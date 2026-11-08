import type { APIRoute } from 'astro';
import fallback from '../styles/noscript.css?raw';
import lateFonts from '../styles/fonts-late.css?inline';
import { webp } from '../lib/assets';
import { MOONS, SQUASH, TILT } from '../lib/planets';
import { getProjects } from '../lib/site';

function moonRule(row: number, moon: number, radius: number, title: string) {
  const tilt = (TILT[row] * Math.PI) / 180, angle = moon * 1.9 + row;
  const x = (Math.cos(angle) * radius) / 2, y = ((Math.sin(angle) * radius) / 2) * SQUASH;
  const left = 50 + (x * Math.cos(tilt) - y * Math.sin(tilt)) * 100, top = 50 + (x * Math.sin(tilt) + y * Math.cos(tilt)) * 100;
  const layer = Math.sin(angle) < 0 ? 0 : 2;
  const owner = `:is(.proj[data-i="${row}"] .planet, #case[aria-label="${title} case study"] :is(.cplanet, .splanet))`;
  return `html ${owner} .moon:nth-of-type(${moon + 1}) { left: ${left.toFixed(1)}%; top: ${top.toFixed(1)}%; transform: translate3d(-50%, -50%, 0); z-index: ${layer}; }`;
}

export const GET: APIRoute = async () => {
  const [projects, portrait] = await Promise.all([getProjects(), webp('pilot')]);
  const rows = projects.map((p, i) => `html .proj[data-i="${i}"] a.pic { background-image: url("${p.shot}"); }\nhtml .proj[data-i="${i}"] .planet { --planet: url("${p.planet}"); }`);
  const moons = projects.flatMap((p, row) => MOONS[row].map(([, radius], moon) => moonRule(row, moon, radius, p.title)));
  const css = [lateFonts, fallback, ...rows, ...moons, `html #pilot .holo { background-image: url("${portrait}"); }`].join('\n');
  return new Response(css, { headers: { 'Content-Type': 'text/css' } });
};
