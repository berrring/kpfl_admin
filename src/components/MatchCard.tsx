import { Match, getClub } from '@/data/mockData';
import { ClubLogo } from './ClubLogo';
import { cn } from '@/utils/cn';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  variant?: 'default' | 'compact' | 'hero' | 'list';
}

export function MatchCard({ match, onClick, variant = 'default' }: MatchCardProps) {
  const homeClub = getClub(match.homeClubId)!;
  const awayClub = getClub(match.awayClubId)!;
  const isLive = match.status === 'Live';
  const isFinal = match.status === 'Final';
  const isScheduled = match.status === 'Scheduled';

  // Hero variant - Featured match
  if (variant === 'hero') {
    return (
      <button
        onClick={onClick}
        className="w-full bg-[#142238]/80 backdrop-blur-sm text-white rounded-xl overflow-hidden relative group border border-white/10 hover:border-[#E8A912]/30 transition-all"
      >
        <div className="p-5 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {isLive && (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="bg-red-500 text-white px-2.5 py-1 rounded text-xs font-bold">
                    LIVE • {match.minute}'
                  </span>
                </>
              )}
              {isFinal && (
                <span className="bg-white/10 text-[#9CA3AF] px-2.5 py-1 rounded text-xs font-bold">
                  Full Time
                </span>
              )}
              {isScheduled && (
                <span className="text-[#9CA3AF] text-sm font-medium">{match.date}</span>
              )}
            </div>
            <span className="text-[#6B7280] text-xs font-medium">Round {match.round}</span>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-3 md:gap-4">
              <ClubLogo club={homeClub} size="xl" />
              <div className="text-left">
                <p className="font-bold text-base md:text-lg">{homeClub.name}</p>
                <p className="text-[#6B7280] text-xs">{homeClub.city}</p>
              </div>
            </div>

            <div className="px-4 md:px-6 text-center">
              {(isLive || isFinal) ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl font-black">{match.homeScore}</span>
                  <span className="text-xl text-[#6B7280]">-</span>
                  <span className="text-3xl md:text-4xl font-black">{match.awayScore}</span>
                </div>
              ) : (
                <div>
                  <p className="text-2xl md:text-3xl font-black text-[#E8A912]">{match.time}</p>
                  <p className="text-[#6B7280] text-xs mt-0.5">{match.tvChannel}</p>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center gap-3 md:gap-4 justify-end">
              <div className="text-right">
                <p className="font-bold text-base md:text-lg">{awayClub.name}</p>
                <p className="text-[#6B7280] text-xs">{awayClub.city}</p>
              </div>
              <ClubLogo club={awayClub} size="xl" />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {match.stadium}
            </span>
            {match.attendance && <span>{match.attendance.toLocaleString()} fans</span>}
          </div>
        </div>

        <div className="absolute inset-0 bg-[#E8A912]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  // Compact variant - Results list row
  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center py-3 px-1 hover:bg-[#F4F6F8] transition-colors rounded-lg group"
      >
        {/* Home team */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <ClubLogo club={homeClub} size="sm" />
          <span className={cn(
            'text-sm font-medium truncate',
            isFinal && match.homeScore! > match.awayScore! && 'font-bold'
          )}>
            {homeClub.shortName}
          </span>
        </div>

        {/* Score / Time */}
        <div className="px-3 flex items-center gap-1.5 text-center min-w-[70px]">
          {(isLive || isFinal) ? (
            <>
              <span className={cn(
                'w-5 text-center font-bold text-sm',
                isFinal && match.homeScore! > match.awayScore! && 'text-emerald-600'
              )}>
                {match.homeScore}
              </span>
              <span className="text-[#D1D5DB]">-</span>
              <span className={cn(
                'w-5 text-center font-bold text-sm',
                isFinal && match.awayScore! > match.homeScore! && 'text-emerald-600'
              )}>
                {match.awayScore}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#4B5563]">{match.time}</span>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
          <span className={cn(
            'text-sm font-medium truncate',
            isFinal && match.awayScore! > match.homeScore! && 'font-bold'
          )}>
            {awayClub.shortName}
          </span>
          <ClubLogo club={awayClub} size="sm" />
        </div>

        {/* Status */}
        <div className="ml-3 w-12 flex justify-end">
          {isLive && (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[9px] font-bold">
              {match.minute}'
            </span>
          )}
          {isFinal && (
            <span className="bg-[#F4F6F8] text-[#6B7280] px-2 py-0.5 rounded text-[9px] font-bold border border-[#E5E7EB]">
              FT
            </span>
          )}
          {isScheduled && (
            <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[9px] font-bold">
              SCH
            </span>
          )}
        </div>
      </button>
    );
  }

  // List variant - Schedule card
  if (variant === 'list') {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full bg-white border rounded-xl p-4 hover:border-[#E8A912] hover:shadow-md transition-all group",
          isLive ? 'border-l-4 border-l-red-500 border-[#E5E7EB]' : 'border-[#E5E7EB]'
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isLive && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  {match.minute}'
                </span>
              </>
            )}
            {isFinal && (
              <span className="bg-[#F4F6F8] text-[#6B7280] px-2 py-0.5 rounded text-[10px] font-bold">
                Full Time
              </span>
            )}
            {isScheduled && (
              <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                {match.time}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#9CA3AF]">R{match.round}</span>
        </div>

        <div className="space-y-2.5">
          {/* Home */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <ClubLogo club={homeClub} size="md" />
              <span className={cn(
                'font-medium truncate text-sm',
                isFinal && match.homeScore! > match.awayScore! && 'font-bold'
              )}>
                {homeClub.name}
              </span>
            </div>
            {(isLive || isFinal) && (
              <span className={cn(
                'text-xl font-bold w-7 text-right',
                isFinal && match.homeScore! > match.awayScore! ? 'text-[#0F1729]' : 'text-[#9CA3AF]'
              )}>
                {match.homeScore}
              </span>
            )}
          </div>

          {/* Away */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <ClubLogo club={awayClub} size="md" />
              <span className={cn(
                'font-medium truncate text-sm',
                isFinal && match.awayScore! > match.homeScore! && 'font-bold'
              )}>
                {awayClub.name}
              </span>
            </div>
            {(isLive || isFinal) && (
              <span className={cn(
                'text-xl font-bold w-7 text-right',
                isFinal && match.awayScore! > match.homeScore! ? 'text-[#0F1729]' : 'text-[#9CA3AF]'
              )}>
                {match.awayScore}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#F4F6F8] text-[10px] text-[#9CA3AF] flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {match.stadium}
        </div>
      </button>
    );
  }

  // Default variant - Featured card
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#E8A912] hover:shadow-lg transition-all group min-w-[280px]"
    >
      {/* Header */}
      <div className="bg-[#0A1628] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400">LIVE</span>
            </>
          )}
          {!isLive && <span className="text-xs text-[#6B7280]">Round {match.round}</span>}
        </div>
        {isLive && match.minute && (
          <span className="text-xs font-bold text-[#E8A912]">{match.minute}'</span>
        )}
        {isFinal && <span className="text-xs text-[#6B7280]">Full Time</span>}
        {isScheduled && <span className="text-xs text-[#9CA3AF]">{match.date}</span>}
      </div>

      {/* Match content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <ClubLogo club={homeClub} size="lg" className="mx-auto mb-2 group-hover:scale-105 transition-transform" />
            <p className="text-sm font-semibold line-clamp-1">{homeClub.shortName}</p>
          </div>

          <div className="px-3 text-center">
            {(isLive || isFinal) ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{match.homeScore}</span>
                <span className="text-[#D1D5DB]">-</span>
                <span className="text-2xl font-bold">{match.awayScore}</span>
              </div>
            ) : (
              <div>
                <p className="text-lg font-bold text-[#E8A912]">{match.time}</p>
                <p className="text-xs text-[#9CA3AF]">Kick-off</p>
              </div>
            )}
          </div>

          <div className="flex-1 text-center">
            <ClubLogo club={awayClub} size="lg" className="mx-auto mb-2 group-hover:scale-105 transition-transform" />
            <p className="text-sm font-semibold line-clamp-1">{awayClub.shortName}</p>
          </div>
        </div>
      </div>
    </button>
  );
}
