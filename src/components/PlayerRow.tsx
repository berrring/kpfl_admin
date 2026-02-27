import { Player } from '@/data/mockData';
import { cn } from '@/utils/cn';

interface PlayerRowProps {
  player: Player;
  onClick: () => void;
}

const positionColors = {
  GK: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DF: 'bg-blue-100 text-blue-800 border-blue-200',
  MF: 'bg-green-100 text-green-800 border-green-200',
  FW: 'bg-red-100 text-red-800 border-red-200',
};

export function PlayerRow({ player, onClick }: PlayerRowProps) {
  if (player.isCoach) {
    return (
      <button
        onClick={onClick}
        className="w-full card p-3 flex items-center gap-3 transition-all hover:shadow-md active:scale-[0.99]"
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
          <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-gray-900">{player.firstName} {player.lastName}</p>
          <p className="text-xs text-gray-500">Head Coach</p>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full card p-3 flex items-center gap-3 transition-all hover:shadow-md active:scale-[0.99]"
    >
      <div className="w-12 h-12 rounded-full bg-[#111827] flex items-center justify-center">
        <span className="text-white font-bold">{player.number}</span>
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-gray-900">{player.firstName} {player.lastName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            'inline-block px-2 py-0.5 rounded text-[10px] font-semibold border',
            positionColors[player.position]
          )}>
            {player.position}
          </span>
          <span className="text-xs text-gray-400">
            {player.nationality === 'Kyrgyzstan' && '🇰🇬'}
            {player.nationality === 'Kazakhstan' && '🇰🇿'}
            {player.nationality === 'Uzbekistan' && '🇺🇿'}
          </span>
        </div>
      </div>
      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export const positionLabels = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
};
