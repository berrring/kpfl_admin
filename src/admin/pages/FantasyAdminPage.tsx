import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createFantasyPlayerStat,
  fetchFantasyCurrentRound,
  fetchFantasyLeagues,
  fetchFantasyMatchStats,
  fetchFantasyTeams,
  fetchMatchesBasic,
  fetchPlayersBasic,
  rebuildFantasyPriceForPlayer,
  rebuildFantasyPrices,
  recalculateFantasyRound,
  updateFantasyPlayerStat,
} from '@/admin/api';
import type {
  FantasyAdminTeamItem,
  FantasyLeagueItem,
  FantasyPlayerStatItem,
  FantasyPlayerStatPayload,
  FantasyPriceItem,
  FantasyRoundInfoItem,
  FantasyRoundRecalculationItem,
  Identifier,
  MatchItem,
  PlayerItem,
} from '@/admin/types';

interface StatFormState {
  matchId: string;
  playerId: string;
  minutesPlayed: string;
  goals: string;
  assists: string;
  cleanSheet: boolean;
  goalsConceded: string;
  yellowCards: string;
  redCards: string;
  ownGoals: string;
  penaltiesSaved: string;
  penaltiesMissed: string;
  saves: string;
  started: boolean;
  substitutedIn: boolean;
  substitutedOut: boolean;
}

interface RoundRecalculationFormState {
  seasonId: string;
  roundNumber: string;
}

const EMPTY_STAT_FORM: StatFormState = {
  matchId: '',
  playerId: '',
  minutesPlayed: '',
  goals: '',
  assists: '',
  cleanSheet: false,
  goalsConceded: '',
  yellowCards: '',
  redCards: '',
  ownGoals: '',
  penaltiesSaved: '',
  penaltiesMissed: '',
  saves: '',
  started: false,
  substitutedIn: false,
  substitutedOut: false,
};

const EMPTY_RECALC_FORM: RoundRecalculationFormState = {
  seasonId: '',
  roundNumber: '',
};

function asOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function matchLabel(match: MatchItem): string {
  const teams = `${match.homeClubName || match.homeClubId || 'Home'} vs ${match.awayClubName || match.awayClubId || 'Away'}`;
  const date = [match.date, match.time].filter(Boolean).join(' ');
  return `${teams}${date ? ` (${date})` : ''}`;
}

function formatCurrency(value?: number | null): string {
  if (value === null || value === undefined) {
    return '-';
  }

  return `EUR ${value.toFixed(2)}`;
}

function formatDateTime(value?: string): string {
  if (!value) {
    return '-';
  }

  return value.replace('T', ' ');
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#334155]">
      <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function FantasyAdminPage() {
  const [leagues, setLeagues] = useState<FantasyLeagueItem[]>([]);
  const [teams, setTeams] = useState<FantasyAdminTeamItem[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [stats, setStats] = useState<FantasyPlayerStatItem[]>([]);
  const [priceResults, setPriceResults] = useState<FantasyPriceItem[]>([]);
  const [currentRound, setCurrentRound] = useState<FantasyRoundInfoItem | null>(null);
  const [lastRecalculation, setLastRecalculation] = useState<FantasyRoundRecalculationItem | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [savingStat, setSavingStat] = useState(false);
  const [runningPriceAction, setRunningPriceAction] = useState(false);
  const [runningRecalculation, setRunningRecalculation] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [pricePlayerId, setPricePlayerId] = useState('');
  const [statForm, setStatForm] = useState<StatFormState>(EMPTY_STAT_FORM);
  const [recalcForm, setRecalcForm] = useState<RoundRecalculationFormState>(EMPTY_RECALC_FORM);

  const playerNameById = useMemo(() => {
    const map = new Map<string, string>();
    players.forEach(player => {
      map.set(player.id, [player.firstName, player.lastName].filter(Boolean).join(' ') || player.id);
    });
    return map;
  }, [players]);

  const currentMatch = useMemo(
    () => matches.find(match => match.id === selectedMatchId) ?? null,
    [matches, selectedMatchId],
  );

  const loadOverview = async () => {
    setError('');
    setMessage('');
    setLoadingOverview(true);

    try {
      const [leaguesData, teamsData, matchesData, playersData, currentRoundData] = await Promise.all([
        fetchFantasyLeagues(),
        fetchFantasyTeams(),
        fetchMatchesBasic(),
        fetchPlayersBasic(),
        fetchFantasyCurrentRound(),
      ]);

      setLeagues(leaguesData);
      setTeams(teamsData);
      setMatches(matchesData);
      setPlayers(playersData);
      setCurrentRound(currentRoundData);

      if (!selectedMatchId && matchesData.length > 0) {
        setSelectedMatchId(matchesData[0].id);
      }

      if (!pricePlayerId && playersData.length > 0) {
        setPricePlayerId(playersData[0].id);
      }

      setRecalcForm(prev => ({
        seasonId: prev.seasonId || (currentRoundData?.seasonYear ? String(currentRoundData.seasonYear) : ''),
        roundNumber: prev.roundNumber || (currentRoundData?.roundNumber ? String(currentRoundData.roundNumber) : ''),
      }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load fantasy admin data');
    } finally {
      setLoadingOverview(false);
    }
  };

  const loadStats = async (matchId: Identifier) => {
    setError('');
    setLoadingStats(true);

    try {
      const statsData = await fetchFantasyMatchStats(matchId);
      setStats(statsData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load fantasy stats');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    void loadOverview();
  }, []);

  useEffect(() => {
    if (!selectedMatchId) {
      setStats([]);
      return;
    }

    if (!editingStatId) {
      setStatForm(prev => ({ ...prev, matchId: selectedMatchId }));
    }

    void loadStats(selectedMatchId);
  }, [editingStatId, selectedMatchId]);

  const resetStatForm = () => {
    setEditingStatId(null);
    setStatForm({
      ...EMPTY_STAT_FORM,
      matchId: selectedMatchId,
    });
  };

  const handleEditStat = (stat: FantasyPlayerStatItem) => {
    setEditingStatId(stat.id);
    setStatForm({
      matchId: stat.matchId,
      playerId: stat.playerId,
      minutesPlayed: stat.minutesPlayed !== null && stat.minutesPlayed !== undefined ? String(stat.minutesPlayed) : '',
      goals: stat.goals !== null && stat.goals !== undefined ? String(stat.goals) : '',
      assists: stat.assists !== null && stat.assists !== undefined ? String(stat.assists) : '',
      cleanSheet: stat.cleanSheet,
      goalsConceded:
        stat.goalsConceded !== null && stat.goalsConceded !== undefined ? String(stat.goalsConceded) : '',
      yellowCards:
        stat.yellowCards !== null && stat.yellowCards !== undefined ? String(stat.yellowCards) : '',
      redCards: stat.redCards !== null && stat.redCards !== undefined ? String(stat.redCards) : '',
      ownGoals: stat.ownGoals !== null && stat.ownGoals !== undefined ? String(stat.ownGoals) : '',
      penaltiesSaved:
        stat.penaltiesSaved !== null && stat.penaltiesSaved !== undefined ? String(stat.penaltiesSaved) : '',
      penaltiesMissed:
        stat.penaltiesMissed !== null && stat.penaltiesMissed !== undefined ? String(stat.penaltiesMissed) : '',
      saves: stat.saves !== null && stat.saves !== undefined ? String(stat.saves) : '',
      started: stat.started,
      substitutedIn: stat.substitutedIn,
      substitutedOut: stat.substitutedOut,
    });
    setSelectedMatchId(stat.matchId);
  };

  const handleStatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!statForm.matchId) {
      setError('Choose a match for fantasy stat entry.');
      return;
    }

    if (!statForm.playerId) {
      setError('Choose a player for fantasy stat entry.');
      return;
    }

    const payload: FantasyPlayerStatPayload = {
      matchId: statForm.matchId,
      playerId: statForm.playerId,
      minutesPlayed: asOptionalNumber(statForm.minutesPlayed),
      goals: asOptionalNumber(statForm.goals),
      assists: asOptionalNumber(statForm.assists),
      cleanSheet: statForm.cleanSheet,
      goalsConceded: asOptionalNumber(statForm.goalsConceded),
      yellowCards: asOptionalNumber(statForm.yellowCards),
      redCards: asOptionalNumber(statForm.redCards),
      ownGoals: asOptionalNumber(statForm.ownGoals),
      penaltiesSaved: asOptionalNumber(statForm.penaltiesSaved),
      penaltiesMissed: asOptionalNumber(statForm.penaltiesMissed),
      saves: asOptionalNumber(statForm.saves),
      started: statForm.started,
      substitutedIn: statForm.substitutedIn,
      substitutedOut: statForm.substitutedOut,
    };

    setSavingStat(true);

    try {
      if (editingStatId) {
        await updateFantasyPlayerStat(editingStatId, payload);
        setMessage('Fantasy player stat updated.');
      } else {
        await createFantasyPlayerStat(payload);
        setMessage('Fantasy player stat created.');
      }

      resetStatForm();
      await loadStats(payload.matchId);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save fantasy player stat');
    } finally {
      setSavingStat(false);
    }
  };

  const handlePlayerPriceRebuild = async () => {
    setError('');
    setMessage('');

    if (!pricePlayerId) {
      setError('Choose a player before rebuilding price.');
      return;
    }

    setRunningPriceAction(true);

    try {
      const updatedPrice = await rebuildFantasyPriceForPlayer(pricePlayerId);
      setPriceResults(prev => [updatedPrice, ...prev.filter(item => item.playerId !== updatedPrice.playerId)].slice(0, 25));
      setMessage(`Price rebuilt for ${updatedPrice.playerName || 'selected player'}.`);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Failed to rebuild player price');
    } finally {
      setRunningPriceAction(false);
    }
  };

  const handleAllPricesRebuild = async () => {
    setError('');
    setMessage('');
    setRunningPriceAction(true);

    try {
      const rebuiltPrices = await rebuildFantasyPrices();
      setPriceResults(rebuiltPrices);
      setMessage(`Rebuilt ${rebuiltPrices.length} fantasy prices.`);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Failed to rebuild fantasy prices');
    } finally {
      setRunningPriceAction(false);
    }
  };

  const handleRoundRecalculation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!recalcForm.seasonId.trim()) {
      setError('Enter backend season ID for round recalculation.');
      return;
    }

    const roundNumber = asOptionalNumber(recalcForm.roundNumber);
    if (roundNumber === undefined) {
      setError('Enter a round number for recalculation.');
      return;
    }

    setRunningRecalculation(true);

    try {
      const result = await recalculateFantasyRound(recalcForm.seasonId.trim(), roundNumber);
      setLastRecalculation(result);
      setMessage(`Round ${result.roundNumber ?? roundNumber} recalculated.`);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Failed to recalculate fantasy round');
    } finally {
      setRunningRecalculation(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in">
      {(error || message) && (
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          {message && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          )}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Active Round</p>
          <p className="mt-2 text-2xl font-black text-[#0F1729]">
            {currentRound ? `${currentRound.seasonYear ?? '-'} / R${currentRound.roundNumber ?? '-'}` : 'Not available'}
          </p>
          <p className="mt-2 text-sm text-[#64748B]">
            {currentRound ? (currentRound.locked ? 'Locked' : 'Open for changes') : 'Backend reports no current fantasy round.'}
          </p>
        </div>

        <div className="card p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Leagues</p>
          <p className="mt-2 text-2xl font-black text-[#0F1729]">{leagues.length}</p>
          <p className="mt-2 text-sm text-[#64748B]">Admin-visible fantasy leagues.</p>
        </div>

        <div className="card p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Teams</p>
          <p className="mt-2 text-2xl font-black text-[#0F1729]">{teams.length}</p>
          <p className="mt-2 text-sm text-[#64748B]">Fantasy teams currently registered.</p>
        </div>

        <div className="card p-4 md:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Stat Rows</p>
          <p className="mt-2 text-2xl font-black text-[#0F1729]">{stats.length}</p>
          <p className="mt-2 text-sm text-[#64748B]">
            {currentMatch ? `Loaded for ${matchLabel(currentMatch)}` : 'Choose a match to manage player stats.'}
          </p>
        </div>
      </section>

      <section className="card p-4 md:p-5">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h2 className="text-lg font-black">Fantasy Overview</h2>
            <p className="mt-1 text-sm text-[#64748B]">Backend-backed fantasy admin tools for leagues, teams, pricing, and scoring.</p>
          </div>
          <button
            onClick={() => void loadOverview()}
            disabled={loadingOverview}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] hover:bg-[#E5E7EB] disabled:opacity-60 transition-colors"
          >
            {loadingOverview ? 'Refreshing...' : 'Refresh Overview'}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <section className="card p-4 md:p-5">
          <h2 className="text-lg font-black mb-4">Fantasy Leagues</h2>
          <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
            <table className="data-table min-w-[760px]">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Season</th>
                  <th>Owner</th>
                  <th>Members</th>
                  <th>Private</th>
                </tr>
              </thead>
              <tbody>
                {leagues.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-[#6B7280]">
                      No fantasy leagues found
                    </td>
                  </tr>
                )}
                {leagues.map((league, index) => (
                  <tr key={league.leagueId || `fantasy-league-${index}`}>
                    <td className="font-semibold text-[#0F1729]">{league.name || '-'}</td>
                    <td>{league.code || '-'}</td>
                    <td>{league.seasonYear ?? '-'}</td>
                    <td>{league.ownerDisplayName || '-'}</td>
                    <td>{league.memberCount ?? '-'}</td>
                    <td>{league.isPrivate ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-4 md:p-5">
          <h2 className="text-lg font-black mb-4">Fantasy Teams</h2>
          <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
            <table className="data-table min-w-[860px]">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Season</th>
                  <th>Points</th>
                  <th>Budget</th>
                  <th>Squad</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-[#6B7280]">
                      No fantasy teams found
                    </td>
                  </tr>
                )}
                {teams.map((team, index) => (
                  <tr key={team.teamId || `fantasy-team-${index}`}>
                    <td className="font-semibold text-[#0F1729]">{team.teamName || '-'}</td>
                    <td>{team.ownerDisplayName || '-'}</td>
                    <td>{team.ownerEmail || '-'}</td>
                    <td>{team.seasonYear ?? '-'}</td>
                    <td>{team.totalPoints ?? '-'}</td>
                    <td>{formatCurrency(team.currentBudget)}</td>
                    <td>{team.activeSquadSize ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="card p-4 md:p-5">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black">Fantasy Player Match Stats</h2>
            <p className="mt-1 text-sm text-[#64748B]">Manage stat rows that feed fantasy scoring and price updates.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="px-3 py-2 rounded-lg border border-[#D1D5DB] bg-white text-sm"
              value={selectedMatchId}
              onChange={event => setSelectedMatchId(event.target.value)}
            >
              <option value="">Select match</option>
              {matches.map((match, index) => (
                <option key={match.id || `fantasy-match-${index}`} value={match.id}>
                  {matchLabel(match)}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (selectedMatchId) {
                  void loadStats(selectedMatchId);
                }
              }}
              disabled={!selectedMatchId || loadingStats}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] hover:bg-[#E5E7EB] disabled:opacity-60 transition-colors"
            >
              {loadingStats ? 'Refreshing...' : 'Refresh Stats'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-4 md:gap-6">
          <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
            <table className="data-table min-w-[1100px]">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Season</th>
                  <th>Round</th>
                  <th>Min</th>
                  <th>G</th>
                  <th>A</th>
                  <th>CS</th>
                  <th>GC</th>
                  <th>YC</th>
                  <th>RC</th>
                  <th>OG</th>
                  <th>PS</th>
                  <th>PM</th>
                  <th>Saves</th>
                  <th>Flags</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {!selectedMatchId && (
                  <tr>
                    <td colSpan={16} className="text-center text-[#6B7280]">
                      Select a match to load fantasy stats
                    </td>
                  </tr>
                )}
                {selectedMatchId && stats.length === 0 && !loadingStats && (
                  <tr>
                    <td colSpan={16} className="text-center text-[#6B7280]">
                      No fantasy stats found for this match
                    </td>
                  </tr>
                )}
                {stats.map((stat, index) => (
                  <tr key={stat.id || `fantasy-stat-${index}`}>
                    <td className="font-semibold text-[#0F1729]">{stat.playerName || playerNameById.get(stat.playerId) || stat.playerId || '-'}</td>
                    <td>{stat.seasonYear ?? '-'}</td>
                    <td>{stat.roundNumber ?? '-'}</td>
                    <td>{stat.minutesPlayed ?? '-'}</td>
                    <td>{stat.goals ?? 0}</td>
                    <td>{stat.assists ?? 0}</td>
                    <td>{stat.cleanSheet ? 'Yes' : 'No'}</td>
                    <td>{stat.goalsConceded ?? 0}</td>
                    <td>{stat.yellowCards ?? 0}</td>
                    <td>{stat.redCards ?? 0}</td>
                    <td>{stat.ownGoals ?? 0}</td>
                    <td>{stat.penaltiesSaved ?? 0}</td>
                    <td>{stat.penaltiesMissed ?? 0}</td>
                    <td>{stat.saves ?? 0}</td>
                    <td>
                      {[
                        stat.started ? 'Start' : null,
                        stat.substitutedIn ? 'In' : null,
                        stat.substitutedOut ? 'Out' : null,
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleEditStat(stat)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#0A1628] text-white hover:bg-[#142238] transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleStatSubmit} className="card border border-[#E5E7EB] p-4 space-y-3.5">
            <h3 className="text-base font-black">{editingStatId ? 'Edit Fantasy Stat' : 'Create Fantasy Stat'}</h3>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Match</label>
              <select
                className="input-field"
                value={statForm.matchId}
                onChange={event => setStatForm(prev => ({ ...prev, matchId: event.target.value }))}
                required
              >
                <option value="">Select match</option>
                {matches.map((match, index) => (
                  <option key={match.id || `fantasy-form-match-${index}`} value={match.id}>
                    {matchLabel(match)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Player</label>
              <select
                className="input-field"
                value={statForm.playerId}
                onChange={event => setStatForm(prev => ({ ...prev, playerId: event.target.value }))}
                required
              >
                <option value="">Select player</option>
                {players.map((player, index) => (
                  <option key={player.id || `fantasy-form-player-${index}`} value={player.id}>
                    {[player.firstName, player.lastName].filter(Boolean).join(' ') || player.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Minutes</label>
                <input className="input-field" type="number" min={0} max={120} value={statForm.minutesPlayed} onChange={event => setStatForm(prev => ({ ...prev, minutesPlayed: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Goals</label>
                <input className="input-field" type="number" min={0} value={statForm.goals} onChange={event => setStatForm(prev => ({ ...prev, goals: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Assists</label>
                <input className="input-field" type="number" min={0} value={statForm.assists} onChange={event => setStatForm(prev => ({ ...prev, assists: event.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Goals Conceded</label>
                <input className="input-field" type="number" min={0} value={statForm.goalsConceded} onChange={event => setStatForm(prev => ({ ...prev, goalsConceded: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Yellow Cards</label>
                <input className="input-field" type="number" min={0} value={statForm.yellowCards} onChange={event => setStatForm(prev => ({ ...prev, yellowCards: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Red Cards</label>
                <input className="input-field" type="number" min={0} value={statForm.redCards} onChange={event => setStatForm(prev => ({ ...prev, redCards: event.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Own Goals</label>
                <input className="input-field" type="number" min={0} value={statForm.ownGoals} onChange={event => setStatForm(prev => ({ ...prev, ownGoals: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Penalties Saved</label>
                <input className="input-field" type="number" min={0} value={statForm.penaltiesSaved} onChange={event => setStatForm(prev => ({ ...prev, penaltiesSaved: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Penalties Missed</label>
                <input className="input-field" type="number" min={0} value={statForm.penaltiesMissed} onChange={event => setStatForm(prev => ({ ...prev, penaltiesMissed: event.target.value }))} />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Saves</label>
              <input className="input-field" type="number" min={0} value={statForm.saves} onChange={event => setStatForm(prev => ({ ...prev, saves: event.target.value }))} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ToggleField label="Clean Sheet" checked={statForm.cleanSheet} onChange={checked => setStatForm(prev => ({ ...prev, cleanSheet: checked }))} />
              <ToggleField label="Started" checked={statForm.started} onChange={checked => setStatForm(prev => ({ ...prev, started: checked }))} />
              <ToggleField label="Substituted In" checked={statForm.substitutedIn} onChange={checked => setStatForm(prev => ({ ...prev, substitutedIn: checked }))} />
              <ToggleField label="Substituted Out" checked={statForm.substitutedOut} onChange={checked => setStatForm(prev => ({ ...prev, substitutedOut: checked }))} />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={savingStat}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 transition-colors"
              >
                {savingStat ? 'Saving...' : editingStatId ? 'Update Stat' : 'Create Stat'}
              </button>
              <button
                type="button"
                onClick={resetStatForm}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#F4F6F8] text-[#4B5563] hover:bg-[#E5E7EB] transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <section className="card p-4 md:p-5">
          <h2 className="text-lg font-black mb-4">Fantasy Pricing</h2>
          <div className="space-y-3.5">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Player</label>
              <select
                className="input-field"
                value={pricePlayerId}
                onChange={event => setPricePlayerId(event.target.value)}
              >
                <option value="">Select player</option>
                {players.map((player, index) => (
                  <option key={player.id || `fantasy-price-player-${index}`} value={player.id}>
                    {[player.firstName, player.lastName].filter(Boolean).join(' ') || player.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                disabled={runningPriceAction}
                onClick={() => void handlePlayerPriceRebuild()}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 transition-colors"
              >
                {runningPriceAction ? 'Running...' : 'Rebuild Selected Price'}
              </button>
              <button
                type="button"
                disabled={runningPriceAction}
                onClick={() => void handleAllPricesRebuild()}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#E8A912] text-[#0A1628] hover:bg-[#F5C742] disabled:opacity-60 transition-colors"
              >
                {runningPriceAction ? 'Running...' : 'Rebuild All Prices'}
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
              <table className="data-table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Season</th>
                    <th>Current</th>
                    <th>Initial</th>
                    <th>Source</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {priceResults.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-[#6B7280]">
                        No pricing results yet
                      </td>
                    </tr>
                  )}
                  {priceResults.map((price, index) => (
                    <tr key={`${price.playerId || 'price'}-${index}`}>
                      <td className="font-semibold text-[#0F1729]">{price.playerName || playerNameById.get(price.playerId) || '-'}</td>
                      <td>{price.seasonYear ?? '-'}</td>
                      <td>{formatCurrency(price.currentPrice)}</td>
                      <td>{formatCurrency(price.initialPrice)}</td>
                      <td>{price.priceSource || '-'}</td>
                      <td>{formatDateTime(price.lastUpdatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="card p-4 md:p-5">
          <h2 className="text-lg font-black mb-4">Round Recalculation</h2>
          <form onSubmit={handleRoundRecalculation} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Season ID</label>
                <input
                  className="input-field"
                  value={recalcForm.seasonId}
                  onChange={event => setRecalcForm(prev => ({ ...prev, seasonId: event.target.value }))}
                  placeholder="Backend season ID"
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Round Number</label>
                <input
                  className="input-field"
                  type="number"
                  min={1}
                  value={recalcForm.roundNumber}
                  onChange={event => setRecalcForm(prev => ({ ...prev, roundNumber: event.target.value }))}
                  required
                />
              </div>
            </div>

            {currentRound && (
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-sm text-[#475569]">
                Current public round: season {currentRound.seasonYear ?? '-'}, round {currentRound.roundNumber ?? '-'},
                lock at {formatDateTime(currentRound.lockAt)}.
              </div>
            )}

            {lastRecalculation && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Recalculated season {lastRecalculation.seasonYear ?? '-'} round {lastRecalculation.roundNumber ?? '-'}.
                Teams processed: {lastRecalculation.teamsProcessed ?? 0}, point rows: {lastRecalculation.playerPointRows ?? 0}.
              </div>
            )}

            <button
              type="submit"
              disabled={runningRecalculation}
              className="w-full py-2.5 rounded-lg font-semibold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 transition-colors"
            >
              {runningRecalculation ? 'Recalculating...' : 'Recalculate Round'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
