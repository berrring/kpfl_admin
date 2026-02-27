import { 
  getUpcomingMatches, 
  getLatestResults, 
  getTopStandings, 
  getLatestNews,
  getLiveMatches,
  clubs,
  getClub,
  topScorers,
  matchEvents,
  players
} from '@/data/mockData';
import { MobileHeader, SectionHeader } from '@/components/Navigation';
import { MatchCard } from '@/components/MatchCard';
import { NewsCard } from '@/components/NewsCard';
import { ClubLogo } from '@/components/ClubLogo';
import { cn } from '@/utils/cn';

interface HomeScreenProps {
  onMatchSelect: (matchId: string) => void;
  onClubSelect: (clubId: string) => void;
  onNewsSelect: (newsId: string) => void;
  onViewMatches: () => void;
  onViewStandings: () => void;
  onViewClubs: () => void;
  onViewNews: () => void;
  onViewStats: () => void;
}

export function HomeScreen({
  onMatchSelect,
  onClubSelect,
  onNewsSelect,
  onViewMatches,
  onViewStandings,
  onViewClubs,
  onViewNews,
  onViewStats,
}: HomeScreenProps) {
  const liveMatches = getLiveMatches();
  const upcomingMatches = getUpcomingMatches(6);
  const latestResults = getLatestResults(5);
  const topStandings = getTopStandings(6);
  const latestNews = getLatestNews(4);
  const featuredClubs = clubs.slice(0, 8);

  // Calculate discipline stats
  const disciplineStats = players
    .filter(p => !p.isCoach)
    .map(player => {
      const yellows = matchEvents.filter(e => e.type === 'YELLOW' && e.playerId === player.id).length;
      const reds = matchEvents.filter(e => e.type === 'RED' && e.playerId === player.id).length;
      return { player, yellows, reds, total: yellows + reds * 2 };
    })
    .filter(p => p.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <MobileHeader title="KPFL" />
      
      {/* Hero Section */}
      <section className="bg-[#0A1628] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8A912]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E8A912]/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 relative z-10">
          {liveMatches.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <span className="text-red-400 font-bold text-sm tracking-wide uppercase">Live Now</span>
                </span>
              </div>
              <MatchCard 
                match={liveMatches[0]} 
                onClick={() => onMatchSelect(liveMatches[0].id)} 
                variant="hero" 
              />
            </div>
          ) : upcomingMatches.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[#6B7280] text-xs font-semibold tracking-wider uppercase">Featured Match</span>
                  <h2 className="text-white text-2xl md:text-3xl font-black mt-1 text-glow">KPFL 2026</h2>
                </div>
                <button 
                  onClick={onViewMatches}
                  className="text-sm text-[#E8A912] font-semibold hover:text-[#F5C742] transition-colors flex items-center gap-1.5 group"
                >
                  Full Schedule
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <MatchCard 
                match={upcomingMatches[0]} 
                onClick={() => onMatchSelect(upcomingMatches[0].id)} 
                variant="hero" 
              />
            </div>
          ) : null}
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-[#E8A912]/30 to-transparent" />
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Matches */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
              <SectionHeader title="Upcoming Matches" action="View All" onAction={onViewMatches} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingMatches.slice(0, 4).map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onClick={() => onMatchSelect(match.id)} 
                    variant="list" 
                  />
                ))}
              </div>
            </section>

            {/* Latest Results */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
              <SectionHeader title="Latest Results" action="View All" onAction={onViewMatches} />
              <div className="divide-y divide-[#F4F6F8]">
                {latestResults.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onClick={() => onMatchSelect(match.id)} 
                    variant="compact" 
                  />
                ))}
              </div>
            </section>

            {/* News Section */}
            <section>
              <SectionHeader title="Latest News" action="View All" onAction={onViewNews} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {latestNews.slice(0, 1).map((item) => (
                  <NewsCard 
                    key={item.id} 
                    news={item} 
                    onClick={() => onNewsSelect(item.id)}
                    variant="hero"
                  />
                ))}
                <div className="space-y-3">
                  {latestNews.slice(1, 4).map((item) => (
                    <NewsCard 
                      key={item.id} 
                      news={item} 
                      onClick={() => onNewsSelect(item.id)}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-5">
            
            {/* Standings Widget */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="bg-[#0A1628] text-white p-4 flex items-center justify-between">
                <h3 className="font-bold text-sm">League Table</h3>
                <button 
                  onClick={onViewStandings}
                  className="text-xs text-[#E8A912] font-semibold hover:text-[#F5C742] transition-colors"
                >
                  Full Table
                </button>
              </div>
              <div className="divide-y divide-[#F4F6F8]">
                {topStandings.map((entry, idx) => {
                  const club = getClub(entry.clubId)!;
                  return (
                    <button
                      key={entry.clubId}
                      onClick={() => onClubSelect(entry.clubId)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F6F8] transition-colors"
                    >
                      <span className={cn(
                        'w-6 h-6 rounded text-xs font-bold flex items-center justify-center',
                        idx === 0 ? 'bg-gradient-to-br from-[#F5C742] to-[#E8A912] text-[#0A1628]' :
                        idx < 3 ? 'bg-[#0A1628] text-white' : 
                        'bg-[#F4F6F8] text-[#6B7280]'
                      )}>
                        {idx + 1}
                      </span>
                      <ClubLogo club={club} size="sm" />
                      <span className="flex-1 text-left font-semibold text-sm truncate">
                        {club.shortName}
                      </span>
                      <span className="text-xs text-[#9CA3AF] w-6 text-center">{entry.played}</span>
                      <span className="font-bold text-sm w-7 text-right">{entry.points}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Top Scorers */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="bg-[#0A1628] text-white p-4 flex items-center justify-between">
                <h3 className="font-bold text-sm">Top Scorers</h3>
                <button 
                  onClick={onViewStats}
                  className="text-xs text-[#E8A912] font-semibold hover:text-[#F5C742] transition-colors"
                >
                  All Stats
                </button>
              </div>
              <div className="divide-y divide-[#F4F6F8]">
                {topScorers.slice(0, 5).map((entry, idx) => {
                  const club = getClub(entry.player.clubId)!;
                  return (
                    <div
                      key={entry.player.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F6F8] transition-colors"
                    >
                      <span className={cn(
                        'w-6 h-6 rounded text-xs font-bold flex items-center justify-center',
                        idx === 0 ? 'bg-gradient-to-br from-[#F5C742] to-[#E8A912] text-[#0A1628]' : 
                        'bg-[#F4F6F8] text-[#6B7280]'
                      )}>
                        {idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{entry.player.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {entry.player.firstName.charAt(0)}. {entry.player.lastName}
                        </p>
                        <div className="flex items-center gap-1">
                          <ClubLogo club={club} size="xs" />
                          <span className="text-xs text-[#9CA3AF]">{club.shortName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{entry.goals}</p>
                        <p className="text-[9px] text-[#9CA3AF] font-medium">GOALS</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Discipline Widget */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="bg-[#0A1628] text-white p-4">
                <h3 className="font-bold text-sm">Discipline</h3>
              </div>
              <div className="divide-y divide-[#F4F6F8]">
                {disciplineStats.slice(0, 5).map((entry, idx) => {
                  const club = getClub(entry.player.clubId)!;
                  return (
                    <div
                      key={entry.player.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F6F8] transition-colors"
                    >
                      <span className="w-5 text-center text-xs text-[#9CA3AF] font-medium">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {entry.player.firstName.charAt(0)}. {entry.player.lastName}
                        </p>
                        <div className="flex items-center gap-1">
                          <ClubLogo club={club} size="xs" />
                          <span className="text-xs text-[#9CA3AF]">{club.shortName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-sm">
                          <span className="text-yellow-500">🟨</span>
                          <span className="font-semibold">{entry.yellows}</span>
                        </span>
                        <span className="flex items-center gap-0.5 text-sm">
                          <span className="text-red-500">🟥</span>
                          <span className="font-semibold">{entry.reds}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Clubs Grid */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
              <SectionHeader title="KPFL Clubs" action="View All" onAction={onViewClubs} />
              <div className="grid grid-cols-4 gap-2">
                {featuredClubs.map((club) => (
                  <button 
                    key={club.id} 
                    onClick={() => onClubSelect(club.id)}
                    className="flex flex-col items-center gap-1.5 p-2 hover:bg-[#F4F6F8] rounded-lg transition-colors group"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      <ClubLogo club={club} size="md" />
                    </div>
                    <span className="text-[9px] font-semibold text-[#6B7280] truncate w-full text-center">
                      {club.shortName}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Fantasy Promo */}
            <section className="rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#F5C742] via-[#E8A912] to-[#C98F00] p-5 text-center relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="relative z-10">
                  <span className="text-3xl mb-2 block">⚽</span>
                  <h3 className="font-bold text-lg text-[#0A1628] mb-1">KPFL Fantasy</h3>
                  <p className="text-[#0A1628]/70 text-xs mb-3">Build your dream team!</p>
                  <button className="bg-[#0A1628] text-white px-5 py-2 rounded-lg font-semibold text-sm opacity-60 cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
