import { NewsItem, formatShortDate, getClub } from '@/data/mockData';
import { cn } from '@/utils/cn';

interface NewsCardProps {
  news: NewsItem;
  onClick: () => void;
  variant?: 'default' | 'featured' | 'compact' | 'hero';
}

const tagColors: Record<string, string> = {
  Transfer: 'bg-purple-500 text-white',
  Matchday: 'bg-emerald-500 text-white',
  Club: 'bg-blue-500 text-white',
  League: 'bg-[#E8A912] text-[#0A1628]',
  Injury: 'bg-red-500 text-white',
  Interview: 'bg-[#4B5563] text-white',
};

export function NewsCard({ news, onClick, variant = 'default' }: NewsCardProps) {
  const club = news.clubId ? getClub(news.clubId) : null;
  const bgColor = club?.primaryColor || '#142238';

  // Hero - main featured article
  if (variant === 'hero') {
    return (
      <button
        onClick={onClick}
        className="w-full rounded-xl overflow-hidden relative group text-left h-[320px] md:h-[380px] shadow-md"
      >
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: bgColor }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          <span className={cn('badge mb-2.5 w-fit', tagColors[news.tag] || 'bg-[#4B5563] text-white')}>
            {news.tag}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-3">
            {news.title}
          </h2>
          <p className="text-white/70 text-sm line-clamp-2 mb-3 max-w-lg">
            {news.summary}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>{formatShortDate(news.date)}</span>
            {news.author && (
              <>
                <span>•</span>
                <span>{news.author}</span>
              </>
            )}
          </div>
        </div>

        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  // Featured - medium card
  if (variant === 'featured') {
    return (
      <button
        onClick={onClick}
        className="w-full bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#E8A912] hover:shadow-lg transition-all text-left group"
      >
        <div 
          className="h-40 relative"
          style={{ backgroundColor: bgColor }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {club ? (
              <span className="text-white/15 text-5xl font-black">{club.shortName}</span>
            ) : (
              <span className="text-white/15 text-5xl">⚽</span>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className={cn(
            'badge absolute bottom-3 left-3',
            tagColors[news.tag] || 'bg-[#4B5563] text-white'
          )}>
            {news.tag}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-[#0F1729] line-clamp-2 mb-1.5 group-hover:text-[#E8A912] transition-colors text-sm">
            {news.title}
          </h3>
          <p className="text-xs text-[#6B7280] line-clamp-2 mb-2">{news.summary}</p>
          <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF]">
            <span>{formatShortDate(news.date)}</span>
            {news.author && (
              <>
                <span>•</span>
                <span>{news.author}</span>
              </>
            )}
          </div>
        </div>
      </button>
    );
  }

  // Compact - small list item
  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="w-full flex gap-3 p-3 hover:bg-[#F4F6F8] rounded-xl transition-colors text-left group bg-white border border-[#E5E7EB] hover:border-[#E8A912]"
      >
        <div 
          className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          {club ? (
            <span className="text-white/30 font-bold text-xs">{club.shortName}</span>
          ) : (
            <span className="text-white/30 text-xl">⚽</span>
          )}
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <span className={cn(
            'inline-block px-2 py-0.5 rounded text-[9px] font-bold mb-1',
            tagColors[news.tag] || 'bg-[#4B5563] text-white'
          )}>
            {news.tag}
          </span>
          <h3 className="font-semibold text-[#0F1729] text-sm line-clamp-2 group-hover:text-[#E8A912] transition-colors leading-tight">
            {news.title}
          </h3>
          <p className="text-[10px] text-[#9CA3AF] mt-1">{formatShortDate(news.date)}</p>
        </div>
      </button>
    );
  }

  // Default - standard card
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#E8A912] hover:shadow-lg transition-all text-left group"
    >
      <div className="flex flex-col sm:flex-row">
        <div 
          className="h-28 sm:h-auto sm:w-36 flex-shrink-0 flex items-center justify-center relative"
          style={{ backgroundColor: bgColor }}
        >
          {club ? (
            <span className="text-white/15 font-bold text-xl">{club.shortName}</span>
          ) : (
            <span className="text-white/15 text-3xl">⚽</span>
          )}
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn(
              'badge text-[10px]',
              tagColors[news.tag] || 'bg-[#4B5563] text-white'
            )}>
              {news.tag}
            </span>
            <span className="text-[10px] text-[#9CA3AF]">{formatShortDate(news.date)}</span>
          </div>
          <h3 className="font-semibold text-[#0F1729] line-clamp-2 mb-1 group-hover:text-[#E8A912] transition-colors text-sm">
            {news.title}
          </h3>
          <p className="text-xs text-[#6B7280] line-clamp-2">{news.summary}</p>
        </div>
      </div>
    </button>
  );
}
