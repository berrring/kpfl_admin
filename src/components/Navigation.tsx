import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

export type TabId = 'home' | 'matches' | 'standings' | 'clubs' | 'more';
export type NavItem = 'home' | 'matches' | 'standings' | 'clubs' | 'news' | 'stats' | 'fantasy';

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'matches',
    label: 'Schedule',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'standings',
    label: 'Table',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'clubs',
    label: 'Clubs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'more',
    label: 'More',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
];

// Mobile Bottom Tab Bar
export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] pb-safe z-50 md:hidden shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full transition-all relative',
              activeTab === tab.id ? 'text-[#E8A912]' : 'text-[#9CA3AF]'
            )}
          >
            {activeTab === tab.id && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-gradient-to-r from-[#F5C742] to-[#E8A912] rounded-b-full" />
            )}
            {tab.icon}
            <span className="text-[10px] mt-1 font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

interface DesktopNavProps {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  onSignIn: () => void;
  isSignedIn?: boolean;
  userName?: string;
  onSignOut?: () => void;
}

// Desktop Top Navigation - MLS Premium Style
export function DesktopNav({ activeNav, onNavChange, onSignIn, isSignedIn, userName, onSignOut }: DesktopNavProps) {
  const navItems: { id: NavItem; label: string; comingSoon?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'matches', label: 'Schedule' },
    { id: 'standings', label: 'Standings' },
    { id: 'stats', label: 'Stats' },
    { id: 'clubs', label: 'Clubs' },
    { id: 'news', label: 'News' },
    { id: 'fantasy', label: 'Fantasy', comingSoon: true },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="bg-[#060D14] border-b border-[#1E3A5F]/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
                <span className="text-[#9CA3AF]">Season 2026</span>
              </span>
              <span className="text-[#374151]">|</span>
              <span>Round 7 in Progress</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Language */}
              <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                <button className="px-2 py-0.5 hover:text-white transition-colors font-medium">EN</button>
                <span className="text-[#374151]">/</span>
                <button className="px-2 py-0.5 hover:text-white transition-colors">RU</button>
                <span className="text-[#374151]">/</span>
                <button className="px-2 py-0.5 hover:text-white transition-colors">KG</button>
              </div>
              
              {isSignedIn && userName ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F5C742] to-[#E8A912] flex items-center justify-center text-[10px] font-bold text-[#0A1628]">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-xs">{userName}</span>
                  <button 
                    onClick={onSignOut}
                    className="text-xs text-[#6B7280] hover:text-[#E8A912] ml-2 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onSignIn}
                  className="text-xs font-semibold text-[#E8A912] hover:text-[#F5C742] transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-gradient-to-b from-[#0A1628] to-[#0D1C30]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-16">
            {/* Logo */}
            <button 
              onClick={() => onNavChange('home')}
              className="flex items-center gap-3 mr-10 hover:opacity-90 transition-opacity group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F5C742] to-[#E8A912] flex items-center justify-center shadow-[0_2px_10px_rgba(232,169,18,0.3)] group-hover:shadow-[0_4px_16px_rgba(232,169,18,0.4)] transition-shadow">
                <span className="text-[#0A1628] font-black text-sm">KPFL</span>
              </div>
              <div>
                <span className="font-black text-white text-lg tracking-tight">KPFL</span>
                <span className="text-[#6B7280] text-[10px] block -mt-0.5">Kyrgyz Pro Football</span>
              </div>
            </button>

            {/* Nav links */}
            <nav className="flex-1 flex items-center gap-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavChange(item.id)}
                  className={cn(
                    'px-4 py-2 font-semibold text-sm transition-all relative rounded-md',
                    activeNav === item.id
                      ? 'text-[#E8A912]'
                      : 'text-[#9CA3AF] hover:text-white'
                  )}
                >
                  {item.label}
                  {item.comingSoon && (
                    <span className="ml-1 text-[8px] bg-[#E8A912] text-[#0A1628] px-1.5 py-0.5 rounded font-bold align-top">
                      SOON
                    </span>
                  )}
                  {activeNav === item.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#E8A912] rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Search */}
            <button className="w-9 h-9 flex items-center justify-center text-[#6B7280] hover:text-white hover:bg-white/5 transition-all rounded-lg mr-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Admin (subtle) */}
            <button className="text-[10px] text-[#374151] hover:text-[#6B7280] transition-colors px-2">
              Admin
            </button>
          </div>
        </div>
        
        {/* Gold accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#E8A912]/40 to-transparent" />
      </div>
    </header>
  );
}

// Desktop Footer
export function Footer() {
  return (
    <footer className="hidden md:block bg-[#0A1628] text-white mt-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8A912]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8 mb-10">
          {/* Logo & Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5C742] to-[#E8A912] flex items-center justify-center shadow-[0_2px_10px_rgba(232,169,18,0.25)]">
                <span className="text-[#0A1628] font-black text-base">KPFL</span>
              </div>
              <div>
                <p className="font-black text-xl">KPFL</p>
                <p className="text-xs text-[#6B7280]">Kyrgyz Professional Football League</p>
              </div>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-md">
              The premier professional football league in Kyrgyzstan, featuring 14 clubs competing for national glory.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm">Competition</h4>
            <ul className="space-y-2.5 text-sm text-[#9CA3AF]">
              <li><a href="#" className="hover:text-[#E8A912] transition-colors">Schedule</a></li>
              <li><a href="#" className="hover:text-[#E8A912] transition-colors">Standings</a></li>
              <li><a href="#" className="hover:text-[#E8A912] transition-colors">Stats</a></li>
              <li><a href="#" className="hover:text-[#E8A912] transition-colors">Clubs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">More</h4>
            <ul className="space-y-2.5 text-sm text-[#9CA3AF]">
              <li><a href="#" className="hover:text-[#E8A912] transition-colors">News</a></li>
              <li><a href="#" className="hover:text-[#E8A912] transition-colors">Fantasy</a></li>
              <li><a href="#" className="hover:text-[#E8A912] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#E8A912] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E3A5F]/50 flex items-center justify-between text-xs text-[#6B7280]">
          <p>© 2026 KPFL. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#E8A912] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#E8A912] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Mobile Header
interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  dark?: boolean;
  rightAction?: ReactNode;
}

export function MobileHeader({ title, showBack, onBack, dark = true, rightAction }: MobileHeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-40 md:hidden',
      dark ? 'bg-[#0A1628]' : 'bg-white border-b border-[#E5E7EB]'
    )}>
      <div className="flex items-center h-14 px-4">
        {showBack ? (
          <button 
            onClick={onBack}
            className={cn(
              'w-10 h-10 flex items-center justify-center -ml-2 rounded-full transition-colors',
              dark ? 'text-white hover:bg-white/10' : 'text-[#0F1729] hover:bg-[#F4F6F8]'
            )}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5C742] to-[#E8A912] flex items-center justify-center mr-3 shadow-sm">
            <span className="text-[#0A1628] font-black text-[10px]">KPFL</span>
          </div>
        )}
        <h1 className={cn(
          'text-lg font-bold flex-1',
          dark ? 'text-white' : 'text-[#0F1729]'
        )}>{title}</h1>
        {rightAction}
      </div>
      {dark && <div className="h-px bg-gradient-to-r from-transparent via-[#E8A912]/20 to-transparent" />}
    </header>
  );
}

// Section Header Component
interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  dark?: boolean;
}

export function SectionHeader({ title, action, onAction, dark = false }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className={cn(
        'text-base font-bold flex items-center gap-2.5',
        dark ? 'text-white' : 'text-[#0F1729]'
      )}>
        <span className="w-1 h-5 bg-gradient-to-b from-[#F5C742] to-[#E8A912] rounded-full" />
        {title}
      </h2>
      {action && onAction && (
        <button 
          onClick={onAction}
          className="text-sm font-semibold text-[#E8A912] hover:text-[#F5C742] transition-colors flex items-center gap-1 group"
        >
          {action}
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
