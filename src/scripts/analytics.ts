/**
 * Analytics — one delegated listener, no per-component tracking code.
 *
 * Markup declares intent:  <a data-event="open_account_click" data-event-location="hero">
 * Everything is pushed to window.dataLayer. GTM (when PUBLIC_GTM_ID is set)
 * forwards it to GA4. With no GTM configured, events stay in-page only.
 *
 * Event catalogue: docs/site-strategy.md §12.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window { dataLayer: unknown[] }
}

window.dataLayer = window.dataLayer || [];

export function track(event: string, params: Params = {}) {
  window.dataLayer.push({ event, ...params, page_path: location.pathname });
  if (import.meta.env.DEV) console.debug('[track]', event, params);
}

function paramsFrom(el: HTMLElement): Params {
  const out: Params = {};
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key.startsWith('event') && key !== 'event') {
      const name = key.slice(5).replace(/^[A-Z]/, (c) => c.toLowerCase()).replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
      out[name] = value;
    }
  }
  return out;
}

document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-event]');
  if (el?.dataset.event) track(el.dataset.event, paramsFrom(el));
});

const view = document.body.dataset.viewEvent;
if (view) {
  try {
    const { name, params } = JSON.parse(view) as { name: string; params?: Params };
    track(name, params);
  } catch { /* malformed view event — ignore */ }
}
