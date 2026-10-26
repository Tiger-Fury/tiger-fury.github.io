export function normalizeTitle(value){
 return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  .replace(/&/g,' and ').replace(/\([^)]*\)/g,' ').replace(/[^a-z0-9]+/g,' ').trim();
}
export function matchVideo(video,games,overrides={}){
 if(Object.hasOwn(overrides,video.id))return {type:overrides[video.id].type??'gameplay',games:overrides[video.id].games};
 const title=video.title;
 const type=/\b(?:retroinput|controller support)\b/i.test(title)?'controller':/\b(?:fix|patch|compatibility)\b/i.test(title)?'fix':/\b(?:full\s+game\s+playthrough|full\s+playthrough|walkthrough|no commentary)\b/i.test(title)?'gameplay':null;
 if(!type)return {type:undefined,games:[]};
 const head=normalizeTitle(title.split('|')[0].replace(/#\S+/g,''));
 // Exact game segment prevents e.g. The Suffering matching Ties That Bind.
 const matches=games.filter(game=>[game.title,...(game.aliases??[])].some(alias=>normalizeTitle(alias)===head));
 return {type,games:matches.length===1?[matches[0].slug]:[]};
}
