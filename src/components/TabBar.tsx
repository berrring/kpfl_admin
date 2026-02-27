import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

export type TabId = 'matches' | 'standings' | 'clubs' | 'more';

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
  {
    id: 'matches',
    label: 'Matches',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'standings',
    label: 'Standings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'clubs',
    label: 'Clubs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full transition-colors',
              activeTab === tab.id ? 'text-[#F5A623]' : 'text-gray-500'
            )}
          >
            {tab.icon}
            <span className="text-xs mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export function DesktopNav({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="hidden md:flex bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto w-full px-6 flex items-center h-16">
        <div className="flex items-center gap-3 mr-12">
          <div className="w-10 h-10 rounded-lg bg-[#F5A623] flex items-center justify-center">
            <span className="text-white font-bold text-sm">KPFL</span>
          </div>
          <span className="font-bold text-lg text-gray-900">Kyrgyz Professional Football League</span>
        </div>
        <div className="flex gap-1">
          {tabs.filter(t => t.id !== 'more').map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === tab.id 
                  ? 'bg-[#F5A623]/10 text-[#F5A623]' 
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => onTabChange('more')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeTab === 'more'
                ? 'bg-[#F5A623]/10 text-[#F5A623]' 
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            Fantasy
            <span className="ml-1 text-xs text-gray-400">(Coming Soon)</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
