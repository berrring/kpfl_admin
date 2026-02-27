import { useState } from 'react';
import { getClub, getClubPlayers, standings, matches } from '@/data/mockData';
import { MobileHeader } from '@/components/Navigation';
import { ClubLogo } from '@/components/ClubLogo';
import { MatchCard } from '@/components/MatchCard';
import { cn } from '@/utils/cn';

interface ClubProfileScreenProps {
  clubId: string;
  onBack: () => void;
  onPlayerSelect: (playerId: string) => void;
  onMatchSelect: (matchId: string) => void;
}

export function ClubProfileScreen({ clubId, onBack, onPlayerSelect, onMatchSelect }: ClubProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'matches'>('overview');
  const club = getClub(clubId);
  const players = getClubPlayers(clubId);
  const clubStanding = standings.find(s => s.clubId === clubId);
  const position = standings.findIndex(s => s.clubId === clubId) + 1;
  const clubMatches = matches.filter(m => m.homeClubId === clubId || m.awayClubId === clubId);
  
  if (!club) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <p className="text-[#6B7280]">Club not found</p>
      </div>
    );
  }

  const regularPlayers = players.filter(p => !p.isCoach);
  const coach = players.find(p => p.isCoach);

  const goalkeepers = regularPlayers.filter(p => p.position === 'GK');
  const defenders = regularPlayers.filter(p => p.position === 'DF');
  const midfielders = regularPlayers.filter(p => p.position === 'MF');
  const forwards = regularPlayers.filter(p => p.position === 'FW');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'squad', label: 'Squad' },
    { id: 'matches', label: 'Matches' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title={club.shortName} showBack onBack={onBack} />
      
      {/* Hero Header */}
      <div 
        className="relative h-44 md:h-56"
        style={{ background: `linear-gradient(135deg, ${club.primaryColor} 0%, ${adjustColor(club.primaryColor, -30)} 100%)` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="max-w-4xl mx-auto flex items-end gap-4">
            <ClubLogo club={club} size="2xl" showRing className="border-4 border-white" />
            <div className="text-white pb-1">
              <h1 className="text-xl md:text-3xl font-black">{club.name}</h1>
              <p className="text-white/80 text-sm">{club.city}, Kyrgyzstan</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-5">
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#0F1729]">#{position}</p>
                <p className="text-xs text-[#6B7280]">Position</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#E8A912]">{clubStanding?.points || 0}</p>
                <p className="text-xs text-[#6B7280]">Points</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#0F1729]">{clubStanding?.played || 0}</p>
                <p className="text-xs text-[#6B7280]">Matches</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-emerald-600">
                  {clubStanding ? clubStanding.goalsFor - clubStanding.goalsAgainst : 0}
                </p>
                <p className="text-xs text-[#6B7280]">Goal Diff</p>
              </div>
            </div>

            {/* Club Info */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
              <h2 className="font-bold text-[#0F1729] mb-4 text-sm">Club Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-[#F4F6F8] rounded-lg">
                  <span className="text-xl">🏟️</span>
                  <div>
                    <p className="text-[10px] text-[#6B7280]">Stadium</p>
                    <p className="font-medium text-sm">{club.stadium}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F4F6F8] rounded-lg">
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="text-[10px] text-[#6B7280]">Capacity</p>
                    <p className="font-medium text-sm">{club.capacity.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F4F6F8] rounded-lg">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-[10px] text-[#6B7280]">Founded</p>
                    <p className="font-medium text-sm">{club.founded}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F4F6F8] rounded-lg">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-[10px] text-[#6B7280]">City</p>
                    <p className="font-medium text-sm">{club.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            {clubStanding && clubStanding.form.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
                <h2 className="font-bold text-[#0F1729] mb-3 text-sm">Recent Form</h2>
                <div className="flex gap-1.5">
                  {clubStanding.form.map((result, idx) => (
                    <span 
                      key={idx}
                      className={cn(
                        'w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center text-white',
                        result === 'W' && 'bg-emerald-500',
                        result === 'D' && 'bg-[#9CA3AF]',
                        result === 'L' && 'bg-red-500'
                      )}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Coach */}
            {coach && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
                <h2 className="font-bold text-[#0F1729] mb-3 text-sm">Head Coach</h2>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#F4F6F8] flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">{coach.firstName} {coach.lastName}</p>
                    <p className="text-[#6B7280] text-sm">Head Coach</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Squad Tab */}
        {activeTab === 'squad' && (
          <div className="space-y-4">
            {[
              { title: 'Goalkeepers', players: goalkeepers, color: 'bg-yellow-500' },
              { title: 'Defenders', players: defenders, color: 'bg-blue-500' },
              { title: 'Midfielders', players: midfielders, color: 'bg-green-500' },
              { title: 'Forwards', players: forwards, color: 'bg-red-500' },
            ].map(({ title, players, color }) => (
              <div key={title} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                <div className={cn('px-4 py-3 font-bold text-white text-sm', color)}>
                  {title} ({players.length})
                </div>
                <div className="divide-y divide-[#F4F6F8]">
                  {players.map(player => (
                    <button
                      key={player.id}
                      onClick={() => onPlayerSelect(player.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-[#F4F6F8] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{player.number}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{player.firstName} {player.lastName}</p>
                        <p className="text-xs text-[#6B7280]">
                          {player.nationality === 'Kyrgyzstan' && '🇰🇬'}
                          {player.nationality === 'Kazakhstan' && '🇰🇿'}
                          {player.nationality === 'Uzbekistan' && '🇺🇿'}
                          {' '}{player.nationality}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-[#D1D5DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-3">
            {clubMatches.slice(0, 10).map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => onMatchSelect(match.id)}
                variant="list"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const r = clamp(parseInt(color.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(color.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(color.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
