import {test} from 'node:test';import assert from 'node:assert/strict';
import {channelId,parseFeed,validateVideos} from './video-feed.mjs';
test('latest six are sorted by publication date, not input order',()=>{const rows=Array.from({length:8},(_,i)=>({id:`video_id_${i}x`,title:`Video ${i}`,channel:channelId,publishedAt:`2026-10-${String(i+1).padStart(2,'0')}T00:00:00Z`}));assert.deepEqual(validateVideos(rows).map(v=>v.title),['Video 7','Video 6','Video 5','Video 4','Video 3','Video 2']);});
test('empty sample feed is rejected',()=>assert.throws(()=>parseFeed('<feed><title>YouTube video feed</title></feed>'),/mismatch/));
test('wrong channel and incomplete feeds are rejected',()=>{assert.throws(()=>validateVideos([]),/Fewer/);assert.throws(()=>validateVideos(Array(6).fill({id:'abcdefghijk',title:'Video',channel:'wrong',publishedAt:'2026-10-26'})),/Invalid/);});
