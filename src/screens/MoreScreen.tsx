import { MobileHeader } from '@/components/Navigation';

interface MoreScreenProps {
  onNewsSelect: () => void;
  onFantasySelect: () => void;
  onSignIn: () => void;
  isSignedIn?: boolean;
  userName?: string;
  onSignOut?: () => void;
}

export function MoreScreen({ 
  onNewsSelect, 
  onFantasySelect, 
  onSignIn,
  isSignedIn,
  userName,
  onSignOut
}: MoreScreenProps) {
  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-20 md:pb-0">
      <MobileHeader title="More" />
      
      <div className="max-w-md mx-auto px-4 py-4">
        {/* User Section */}
        {isSignedIn && userName ? (
          <div className="card p-4 mb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F5A623] flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">KPFL Member</p>
            </div>
            <button 
              onClick={onSignOut}
              className="text-sm text-red-500 font-medium"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="w-full card p-4 mb-4 flex items-center gap-4 touch-feedback"
          >
            <div className="w-14 h-14 rounded-full bg-[#F5A623] flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900">Sign In</p>
              <p className="text-sm text-gray-500">Access your account</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {/* News */}
          <button
            onClick={onNewsSelect}
            className="w-full card p-4 flex items-center gap-4 touch-feedback"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">News</h3>
              <p className="text-sm text-gray-500">Latest updates and articles</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Fantasy */}
          <button
            onClick={onFantasySelect}
            className="w-full card p-4 flex items-center gap-4 touch-feedback"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Fantasy League</h3>
                <span className="text-xs bg-[#F5A623]/20 text-[#F5A623] px-2 py-0.5 rounded-full font-medium">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-gray-500">Create your dream team</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Settings */}
          <button
            disabled
            className="w-full card p-4 flex items-center gap-4 opacity-50 cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-500">Settings</h3>
              <p className="text-sm text-gray-400">App preferences</p>
            </div>
            <span className="text-xs text-gray-400">Placeholder</span>
          </button>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F5A623] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white font-bold text-lg">KPFL</span>
          </div>
          <p className="text-sm font-medium text-gray-900">Kyrgyz Professional Football League</p>
          <p className="text-xs text-gray-500 mt-1">Version 1.0.0 MVP</p>
          <p className="text-xs text-gray-400 mt-4">© 2026 KPFL. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
