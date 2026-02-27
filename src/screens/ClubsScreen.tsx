import { clubs, standings } from '@/data/mockData';
import { MobileHeader } from '@/components/Navigation';
import { ClubLogo } from '@/components/ClubLogo';
import { cn } from '@/utils/cn';

interface ClubsScreenProps {
  onClubSelect: (clubId: string) => void;
}

export function ClubsScreen({ onClubSelect }: ClubsScreenProps) {
  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="Clubs" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#0F1729]">KPFL Clubs</h1>
            <p className="text-[#6B7280] text-sm mt-1">{clubs.length} clubs competing in the 2026 season</p>
          </div>
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {clubs.map((club) => {
            const standing = standings.find(s => s.clubId === club.id);
            const position = standings.findIndex(s => s.clubId === club.id) + 1;
            
            return (
              <button
                key={club.id}
                onClick={() => onClubSelect(club.id)}
                className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#E8A912] hover:shadow-lg transition-all group"
              >
                {/* Header with club color */}
                <div 
                  className="h-24 relative flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${club.primaryColor} 0%, ${adjustColor(club.primaryColor, -30)} 100%)` }}
                >
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                  </div>
                  
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    <ClubLogo club={club} size="xl" />
                  </div>
                  
                  <div className={cn(
                    'absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold',
                    position <= 3 
                      ? 'bg-gradient-to-r from-[#F5C742] to-[#E8A912] text-[#0A1628]' 
                      : 'bg-black/30 backdrop-blur text-white'
                  )}>
                    #{position}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-[#0F1729] text-sm group-hover:text-[#E8A912] transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {club.city}
                  </p>
                  
                  <div className="mt-3 pt-3 border-t border-[#F4F6F8] flex items-center justify-between text-xs">
                    <div className="text-[#6B7280] flex items-center gap-1">
                      <span className="text-emerald-600 font-semibold">{standing?.won || 0}W</span>
                      <span className="text-[#D1D5DB]">-</span>
                      <span>{standing?.drawn || 0}D</span>
                      <span className="text-[#D1D5DB]">-</span>
                      <span className="text-red-500 font-semibold">{standing?.lost || 0}L</span>
                    </div>
                    <div className="font-bold text-[#E8A912] bg-[#E8A912]/10 px-2 py-1 rounded">
                      {standing?.points || 0} pts
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
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
