import { MobileHeader } from '@/components/Navigation';

interface FantasyScreenProps {
  onBack: () => void;
}

export function FantasyScreen({ onBack }: FantasyScreenProps) {
  const leaderboard = [
    { rank: 1, name: 'AzamatFC', points: '---' },
    { rank: 2, name: 'KyrgyzKing', points: '---' },
    { rank: 3, name: 'OshUnited', points: '---' },
    { rank: 4, name: 'BishkekBoys', points: '---' },
    { rank: 5, name: 'FootballFan_KG', points: '---' },
  ];

  const features = [
    { icon: '👥', title: 'Build Your Squad', desc: 'Select 15 players within your budget' },
    { icon: '📊', title: 'Live Scoring', desc: 'Points based on real match performance' },
    { icon: '🏆', title: 'Compete & Win', desc: 'Join leagues and climb the rankings' },
    { icon: '🔄', title: 'Transfers', desc: 'Make transfers each gameweek' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title="Fantasy" showBack onBack={onBack} />
      
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        {/* Hero */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden mb-5 shadow-sm">
          <div className="bg-gradient-to-br from-[#F5C742] via-[#E8A912] to-[#C98F00] p-8 md:p-10 text-center relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <span className="text-5xl mb-3 block">⚽</span>
            <h1 className="text-2xl md:text-3xl font-black text-[#0A1628] mb-2">
              KPFL Fantasy
            </h1>
            <p className="text-[#0A1628]/70 mb-5 max-w-md mx-auto text-sm">
              Build your dream team, compete against friends and fans, 
              and prove you're the ultimate football manager!
            </p>
            
            <div className="bg-black/15 backdrop-blur rounded-lg p-3 inline-block mb-5">
              <div className="flex items-center gap-2 justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-bold text-[#0A1628] text-sm">Coming Soon</span>
              </div>
              <p className="text-xs text-[#0A1628]/70 mt-1">
                Planned for release after the midterm milestone
              </p>
            </div>

            <button
              disabled
              className="bg-[#0A1628] text-white px-7 py-2.5 rounded-lg font-bold text-sm opacity-50 cursor-not-allowed"
            >
              Create Your Team
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Features */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <h2 className="font-bold text-[#0F1729] mb-4 text-sm">Planned Features</h2>
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-[#F4F6F8] rounded-lg opacity-60"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <div>
                    <p className="font-medium text-[#4B5563] text-sm">{feature.title}</p>
                    <p className="text-xs text-[#6B7280]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
            <div className="bg-[#0A1628] text-white px-4 py-3 flex items-center justify-between">
              <h2 className="font-bold text-sm">Leaderboard Preview</h2>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-medium">Demo</span>
            </div>
            <div className="divide-y divide-[#F4F6F8]">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.rank}
                  className="flex items-center gap-3 p-4 opacity-50"
                >
                  <span className="w-7 h-7 rounded-full bg-[#F4F6F8] flex items-center justify-center font-bold text-xs text-[#6B7280]">
                    {entry.rank}
                  </span>
                  <span className="flex-1 font-medium text-[#6B7280] text-sm">{entry.name}</span>
                  <span className="text-[#9CA3AF] text-sm">{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mt-5 text-center shadow-sm">
          <span className="text-3xl mb-3 block">🚀</span>
          <h3 className="font-bold text-[#0F1729] mb-1">Stay Tuned!</h3>
          <p className="text-[#6B7280] text-xs max-w-md mx-auto">
            KPFL Fantasy is currently in development. Follow our news section 
            for updates on the official launch date.
          </p>
        </div>
      </div>
    </div>
  );
}
