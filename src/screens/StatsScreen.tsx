import { useState } from 'react';
import { topScorers, getClub, matchEvents, players } from '@/data/mockData';
import { MobileHeader } from '@/components/Navigation';
import { ClubLogo } from '@/components/ClubLogo';
import { cn } from '@/utils/cn';

interface StatsScreenProps {
  onPlayerSelect: (playerId: string) => void;
  onClubSelect: (clubId: string) => void;
}

type StatTab = 'goals' | 'assists' | 'cards';

export function StatsScreen({ onPlayerSelect, onClubSelect }: StatsScreenProps) {
  const [activeTab, setActiveTab] = useState<StatTab>('goals');

  const topAssisters = players
    .filter(p => !p.isCoach)
    .map(player => {
      const assists = matchEvents.filter(e => e.assistPlayerId === player.id).length;
      return { player, assists };
    })
    .filter(p => p.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);

  const mostCards = players
    .filter(p => !p.isCoach)
    .map(player => {
      const yellows = matchEvents.filter(e => e.type === 'YELLOW' && e.playerId === player.id).length;
      const reds = matchEvents.filter(e => e.type === 'RED' && e.playerId === player.id).length;
      return { player, yellows, reds, total: yellows + reds * 2 };
    })
    .filter(p => p.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const tabs: { id: StatTab; label: string }[] = [
    { id: 'goals', label: 'Goals' },
    { id: 'assists', label: 'Assists' },
    { id: 'cards', label: 'Cards' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="Stats" />
      
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-black text-[#0F1729]">Player Statistics</h1>
          <p className="text-[#6B7280] text-sm mt-1">KPFL Season 2026</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-1 mb-5 inline-flex shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-5 py-2 rounded-lg font-semibold text-sm transition-colors',
                activeTab === tab.id
                  ? 'bg-[#0A1628] text-white'
                  : 'text-[#4B5563] hover:text-[#0F1729]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
            <div className="bg-[#0A1628] text-white px-4 py-3">
              <h2 className="font-bold text-sm">Top Scorers</h2>
            </div>
            <div className="divide-y divide-[#F4F6F8]">
              {topScorers.map((entry, idx) => {
                const club = getClub(entry.player.clubId)!;
                return (
                  <button
                    key={entry.player.id}
                    onClick={() => onPlayerSelect(entry.player.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-[#F4F6F8] transition-colors"
                  >
                    <span className={cn(
                      'w-7 h-7 rounded flex items-center justify-center font-bold text-sm',
                      idx === 0 ? 'bg-gradient-to-br from-[#F5C742] to-[#E8A912] text-[#0A1628]' :
                      idx === 1 ? 'bg-[#D1D5DB] text-[#4B5563]' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'bg-[#F4F6F8] text-[#6B7280]'
                    )}>
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{entry.player.number}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-[#0F1729]">
                        {entry.player.firstName} {entry.player.lastName}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onClubSelect(club.id); }}
                        className="flex items-center gap-1.5 mt-0.5 hover:opacity-70"
                      >
                        <ClubLogo club={club} size="xs" />
                        <span className="text-xs text-[#6B7280]">{club.name}</span>
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#0F1729]">{entry.goals}</p>
                      <p className="text-[9px] text-[#9CA3AF] font-medium">GOALS</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Assists Tab */}
        {activeTab === 'assists' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
            <div className="bg-[#0A1628] text-white px-4 py-3">
              <h2 className="font-bold text-sm">Top Assists</h2>
            </div>
            <div className="divide-y divide-[#F4F6F8]">
              {topAssisters.map((entry, idx) => {
                const club = getClub(entry.player.clubId)!;
                return (
                  <button
                    key={entry.player.id}
                    onClick={() => onPlayerSelect(entry.player.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-[#F4F6F8] transition-colors"
                  >
                    <span className={cn(
                      'w-7 h-7 rounded flex items-center justify-center font-bold text-sm',
                      idx === 0 ? 'bg-gradient-to-br from-[#F5C742] to-[#E8A912] text-[#0A1628]' :
                      idx === 1 ? 'bg-[#D1D5DB] text-[#4B5563]' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'bg-[#F4F6F8] text-[#6B7280]'
                    )}>
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{entry.player.number}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-[#0F1729]">
                        {entry.player.firstName} {entry.player.lastName}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onClubSelect(club.id); }}
                        className="flex items-center gap-1.5 mt-0.5 hover:opacity-70"
                      >
                        <ClubLogo club={club} size="xs" />
                        <span className="text-xs text-[#6B7280]">{club.name}</span>
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#0F1729]">{entry.assists}</p>
                      <p className="text-[9px] text-[#9CA3AF] font-medium">ASSISTS</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
            <div className="bg-[#0A1628] text-white px-4 py-3">
              <h2 className="font-bold text-sm">Disciplinary</h2>
            </div>
            <div className="divide-y divide-[#F4F6F8]">
              {mostCards.map((entry, idx) => {
                const club = getClub(entry.player.clubId)!;
                return (
                  <button
                    key={entry.player.id}
                    onClick={() => onPlayerSelect(entry.player.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-[#F4F6F8] transition-colors"
                  >
                    <span className="w-7 h-7 rounded bg-[#F4F6F8] flex items-center justify-center font-bold text-sm text-[#6B7280]">
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{entry.player.number}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-[#0F1729]">
                        {entry.player.firstName} {entry.player.lastName}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onClubSelect(club.id); }}
                        className="flex items-center gap-1.5 mt-0.5 hover:opacity-70"
                      >
                        <ClubLogo club={club} size="xs" />
                        <span className="text-xs text-[#6B7280]">{club.name}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 text-base">🟨</span>
                          <span className="font-bold text-sm">{entry.yellows}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <span className="text-red-500 text-base">🟥</span>
                          <span className="font-bold text-sm">{entry.reds}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
