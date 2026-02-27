interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBack, onBack }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 md:hidden">
      <div className="flex items-center h-14 px-4">
        {showBack ? (
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xs">KPFL</span>
          </div>
        )}
        <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>
      </div>
    </header>
  );
}

export function DesktopHeader({ title, showBack, onBack }: HeaderProps) {
  return (
    <div className="hidden md:block mb-6">
      <div className="flex items-center gap-4">
        {showBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
    </div>
  );
}
