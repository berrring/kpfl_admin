import { useState } from 'react';
import { HomeScreen } from '@/screens/HomeScreen';
import { MatchesScreen } from '@/screens/MatchesScreen';
import { MatchDetailsScreen } from '@/screens/MatchDetailsScreen';
import { StandingsScreen } from '@/screens/StandingsScreen';
import { ClubsScreen } from '@/screens/ClubsScreen';
import { ClubProfileScreen } from '@/screens/ClubProfileScreen';
import { PlayerProfileScreen } from '@/screens/PlayerProfileScreen';
import { NewsScreen, NewsDetailScreen } from '@/screens/NewsScreen';
import { StatsScreen } from '@/screens/StatsScreen';
import { FantasyScreen } from '@/screens/FantasyScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { DesktopNav, TabBar, Footer } from '@/components/Navigation';
import { cn } from '@/utils/cn';

type Screen =
  | { type: 'home' }
  | { type: 'matches' }
  | { type: 'matchDetails'; matchId: string }
  | { type: 'standings' }
  | { type: 'clubs' }
  | { type: 'clubProfile'; clubId: string }
  | { type: 'playerProfile'; playerId: string }
  | { type: 'news' }
  | { type: 'newsDetail'; newsId: string }
  | { type: 'stats' }
  | { type: 'fantasy' }
  | { type: 'auth' };

type TabId = 'home' | 'matches' | 'standings' | 'clubs' | 'more';
type NavItem = 'home' | 'matches' | 'standings' | 'clubs' | 'news' | 'stats' | 'fantasy';

export function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'home' });
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeNav, setActiveNav] = useState<NavItem>('home');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);

  const navigate = (newScreen: Screen) => {
    setScreenHistory(prev => [...prev, screen]);
    setScreen(newScreen);
  };

  const goBack = () => {
    const prev = screenHistory[screenHistory.length - 1];
    if (prev) {
      setScreenHistory(h => h.slice(0, -1));
      setScreen(prev);
    } else {
      setScreen({ type: 'home' });
    }
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setScreenHistory([]);
    switch (tab) {
      case 'home':
        setScreen({ type: 'home' });
        setActiveNav('home');
        break;
      case 'matches':
        setScreen({ type: 'matches' });
        setActiveNav('matches');
        break;
      case 'standings':
        setScreen({ type: 'standings' });
        setActiveNav('standings');
        break;
      case 'clubs':
        setScreen({ type: 'clubs' });
        setActiveNav('clubs');
        break;
      case 'more':
        // Show more options - for now go to news
        setScreen({ type: 'news' });
        setActiveNav('news');
        break;
    }
  };

  const handleNavChange = (nav: NavItem) => {
    setActiveNav(nav);
    setScreenHistory([]);
    switch (nav) {
      case 'home':
        setScreen({ type: 'home' });
        setActiveTab('home');
        break;
      case 'matches':
        setScreen({ type: 'matches' });
        setActiveTab('matches');
        break;
      case 'standings':
        setScreen({ type: 'standings' });
        setActiveTab('standings');
        break;
      case 'clubs':
        setScreen({ type: 'clubs' });
        setActiveTab('clubs');
        break;
      case 'news':
        setScreen({ type: 'news' });
        setActiveTab('more');
        break;
      case 'stats':
        setScreen({ type: 'stats' });
        setActiveTab('more');
        break;
      case 'fantasy':
        setScreen({ type: 'fantasy' });
        setActiveTab('more');
        break;
    }
  };

  const handleSignIn = (name: string) => {
    setIsSignedIn(true);
    setUserName(name);
    goBack();
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserName('');
  };

  const renderScreen = () => {
    switch (screen.type) {
      case 'home':
        return (
          <HomeScreen
            onMatchSelect={(matchId) => navigate({ type: 'matchDetails', matchId })}
            onClubSelect={(clubId) => navigate({ type: 'clubProfile', clubId })}
            onNewsSelect={(newsId) => navigate({ type: 'newsDetail', newsId })}
            onViewMatches={() => handleNavChange('matches')}
            onViewStandings={() => handleNavChange('standings')}
            onViewClubs={() => handleNavChange('clubs')}
            onViewNews={() => handleNavChange('news')}
            onViewStats={() => handleNavChange('stats')}
          />
        );
      case 'matches':
        return (
          <MatchesScreen
            onMatchSelect={(matchId) => navigate({ type: 'matchDetails', matchId })}
          />
        );
      case 'matchDetails':
        return (
          <MatchDetailsScreen
            matchId={screen.matchId}
            onBack={goBack}
            onPlayerSelect={(playerId) => navigate({ type: 'playerProfile', playerId })}
            onClubSelect={(clubId) => navigate({ type: 'clubProfile', clubId })}
          />
        );
      case 'standings':
        return (
          <StandingsScreen
            onClubSelect={(clubId) => navigate({ type: 'clubProfile', clubId })}
          />
        );
      case 'clubs':
        return (
          <ClubsScreen
            onClubSelect={(clubId) => navigate({ type: 'clubProfile', clubId })}
          />
        );
      case 'clubProfile':
        return (
          <ClubProfileScreen
            clubId={screen.clubId}
            onBack={goBack}
            onPlayerSelect={(playerId) => navigate({ type: 'playerProfile', playerId })}
            onMatchSelect={(matchId) => navigate({ type: 'matchDetails', matchId })}
          />
        );
      case 'playerProfile':
        return (
          <PlayerProfileScreen
            playerId={screen.playerId}
            onBack={goBack}
            onClubSelect={(clubId) => navigate({ type: 'clubProfile', clubId })}
          />
        );
      case 'news':
        return (
          <NewsScreen
            onNewsSelect={(newsId) => navigate({ type: 'newsDetail', newsId })}
          />
        );
      case 'newsDetail':
        return (
          <NewsDetailScreen
            newsId={screen.newsId}
            onBack={goBack}
          />
        );
      case 'stats':
        return (
          <StatsScreen
            onPlayerSelect={(playerId) => navigate({ type: 'playerProfile', playerId })}
            onClubSelect={(clubId) => navigate({ type: 'clubProfile', clubId })}
          />
        );
      case 'fantasy':
        return <FantasyScreen onBack={goBack} />;
      case 'auth':
        return (
          <AuthScreen
            onBack={goBack}
            onSignIn={handleSignIn}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      'bg-[#f7f8fa]'
    )}>
      {/* Desktop Navigation */}
      <DesktopNav
        activeNav={activeNav}
        onNavChange={handleNavChange}
        onSignIn={() => navigate({ type: 'auth' })}
        isSignedIn={isSignedIn}
        userName={userName}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">
        {renderScreen()}
      </main>

      {/* Desktop Footer */}
      <Footer />

      {/* Mobile Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
