import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface AdminNavItem {
  path: '/admin/clubs' | '/admin/players' | '/admin/matches' | '/admin/news' | '/admin/fantasy';
  label: string;
}

const NAV_ITEMS: AdminNavItem[] = [
  { path: '/admin/clubs', label: 'Clubs' },
  { path: '/admin/players', label: 'Players' },
  { path: '/admin/matches', label: 'Matches' },
  { path: '/admin/news', label: 'News' },
  { path: '/admin/fantasy', label: 'Fantasy' },
];

interface AdminLayoutProps {
  activePath: string;
  children: ReactNode;
  onNavigate: (path: AdminNavItem['path']) => void;
  onLogout: () => void;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

function getSectionTitle(path: string): string {
  return NAV_ITEMS.find(item => item.path === path)?.label ?? 'Admin';
}

export function AdminLayout({
  activePath,
  children,
  onNavigate,
  onLogout,
  sectionTitle,
  sectionSubtitle,
}: AdminLayoutProps) {
  const currentTitle = sectionTitle ?? getSectionTitle(activePath);
  const currentSubtitle = sectionSubtitle ?? 'KPFL Admin';

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0F1729]">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-gradient-to-b from-[#0A1628] to-[#10243D] border-r border-[#1E3A5F]/40">
          <div className="h-16 px-5 flex items-center border-b border-[#1E3A5F]/40">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F5C742] to-[#E8A912] flex items-center justify-center shadow-[0_4px_14px_rgba(232,169,18,0.28)]">
              <span className="text-[#0A1628] font-black text-xs">KPFL</span>
            </div>
            <div className="ml-3">
              <p className="text-white text-sm font-bold">Admin Panel</p>
              <p className="text-[#9CA3AF] text-[10px]">Management</p>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={cn(
                  'w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  activePath === item.path
                    ? 'bg-gradient-to-r from-[#F5C742] to-[#E8A912] text-[#0A1628] shadow-[0_4px_14px_rgba(232,169,18,0.2)]'
                    : 'text-[#CBD5E1] hover:text-white hover:bg-white/8'
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-16 bg-white border-b border-[#E5E7EB] sticky top-0 z-20">
            <div className="h-full px-4 md:px-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9CA3AF]">{currentSubtitle}</p>
                <h1 className="text-lg font-black text-[#0F1729]">{currentTitle}</h1>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#0A1628] text-white hover:bg-[#142238] transition-colors"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="md:hidden px-4 py-3 bg-white border-b border-[#E5E7EB] overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 min-w-max">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                    activePath === item.path
                      ? 'bg-[#0A1628] text-white'
                      : 'bg-[#F4F6F8] text-[#4B5563] hover:bg-[#E5E7EB]'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
