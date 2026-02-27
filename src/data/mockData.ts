// KPFL Mock Data - Kyrgyz Professional Football League
// MLS-style data structure

export interface Club {
  id: string;
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  founded: number;
  primaryColor: string;
  secondaryColor: string;
  capacity: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface Player {
  id: string;
  clubId: string;
  number: number;
  firstName: string;
  lastName: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  nationality: string;
  birthDate: string;
  height: number;
  weight: number;
  isCoach?: boolean;
  image?: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  minute: number;
  type: 'GOAL' | 'YELLOW' | 'RED' | 'ASSIST' | 'SUB_IN' | 'SUB_OUT';
  playerId: string;
  clubId: string;
  assistPlayerId?: string;
}

export interface Match {
  id: string;
  homeClubId: string;
  awayClubId: string;
  date: string;
  time: string;
  stadium: string;
  round: number;
  status: 'Scheduled' | 'Live' | 'Final' | 'Postponed';
  homeScore?: number;
  awayScore?: number;
  attendance?: number;
  minute?: number;
  tvChannel?: string;
}

export interface StandingEntry {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  homeRecord: { w: number; d: number; l: number };
  awayRecord: { w: number; d: number; l: number };
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string[];
  date: string;
  tag: 'Transfer' | 'Matchday' | 'Club' | 'League' | 'Injury' | 'Interview';
  clubId?: string;
  imageUrl?: string;
  featured?: boolean;
  author?: string;
}

export interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  category: 'Highlights' | 'Interview' | 'Preview' | 'Analysis';
  date: string;
  views: number;
}

export interface PlayerStats {
  playerId: string;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  cleanSheets?: number;
  saves?: number;
}

// Seeded random for consistent data
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

const random = seededRandom(42);

// 14 Kyrgyz Football Clubs with enhanced data
export const clubs: Club[] = [
  { id: 'dordoi', name: 'Dordoi Bishkek', shortName: 'DOR', city: 'Bishkek', stadium: 'Dolen Omurzakov Stadium', founded: 1997, primaryColor: '#1E3A8A', secondaryColor: '#3B82F6', capacity: 25000, wins: 18, draws: 5, losses: 3 },
  { id: 'abdysh-ata', name: 'Abdysh-Ata Kant', shortName: 'ABD', city: 'Kant', stadium: 'Abdysh-Ata Stadium', founded: 2004, primaryColor: '#DC2626', secondaryColor: '#F87171', capacity: 8000, wins: 14, draws: 7, losses: 5 },
  { id: 'alay', name: 'Alay Osh', shortName: 'ALA', city: 'Osh', stadium: 'Alay Stadium', founded: 2005, primaryColor: '#059669', secondaryColor: '#34D399', capacity: 12000, wins: 15, draws: 6, losses: 5 },
  { id: 'ilbirs', name: 'Ilbirs Bishkek', shortName: 'ILB', city: 'Bishkek', stadium: 'Spartak Stadium', founded: 2011, primaryColor: '#7C3AED', secondaryColor: '#A78BFA', capacity: 15000, wins: 12, draws: 8, losses: 6 },
  { id: 'neftchi', name: 'Neftchi Kochkor-Ata', shortName: 'NEF', city: 'Kochkor-Ata', stadium: 'Neftchi Stadium', founded: 1958, primaryColor: '#0891B2', secondaryColor: '#22D3EE', capacity: 6000, wins: 10, draws: 9, losses: 7 },
  { id: 'ala-too', name: 'Ala-Too Naryn', shortName: 'ALT', city: 'Naryn', stadium: 'Naryn Central Stadium', founded: 2009, primaryColor: '#EA580C', secondaryColor: '#FB923C', capacity: 5000, wins: 8, draws: 10, losses: 8 },
  { id: 'kaganat', name: 'Kaganat Tash-Kumyr', shortName: 'KAG', city: 'Tash-Kumyr', stadium: 'Kaganat Arena', founded: 2012, primaryColor: '#BE185D', secondaryColor: '#F472B6', capacity: 4500, wins: 9, draws: 7, losses: 10 },
  { id: 'kara-balta', name: 'Kara-Balta', shortName: 'KRB', city: 'Kara-Balta', stadium: 'Kara-Balta Stadium', founded: 2008, primaryColor: '#4338CA', secondaryColor: '#818CF8', capacity: 5500, wins: 7, draws: 11, losses: 8 },
  { id: 'muras', name: 'Muras United', shortName: 'MUR', city: 'Kant', stadium: 'Muras Arena', founded: 2015, primaryColor: '#0D9488', secondaryColor: '#2DD4BF', capacity: 6000, wins: 11, draws: 6, losses: 9 },
  { id: 'ak-altyn', name: 'Ak-Altyn Kemin', shortName: 'AKA', city: 'Kemin', stadium: 'Kemin Stadium', founded: 2010, primaryColor: '#CA8A04', secondaryColor: '#FACC15', capacity: 4000, wins: 6, draws: 8, losses: 12 },
  { id: 'dostuk', name: 'Dostuk Bishkek', shortName: 'DOS', city: 'Bishkek', stadium: 'Dostuk Stadium', founded: 2000, primaryColor: '#E11D48', secondaryColor: '#FB7185', capacity: 8500, wins: 13, draws: 5, losses: 8 },
  { id: 'osh-city', name: 'Osh City FC', shortName: 'OSH', city: 'Osh', stadium: 'Osh Central Stadium', founded: 2018, primaryColor: '#2563EB', secondaryColor: '#60A5FA', capacity: 15000, wins: 16, draws: 4, losses: 6 },
  { id: 'talas', name: 'Talas FC', shortName: 'TAL', city: 'Talas', stadium: 'Talas Municipal Stadium', founded: 2006, primaryColor: '#16A34A', secondaryColor: '#4ADE80', capacity: 4000, wins: 5, draws: 9, losses: 12 },
  { id: 'issyk-kul', name: 'Issyk-Kul Karakol', shortName: 'ISK', city: 'Karakol', stadium: 'Issyk-Kul Arena', founded: 2013, primaryColor: '#0EA5E9', secondaryColor: '#38BDF8', capacity: 7000, wins: 8, draws: 7, losses: 11 },
];

// Player names
const firstNames = ['Azamat', 'Bakyt', 'Bekzat', 'Chyngyz', 'Daniyar', 'Eldar', 'Erlan', 'Islambek', 'Kairat', 'Kubanychbek', 'Maksat', 'Mirlan', 'Nurlanbek', 'Omurbek', 'Ruslan', 'Samat', 'Talgat', 'Uluk', 'Viktor', 'Zhyrgalbek', 'Aidar', 'Baiaman', 'Dastan', 'Ermek', 'Farkhad', 'Gulzhigit', 'Ilyas', 'Jasur', 'Kamchybek', 'Marat', 'Nurbol', 'Orozbek', 'Pavel', 'Rasul', 'Syimyk', 'Talant', 'Ulan', 'Yrysbek', 'Zafar', 'Aibek', 'Timur', 'Artur', 'Denis', 'Sergei', 'Aleksandr'];
const lastNames = ['Alykulov', 'Bakashev', 'Cholponbaev', 'Duishenov', 'Ergeshov', 'Ismailov', 'Jumagulov', 'Kadyrbekov', 'Lomunov', 'Mamatov', 'Niyazov', 'Orozaliev', 'Ryskulov', 'Sagynbaev', 'Tashmatov', 'Usenov', 'Zhunusov', 'Abdraev', 'Beishenaliev', 'Chokobaev', 'Dzholdoshev', 'Esenov', 'Ibraev', 'Kalmurzaev', 'Mamytov', 'Nurmatov', 'Osmonov', 'Rakhimov', 'Sultanov', 'Toktomushev', 'Urmanbetov', 'Yusupov', 'Zakirov', 'Atabekov', 'Bazarbekov', 'Chokmorov', 'Dosanov', 'Erkinbekov', 'Karimov', 'Moldobekov', 'Petrov', 'Ivanov', 'Sidorov'];

const positions: Array<'GK' | 'DF' | 'MF' | 'FW'> = ['GK', 'DF', 'MF', 'FW'];
const positionDistribution = [2, 6, 7, 5];

function generatePlayers(clubId: string): Player[] {
  const players: Player[] = [];
  let playerIndex = 0;
  const usedNumbers = new Set<number>();
  
  positions.forEach((position, posIdx) => {
    for (let i = 0; i < positionDistribution[posIdx]; i++) {
      let number: number;
      if (position === 'GK') {
        number = i === 0 ? 1 : 25;
      } else {
        do {
          number = Math.floor(random() * 30) + 2;
        } while (usedNumbers.has(number));
      }
      usedNumbers.add(number);
      
      const birthYear = 1988 + Math.floor(random() * 15);
      const birthMonth = String(Math.floor(random() * 12) + 1).padStart(2, '0');
      const birthDay = String(Math.floor(random() * 28) + 1).padStart(2, '0');
      
      players.push({
        id: `${clubId}-player-${playerIndex}`,
        clubId,
        number,
        firstName: firstNames[Math.floor(random() * firstNames.length)],
        lastName: lastNames[Math.floor(random() * lastNames.length)],
        position,
        nationality: random() > 0.12 ? 'Kyrgyzstan' : (random() > 0.5 ? 'Kazakhstan' : 'Uzbekistan'),
        birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
        height: 170 + Math.floor(random() * 25),
        weight: 65 + Math.floor(random() * 20),
      });
      playerIndex++;
    }
  });
  
  // Add coach
  players.push({
    id: `${clubId}-coach`,
    clubId,
    number: 0,
    firstName: firstNames[Math.floor(random() * firstNames.length)],
    lastName: lastNames[Math.floor(random() * lastNames.length)],
    position: 'MF',
    nationality: 'Kyrgyzstan',
    birthDate: `${1965 + Math.floor(random() * 15)}-01-15`,
    height: 180,
    weight: 80,
    isCoach: true,
  });
  
  return players.sort((a, b) => {
    if (a.isCoach) return 1;
    if (b.isCoach) return -1;
    const posOrder = { 'GK': 0, 'DF': 1, 'MF': 2, 'FW': 3 };
    if (posOrder[a.position] !== posOrder[b.position]) {
      return posOrder[a.position] - posOrder[b.position];
    }
    return a.number - b.number;
  });
}

export const players: Player[] = clubs.flatMap(club => generatePlayers(club.id));

// Generate matches
export const matches: Match[] = [];
const matchPairs = [
  [0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13],
  [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [0, 13],
  [0, 2], [1, 3], [4, 6], [5, 7], [8, 10], [9, 11], [12, 0],
  [3, 5], [2, 4], [7, 9], [6, 8], [11, 13], [10, 12], [1, 0],
  [4, 0], [5, 1], [6, 2], [7, 3], [8, 4], [9, 5], [10, 6],
  [0, 5], [1, 6], [2, 7], [3, 8], [4, 9], [5, 10], [6, 11],
  [7, 0], [8, 1], [9, 2], [10, 3], [11, 4], [12, 5], [13, 6],
  [0, 8], [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 0],
  [9, 0], [10, 1], [11, 2], [12, 3], [13, 4], [0, 6], [1, 7],
  [0, 10], [1, 11], [2, 12], [3, 13], [4, 0], [5, 2], [6, 3],
];

let matchIndex = 0;
for (let round = 1; round <= 10; round++) {
  const roundMatches = matchPairs.slice((round - 1) * 7, round * 7);
  const baseDate = new Date(2026, 2, 1 + (round - 1) * 7);
  
  roundMatches.forEach((pair, idx) => {
    const matchDate = new Date(baseDate);
    matchDate.setDate(matchDate.getDate() + (idx % 2));
    
    const isCompleted = round <= 6;
    const isLive = round === 7 && idx === 0;
    const homeScore = isCompleted ? Math.floor(random() * 4) : (isLive ? Math.floor(random() * 3) : undefined);
    const awayScore = isCompleted ? Math.floor(random() * 3) : (isLive ? Math.floor(random() * 2) : undefined);
    
    matches.push({
      id: `match-${matchIndex}`,
      homeClubId: clubs[pair[0]].id,
      awayClubId: clubs[pair[1]].id,
      date: matchDate.toISOString().split('T')[0],
      time: ['14:00', '16:30', '19:00', '20:00'][idx % 4],
      stadium: clubs[pair[0]].stadium,
      round,
      status: isLive ? 'Live' : (isCompleted ? 'Final' : 'Scheduled'),
      homeScore,
      awayScore,
      attendance: isCompleted ? Math.floor(3000 + random() * 10000) : undefined,
      minute: isLive ? Math.floor(random() * 90) : undefined,
      tvChannel: random() > 0.5 ? 'KTRK Sport' : 'KPFL+',
    });
    matchIndex++;
  });
}

// Generate match events
export const matchEvents: MatchEvent[] = [];
let eventIndex = 0;

matches.filter(m => m.status === 'Final' || m.status === 'Live').forEach(match => {
  const homeClub = clubs.find(c => c.id === match.homeClubId)!;
  const awayClub = clubs.find(c => c.id === match.awayClubId)!;
  const homePlayers = players.filter(p => p.clubId === homeClub.id && !p.isCoach);
  const awayPlayers = players.filter(p => p.clubId === awayClub.id && !p.isCoach);
  
  for (let i = 0; i < (match.homeScore || 0); i++) {
    const scorer = homePlayers[Math.floor(random() * homePlayers.length)];
    const assister = homePlayers[Math.floor(random() * homePlayers.length)];
    matchEvents.push({
      id: `event-${eventIndex++}`,
      matchId: match.id,
      minute: Math.floor(random() * 90) + 1,
      type: 'GOAL',
      playerId: scorer.id,
      clubId: homeClub.id,
      assistPlayerId: random() > 0.3 ? assister.id : undefined,
    });
  }
  
  for (let i = 0; i < (match.awayScore || 0); i++) {
    const scorer = awayPlayers[Math.floor(random() * awayPlayers.length)];
    const assister = awayPlayers[Math.floor(random() * awayPlayers.length)];
    matchEvents.push({
      id: `event-${eventIndex++}`,
      matchId: match.id,
      minute: Math.floor(random() * 90) + 1,
      type: 'GOAL',
      playerId: scorer.id,
      clubId: awayClub.id,
      assistPlayerId: random() > 0.3 ? assister.id : undefined,
    });
  }
  
  const cardCount = Math.floor(random() * 5);
  for (let i = 0; i < cardCount; i++) {
    const isHome = random() > 0.5;
    const clubPlayers = isHome ? homePlayers : awayPlayers;
    const player = clubPlayers[Math.floor(random() * clubPlayers.length)];
    matchEvents.push({
      id: `event-${eventIndex++}`,
      matchId: match.id,
      minute: Math.floor(random() * 90) + 1,
      type: random() > 0.12 ? 'YELLOW' : 'RED',
      playerId: player.id,
      clubId: isHome ? homeClub.id : awayClub.id,
    });
  }
});

matchEvents.sort((a, b) => a.minute - b.minute);

// Calculate standings
export const standings: StandingEntry[] = clubs.map(club => {
  const clubMatches = matches.filter(
    m => (m.homeClubId === club.id || m.awayClubId === club.id) && m.status === 'Final'
  );
  
  let won = 0, drawn = 0, lost = 0, goalsFor = 0, goalsAgainst = 0;
  const form: ('W' | 'D' | 'L')[] = [];
  const homeRecord = { w: 0, d: 0, l: 0 };
  const awayRecord = { w: 0, d: 0, l: 0 };
  
  clubMatches.forEach(match => {
    const isHome = match.homeClubId === club.id;
    const scored = isHome ? match.homeScore! : match.awayScore!;
    const conceded = isHome ? match.awayScore! : match.homeScore!;
    
    goalsFor += scored;
    goalsAgainst += conceded;
    
    if (scored > conceded) {
      won++;
      form.push('W');
      if (isHome) homeRecord.w++; else awayRecord.w++;
    } else if (scored === conceded) {
      drawn++;
      form.push('D');
      if (isHome) homeRecord.d++; else awayRecord.d++;
    } else {
      lost++;
      form.push('L');
      if (isHome) homeRecord.l++; else awayRecord.l++;
    }
  });
  
  return {
    clubId: club.id,
    played: clubMatches.length,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    points: won * 3 + drawn,
    form: form.slice(-5),
    homeRecord,
    awayRecord,
  };
}).sort((a, b) => {
  if (b.points !== a.points) return b.points - a.points;
  const gdA = a.goalsFor - a.goalsAgainst;
  const gdB = b.goalsFor - b.goalsAgainst;
  if (gdB !== gdA) return gdB - gdA;
  return b.goalsFor - a.goalsFor;
});

// Calculate top scorers
export const topScorers = players
  .filter(p => !p.isCoach)
  .map(player => {
    const goals = matchEvents.filter(e => e.type === 'GOAL' && e.playerId === player.id).length;
    const assists = matchEvents.filter(e => e.assistPlayerId === player.id).length;
    return { player, goals, assists };
  })
  .filter(p => p.goals > 0)
  .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
  .slice(0, 10);

// News
export const news: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Dordoi Bishkek Extends Winning Streak with Clinical Performance',
    summary: 'The reigning champions showcased their title credentials with a dominant display at home, maintaining their push for back-to-back championships.',
    content: [
      'FC Dordoi Bishkek produced a masterclass in attacking football, securing a convincing 3-1 victory over FC Ala-Too Naryn at the Dolen Omurzakov Stadium in front of a passionate home crowd.',
      'The match was effectively decided in a blistering first-half display that saw Dordoi take a commanding lead. Azamat Bakashev opened the scoring in the 23rd minute with a perfectly placed header from a corner kick.',
      'Manager expressed satisfaction with the tactical discipline shown throughout the ninety minutes, noting the team\'s improved cohesion since the season\'s start.'
    ],
    date: '2026-03-20',
    tag: 'Matchday',
    clubId: 'dordoi',
    featured: true,
    author: 'Mirlan Kadyrbekov'
  },
  {
    id: 'news-2',
    title: 'BREAKING: Alay Osh Completes Signing of National Team Star',
    summary: 'The southern powerhouse secures the services of highly-rated midfielder in a record-breaking transfer deal.',
    content: [
      'FC Alay Osh has completed the signing of national team midfielder Bekzat Orozaliev from their youth academy in what sources describe as a landmark deal for Kyrgyz football.',
      'The 22-year-old has been one of the standout performers in the national team setup and brings significant experience despite his young age.',
      'This signing represents the club\'s ambitious plans for continental competition in the coming seasons.'
    ],
    date: '2026-03-19',
    tag: 'Transfer',
    clubId: 'alay',
    featured: true,
    author: 'Sports Desk'
  },
  {
    id: 'news-3',
    title: 'KPFL Announces Historic Broadcasting Partnership',
    summary: 'All league matches will now reach fans across Central Asia through new multi-platform deal.',
    content: [
      'The Kyrgyz Professional Football League has announced a groundbreaking broadcasting agreement that will transform how fans consume domestic football.',
      'Starting from Round 7, every single KPFL match will be available on national television, with additional coverage on streaming platforms.',
      'This landmark partnership represents a major step forward for the visibility of Kyrgyz football across the region.'
    ],
    date: '2026-03-18',
    tag: 'League',
    author: 'KPFL Media'
  },
  {
    id: 'news-4',
    title: 'Exclusive: Abdysh-Ata Kant Reveals Ambitious Stadium Plans',
    summary: 'Club president unveils vision for a modern 15,000-seat arena with state-of-the-art facilities.',
    content: [
      'FC Abdysh-Ata Kant has presented comprehensive plans for a complete stadium transformation that will position the club among the best-equipped in Central Asia.',
      'The renovation project includes new all-seater stands, covered terracing, and a modern hospitality complex.',
      'Construction is scheduled to commence immediately after the current season concludes, with completion targeted for 2028.'
    ],
    date: '2026-03-17',
    tag: 'Club',
    clubId: 'abdysh-ata',
    author: 'Stadium Weekly'
  },
  {
    id: 'news-5',
    title: 'Player of the Month: Ilbirs Goalkeeper Makes History',
    summary: 'Eldar Jumagulov becomes the first goalkeeper to win the award twice in a single season.',
    content: [
      'FC Ilbirs Bishkek goalkeeper Eldar Jumagulov has been named KPFL Player of the Month for February, adding to his October award.',
      'The 26-year-old kept four clean sheets in five appearances while making a league-high 28 saves during the month.',
      'His outstanding form has been crucial to Ilbirs\' unexpected push for continental qualification.'
    ],
    date: '2026-03-16',
    tag: 'League',
    clubId: 'ilbirs',
    author: 'Awards Committee'
  },
  {
    id: 'news-6',
    title: 'Derby Day Drama: Osh City vs Alay Ends in Thriller',
    summary: 'Late equalizer ensures honors remain even in the most anticipated fixture of the southern region.',
    content: [
      'The Osh derby delivered on its promise of entertainment as FC Osh City and FC Alay played out a pulsating 2-2 draw.',
      'Osh City appeared to have secured all three points until Alay\'s substitute struck in the 89th minute.',
      'A crowd of 14,500 packed into the Osh Central Stadium, creating an atmosphere befitting the fixture\'s significance.'
    ],
    date: '2026-03-15',
    tag: 'Matchday',
    author: 'Match Reporter'
  },
  {
    id: 'news-7',
    title: 'Injury Update: Key Players Return to Training',
    summary: 'Several high-profile names are back in contention as the business end of the season approaches.',
    content: [
      'Multiple KPFL clubs have received positive news on the injury front with key players returning to full training this week.',
      'Dordoi\'s captain is expected to be available for selection after recovering from a hamstring strain.',
      'The timing of these returns could prove pivotal in the title race and relegation battles.'
    ],
    date: '2026-03-14',
    tag: 'Injury',
    author: 'Medical Correspondent'
  },
  {
    id: 'news-8',
    title: 'Interview: Kaganat\'s New Coach Outlines Vision',
    summary: 'Former national team assistant discusses his plans to revive the western club\'s fortunes.',
    content: [
      'In an exclusive interview with KPFL Media, newly appointed Kaganat head coach Bakyt Cholponbaev has outlined his vision for the club.',
      'The experienced tactician emphasized the importance of youth development and attractive attacking football.',
      'He has been given a three-year mandate to establish Kaganat as a consistent top-half team.'
    ],
    date: '2026-03-13',
    tag: 'Interview',
    clubId: 'kaganat',
    author: 'Exclusive Interview'
  },
  {
    id: 'news-9',
    title: 'Issyk-Kul Arena Selected for International Fixture',
    summary: 'Karakol venue to host Kyrgyzstan\'s upcoming World Cup qualifier.',
    content: [
      'The Issyk-Kul Arena has been chosen as the venue for Kyrgyzstan\'s crucial World Cup qualifying match against Tajikistan.',
      'This will be the first senior international match played at the venue since its renovation was completed.',
      'FC Issyk-Kul Karakol has expressed immense pride in their stadium receiving this prestigious honor.'
    ],
    date: '2026-03-12',
    tag: 'League',
    clubId: 'issyk-kul',
    author: 'National Team'
  },
  {
    id: 'news-10',
    title: 'Youth Development: Dostuk Academy Produces Trio of Stars',
    summary: 'Three talented teenagers sign professional contracts with the capital club.',
    content: [
      'FC Dostuk Bishkek has promoted three exceptional youngsters from their academy system to professional terms.',
      'The trio, all aged between 17 and 18, have shown remarkable potential in youth competitions.',
      'This continues Dostuk\'s proud tradition of nurturing homegrown talent.'
    ],
    date: '2026-03-11',
    tag: 'Transfer',
    clubId: 'dostuk',
    author: 'Youth Football'
  },
];

// Videos
export const videos: Video[] = [
  { id: 'v1', title: 'Match Highlights: Dordoi 3-1 Ala-Too', duration: '8:45', thumbnail: '#1E3A8A', category: 'Highlights', date: '2026-03-20', views: 45200 },
  { id: 'v2', title: 'All Goals: KPFL Round 6', duration: '12:30', thumbnail: '#F5A623', category: 'Highlights', date: '2026-03-19', views: 38100 },
  { id: 'v3', title: 'Pre-Match: Osh City vs Abdysh-Ata Preview', duration: '5:20', thumbnail: '#2563EB', category: 'Preview', date: '2026-03-18', views: 12400 },
  { id: 'v4', title: 'Tactical Analysis: Alay\'s Pressing System', duration: '15:00', thumbnail: '#059669', category: 'Analysis', date: '2026-03-17', views: 8900 },
  { id: 'v5', title: 'Post-Match Interview: Player of the Month', duration: '6:15', thumbnail: '#7C3AED', category: 'Interview', date: '2026-03-16', views: 21300 },
];

// Helper functions
export function getClub(id: string): Club | undefined {
  return clubs.find(c => c.id === id);
}

export function getPlayer(id: string): Player | undefined {
  return players.find(p => p.id === id);
}

export function getClubPlayers(clubId: string): Player[] {
  return players.filter(p => p.clubId === clubId);
}

export function getMatchEvents(matchId: string): MatchEvent[] {
  return matchEvents.filter(e => e.matchId === matchId).sort((a, b) => a.minute - b.minute);
}

export function getPlayerStats(playerId: string): { goals: number; assists: number; yellowCards: number; redCards: number } {
  const playerEvents = matchEvents.filter(e => e.playerId === playerId);
  const assistEvents = matchEvents.filter(e => e.assistPlayerId === playerId);
  return {
    goals: playerEvents.filter(e => e.type === 'GOAL').length,
    assists: assistEvents.length,
    yellowCards: playerEvents.filter(e => e.type === 'YELLOW').length,
    redCards: playerEvents.filter(e => e.type === 'RED').length,
  };
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getUpcomingMatches(count: number = 6): Match[] {
  return matches.filter(m => m.status === 'Scheduled').slice(0, count);
}

export function getLiveMatches(): Match[] {
  return matches.filter(m => m.status === 'Live');
}

export function getLatestResults(count: number = 5): Match[] {
  return matches.filter(m => m.status === 'Final').slice(-count).reverse();
}

export function getTopStandings(count: number = 5): StandingEntry[] {
  return standings.slice(0, count);
}

export function getLatestNews(count: number = 3): NewsItem[] {
  return news.slice(0, count);
}

export function getFeaturedNews(): NewsItem[] {
  return news.filter(n => n.featured);
}

export function getNewsItem(id: string): NewsItem | undefined {
  return news.find(n => n.id === id);
}

export function getMatchesByRound(round: number): Match[] {
  return matches.filter(m => m.round === round);
}
