export function durationSeconds(value){
 const match=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/.exec(value??'');
 if(!match)return NaN;
 return Number(match[1]??0)*3600+Number(match[2]??0)*60+Number(match[3]??0);
}
export function includeVideo(details,override={}){
 if(details?.status?.privacyStatus!=='public'||details.status.embeddable===false)return false;
 const duration=durationSeconds(details?.contentDetails?.duration);
 return Number.isFinite(duration)&&duration>0&&(override.includeShort===true||duration>180);
}
