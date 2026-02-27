import { useMemo } from 'react';
import { matches, getClub, getMatchEvents, getPlayer, formatFullDate } from '@/data/mockData';
import { MobileHeader } from '@/components/Navigation';
import { ClubLogo } from '@/components/ClubLogo';
import { cn } from '@/utils/cn';

interface MatchDetailsScreenProps {
  matchId: string;
  onBack: () => void;
  onPlayerSelect: (playerId: string) => void;
  onClubSelect: (clubId: string) => void;
}

export function MatchDetailsScreen({ matchId, onBack, onPlayerSelect, onClubSelect }: MatchDetailsScreenProps) {
  const match = matches.find(m => m.id === matchId);
  const homeClub = match ? getClub(match.homeClubId) : null;
  const awayClub = match ? getClub(match.awayClubId) : null;
  const events = useMemo(() => getMatchEvents(matchId), [matchId]);

  if (!match || !homeClub || !awayClub) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <p className="text-[#6B7280]">Match not found</p>
      </div>
    );
  }

  const isLive = match.status === 'Live';
  const isFinal = match.status === 'Final';

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="Match" showBack onBack={onBack} />
      
      {/* Match Header */}
      <div className="bg-[#0A1628] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {isLive && (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="bg-red-500 text-white px-2.5 py-1 rounded text-xs font-bold">{match.minute}'</span>
                </>
              )}
              {isFinal && <span className="bg-white/10 text-[#9CA3AF] px-2.5 py-1 rounded text-xs font-bold">Full Time</span>}
              {match.status === 'Scheduled' && <span className="bg-blue-500 text-white px-2.5 py-1 rounded text-xs font-bold">Scheduled</span>}
            </div>
            <span className="text-[#6B7280] text-xs">Round {match.round}</span>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onClubSelect(homeClub.id)}
              className="flex-1 flex flex-col items-center text-center hover:opacity-80 transition-opacity"
            >
              <ClubLogo club={homeClub} size="xl" />
              <h3 className="font-bold mt-2.5 text-base md:text-lg">{homeClub.name}</h3>
              <p className="text-[#6B7280] text-xs">{homeClub.city}</p>
            </button>

            <div className="px-6 text-center">
              {(isLive || isFinal) ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl md:text-5xl font-black">{match.homeScore}</span>
                  <span className="text-xl text-[#6B7280]">-</span>
                  <span className="text-4xl md:text-5xl font-black">{match.awayScore}</span>
                </div>
              ) : (
                <div>
                  <p className="text-3xl font-bold text-[#E8A912]">{match.time}</p>
                  <p className="text-[#6B7280] text-xs mt-1">Kick-off</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => onClubSelect(awayClub.id)}
              className="flex-1 flex flex-col items-center text-center hover:opacity-80 transition-opacity"
            >
              <ClubLogo club={awayClub} size="xl" />
              <h3 className="font-bold mt-2.5 text-base md:text-lg">{awayClub.name}</h3>
              <p className="text-[#6B7280] text-xs">{awayClub.city}</p>
            </button>
          </div>

          {/* Match Info */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-5 text-xs text-[#6B7280]">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatFullDate(match.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{match.stadium}</span>
            </div>
            {match.attendance && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{match.attendance.toLocaleString()} fans</span>
              </div>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#E8A912]/30 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5">
        {/* Match Events */}
        {(isLive || isFinal) && events.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden mb-5 shadow-sm">
            <div className="bg-[#0A1628] text-white px-4 py-3 font-bold text-sm">
              Match Events
            </div>
            <div className="divide-y divide-[#F4F6F8]">
              {events.sort((a, b) => a.minute - b.minute).map((event) => {
                const player = getPlayer(event.playerId);
                const assistPlayer = event.assistPlayerId ? getPlayer(event.assistPlayerId) : null;
                const isHomeEvent = event.clubId === homeClub.id;
                
                return (
                  <button
                    key={event.id}
                    onClick={() => player && onPlayerSelect(player.id)}
                    className="w-full p-4 hover:bg-[#F4F6F8] transition-colors"
                  >
                    <div className={cn(
                      'flex items-center gap-3',
                      isHomeEvent ? 'flex-row' : 'flex-row-reverse'
                    )}>
                      <div className={cn(
                        'flex-1',
                        isHomeEvent ? 'text-left' : 'text-right'
                      )}>
                        <p className="font-semibold text-sm text-[#0F1729]">
                          {player ? `${player.firstName} ${player.lastName}` : 'Unknown'}
                        </p>
                        {assistPlayer && event.type === 'GOAL' && (
                          <p className="text-xs text-[#6B7280]">
                            Assist: {assistPlayer.firstName.charAt(0)}. {assistPlayer.lastName}
                          </p>
                        )}
                      </div>
                      
                      <div className={cn(
                        'w-12 h-12 rounded-lg flex flex-col items-center justify-center',
                        event.type === 'GOAL' ? 'bg-emerald-50' :
                        event.type === 'YELLOW' ? 'bg-yellow-50' :
                        'bg-red-50'
                      )}>
                        <span className="text-lg">
                          {event.type === 'GOAL' && '⚽'}
                          {event.type === 'YELLOW' && '🟨'}
                          {event.type === 'RED' && '🟥'}
                        </span>
                        <span className="text-[10px] font-bold text-[#4B5563]">{event.minute}'</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Match Stats Summary */}
        {(isLive || isFinal) && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <h3 className="font-bold text-[#0F1729] mb-4 text-sm">Match Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#0F1729]">
                  {events.filter(e => e.type === 'GOAL' && e.clubId === homeClub.id).length}
                </p>
                <p className="text-xs text-[#6B7280]">Home Goals</p>
              </div>
              <div className="border-x border-[#E5E7EB]">
                <p className="text-2xl font-bold text-amber-500">
                  {events.filter(e => e.type === 'YELLOW').length}
                </p>
                <p className="text-xs text-[#6B7280]">Yellow Cards</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1729]">
                  {events.filter(e => e.type === 'GOAL' && e.clubId === awayClub.id).length}
                </p>
                <p className="text-xs text-[#6B7280]">Away Goals</p>
              </div>
            </div>
          </div>
        )}

        {match.status === 'Scheduled' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-[#0F1729] font-semibold">Match hasn't started</p>
            <p className="text-xs text-[#6B7280] mt-1">
              Kick-off at {match.time} on {formatFullDate(match.date)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
