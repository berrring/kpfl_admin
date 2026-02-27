import { useState, useMemo } from 'react';
import { matches } from '@/data/mockData';
import { MobileHeader } from '@/components/Navigation';
import { MatchCard } from '@/components/MatchCard';
import { cn } from '@/utils/cn';

interface MatchesScreenProps {
  onMatchSelect: (matchId: string) => void;
}

export function MatchesScreen({ onMatchSelect }: MatchesScreenProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'final' | 'scheduled'>('all');
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  
  const rounds = useMemo(() => [...new Set(matches.map(m => m.round))].sort((a, b) => a - b), []);
  
  const filteredMatches = useMemo(() => {
    let filtered = [...matches];
    
    if (filterStatus === 'final') {
      filtered = filtered.filter(m => m.status === 'Final' || m.status === 'Live');
    } else if (filterStatus === 'scheduled') {
      filtered = filtered.filter(m => m.status === 'Scheduled');
    }
    
    if (selectedRound !== null) {
      filtered = filtered.filter(m => m.round === selectedRound);
    }
    
    return filtered;
  }, [filterStatus, selectedRound]);
  
  const groupedByRound = useMemo(() => {
    const groups: Record<number, typeof matches> = {};
    filteredMatches.forEach(match => {
      if (!groups[match.round]) {
        groups[match.round] = [];
      }
      groups[match.round].push(match);
    });
    return Object.entries(groups)
      .map(([round, matches]) => ({ round: Number(round), matches }))
      .sort((a, b) => a.round - b.round);
  }, [filteredMatches]);

  const statusFilters = [
    { id: 'all', label: 'All Matches' },
    { id: 'final', label: 'Results' },
    { id: 'scheduled', label: 'Upcoming' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="Schedule" />
      
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-black text-[#0F1729]">Schedule</h1>
          <p className="text-[#6B7280] text-sm mt-1">KPFL Season 2026 • All fixtures and results</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-5 shadow-sm">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Status Filters */}
            <div className="flex gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
                    filterStatus === filter.id
                      ? 'bg-[#0A1628] text-white'
                      : 'bg-[#F4F6F8] text-[#4B5563] hover:bg-[#E5E7EB]'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {/* Round Selector */}
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setSelectedRound(null)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors',
                  selectedRound === null
                    ? 'bg-[#E8A912] text-[#0A1628]'
                    : 'bg-[#F4F6F8] text-[#6B7280] hover:bg-[#E5E7EB]'
                )}
              >
                All
              </button>
              {rounds.map((round) => (
                <button
                  key={round}
                  onClick={() => setSelectedRound(round)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors',
                    selectedRound === round
                      ? 'bg-[#E8A912] text-[#0A1628]'
                      : 'bg-[#F4F6F8] text-[#6B7280] hover:bg-[#E5E7EB]'
                  )}
                >
                  R{round}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Match List */}
        <div className="space-y-6">
          {groupedByRound.map(({ round, matches: roundMatches }) => (
            <section key={round}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#0A1628] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{round}</span>
                </div>
                <div>
                  <h2 className="font-bold text-[#0F1729] text-sm">Round {round}</h2>
                  <p className="text-[10px] text-[#9CA3AF]">
                    {roundMatches.filter(m => m.status === 'Final').length} completed • 
                    {roundMatches.filter(m => m.status === 'Scheduled').length} scheduled
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roundMatches.sort((a, b) => a.date.localeCompare(b.date)).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => onMatchSelect(match.id)}
                    variant="list"
                  />
                ))}
              </div>
            </section>
          ))}
          
          {groupedByRound.length === 0 && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#F4F6F8] flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚽</span>
              </div>
              <p className="text-[#4B5563] font-medium">No matches found</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
