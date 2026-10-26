import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: process.env.SITE_URL || 'https://tiger-fury.github.io', base: process.env.SITE_BASE || '/', devToolbar: { enabled: false }, vite: { plugins: [tailwindcss()] } });
