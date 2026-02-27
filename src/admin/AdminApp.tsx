import { useEffect } from 'react';
import { clearToken, getToken } from '@/admin/api';
import { AdminGuard } from '@/admin/components/AdminGuard';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { ClubsAdminPage } from '@/admin/pages/ClubsAdminPage';
import { AdminLoginPage } from '@/admin/pages/AdminLoginPage';
import { MatchesAdminPage } from '@/admin/pages/MatchesAdminPage';
import { NewsAdminPage } from '@/admin/pages/NewsAdminPage';
import { PlayersAdminPage } from '@/admin/pages/PlayersAdminPage';
import { navigateTo, usePathname } from '@/admin/router';

type AdminPath =
  | '/admin'
  | '/admin/login'
  | '/admin/clubs'
  | '/admin/players'
  | '/admin/matches'
  | '/admin/news';

type ProtectedAdminPath = '/admin/clubs' | '/admin/players' | '/admin/matches' | '/admin/news';

const ROUTES: AdminPath[] = [
  '/admin',
  '/admin/login',
  '/admin/clubs',
  '/admin/players',
  '/admin/matches',
  '/admin/news',
];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isKnownAdminPath(pathname: string): pathname is AdminPath {
  return ROUTES.includes(pathname as AdminPath);
}

function isProtectedAdminPath(pathname: string): pathname is ProtectedAdminPath {
  return (
    pathname === '/admin/clubs' ||
    pathname === '/admin/players' ||
    pathname === '/admin/matches' ||
    pathname === '/admin/news'
  );
}

function renderProtectedPage(path: ProtectedAdminPath) {
  switch (path) {
    case '/admin/clubs':
      return <ClubsAdminPage />;
    case '/admin/players':
      return <PlayersAdminPage />;
    case '/admin/matches':
      return <MatchesAdminPage />;
    case '/admin/news':
      return <NewsAdminPage />;
    default:
      return null;
  }
}

export function AdminApp() {
  const pathname = usePathname();
  const normalizedPath = normalizePath(pathname);
  const token = getToken();

  useEffect(() => {
    if (!isKnownAdminPath(normalizedPath) || normalizedPath === '/admin') {
      navigateTo(token ? '/admin/clubs' : '/admin/login', 'replace');
      return;
    }

    if (normalizedPath === '/admin/login' && token) {
      navigateTo('/admin/clubs', 'replace');
    }
  }, [normalizedPath, token]);

  if (!isKnownAdminPath(normalizedPath) || normalizedPath === '/admin') {
    return null;
  }

  if (normalizedPath === '/admin/login') {
    return <AdminLoginPage onSuccess={() => navigateTo('/admin/clubs', 'replace')} />;
  }

  if (!isProtectedAdminPath(normalizedPath)) {
    return null;
  }

  return (
    <AdminGuard onUnauthorized={() => navigateTo('/admin/login', 'replace')}>
      <AdminLayout
        activePath={normalizedPath}
        onNavigate={path => navigateTo(path)}
        onLogout={() => {
          clearToken();
          navigateTo('/admin/login', 'replace');
        }}
      >
        {renderProtectedPage(normalizedPath)}
      </AdminLayout>
    </AdminGuard>
  );
}
