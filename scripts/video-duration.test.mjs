import {test} from 'node:test';import assert from 'node:assert/strict';
import {durationSeconds,includeVideo} from './video-duration.mjs';
const detail=duration=>({status:{privacyStatus:'public',embeddable:true},contentDetails:{duration}});
test('parses full playthrough duration',()=>assert.equal(durationSeconds('PT5H12M3S'),18723));
test('excludes clips through three minutes; retains longer videos',()=>{assert.equal(includeVideo(detail('PT3M')),false);assert.equal(includeVideo(detail('PT3M1S')),true);assert.equal(includeVideo(detail('PT1M10S')),false);});
test('manual inclusion permits a short clip, but not private videos',()=>{assert.equal(includeVideo(detail('PT1M'),{includeShort:true}),true);assert.equal(includeVideo({...detail('PT1H'),status:{privacyStatus:'private'}},{includeShort:true}),false);assert.equal(includeVideo(detail('invalid')),false);});
