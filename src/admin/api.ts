import type {
  ClubItem,
  ClubPayload,
  FantasyAdminTeamItem,
  FantasyLeagueItem,
  FantasyPlayerStatItem,
  FantasyPlayerStatPayload,
  FantasyPriceItem,
  FantasyRoundInfoItem,
  FantasyRoundRecalculationItem,
  Identifier,
  MatchItem,
  MatchPayload,
  MatchResultPayload,
  NewsItem,
  NewsPayload,
  PlayerItem,
  PlayerPayload,
} from '@/admin/types';

const DEFAULT_API_BASE_URL = '/backend';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
const API_ENDPOINTS = {
  authLogin: '/auth/login',
  clubsList: '/api/clubs',
  clubDetail: (id: Identifier) => `/api/clubs/${id}`,
  clubsAdmin: '/admin/clubs',
  playersList: '/api/players',
  playerDetail: (id: Identifier) => `/api/players/${id}`,
  playersAdmin: '/admin/players',
  matchesList: '/api/matches',
  matchDetail: (id: Identifier) => `/api/matches/${id}`,
  matchesAdmin: '/admin/matches',
  newsList: '/api/news',
  newsDetail: (id: Identifier) => `/api/news/${id}`,
  newsAdmin: '/admin/news',
  fantasyLeaguesAdmin: '/admin/fantasy/leagues',
  fantasyTeamsAdmin: '/admin/fantasy/teams',
  fantasyMatchStatsAdmin: (matchId: Identifier) => `/admin/fantasy/player-stats/match/${matchId}`,
  fantasyPlayerStatsAdmin: '/admin/fantasy/player-stats',
  fantasyPlayerStatAdmin: (id: Identifier) => `/admin/fantasy/player-stats/${id}`,
  fantasyPlayerPriceAdmin: (playerId: Identifier) => `/admin/fantasy/prices/player/${playerId}`,
  fantasyPricesRebuildAdmin: '/admin/fantasy/prices/rebuild',
  fantasyRoundRecalculateAdmin: (seasonId: Identifier, roundNumber: number) =>
    `/admin/fantasy/recalculate/round/${seasonId}/${roundNumber}`,
  fantasyCurrentRound: '/api/fantasy/rounds/current',
} as const;
const TOKEN_KEY = 'kpfl_admin_token';
const DETAIL_REQUEST_CONCURRENCY = 12;

type JsonRecord = Record<string, unknown>;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function asIdentifier(value: unknown): Identifier | undefined {
  if (isRecord(value)) {
    return asString(value.id);
  }
  return asString(value);
}

function readValue(record: JsonRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }
  return undefined;
}

function readString(record: JsonRecord, keys: string[]): string {
  return asString(readValue(record, keys)) ?? '';
}

function readNumber(record: JsonRecord, keys: string[]): number | undefined {
  return asNumber(readValue(record, keys));
}

function readIdentifier(record: JsonRecord, keys: string[]): Identifier {
  return asIdentifier(readValue(record, keys)) ?? '';
}

function listFromPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (!isRecord(payload)) {
    return [];
  }

  const listKeys = ['data', 'items', 'results', 'content', 'clubs', 'players', 'matches', 'news'];
  for (const key of listKeys) {
    const maybeList = payload[key];
    if (Array.isArray(maybeList)) {
      return maybeList;
    }
  }

  return [];
}

function normalizeClub(value: unknown): ClubItem {
  const row = isRecord(value) ? value : {};

  return {
    id: readIdentifier(row, ['id', 'clubId', 'club_id']),
    name: readString(row, ['name', 'title']),
    shortName: readString(row, ['shortName', 'short_name', 'abbr', 'code']),
    city: readString(row, ['city']),
    stadium: readString(row, ['stadium']),
    founded: readNumber(row, ['founded', 'foundedYear', 'founded_year']) ?? null,
    primaryColor: readString(row, ['primaryColor', 'primary_color']),
    logoUrl: readString(row, ['logoUrl', 'logo_url']),
    coachName: readString(row, ['coachName', 'coach_name']),
    coachInfo: readString(row, ['coachInfo', 'coach_info']),
  };
}

function normalizePlayer(value: unknown): PlayerItem {
  const row = isRecord(value) ? value : {};

  const clubValue = readValue(row, ['clubId', 'club_id', 'club']);
  const clubId = asIdentifier(clubValue) ?? '';
  const clubName = isRecord(clubValue) ? readString(clubValue, ['name']) : '';

  return {
    id: readIdentifier(row, ['id', 'playerId', 'player_id']),
    clubId,
    clubName,
    firstName: readString(row, ['firstName', 'first_name', 'name']),
    lastName: readString(row, ['lastName', 'last_name', 'surname']),
    number: readNumber(row, ['number', 'shirtNumber', 'shirt_number']) ?? null,
    position: readString(row, ['position']),
    nationality: readString(row, ['nationality']),
    birthDate: readString(row, ['birthDate', 'birth_date', 'dob']),
    heightCm: readNumber(row, ['heightCm', 'height_cm']) ?? null,
    weightKg: readNumber(row, ['weightKg', 'weight_kg']) ?? null,
    ageYears: readNumber(row, ['ageYears', 'age_years']) ?? null,
    marketValueEur: readNumber(row, ['marketValueEur', 'market_value_eur']) ?? null,
    photoUrl: readString(row, ['photoUrl', 'photo_url']),
    sourceUrl: readString(row, ['sourceUrl', 'source_url']),
    sourceNote: readString(row, ['sourceNote', 'source_note']),
  };
}

function normalizeMatch(value: unknown): MatchItem {
  const row = isRecord(value) ? value : {};

  const homeValue = readValue(row, ['homeClubId', 'home_club_id', 'homeClub']);
  const awayValue = readValue(row, ['awayClubId', 'away_club_id', 'awayClub']);
  const dateTime = readString(row, ['dateTime', 'date_time', 'kickoffAt']);
  const parsedDate = dateTime.includes('T') ? dateTime.split('T')[0] : dateTime;
  const parsedTime = dateTime.includes('T') ? dateTime.split('T')[1]?.slice(0, 5) : '';
  const score = readString(row, ['score']);
  const scoreMatch = score.match(/(\d+)\s*[-:]\s*(\d+)/);
  const scoreHome = scoreMatch ? Number(scoreMatch[1]) : undefined;
  const scoreAway = scoreMatch ? Number(scoreMatch[2]) : undefined;

  return {
    id: readIdentifier(row, ['id', 'matchId', 'match_id']),
    homeClubId: asIdentifier(homeValue) ?? '',
    homeClubName: isRecord(homeValue) ? readString(homeValue, ['name']) : '',
    awayClubId: asIdentifier(awayValue) ?? '',
    awayClubName: isRecord(awayValue) ? readString(awayValue, ['name']) : '',
    date: readString(row, ['date', 'matchDate', 'match_date', 'kickoffDate']) || parsedDate,
    time: readString(row, ['time', 'kickoffTime', 'kickoff_time']) || parsedTime,
    stadium: readString(row, ['stadium']),
    round: readNumber(row, ['round', 'roundNumber']) ?? null,
    seasonYear: readNumber(row, ['seasonYear', 'season_year']) ?? null,
    status: readString(row, ['status']),
    homeScore: readNumber(row, ['homeScore', 'home_score']) ?? scoreHome ?? null,
    awayScore: readNumber(row, ['awayScore', 'away_score']) ?? scoreAway ?? null,
  };
}

function normalizeNews(value: unknown): NewsItem {
  const row = isRecord(value) ? value : {};

  const clubValue = readValue(row, ['clubId', 'club_id', 'club']);
  const playerValue = readValue(row, ['playerId', 'player_id', 'player']);

  return {
    id: readIdentifier(row, ['id', 'newsId', 'news_id']),
    title: readString(row, ['title', 'headline']),
    summary: readString(row, ['summary', 'description', 'lead', 'shortText', 'short_text']),
    date: readString(row, ['date', 'publishedAt', 'published_at']),
    tag: readString(row, ['tag', 'category']),
    clubId: asIdentifier(clubValue),
    clubName: isRecord(clubValue) ? readString(clubValue, ['name']) : '',
    playerId: asIdentifier(playerValue),
    playerName: isRecord(playerValue)
      ? [readString(playerValue, ['firstName']), readString(playerValue, ['lastName'])].filter(Boolean).join(' ')
      : '',
  };
}

function normalizeFantasyLeague(value: unknown): FantasyLeagueItem {
  const row = isRecord(value) ? value : {};

  return {
    leagueId: readIdentifier(row, ['leagueId', 'id']),
    name: readString(row, ['name']),
    code: readString(row, ['code']),
    isPrivate: Boolean(readValue(row, ['isPrivate', 'private'])),
    seasonYear: readNumber(row, ['seasonYear', 'season_year']) ?? null,
    ownerDisplayName: readString(row, ['ownerDisplayName', 'owner_display_name']),
    memberCount: readNumber(row, ['memberCount', 'member_count']) ?? null,
  };
}

function normalizeFantasyAdminTeam(value: unknown): FantasyAdminTeamItem {
  const row = isRecord(value) ? value : {};

  return {
    teamId: readIdentifier(row, ['teamId', 'id']),
    teamName: readString(row, ['teamName', 'name']),
    ownerEmail: readString(row, ['ownerEmail', 'owner_email']),
    ownerDisplayName: readString(row, ['ownerDisplayName', 'owner_display_name']),
    seasonYear: readNumber(row, ['seasonYear', 'season_year']) ?? null,
    totalPoints: readNumber(row, ['totalPoints', 'total_points']) ?? null,
    currentBudget: readNumber(row, ['currentBudget', 'current_budget']) ?? null,
    activeSquadSize: readNumber(row, ['activeSquadSize', 'active_squad_size']) ?? null,
  };
}

function normalizeFantasyPlayerStat(value: unknown): FantasyPlayerStatItem {
  const row = isRecord(value) ? value : {};

  return {
    id: readIdentifier(row, ['id']),
    playerId: readIdentifier(row, ['playerId', 'player_id']),
    playerName: readString(row, ['playerName', 'player_name']),
    matchId: readIdentifier(row, ['matchId', 'match_id']),
    seasonYear: readNumber(row, ['seasonYear', 'season_year']) ?? null,
    roundNumber: readNumber(row, ['roundNumber', 'round_number']) ?? null,
    minutesPlayed: readNumber(row, ['minutesPlayed', 'minutes_played']) ?? null,
    goals: readNumber(row, ['goals']) ?? null,
    assists: readNumber(row, ['assists']) ?? null,
    cleanSheet: Boolean(readValue(row, ['cleanSheet', 'clean_sheet'])),
    goalsConceded: readNumber(row, ['goalsConceded', 'goals_conceded']) ?? null,
    yellowCards: readNumber(row, ['yellowCards', 'yellow_cards']) ?? null,
    redCards: readNumber(row, ['redCards', 'red_cards']) ?? null,
    ownGoals: readNumber(row, ['ownGoals', 'own_goals']) ?? null,
    penaltiesSaved: readNumber(row, ['penaltiesSaved', 'penalties_saved']) ?? null,
    penaltiesMissed: readNumber(row, ['penaltiesMissed', 'penalties_missed']) ?? null,
    saves: readNumber(row, ['saves']) ?? null,
    started: Boolean(readValue(row, ['started'])),
    substitutedIn: Boolean(readValue(row, ['substitutedIn', 'substituted_in'])),
    substitutedOut: Boolean(readValue(row, ['substitutedOut', 'substituted_out'])),
  };
}

function normalizeFantasyPrice(value: unknown): FantasyPriceItem {
  const row = isRecord(value) ? value : {};

  return {
    playerId: readIdentifier(row, ['playerId', 'player_id']),
    playerName: readString(row, ['playerName', 'player_name']),
    seasonYear: readNumber(row, ['seasonYear', 'season_year']) ?? null,
    currentPrice: readNumber(row, ['currentPrice', 'current_price']) ?? null,
    initialPrice: readNumber(row, ['initialPrice', 'initial_price']) ?? null,
    priceSource: readString(row, ['priceSource', 'price_source']),
    lastUpdatedAt: readString(row, ['lastUpdatedAt', 'last_updated_at']),
  };
}

function normalizeFantasyRoundInfo(value: unknown): FantasyRoundInfoItem {
  const row = isRecord(value) ? value : {};

  return {
    seasonYear: readNumber(row, ['seasonYear', 'season_year']) ?? null,
    roundNumber: readNumber(row, ['roundNumber', 'round_number']) ?? null,
    lockAt: readString(row, ['lockAt', 'lock_at']),
    locked: Boolean(readValue(row, ['locked'])),
  };
}

function normalizeFantasyRoundRecalculation(value: unknown): FantasyRoundRecalculationItem {
  const row = isRecord(value) ? value : {};

  return {
    seasonYear: readNumber(row, ['seasonYear', 'season_year']) ?? null,
    roundNumber: readNumber(row, ['roundNumber', 'round_number']) ?? null,
    teamsProcessed: readNumber(row, ['teamsProcessed', 'teams_processed']) ?? null,
    playerPointRows: readNumber(row, ['playerPointRows', 'player_point_rows']) ?? null,
    scoredAt: readString(row, ['scoredAt', 'scored_at']),
  };
}

function extractErrorMessage(payload: unknown, status: number): string {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (isRecord(payload)) {
    const fields = ['message', 'error', 'detail', 'title'];
    for (const field of fields) {
      const value = payload[field];
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }
  }

  return `Request failed with status ${status}`;
}

function asPayloadId(id: Identifier | undefined): string | number | undefined {
  if (!id) {
    return undefined;
  }
  if (/^\d+$/.test(id)) {
    return Number(id);
  }
  return id;
}

function withoutUndefined<T extends JsonRecord>(payload: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) {
      out[key as keyof T] = value as T[keyof T];
    }
  }
  return out;
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;
  const requiresAuth = options.auth ?? path.startsWith('/admin/');

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      throw new Error('Admin token is missing. Please sign in again.');
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const requestUrl = buildApiUrl(path);
  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const usesDefaultProxy = API_BASE_URL === DEFAULT_API_BASE_URL;
    const hint = usesDefaultProxy
      ? 'API proxy /backend is unavailable. Start the app with `npm run dev` or `npm run preview`, or deploy it behind a server rewrite for /backend.'
      : `Cannot reach API base URL ${API_BASE_URL}.`;
    throw new Error(`Network error while contacting ${requestUrl}. ${hint}`);
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new ApiError(response.status, extractErrorMessage(payload, response.status));
  }

  return payload as T;
}

async function requestList<T>(path: string, normalize: (value: unknown) => T): Promise<T[]> {
  const payload = await apiRequest<unknown>(path, { method: 'GET' });
  const list = listFromPayload(payload);
  if (list.length > 0 || Array.isArray(payload)) {
    return list.map(normalize);
  }

  return [];
}

async function mapWithConcurrency<T, U>(
  items: T[],
  concurrency: number,
  mapper: (value: T, index: number) => Promise<U>,
): Promise<U[]> {
  if (items.length === 0) {
    return [];
  }

  const results = new Array<U>(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results;
}

async function requestDetailedList<T extends { id: Identifier }>(
  listPath: string,
  normalizeListItem: (value: unknown) => T,
  detailPathForId: (id: Identifier) => string,
  normalizeDetailItem: (value: unknown) => T,
): Promise<T[]> {
  const list = await requestList(listPath, normalizeListItem);

  return mapWithConcurrency(list, DETAIL_REQUEST_CONCURRENCY, async item => {
    if (!item.id) {
      return item;
    }

    try {
      const detailPayload = await apiRequest<unknown>(detailPathForId(item.id), { method: 'GET' });
      return normalizeDetailItem(detailPayload);
    } catch {
      return item;
    }
  });
}

export function getToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function loginAdmin(email: string, password: string): Promise<void> {
  const payload = await apiRequest<unknown>(API_ENDPOINTS.authLogin, {
    method: 'POST',
    auth: false,
    body: { email, password },
  });

  if (!isRecord(payload)) {
    throw new Error('Unexpected login response from server.');
  }

  const token = asString(payload.token) ?? asString(payload.accessToken);
  if (!token) {
    throw new Error('Token is missing in login response.');
  }

  setToken(token);
}

export async function fetchClubs(): Promise<ClubItem[]> {
  return requestDetailedList(
    API_ENDPOINTS.clubsList,
    normalizeClub,
    API_ENDPOINTS.clubDetail,
    normalizeClub,
  );
}

export async function fetchClub(id: Identifier): Promise<ClubItem> {
  const payload = await apiRequest<unknown>(API_ENDPOINTS.clubDetail(id), { method: 'GET' });
  return normalizeClub(payload);
}

export async function fetchPlayers(): Promise<PlayerItem[]> {
  return requestDetailedList(
    API_ENDPOINTS.playersList,
    normalizePlayer,
    API_ENDPOINTS.playerDetail,
    normalizePlayer,
  );
}

export async function fetchMatches(): Promise<MatchItem[]> {
  return requestDetailedList(
    API_ENDPOINTS.matchesList,
    normalizeMatch,
    API_ENDPOINTS.matchDetail,
    normalizeMatch,
  );
}

export async function fetchMatchesBasic(): Promise<MatchItem[]> {
  return requestList(API_ENDPOINTS.matchesList, normalizeMatch);
}

export async function fetchPlayersBasic(): Promise<PlayerItem[]> {
  return requestList(API_ENDPOINTS.playersList, normalizePlayer);
}

export async function fetchNews(limit: number = 50): Promise<NewsItem[]> {
  return requestDetailedList(
    `${API_ENDPOINTS.newsList}?limit=${limit}`,
    normalizeNews,
    API_ENDPOINTS.newsDetail,
    normalizeNews,
  );
}

export async function fetchFantasyLeagues(): Promise<FantasyLeagueItem[]> {
  return requestList(API_ENDPOINTS.fantasyLeaguesAdmin, normalizeFantasyLeague);
}

export async function fetchFantasyTeams(): Promise<FantasyAdminTeamItem[]> {
  return requestList(API_ENDPOINTS.fantasyTeamsAdmin, normalizeFantasyAdminTeam);
}

export async function fetchFantasyMatchStats(matchId: Identifier): Promise<FantasyPlayerStatItem[]> {
  return requestList(API_ENDPOINTS.fantasyMatchStatsAdmin(matchId), normalizeFantasyPlayerStat);
}

export async function fetchFantasyCurrentRound(): Promise<FantasyRoundInfoItem | null> {
  try {
    const payload = await apiRequest<unknown>(API_ENDPOINTS.fantasyCurrentRound, { method: 'GET', auth: false });
    return normalizeFantasyRoundInfo(payload);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createClub(payload: ClubPayload): Promise<void> {
  const requestBody = withoutUndefined({
    name: payload.name,
    abbr: payload.shortName,
    city: payload.city,
    stadium: payload.stadium || undefined,
    foundedYear: payload.founded ?? undefined,
    primaryColor: payload.primaryColor || undefined,
    logoUrl: payload.logoUrl || undefined,
    coachName: payload.coachName || undefined,
    coachInfo: payload.coachInfo || undefined,
  });

  await apiRequest(API_ENDPOINTS.clubsAdmin, {
    method: 'POST',
    body: requestBody,
  });
}

export async function updateClub(id: Identifier, payload: ClubPayload): Promise<void> {
  const requestBody = withoutUndefined({
    name: payload.name,
    abbr: payload.shortName,
    city: payload.city,
    stadium: payload.stadium || undefined,
    foundedYear: payload.founded ?? undefined,
    primaryColor: payload.primaryColor || undefined,
    logoUrl: payload.logoUrl || undefined,
    coachName: payload.coachName || undefined,
    coachInfo: payload.coachInfo || undefined,
  });

  await apiRequest(`${API_ENDPOINTS.clubsAdmin}/${id}`, {
    method: 'PUT',
    body: requestBody,
  });
}

export async function createPlayer(payload: PlayerPayload): Promise<void> {
  const requestBody = withoutUndefined({
    clubId: asPayloadId(payload.clubId),
    firstName: payload.firstName,
    lastName: payload.lastName,
    position: payload.position,
    number: payload.number ?? undefined,
    birthDate: payload.birthDate || undefined,
    nationality: payload.nationality || undefined,
    heightCm: payload.heightCm ?? undefined,
    weightKg: payload.weightKg ?? undefined,
    ageYears: payload.ageYears ?? undefined,
    marketValueEur: payload.marketValueEur ?? undefined,
    photoUrl: payload.photoUrl || undefined,
    sourceUrl: payload.sourceUrl || undefined,
    sourceNote: payload.sourceNote || undefined,
  });

  await apiRequest(API_ENDPOINTS.playersAdmin, {
    method: 'POST',
    body: requestBody,
  });
}

export async function updatePlayer(id: Identifier, payload: PlayerPayload): Promise<void> {
  const requestBody = withoutUndefined({
    clubId: asPayloadId(payload.clubId),
    firstName: payload.firstName,
    lastName: payload.lastName,
    position: payload.position,
    number: payload.number ?? undefined,
    birthDate: payload.birthDate || undefined,
    nationality: payload.nationality || undefined,
    heightCm: payload.heightCm ?? undefined,
    weightKg: payload.weightKg ?? undefined,
    ageYears: payload.ageYears ?? undefined,
    marketValueEur: payload.marketValueEur ?? undefined,
    photoUrl: payload.photoUrl || undefined,
    sourceUrl: payload.sourceUrl || undefined,
    sourceNote: payload.sourceNote || undefined,
  });

  await apiRequest(`${API_ENDPOINTS.playersAdmin}/${id}`, {
    method: 'PUT',
    body: requestBody,
  });
}

export async function createMatch(payload: MatchPayload): Promise<void> {
  const requestBody = withoutUndefined({
    seasonYear: payload.seasonYear,
    roundNumber: payload.roundNumber,
    dateTime: payload.dateTime,
    stadium: payload.stadium || undefined,
    homeClubId: asPayloadId(payload.homeClubId),
    awayClubId: asPayloadId(payload.awayClubId),
    homeGoals: payload.homeGoals ?? undefined,
    awayGoals: payload.awayGoals ?? undefined,
    status: payload.status,
  });

  await apiRequest(API_ENDPOINTS.matchesAdmin, {
    method: 'POST',
    body: requestBody,
  });
}

export async function updateMatch(id: Identifier, payload: MatchPayload): Promise<void> {
  const requestBody = withoutUndefined({
    seasonYear: payload.seasonYear,
    roundNumber: payload.roundNumber,
    dateTime: payload.dateTime,
    stadium: payload.stadium || undefined,
    homeClubId: asPayloadId(payload.homeClubId),
    awayClubId: asPayloadId(payload.awayClubId),
    homeGoals: payload.homeGoals ?? undefined,
    awayGoals: payload.awayGoals ?? undefined,
    status: payload.status,
  });

  await apiRequest(`${API_ENDPOINTS.matchesAdmin}/${id}`, {
    method: 'PUT',
    body: requestBody,
  });
}

export async function setMatchResult(id: Identifier, payload: MatchResultPayload): Promise<void> {
  await apiRequest(`${API_ENDPOINTS.matchesAdmin}/${id}/result`, {
    method: 'POST',
    body: payload,
  });
}

export async function createNews(payload: NewsPayload): Promise<void> {
  const requestBody = withoutUndefined({
    title: payload.title,
    shortText: payload.shortText || undefined,
    publishedAt: payload.publishedAt,
    tag: payload.tag,
    clubId: asPayloadId(payload.clubId),
    playerId: asPayloadId(payload.playerId),
  });

  await apiRequest(API_ENDPOINTS.newsAdmin, {
    method: 'POST',
    body: requestBody,
  });
}

export async function updateNews(id: Identifier, payload: NewsPayload): Promise<void> {
  const requestBody = withoutUndefined({
    title: payload.title,
    shortText: payload.shortText || undefined,
    publishedAt: payload.publishedAt,
    tag: payload.tag,
    clubId: asPayloadId(payload.clubId),
    playerId: asPayloadId(payload.playerId),
  });

  await apiRequest(`${API_ENDPOINTS.newsAdmin}/${id}`, {
    method: 'PUT',
    body: requestBody,
  });
}

export async function createFantasyPlayerStat(payload: FantasyPlayerStatPayload): Promise<FantasyPlayerStatItem> {
  const requestBody = withoutUndefined({
    matchId: asPayloadId(payload.matchId),
    playerId: asPayloadId(payload.playerId),
    minutesPlayed: payload.minutesPlayed ?? undefined,
    goals: payload.goals ?? undefined,
    assists: payload.assists ?? undefined,
    cleanSheet: payload.cleanSheet,
    goalsConceded: payload.goalsConceded ?? undefined,
    yellowCards: payload.yellowCards ?? undefined,
    redCards: payload.redCards ?? undefined,
    ownGoals: payload.ownGoals ?? undefined,
    penaltiesSaved: payload.penaltiesSaved ?? undefined,
    penaltiesMissed: payload.penaltiesMissed ?? undefined,
    saves: payload.saves ?? undefined,
    started: payload.started,
    substitutedIn: payload.substitutedIn,
    substitutedOut: payload.substitutedOut,
  });

  const response = await apiRequest<unknown>(API_ENDPOINTS.fantasyPlayerStatsAdmin, {
    method: 'POST',
    body: requestBody,
  });

  return normalizeFantasyPlayerStat(response);
}

export async function updateFantasyPlayerStat(
  id: Identifier,
  payload: FantasyPlayerStatPayload,
): Promise<FantasyPlayerStatItem> {
  const requestBody = withoutUndefined({
    matchId: asPayloadId(payload.matchId),
    playerId: asPayloadId(payload.playerId),
    minutesPlayed: payload.minutesPlayed ?? undefined,
    goals: payload.goals ?? undefined,
    assists: payload.assists ?? undefined,
    cleanSheet: payload.cleanSheet,
    goalsConceded: payload.goalsConceded ?? undefined,
    yellowCards: payload.yellowCards ?? undefined,
    redCards: payload.redCards ?? undefined,
    ownGoals: payload.ownGoals ?? undefined,
    penaltiesSaved: payload.penaltiesSaved ?? undefined,
    penaltiesMissed: payload.penaltiesMissed ?? undefined,
    saves: payload.saves ?? undefined,
    started: payload.started,
    substitutedIn: payload.substitutedIn,
    substitutedOut: payload.substitutedOut,
  });

  const response = await apiRequest<unknown>(API_ENDPOINTS.fantasyPlayerStatAdmin(id), {
    method: 'PUT',
    body: requestBody,
  });

  return normalizeFantasyPlayerStat(response);
}

export async function rebuildFantasyPriceForPlayer(playerId: Identifier): Promise<FantasyPriceItem> {
  const response = await apiRequest<unknown>(API_ENDPOINTS.fantasyPlayerPriceAdmin(playerId), {
    method: 'POST',
  });
  return normalizeFantasyPrice(response);
}

export async function rebuildFantasyPrices(): Promise<FantasyPriceItem[]> {
  const payload = await apiRequest<unknown>(API_ENDPOINTS.fantasyPricesRebuildAdmin, {
    method: 'POST',
  });
  const list = listFromPayload(payload);
  return list.map(normalizeFantasyPrice);
}

export async function recalculateFantasyRound(
  seasonId: Identifier,
  roundNumber: number,
): Promise<FantasyRoundRecalculationItem> {
  const response = await apiRequest<unknown>(API_ENDPOINTS.fantasyRoundRecalculateAdmin(seasonId, roundNumber), {
    method: 'POST',
  });
  return normalizeFantasyRoundRecalculation(response);
}
