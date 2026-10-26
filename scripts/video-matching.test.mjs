import {test} from 'node:test';import assert from 'node:assert/strict';
import {matchVideo} from './video-matching.mjs';
const games=[{slug:'csi',title:'CSI: Crime Scene Investigation'},{slug:'dm',title:'CSI: Dark Motives'},{slug:'suffering',title:'The Suffering'},{slug:'ttb',title:'The Suffering: Ties That Bind'}];
test('matches game segment while ignoring playthrough metadata and hashtags',()=>assert.deepEqual(matchVideo({id:'a',title:'CSI: Dark Motives (Windows 11) | Full game playthrough | 1440p 60FPS #csi'},games),{type:'gameplay',games:['dm']}));
test('specific sequel does not match original',()=>assert.deepEqual(matchVideo({id:'a',title:'The Suffering: Ties That Bind | Full Game Playthrough | No Commentary'},games).games,['ttb']));
test('unrelated and ambiguous games stay unassigned',()=>{assert.deepEqual(matchVideo({id:'a',title:'CSI: Miami | Full game playthrough'},games).games,[]);assert.deepEqual(matchVideo({id:'a',title:'The Suffering | Full game playthrough'},[...games,{slug:'other',title:'The Suffering'}]).games,[]);});
test('manual corrections including exclusions win',()=>{const v={id:'a',title:'The Suffering | Full game playthrough'};assert.deepEqual(matchVideo(v,games,{a:{games:[],type:'gameplay'}}).games,[]);assert.deepEqual(matchVideo(v,games,{a:{games:['ttb'],type:'fix'}}),{games:['ttb'],type:'fix'});});
