import { Club } from '@/data/mockData';
import { cn } from '@/utils/cn';

interface ClubLogoProps {
  club: Club;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showRing?: boolean;
}

const sizeClasses = {
  xs: 'w-5 h-5 text-[7px]',
  sm: 'w-8 h-8 text-[9px]',
  md: 'w-10 h-10 text-[11px]',
  lg: 'w-12 h-12 text-xs',
  xl: 'w-16 h-16 text-sm',
  '2xl': 'w-20 h-20 text-base',
};

const borderSizes = {
  xs: 'border',
  sm: 'border-[1.5px]',
  md: 'border-2',
  lg: 'border-2',
  xl: 'border-[3px]',
  '2xl': 'border-[3px]',
};

export function ClubLogo({ club, size = 'md', className, showRing = false }: ClubLogoProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold text-white flex-shrink-0 relative',
        'shadow-md border-white',
        sizeClasses[size],
        borderSizes[size],
        showRing && 'ring-2 ring-white shadow-lg',
        className
      )}
      style={{ 
        background: `linear-gradient(145deg, ${club.primaryColor} 0%, ${adjustColor(club.primaryColor, -25)} 100%)`
      }}
    >
      <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] tracking-tight">{club.shortName}</span>
      {/* Inner highlight */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
    </div>
  );
}

// Helper to darken colors
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

// Shield variant for special displays
export function ClubLogoShield({ club, size = 'md', className }: ClubLogoProps) {
  const shieldSizes = {
    xs: { width: 20, height: 24, fontSize: 6 },
    sm: { width: 28, height: 34, fontSize: 8 },
    md: { width: 36, height: 44, fontSize: 10 },
    lg: { width: 48, height: 58, fontSize: 12 },
    xl: { width: 64, height: 76, fontSize: 14 },
    '2xl': { width: 80, height: 96, fontSize: 16 },
  };

  const s = shieldSizes[size];
  const gradientId = `shield-grad-${club.id}`;

  return (
    <div
      className={cn('flex items-center justify-center relative flex-shrink-0', className)}
      style={{ width: s.width, height: s.height }}
    >
      <svg viewBox="0 0 40 48" className="absolute inset-0 w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={club.primaryColor} />
            <stop offset="100%" stopColor={adjustColor(club.primaryColor, -30)} />
          </linearGradient>
        </defs>
        <path
          d="M20 0 L40 8 L40 28 Q40 44 20 48 Q0 44 0 28 L0 8 Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M20 2 L38 9 L38 28 Q38 42 20 46 Q2 42 2 28 L2 9 Z"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        <path
          d="M20 2 L38 9 L38 18 Q28 14 8 18 L2 9 Z"
          fill="rgba(255,255,255,0.1)"
        />
      </svg>
      <span 
        className="relative z-10 font-bold text-white drop-shadow-sm"
        style={{ fontSize: s.fontSize }}
      >
        {club.shortName}
      </span>
    </div>
  );
}
