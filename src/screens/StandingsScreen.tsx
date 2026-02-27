import { standings, getClub } from '@/data/mockData';
import { MobileHeader } from '@/components/Navigation';
import { ClubLogo } from '@/components/ClubLogo';
import { cn } from '@/utils/cn';

interface StandingsScreenProps {
  onClubSelect: (clubId: string) => void;
}

export function StandingsScreen({ onClubSelect }: StandingsScreenProps) {
  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="Standings" />
      
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-black text-[#0F1729]">League Standings</h1>
          <p className="text-[#6B7280] text-sm mt-1">KPFL Season 2026 • Updated after each matchday</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0A1628] text-white">
                  <th className="text-left py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-12">#</th>
                  <th className="text-left py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide">Club</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-10">P</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-10">W</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-10">D</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-10">L</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-10">GF</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-10">GA</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-10">GD</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide w-20">Form</th>
                  <th className="text-center py-3.5 px-4 font-bold text-[10px] uppercase tracking-wide text-[#E8A912] w-14">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((entry, index) => {
                  const club = getClub(entry.clubId)!;
                  const gd = entry.goalsFor - entry.goalsAgainst;
                  const isTop = index < 3;
                  const isBottom = index >= standings.length - 2;
                  
                  return (
                    <tr
                      key={entry.clubId}
                      onClick={() => onClubSelect(entry.clubId)}
                      className={cn(
                        'cursor-pointer hover:bg-[#F4F6F8] transition-colors border-b border-[#F4F6F8]',
                        index % 2 === 0 && 'bg-[#FAFBFC]'
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            'w-0.5 h-6 rounded-full',
                            isTop && 'bg-emerald-500',
                            isBottom && 'bg-red-500'
                          )} />
                          <span className={cn(
                            'w-6 h-6 rounded text-xs font-bold flex items-center justify-center',
                            index === 0 ? 'bg-gradient-to-br from-[#F5C742] to-[#E8A912] text-[#0A1628]' :
                            isTop ? 'bg-[#0A1628] text-white' :
                            isBottom ? 'bg-red-50 text-red-600' :
                            'bg-[#F4F6F8] text-[#6B7280]'
                          )}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <ClubLogo club={club} size="sm" />
                          <div>
                            <span className="font-semibold text-sm text-[#0F1729]">{club.name}</span>
                            <span className="text-[10px] text-[#9CA3AF] block">{club.city}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 text-[#4B5563] text-sm">{entry.played}</td>
                      <td className="text-center py-3 px-4 text-emerald-600 font-semibold text-sm">{entry.won}</td>
                      <td className="text-center py-3 px-4 text-[#9CA3AF] text-sm">{entry.drawn}</td>
                      <td className="text-center py-3 px-4 text-red-500 font-semibold text-sm">{entry.lost}</td>
                      <td className="text-center py-3 px-4 text-[#4B5563] text-sm">{entry.goalsFor}</td>
                      <td className="text-center py-3 px-4 text-[#4B5563] text-sm">{entry.goalsAgainst}</td>
                      <td className={cn(
                        'text-center py-3 px-4 font-semibold text-sm',
                        gd > 0 ? 'text-emerald-600' : gd < 0 ? 'text-red-500' : 'text-[#9CA3AF]'
                      )}>
                        {gd > 0 ? `+${gd}` : gd}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-0.5 justify-center">
                          {entry.form.map((f, i) => (
                            <span 
                              key={i}
                              className={cn(
                                'w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center text-white',
                                f === 'W' && 'bg-emerald-500',
                                f === 'D' && 'bg-[#9CA3AF]',
                                f === 'L' && 'bg-red-500'
                              )}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#E8A912]/10 font-bold text-[#C98F00] border border-[#E8A912]/20">
                          {entry.points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden divide-y divide-[#F4F6F8]">
            {standings.map((entry, index) => {
              const club = getClub(entry.clubId)!;
              const gd = entry.goalsFor - entry.goalsAgainst;
              const isTop = index < 3;
              const isBottom = index >= standings.length - 2;
              
              return (
                <button
                  key={entry.clubId}
                  onClick={() => onClubSelect(entry.clubId)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3.5 hover:bg-[#F4F6F8] transition-colors',
                    isTop && 'border-l-[3px] border-l-emerald-500',
                    isBottom && 'border-l-[3px] border-l-red-500'
                  )}
                >
                  <span className={cn(
                    'w-7 h-7 rounded text-xs font-bold flex items-center justify-center flex-shrink-0',
                    index === 0 ? 'bg-gradient-to-br from-[#F5C742] to-[#E8A912] text-[#0A1628]' :
                    isTop ? 'bg-[#0A1628] text-white' :
                    isBottom ? 'bg-red-50 text-red-600' :
                    'bg-[#F4F6F8] text-[#6B7280]'
                  )}>
                    {index + 1}
                  </span>
                  <ClubLogo club={club} size="sm" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm text-[#0F1729] truncate">{club.name}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#9CA3AF] mt-0.5">
                      <span className="text-emerald-600 font-medium">{entry.won}W</span>
                      <span>{entry.drawn}D</span>
                      <span className="text-red-500 font-medium">{entry.lost}L</span>
                      <span className="text-[#D1D5DB]">|</span>
                      <span className={cn(
                        'font-medium',
                        gd >= 0 ? 'text-emerald-600' : 'text-red-500'
                      )}>
                        {gd > 0 ? `+${gd}` : gd}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-[#E8A912]">{entry.points}</p>
                    <p className="text-[9px] text-[#9CA3AF] font-medium uppercase">pts</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-wrap gap-5 text-sm shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#4B5563] text-xs">Champions League</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[#4B5563] text-xs">Relegation</span>
          </div>
          <div className="text-[10px] text-[#9CA3AF] ml-auto flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tie-breaker: Points → GD → GF
          </div>
        </div>
      </div>
    </div>
  );
}
