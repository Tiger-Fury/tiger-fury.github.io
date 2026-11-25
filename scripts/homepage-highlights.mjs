// Use game-specific releases: RetroInput integrations can update independently.
export function newestHighlights(games, releases, limit=2) {
 return [...games].sort((a,b)=>
  (releases[b.slug]?.publishedAt??'').localeCompare(releases[a.slug]?.publishedAt??'') ||
  a.title.localeCompare(b.title,'en',{sensitivity:'base',numeric:true})
 ).slice(0,limit);
}
