import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectGameRelease,fetchAllReleases} from './release-selection.mjs';
const targets=JSON.parse(await readFile(new URL('../src/data/release-targets.json',import.meta.url),'utf8'));
function release(tag,date,names,flags={}) {
 return {tag_name:tag,name:tag,published_at:date,html_url:`https://github.com/example/releases/${tag}`,assets:names.map(name=>({name,browser_download_url:`https://github.com/example/${name}`})),...flags};
}
test('separate DLL releases keep each game latest download',()=>{
 const history=[release('ttb','2026-10-26',['SufferingTTBInput.dll']),release('suffering','2026-10-25',['SufferingXInput.dll']),release('old','2026-10-22',['RetroInput-The-Suffering-v1.0.1-Win32.zip','RetroInput-The-Suffering-Ties-That-Bind-v1.0.1-Win32.zip'])];
 assert.equal(selectGameRelease(targets[0],history).tag,'suffering');
 assert.deepEqual(selectGameRelease(targets[1],history).assets.map(a=>a.name),['SufferingTTBInput.dll']);
});
test('combined packages match only their game; previews, drafts and unrelated assets are skipped',()=>{
 const history=[release('preview','2026-10-29',['SufferingXInput.dll'],{prerelease:true}),release('draft','2026-10-28',['SufferingXInput.dll'],{draft:true}),release('notes','2026-10-27',['SHA256SUMS.txt','UnknownGame.dll']),release('stable','2026-10-22',['RetroInput-The-Suffering-v1.0.1-Win32.zip','RetroInput-The-Suffering-Ties-That-Bind-v1.0.1-Win32.zip'])];
 assert.deepEqual(selectGameRelease(targets[0],history).assets.map(a=>a.name),['RetroInput-The-Suffering-v1.0.1-Win32.zip']);
 assert.equal(selectGameRelease(targets[1],history).tag,'stable');
});
test('missing game download fails rather than assigning another game DLL',()=>{
 assert.throws(()=>selectGameRelease(targets[0],[release('ttb','2026-10-26',['SufferingTTBInput.dll'])]),/No stable download/);
});
test('history is paginated beyond 100 releases',async()=>{
 const calls=[];const all=await fetchAllReleases('repo',async(_,page)=>{calls.push(page);return page===1?Array(100).fill({}):[release('older','2026-01-01',[])]});
 assert.deepEqual(calls,[1,2]);assert.equal(all.length,101);
});
