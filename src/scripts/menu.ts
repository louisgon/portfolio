import { TR } from './state';
import { $ } from './util';
import { lenis } from './scroll';

export function initMenu() {
  const mnav = $('mnav'), mbtn = $('mbtn'), bg = new Map<HTMLElement, boolean>(); mnav.inert = true;
  function setMenu(on: boolean) { mnav.classList.toggle('on', on); mbtn.setAttribute('aria-expanded', String(on)); mbtn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu'); mnav.inert = !on; if (on) [...document.body.children].forEach((el) => { if (el.matches('nav, #mnav, script, canvas') || bg.has(el as HTMLElement)) return; bg.set(el as HTMLElement, (el as HTMLElement).inert); (el as HTMLElement).inert = true; }); else { bg.forEach((v, el) => (el.inert = v)); bg.clear(); } document.documentElement.classList.toggle('tr-lock', on || TR.busy); if (on) { lenis && lenis.stop(); mnav.querySelector('a')!.focus({ preventScroll: true }); } else if (!TR.busy) lenis && lenis.start(); }
  mbtn.addEventListener('click', () => setMenu(!mnav.classList.contains('on')));
  mnav.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setMenu(false); }, true);
  matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches && mnav.classList.contains('on')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && mnav.classList.contains('on')) { setMenu(false); mbtn.focus(); } });
}
