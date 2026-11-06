import type { APIRoute } from 'astro';
import { getProjects } from '../lib/site';
import { workURL } from '../lib/pages';

export const GET: APIRoute = async ({ site }) => {
  const projects = await getProjects();
  const paths = ['/', ...projects.map((p) => workURL(p.id))];
  const urls = paths.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
