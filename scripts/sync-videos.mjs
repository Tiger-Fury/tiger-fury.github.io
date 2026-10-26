import {readFile,writeFile,rename,rm} from 'node:fs/promises';
import {imageSize} from 'image-size';
import {channelId,validateVideos} from './video-feed.mjs';
import {matchVideo} from './video-matching.mjs';
import {games} from '../src/data/games.ts';
import {includeVideo} from './video-duration.mjs';
const root=new URL('../',import.meta.url);
async function request(url){const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw new Error(`Public video service returned ${r.status}`);return r;}
const curated=JSON.parse(await readFile(new URL('src/data/videos.json',root),'utf8'));
const aliases=JSON.parse(await readFile(new URL('src/data/video-aliases.json',root),'utf8'));
const matchingGames=games.map(game=>({...game,aliases:aliases[game.slug]??[]}));
const overrides=Object.fromEntries(curated.map(video=>[video.id,video]));
let publicVideos=[],latest,fullHistory=false;
if(process.env.YOUTUBE_API_KEY){
 let pageToken;
 do{
  const url=new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  url.search=new URLSearchParams({part:'snippet',playlistId:'UU'+channelId.slice(2),maxResults:'50',key:process.env.YOUTUBE_API_KEY,...(pageToken?{pageToken}:{})}).toString();
  const data=await (await request(url)).json();
  publicVideos.push(...(data.items??[]).map(item=>({id:item.snippet?.resourceId?.videoId,title:item.snippet?.title,publishedAt:item.snippet?.publishedAt,channel:item.snippet?.videoOwnerChannelId})));
  pageToken=data.nextPageToken;
 }while(pageToken);
 const eligible=new Set();
 for(let offset=0;offset<publicVideos.length;offset+=50){
  const url=new URL('https://www.googleapis.com/youtube/v3/videos');
  url.search=new URLSearchParams({part:'contentDetails,status',id:publicVideos.slice(offset,offset+50).map(v=>v.id).join(','),key:process.env.YOUTUBE_API_KEY}).toString();
  const data=await (await request(url)).json();
  for(const details of data.items??[])if(includeVideo(details,overrides[details.id]))eligible.add(details.id);
 }
 publicVideos=publicVideos.filter(video=>eligible.has(video.id));
 latest=validateVideos(publicVideos);fullHistory=true;
}else{
 // The limited feed cannot safely replace complete game-page history.
 throw new Error('YOUTUBE_API_KEY is required to verify duration; existing snapshots preserved.');
}
const classified=publicVideos.map(video=>({id:video.id,title:video.title,publishedAt:video.publishedAt,...matchVideo(video,matchingGames,overrides)}));
let assigned;
if(fullHistory)assigned=classified.filter(video=>video.games.length);
else assigned=JSON.parse(await readFile(new URL('src/data/game-videos.json',root),'utf8'));
const latestIds=new Set(latest.map(video=>video.id));
const next=classified.filter(video=>latestIds.has(video.id)).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
assigned.sort((a,b)=>Date.parse(b.publishedAt??'1970-01-01')-Date.parse(a.publishedAt??'1970-01-01'));
const thumbs=JSON.parse(await readFile(new URL('src/data/video-thumbnails.json',root),'utf8'));
const needed=[...new Map([...next,...assigned].map(video=>[video.id,video])).values()];const files=[];
for(const video of needed){
 if(thumbs[video.id]){try{await readFile(new URL('public/images/videos/'+thumbs[video.id].file,root));continue;}catch{}}
 let selected;
 for(const quality of ['maxresdefault','sddefault','hqdefault']){
  try{const bytes=new Uint8Array(await (await request(`https://i.ytimg.com/vi/${video.id}/${quality}.jpg`)).arrayBuffer());const size=imageSize(bytes);if(size.width<320)continue;
   selected={file:`${video.id}-auto.jpg`,width:size.width,height:size.height};files.push({path:new URL('public/images/videos/'+selected.file,root),bytes});break;
  }catch{}
 }
 if(!selected)throw new Error('A video thumbnail is unavailable; existing gallery preserved');thumbs[video.id]=selected;
}
for(const file of files)await writeFile(file.path,file.bytes);
for(const [name,data] of [['video-thumbnails.json',thumbs],['latest-videos.json',next],['game-videos.json',assigned]]){
 const destination=new URL('src/data/'+name,root),temporary=new URL('src/data/'+name+'.tmp',root);
 try{await writeFile(temporary,JSON.stringify(data,null,2)+'\n');await rename(temporary,destination);}finally{await rm(temporary,{force:true});}
}
console.log(`Refreshed ${next.length} latest videos and ${assigned.length} game showcases from ${publicVideos.length} public uploads.`);

