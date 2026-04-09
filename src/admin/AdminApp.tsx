import { useEffect } from 'react';
import { clearToken, getToken } from '@/admin/api';
import { AdminGuard } from '@/admin/components/AdminGuard';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { ClubsAdminPage } from '@/admin/pages/ClubsAdminPage';
import { AdminLoginPage } from '@/admin/pages/AdminLoginPage';
import { ClubDetailAdminPage } from '@/admin/pages/ClubDetailAdminPage';
import { FantasyAdminPage } from '@/admin/pages/FantasyAdminPage';
import { MatchesAdminPage } from '@/admin/pages/MatchesAdminPage';
import { NewsAdminPage } from '@/admin/pages/NewsAdminPage';
import { PlayersAdminPage } from '@/admin/pages/PlayersAdminPage';
import { navigateTo, usePathname } from '@/admin/router';

type ProtectedAdminPath = '/admin/clubs' | '/admin/players' | '/admin/matches' | '/admin/news' | '/admin/fantasy';
type ResolvedAdminRoute =
  | { kind: 'root' }
  | { kind: 'login' }
  | { kind: 'page'; path: ProtectedAdminPath }
  | { kind: 'club-detail'; clubId: string };

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function resolveAdminRoute(pathname: string): ResolvedAdminRoute | null {
  if (pathname === '/admin') {
    return { kind: 'root' };
  }

  if (pathname === '/admin/login') {
    return { kind: 'login' };
  }

  if (
    pathname === '/admin/clubs' ||
    pathname === '/admin/players' ||
    pathname === '/admin/matches' ||
    pathname === '/admin/news' ||
    pathname === '/admin/fantasy'
  ) {
    return { kind: 'page', path: pathname };
  }

  const clubDetailMatch = pathname.match(/^\/admin\/clubs\/([^/]+)$/);
  if (clubDetailMatch) {
    return {
      kind: 'club-detail',
      clubId: decodeURIComponent(clubDetailMatch[1]),
    };
  }

  return null;
}

function getActiveProtectedPath(route: ResolvedAdminRoute): ProtectedAdminPath | null {
  if (route.kind === 'page') {
    return route.path;
  }

  if (route.kind === 'club-detail') {
    return '/admin/clubs';
  }

  return null;
}

function renderProtectedPage(route: ResolvedAdminRoute) {
  if (route.kind === 'club-detail') {
    return <ClubDetailAdminPage clubId={route.clubId} />;
  }

  if (route.kind !== 'page') {
    return null;
  }

  switch (route.path) {
    case '/admin/clubs':
      return <ClubsAdminPage />;
    case '/admin/players':
      return <PlayersAdminPage />;
    case '/admin/matches':
      return <MatchesAdminPage />;
    case '/admin/news':
      return <NewsAdminPage />;
    case '/admin/fantasy':
      return <FantasyAdminPage />;
    default:
      return null;
  }
}

export function AdminApp() {
  const pathname = usePathname();
  const normalizedPath = normalizePath(pathname);
  const token = getToken();
  const route = resolveAdminRoute(normalizedPath);
  const activeProtectedPath = route ? getActiveProtectedPath(route) : null;

  useEffect(() => {
    if (!route || route.kind === 'root') {
      navigateTo(token ? '/admin/clubs' : '/admin/login', 'replace');
      return;
    }

    if (route.kind === 'login' && token) {
      navigateTo('/admin/clubs', 'replace');
    }
  }, [route, token]);

  if (!route || route.kind === 'root') {
    return null;
  }

  if (route.kind === 'login') {
    return <AdminLoginPage onSuccess={() => navigateTo('/admin/clubs', 'replace')} />;
  }

  if (!activeProtectedPath) {
    return null;
  }

  return (
    <AdminGuard onUnauthorized={() => navigateTo('/admin/login', 'replace')}>
      <AdminLayout
        activePath={activeProtectedPath}
        sectionTitle={route.kind === 'club-detail' ? 'Club Details' : undefined}
        sectionSubtitle={route.kind === 'club-detail' ? 'Club profile and editing' : undefined}
        onNavigate={path => navigateTo(path)}
        onLogout={() => {
          clearToken();
          navigateTo('/admin/login', 'replace');
        }}
      >
        {renderProtectedPage(route)}
      </AdminLayout>
    </AdminGuard>
  );
}
