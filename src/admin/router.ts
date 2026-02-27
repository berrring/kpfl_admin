import { useEffect, useState } from 'react';

const NAVIGATE_EVENT = 'kpfl:navigate';

type NavigationMode = 'push' | 'replace';

export function navigateTo(path: string, mode: NavigationMode = 'push'): void {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (mode === 'replace') {
    window.history.replaceState(null, '', normalized);
  } else {
    window.history.pushState(null, '', normalized);
  }
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function usePathname(): string {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    window.addEventListener(NAVIGATE_EVENT, sync);

    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAVIGATE_EVENT, sync);
    };
  }, []);

  return pathname;
}
