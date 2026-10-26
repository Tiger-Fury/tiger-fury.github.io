import {readFile,writeFile,rename,rm} from 'node:fs/promises';
import {imageSize} from 'image-size';
import {channelId,parseFeed,validateVideos} from './video-feed.mjs';
const root=new URL('../',import.meta.url);
async function request(url){const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw new Error(`Public video service returned ${r.status}`);return r;}
let latest;
if(process.env.YOUTUBE_API_KEY){
 // The key is read only from the environment, never emitted or written to files.
 const url=new URL('https://www.googleapis.com/youtube/v3/playlistItems');
 url.search=new URLSearchParams({part:'snippet',playlistId:'UU'+channelId.slice(2),maxResults:'50',key:process.env.YOUTUBE_API_KEY}).toString();
 const data=await (await request(url)).json();
 latest=validateVideos((data.items??[]).map(item=>({id:item.snippet?.resourceId?.videoId,title:item.snippet?.title,publishedAt:item.snippet?.publishedAt,channel:item.snippet?.videoOwnerChannelId})));
}else{
 latest=parseFeed(await (await request(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)).text());
}
const curated=JSON.parse(await readFile(new URL('src/data/videos.json',root),'utf8'));
const thumbs=JSON.parse(await readFile(new URL('src/data/video-thumbnails.json',root),'utf8'));
const files=[];
for(const video of latest){
 let selected;
 for(const quality of ['maxresdefault','sddefault','hqdefault']){
  try{const bytes=new Uint8Array(await (await request(`https://i.ytimg.com/vi/${video.id}/${quality}.jpg`)).arrayBuffer());const size=imageSize(bytes);if(size.width<320)continue;
   selected={file:`${video.id}-auto.jpg`,width:size.width,height:size.height};files.push({path:new URL('public/images/videos/'+selected.file,root),bytes});break;
  }catch{/* Try the next publicly available thumbnail size. */}
 }
 if(!selected)throw new Error('A video thumbnail is unavailable; existing gallery preserved');
 thumbs[video.id]=selected;
}
const next=latest.map(({id,title,publishedAt})=>{const known=curated.find(v=>v.id===id);return {id,title,publishedAt,...(known?{type:known.type,games:known.games}: {})};});
// All network and validation steps finish before any gallery data is replaced.
for(const file of files)await writeFile(file.path,file.bytes);
for(const [name,data] of [['video-thumbnails.json',thumbs],['latest-videos.json',next]]){
 const destination=new URL('src/data/'+name,root),temporary=new URL('src/data/'+name+'.tmp',root);
 try{await writeFile(temporary,JSON.stringify(data,null,2)+'\n');await rename(temporary,destination);}finally{await rm(temporary,{force:true});}
}
console.log(`Refreshed ${next.length} public channel videos. Curated game showcases are unchanged.`);
