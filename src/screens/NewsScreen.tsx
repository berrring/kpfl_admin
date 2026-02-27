import { useState } from 'react';
import { news, getClub, formatShortDate } from '@/data/mockData';
import { MobileHeader } from '@/components/Navigation';
import { NewsCard } from '@/components/NewsCard';
import { cn } from '@/utils/cn';

interface NewsScreenProps {
  onNewsSelect: (newsId: string) => void;
}

type FilterTag = 'All' | 'Transfer' | 'Matchday' | 'Club' | 'League' | 'Injury' | 'Interview';

export function NewsScreen({ onNewsSelect }: NewsScreenProps) {
  const [activeTag, setActiveTag] = useState<FilterTag>('All');
  
  const filteredNews = activeTag === 'All' 
    ? news 
    : news.filter(n => n.tag === activeTag);

  const tags: FilterTag[] = ['All', 'Transfer', 'Matchday', 'Club', 'League', 'Injury', 'Interview'];

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="News" />
      
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-black text-[#0F1729]">Latest News</h1>
          <p className="text-[#6B7280] text-sm mt-1">Stay updated with KPFL news and announcements</p>
        </div>

        {/* Filter Tags */}
        <div className="mb-5 overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  'px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors',
                  activeTag === tag
                    ? 'bg-[#0A1628] text-white'
                    : 'bg-white text-[#4B5563] hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {activeTag === 'All' && filteredNews.length > 0 && (
          <div className="mb-5">
            <NewsCard 
              news={filteredNews[0]} 
              onClick={() => onNewsSelect(filteredNews[0].id)}
              variant="hero"
            />
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTag === 'All' ? filteredNews.slice(1) : filteredNews).map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onClick={() => onNewsSelect(item.id)}
              variant="featured"
            />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
            <span className="text-4xl mb-3 block">📰</span>
            <p className="text-[#4B5563] font-medium">No news found</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface NewsDetailScreenProps {
  newsId: string;
  onBack: () => void;
}

const tagColors: Record<string, string> = {
  Transfer: 'bg-purple-500',
  Matchday: 'bg-emerald-500',
  Club: 'bg-blue-500',
  League: 'bg-[#E8A912]',
  Injury: 'bg-red-500',
  Interview: 'bg-[#4B5563]',
};

export function NewsDetailScreen({ newsId, onBack }: NewsDetailScreenProps) {
  const newsItem = news.find(n => n.id === newsId);
  const club = newsItem?.clubId ? getClub(newsItem.clubId) : null;
  
  if (!newsItem) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <p className="text-[#6B7280]">Article not found</p>
      </div>
    );
  }

  const bgColor = club?.primaryColor || '#0A1628';

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="News" showBack onBack={onBack} />
      
      {/* Hero Image */}
      <div 
        className="h-56 md:h-80 relative"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {club ? (
            <span className="text-white/15 text-8xl font-black">{club.shortName}</span>
          ) : (
            <span className="text-white/15 text-8xl">⚽</span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
          <div className="max-w-3xl mx-auto">
            <span className={cn('badge text-white mb-2', tagColors[newsItem.tag] || 'bg-[#4B5563]')}>
              {newsItem.tag}
            </span>
            <h1 className="text-xl md:text-3xl font-black text-white leading-tight">
              {newsItem.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 md:py-8">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-5 text-sm text-[#6B7280]">
          <span>{formatShortDate(newsItem.date)}</span>
          {newsItem.author && (
            <>
              <span>•</span>
              <span>By {newsItem.author}</span>
            </>
          )}
        </div>

        {/* Summary */}
        <p className="text-lg text-[#4B5563] mb-6 leading-relaxed font-medium">
          {newsItem.summary}
        </p>

        {/* Content */}
        <div className="space-y-5">
          {newsItem.content.map((paragraph, idx) => (
            <p key={idx} className="text-[#4B5563] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share */}
        <div className="mt-8 pt-5 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-sm text-[#6B7280]">Share this article</span>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-lg bg-[#F4F6F8] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors">
              📋
            </button>
            <button className="w-9 h-9 rounded-lg bg-[#F4F6F8] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors">
              📧
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
