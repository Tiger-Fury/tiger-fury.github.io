import {XMLParser,XMLValidator} from 'fast-xml-parser';
export const channelId='UCh1NCgV1JOCRjoZYaVek35g';
export function parseFeed(xml){
 if(XMLValidator.validate(xml)!==true)throw new Error('Invalid YouTube feed');
 const feed=new XMLParser().parse(xml).feed;
 if(feed?.['yt:channelId']!==channelId)throw new Error('YouTube feed channel mismatch or empty feed');
 const entries=Array.isArray(feed.entry)?feed.entry:[feed.entry].filter(Boolean);
 return validateVideos(entries.map(e=>({id:e['yt:videoId'],title:e.title,publishedAt:e.published,channel:e['yt:channelId']})));
}
export function validateVideos(videos){
 if(videos.length<6)throw new Error('Fewer than six public videos; existing gallery preserved');
 if(videos.some(v=>v.channel!==channelId||! /^[\w-]{11}$/.test(v.id)||typeof v.title!=='string'||!v.title.trim()||!Number.isFinite(Date.parse(v.publishedAt))))throw new Error('Invalid public video metadata');
 const unique=[...new Map(videos.map(v=>[v.id,v])).values()];
 if(unique.length<6)throw new Error('Fewer than six distinct public videos');
 return unique.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,6);
}
