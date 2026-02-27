import { getPlayer, getClub, getPlayerStats } from '@/data/mockData';
import { MobileHeader } from '@/components/Navigation';
import { ClubLogo } from '@/components/ClubLogo';
import { cn } from '@/utils/cn';

interface PlayerProfileScreenProps {
  playerId: string;
  onBack: () => void;
  onClubSelect: (clubId: string) => void;
}

const positionColors = {
  GK: 'bg-yellow-500',
  DF: 'bg-blue-500',
  MF: 'bg-green-500',
  FW: 'bg-red-500',
};

const positionLabels = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
};

export function PlayerProfileScreen({ playerId, onBack, onClubSelect }: PlayerProfileScreenProps) {
  const player = getPlayer(playerId);
  const club = player ? getClub(player.clubId) : null;
  const stats = player ? getPlayerStats(playerId) : null;

  if (!player || !club) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <p className="text-[#6B7280]">Player not found</p>
      </div>
    );
  }

  const birthDate = new Date(player.birthDate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="Player" showBack onBack={onBack} />
      
      {/* Hero Header */}
      <div 
        className="relative h-56 md:h-72"
        style={{ background: `linear-gradient(135deg, ${club.primaryColor} 0%, ${adjustColor(club.primaryColor, -30)} 100%)` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {!player.isCoach ? (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/40 backdrop-blur flex items-center justify-center mx-auto border-4 border-white/20">
                <span className="text-white font-black text-4xl md:text-5xl">{player.number}</span>
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/40 backdrop-blur flex items-center justify-center mx-auto border-4 border-white/20">
                <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <h1 className="text-white text-xl md:text-3xl font-black mt-3">
              {player.firstName} {player.lastName}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              {!player.isCoach && (
                <span className={cn(
                  'px-3 py-1 rounded text-white text-xs font-bold',
                  positionColors[player.position]
                )}>
                  {positionLabels[player.position]}
                </span>
              )}
              {player.isCoach && (
                <span className="px-3 py-1 rounded bg-white/20 text-white text-xs font-bold">
                  Head Coach
                </span>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={() => onClubSelect(club.id)}
          className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-1.5 rounded-lg text-white hover:bg-black/40 transition-colors"
        >
          <ClubLogo club={club} size="sm" />
          <span className="text-xs font-medium">{club.shortName}</span>
        </button>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 py-5">
        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-5 shadow-sm">
          <h2 className="font-bold text-[#0F1729] mb-4 text-sm">Personal Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#F4F6F8] rounded-lg">
              <p className="text-[10px] text-[#6B7280] mb-0.5">Full Name</p>
              <p className="font-medium text-sm">{player.firstName} {player.lastName}</p>
            </div>
            {!player.isCoach && (
              <div className="p-3 bg-[#F4F6F8] rounded-lg">
                <p className="text-[10px] text-[#6B7280] mb-0.5">Shirt Number</p>
                <p className="font-medium text-sm">#{player.number}</p>
              </div>
            )}
            {!player.isCoach && (
              <div className="p-3 bg-[#F4F6F8] rounded-lg">
                <p className="text-[10px] text-[#6B7280] mb-0.5">Position</p>
                <p className="font-medium text-sm">{positionLabels[player.position]}</p>
              </div>
            )}
            <div className="p-3 bg-[#F4F6F8] rounded-lg">
              <p className="text-[10px] text-[#6B7280] mb-0.5">Nationality</p>
              <p className="font-medium text-sm flex items-center gap-1.5">
                {player.nationality === 'Kyrgyzstan' && '🇰🇬'}
                {player.nationality === 'Kazakhstan' && '🇰🇿'}
                {player.nationality === 'Uzbekistan' && '🇺🇿'}
                {player.nationality}
              </p>
            </div>
            <div className="p-3 bg-[#F4F6F8] rounded-lg">
              <p className="text-[10px] text-[#6B7280] mb-0.5">Date of Birth</p>
              <p className="font-medium text-sm">
                {birthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="p-3 bg-[#F4F6F8] rounded-lg">
              <p className="text-[10px] text-[#6B7280] mb-0.5">Age</p>
              <p className="font-medium text-sm">{age} years</p>
            </div>
            {!player.isCoach && (
              <>
                <div className="p-3 bg-[#F4F6F8] rounded-lg">
                  <p className="text-[10px] text-[#6B7280] mb-0.5">Height</p>
                  <p className="font-medium text-sm">{player.height} cm</p>
                </div>
                <div className="p-3 bg-[#F4F6F8] rounded-lg">
                  <p className="text-[10px] text-[#6B7280] mb-0.5">Weight</p>
                  <p className="font-medium text-sm">{player.weight} kg</p>
                </div>
              </>
            )}
            <div className="p-3 bg-[#F4F6F8] rounded-lg col-span-2 md:col-span-1">
              <p className="text-[10px] text-[#6B7280] mb-0.5">Club</p>
              <button 
                onClick={() => onClubSelect(club.id)}
                className="font-medium text-sm flex items-center gap-1.5 hover:text-[#E8A912] transition-colors"
              >
                <ClubLogo club={club} size="xs" />
                {club.name}
              </button>
            </div>
          </div>
        </div>

        {/* Season Stats */}
        {!player.isCoach && stats && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0F1729] text-sm">Season 2026 Statistics</h2>
              <span className="text-[10px] text-[#9CA3AF] bg-[#F4F6F8] px-2 py-1 rounded">
                From match events
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-2xl mb-1 block">⚽</span>
                <p className="text-2xl font-bold text-emerald-700">{stats.goals}</p>
                <p className="text-xs text-[#4B5563] mt-0.5">Goals</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-2xl mb-1 block">👟</span>
                <p className="text-2xl font-bold text-blue-700">{stats.assists}</p>
                <p className="text-xs text-[#4B5563] mt-0.5">Assists</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <span className="text-2xl mb-1 block">🟨</span>
                <p className="text-2xl font-bold text-yellow-700">{stats.yellowCards}</p>
                <p className="text-xs text-[#4B5563] mt-0.5">Yellows</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                <span className="text-2xl mb-1 block">🟥</span>
                <p className="text-2xl font-bold text-red-700">{stats.redCards}</p>
                <p className="text-xs text-[#4B5563] mt-0.5">Reds</p>
              </div>
            </div>
          </div>
        )}

        {player.isCoach && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center shadow-sm">
            <span className="text-4xl mb-3 block">👔</span>
            <p className="text-[#0F1729] font-semibold">Coaching Staff</p>
            <p className="text-xs text-[#6B7280] mt-1">
              Detailed coaching statistics coming soon
            </p>
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
