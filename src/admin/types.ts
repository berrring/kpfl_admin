export type Identifier = string;

export interface ClubItem {
  id: Identifier;
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  founded?: number | null;
  primaryColor?: string;
  logoUrl?: string;
  coachName?: string;
  coachInfo?: string;
}

export interface ClubPayload {
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  founded?: number | null;
  primaryColor?: string;
  logoUrl?: string;
  coachName?: string;
  coachInfo?: string;
}

export interface PlayerItem {
  id: Identifier;
  clubId: Identifier;
  clubName?: string;
  firstName: string;
  lastName: string;
  number?: number | null;
  position: string;
  nationality?: string;
  birthDate?: string;
  heightCm?: number | null;
  weightKg?: number | null;
  ageYears?: number | null;
  marketValueEur?: number | null;
  photoUrl?: string;
  sourceUrl?: string;
  sourceNote?: string;
}

export interface PlayerPayload {
  clubId: Identifier;
  firstName: string;
  lastName: string;
  position: string;
  number?: number | null;
  nationality?: string;
  birthDate?: string;
  heightCm?: number | null;
  weightKg?: number | null;
  ageYears?: number | null;
  marketValueEur?: number | null;
  photoUrl?: string;
  sourceUrl?: string;
  sourceNote?: string;
}

export interface MatchItem {
  id: Identifier;
  homeClubId: Identifier;
  homeClubName?: string;
  awayClubId: Identifier;
  awayClubName?: string;
  date: string;
  time?: string;
  stadium?: string;
  round?: number | null;
  seasonYear?: number | null;
  status?: string;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface MatchPayload {
  seasonYear: number;
  roundNumber: number;
  homeClubId: Identifier;
  awayClubId: Identifier;
  dateTime: string;
  stadium?: string;
  homeGoals?: number | null;
  awayGoals?: number | null;
  status: string;
}

export interface MatchResultPayload {
  homeGoals: number;
  awayGoals: number;
}

export interface NewsItem {
  id: Identifier;
  title: string;
  summary?: string;
  date?: string;
  tag?: string;
  clubId?: Identifier;
  clubName?: string;
  playerId?: Identifier;
  playerName?: string;
}

export interface NewsPayload {
  title: string;
  shortText?: string;
  publishedAt: string;
  tag: string;
  clubId?: Identifier;
  playerId?: Identifier;
}
