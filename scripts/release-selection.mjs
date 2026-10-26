export function stableReleases(releases) {
 return releases.filter(r=>!r.draft&&!r.prerelease&&r.published_at).sort((a,b)=>b.published_at.localeCompare(a.published_at));
}
export function normalizeRelease(repo,r,assets=r.assets) {
 return {repo,tag:r.tag_name,title:r.name||r.tag_name,publishedAt:r.published_at,url:r.html_url,assets:assets.map(a=>({name:a.name,url:a.browser_download_url}))};
}
export function selectGameRelease(target,releases) {
 for(const r of stableReleases(releases)) {
  const assets=r.assets.filter(a=>{const name=a.name.toLowerCase();return target.prefix ? name===target.dll || (name.startsWith(target.prefix)&&name.endsWith('.zip')) : name.endsWith('.zip');});
  if(assets.length)return normalizeRelease(target.repo,r,assets);
 }
 throw new Error(`No stable download found for ${target.slug}; existing snapshot preserved.`);
}
export async function fetchAllReleases(repo,fetchPage) {
 const releases=[];
 for(let page=1;;page++){
  const batch=await fetchPage(repo,page);
  if(!Array.isArray(batch))throw new Error(`Invalid release response for ${repo}`);
  releases.push(...batch);
  if(batch.length<100)return releases;
 }
}
