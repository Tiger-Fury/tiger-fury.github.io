import {readFile,writeFile,rename,rm} from 'node:fs/promises';
import {fetchAllReleases,normalizeRelease,selectGameRelease,stableReleases} from './release-selection.mjs';
const targets=JSON.parse(await readFile(new URL('../src/data/release-targets.json',import.meta.url),'utf8'));
const repos=[...new Set(targets.map(t=>t.repo))];
// Only public project endpoints are queried. No credentials are needed.
const histories=new Map(await Promise.all(repos.map(async repo=>[repo,
 await fetchAllReleases(repo,async(name,page)=>{
  const response=await fetch(`https://api.github.com/repos/Tiger-Fury/${name}/releases?per_page=100&page=${page}`,{headers:{Accept:'application/vnd.github+json','User-Agent':'TigerFury-Fixes'},signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error(`${name}: GitHub returned ${response.status}; existing snapshot preserved.`);
  return response.json();
 })
])));
const releases=repos.map(repo=>{
 const latest=stableReleases(histories.get(repo))[0];
 if(!latest)throw new Error(`No stable releases for ${repo}`);
 return normalizeRelease(repo,latest);
}).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
const gameReleases=Object.fromEntries(targets.map(t=>[t.slug,selectGameRelease(t,histories.get(t.repo))]));
const path=new URL('../src/data/releases.json',import.meta.url);
const temporary=new URL('../src/data/releases.json.tmp',import.meta.url);
try {
 await writeFile(temporary,JSON.stringify({checkedAt:new Date().toISOString().slice(0,10),releases,gameReleases},null,2)+'\n');
 await rename(temporary,path);
}finally{await rm(temporary,{force:true});}
console.log(`Updated ${releases.length} projects and ${targets.length} download targets.`);
