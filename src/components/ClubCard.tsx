import { Club, standings } from '@/data/mockData';
import { ClubLogo } from './ClubLogo';

interface ClubCardProps {
  club: Club;
  onClick: () => void;
  variant?: 'default' | 'compact' | 'grid';
}

export function ClubCard({ club, onClick, variant = 'default' }: ClubCardProps) {
  const standing = standings.find(s => s.clubId === club.id);
  const position = standings.findIndex(s => s.clubId === club.id) + 1;

  if (variant === 'grid') {
    return (
      <button
        onClick={onClick}
        className="card p-4 flex flex-col items-center gap-3 hover:shadow-lg transition-shadow group"
      >
        <ClubLogo club={club} size="lg" />
        <div className="text-center">
          <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#F5A623] transition-colors">
            {club.shortName}
          </h3>
          <p className="text-xs text-gray-500">{club.city}</p>
        </div>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 min-w-[72px] p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ClubLogo club={club} size="lg" />
        <span className="text-xs font-medium text-gray-700 text-center line-clamp-1">
          {club.shortName}
        </span>
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={onClick}
      className="w-full card overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div 
        className="h-20 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${club.primaryColor} 0%, ${club.secondaryColor} 100%)` }}
      >
        <ClubLogo club={club} size="xl" />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-0.5 rounded text-white text-xs font-bold">
          #{position}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 group-hover:text-[#F5A623] transition-colors">
          {club.name}
        </h3>
        <p className="text-sm text-gray-500">{club.city}</p>
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-500">{club.stadium}</span>
          <span className="font-bold text-[#F5A623]">{standing?.points || 0} pts</span>
        </div>
      </div>
    </button>
  );
}
