import type { APIRoute } from 'astro';
import {games} from '../data/games';
export const GET: APIRoute=({site})=>{
 const base=import.meta.env.BASE_URL;
 const paths=['','retroinput/','credits/',...games.map(game=>'fixes/'+game.slug+'/')];
 const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>'<url><loc>'+new URL(base+path,site).href+'</loc></url>').join('')+'</urlset>';
 return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
