import test from 'node:test';
import assert from 'node:assert/strict';
import {newestHighlights} from './homepage-highlights.mjs';
test('homepage promotes new fixes and keeps catalogue order intact',()=>{
 const games=[{slug:'a',title:'Alpha'},{slug:'b',title:'Bravo'},{slug:'c',title:'Charlie'}];
 const releases={a:{publishedAt:'2026-10-24'},b:{publishedAt:'2026-10-26'},c:{publishedAt:'2026-11-25'}};
 assert.deepEqual(newestHighlights(games,releases).map(g=>g.slug),['c','b']);
 assert.deepEqual(games.map(g=>g.slug),['a','b','c']);
});
test('controller highlights use each game release with alphabetical ties and missing dates last',()=>{
 const games=[{slug:'b',title:'Bravo',repo:'RetroInput-Public'},{slug:'a',title:'Alpha',repo:'RetroInput-Public'},{slug:'c',title:'Charlie'},{slug:'d',title:'Delta'}];
 assert.deepEqual(newestHighlights(games,{a:{publishedAt:'2026-10-22'},b:{publishedAt:'2026-11-25'},c:{publishedAt:'2026-10-22'}},4).map(g=>g.slug),['b','a','c','d']);
});
