import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createMatch,
  fetchClubs,
  fetchMatches,
  setMatchResult,
  updateMatch,
} from '@/admin/api';
import type { ClubItem, MatchItem, MatchPayload, MatchResultPayload } from '@/admin/types';

interface MatchFormState {
  seasonYear: string;
  homeClubId: string;
  awayClubId: string;
  date: string;
  time: string;
  stadium: string;
  roundNumber: string;
  status: string;
}

interface ResultFormState {
  matchId: string;
  homeScore: string;
  awayScore: string;
}

const EMPTY_MATCH_FORM: MatchFormState = {
  seasonYear: String(new Date().getFullYear()),
  homeClubId: '',
  awayClubId: '',
  date: '',
  time: '',
  stadium: '',
  roundNumber: '',
  status: 'SCHEDULED',
};

const EMPTY_RESULT_FORM: ResultFormState = {
  matchId: '',
  homeScore: '',
  awayScore: '',
};

const MATCH_STATUSES: Array<{ value: string; label: string }> = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'POSTPONED', label: 'Postponed' },
];

export function MatchesAdminPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMatch, setSavingMatch] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [error, setError] = useState('');
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clubFilter, setClubFilter] = useState<string>('all');
  const [matchForm, setMatchForm] = useState<MatchFormState>(EMPTY_MATCH_FORM);
  const [resultForm, setResultForm] = useState<ResultFormState>(EMPTY_RESULT_FORM);

  const isEditMode = editingMatchId !== null;

  const clubMap = useMemo(() => {
    const map = new Map<string, string>();
    clubs.forEach(club => {
      map.set(club.id, club.name || club.shortName || club.id);
    });
    return map;
  }, [clubs]);

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const statusOk = statusFilter === 'all' || (match.status ?? 'SCHEDULED') === statusFilter;
      const clubOk =
        clubFilter === 'all' ||
        match.homeClubId === clubFilter ||
        match.awayClubId === clubFilter;
      return statusOk && clubOk;
    });
  }, [matches, statusFilter, clubFilter]);

  const loadData = async () => {
    setError('');
    setLoading(true);
    try {
      const [clubsData, matchesData] = await Promise.all([fetchClubs(), fetchMatches()]);
      setClubs(clubsData);
      setMatches(matchesData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetMatchForm = () => {
    setEditingMatchId(null);
    setMatchForm(EMPTY_MATCH_FORM);
  };

  const handleEditMatch = (match: MatchItem) => {
    setEditingMatchId(match.id);
    setMatchForm({
      seasonYear:
        match.seasonYear !== null && match.seasonYear !== undefined
          ? String(match.seasonYear)
          : String(new Date().getFullYear()),
      homeClubId: match.homeClubId || '',
      awayClubId: match.awayClubId || '',
      date: match.date || '',
      time: match.time || '',
      stadium: match.stadium || '',
      roundNumber: match.round !== null && match.round !== undefined ? String(match.round) : '',
      status: match.status || 'SCHEDULED',
    });
  };

  const openResultForm = (match: MatchItem) => {
    setResultForm({
      matchId: match.id,
      homeScore:
        match.homeScore !== null && match.homeScore !== undefined ? String(match.homeScore) : '',
      awayScore:
        match.awayScore !== null && match.awayScore !== undefined ? String(match.awayScore) : '',
    });
  };

  const submitMatch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (matchForm.homeClubId === matchForm.awayClubId) {
      setError('Home club and away club must be different.');
      return;
    }

    setSavingMatch(true);
    const payload: MatchPayload = {
      seasonYear: Number(matchForm.seasonYear),
      roundNumber: Number(matchForm.roundNumber),
      homeClubId: matchForm.homeClubId,
      awayClubId: matchForm.awayClubId,
      dateTime: `${matchForm.date}T${matchForm.time || '00:00'}:00`,
      stadium: matchForm.stadium || undefined,
      status: matchForm.status || 'SCHEDULED',
    };

    try {
      if (isEditMode && editingMatchId) {
        await updateMatch(editingMatchId, payload);
      } else {
        await createMatch(payload);
      }
      resetMatchForm();
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save match');
    } finally {
      setSavingMatch(false);
    }
  };

  const submitResult = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!resultForm.matchId) {
      setError('Choose a match to set result.');
      return;
    }

    if (resultForm.homeScore === '' || resultForm.awayScore === '') {
      setError('Set both home and away scores.');
      return;
    }

    setSavingResult(true);
    const payload: MatchResultPayload = {
      homeGoals: Number(resultForm.homeScore),
      awayGoals: Number(resultForm.awayScore),
    };

    try {
      await setMatchResult(resultForm.matchId, payload);
      setResultForm(EMPTY_RESULT_FORM);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to set result');
    } finally {
      setSavingResult(false);
    }
  };

  const statusOptions = useMemo(() => {
    const available = new Set<string>();
    matches.forEach(match => {
      if (match.status) {
        available.add(match.status);
      }
    });
    MATCH_STATUSES.forEach(status => available.add(status.value));
    return Array.from(available);
  }, [matches]);

  const statusLabel = (value: string) => {
    const known = MATCH_STATUSES.find(status => status.value === value);
    if (known) {
      return known.label;
    }
    return value;
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in">
      <section className="card p-4 md:p-5">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <h2 className="text-lg font-black">Matches</h2>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
              className="px-3 py-2 rounded-lg border border-[#D1D5DB] bg-white text-sm"
            >
              <option value="all">All statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
            <select
              value={clubFilter}
              onChange={event => setClubFilter(event.target.value)}
              className="px-3 py-2 rounded-lg border border-[#D1D5DB] bg-white text-sm"
            >
              <option value="all">All clubs</option>
              {clubs.map((club, index) => (
                <option key={club.id || `club-filter-${index}`} value={club.id}>
                  {club.name || club.shortName || club.id}
                </option>
              ))}
            </select>
            <button
              onClick={() => void loadData()}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] hover:bg-[#E5E7EB] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-[#6B7280]">Loading matches...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
            <table className="data-table min-w-[940px]">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Season</th>
                  <th>Home</th>
                  <th>Away</th>
                  <th>Round</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Stadium</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-[#6B7280]">
                      No matches found
                    </td>
                  </tr>
                )}
                {filteredMatches.map((match, index) => (
                  <tr key={match.id || `match-${index}`}>
                    <td>{[match.date, match.time].filter(Boolean).join(' ') || '-'}</td>
                    <td>{match.seasonYear ?? '-'}</td>
                    <td>{match.homeClubName || clubMap.get(match.homeClubId) || match.homeClubId || '-'}</td>
                    <td>{match.awayClubName || clubMap.get(match.awayClubId) || match.awayClubId || '-'}</td>
                    <td>{match.round ?? '-'}</td>
                    <td>{match.status ? statusLabel(match.status) : '-'}</td>
                    <td>
                      {match.homeScore !== null &&
                      match.homeScore !== undefined &&
                      match.awayScore !== null &&
                      match.awayScore !== undefined
                        ? `${match.homeScore}:${match.awayScore}`
                        : '-'}
                    </td>
                    <td>{match.stadium || '-'}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditMatch(match)}
                          className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#0A1628] text-white hover:bg-[#142238] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openResultForm(match)}
                          className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#E8A912] text-[#0A1628] hover:bg-[#F5C742] transition-colors"
                        >
                          Set Result
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <section className="card p-4 md:p-5">
          <h2 className="text-lg font-black mb-4">{isEditMode ? 'Edit Match' : 'Create Match'}</h2>
          <form onSubmit={submitMatch} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Season Year</label>
                <input
                  type="number"
                  min={2000}
                  className="input-field"
                  value={matchForm.seasonYear}
                  onChange={event => setMatchForm(prev => ({ ...prev, seasonYear: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Home Club</label>
                {clubs.length > 0 ? (
                  <select
                    className="input-field"
                    value={matchForm.homeClubId}
                    onChange={event => setMatchForm(prev => ({ ...prev, homeClubId: event.target.value }))}
                    required
                  >
                    <option value="">Select</option>
                    {clubs.map((club, index) => (
                      <option key={club.id || `home-club-${index}`} value={club.id}>
                        {club.name || club.shortName || club.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input-field"
                    placeholder="Club ID"
                    value={matchForm.homeClubId}
                    onChange={event => setMatchForm(prev => ({ ...prev, homeClubId: event.target.value }))}
                    required
                  />
                )}
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Away Club</label>
                {clubs.length > 0 ? (
                  <select
                    className="input-field"
                    value={matchForm.awayClubId}
                    onChange={event => setMatchForm(prev => ({ ...prev, awayClubId: event.target.value }))}
                    required
                  >
                    <option value="">Select</option>
                    {clubs.map((club, index) => (
                      <option key={club.id || `away-club-${index}`} value={club.id}>
                        {club.name || club.shortName || club.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input-field"
                    placeholder="Club ID"
                    value={matchForm.awayClubId}
                    onChange={event => setMatchForm(prev => ({ ...prev, awayClubId: event.target.value }))}
                    required
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={matchForm.date}
                  onChange={event => setMatchForm(prev => ({ ...prev, date: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={matchForm.time}
                  onChange={event => setMatchForm(prev => ({ ...prev, time: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Stadium</label>
              <input
                className="input-field"
                value={matchForm.stadium}
                onChange={event => setMatchForm(prev => ({ ...prev, stadium: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Round</label>
                <input
                  type="number"
                  min={1}
                  className="input-field"
                  value={matchForm.roundNumber}
                  onChange={event => setMatchForm(prev => ({ ...prev, roundNumber: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Status</label>
                <select
                  className="input-field"
                  value={matchForm.status}
                  onChange={event => setMatchForm(prev => ({ ...prev, status: event.target.value }))}
                >
                  {MATCH_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={savingMatch}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 transition-colors"
              >
                {savingMatch ? 'Saving...' : isEditMode ? 'Update Match' : 'Create Match'}
              </button>
              <button
                type="button"
                onClick={resetMatchForm}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#F4F6F8] text-[#4B5563] hover:bg-[#E5E7EB] transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="card p-4 md:p-5">
          <h2 className="text-lg font-black mb-4">Set Result</h2>
          <form onSubmit={submitResult} className="space-y-3.5">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Match</label>
              {matches.length > 0 ? (
                <select
                  className="input-field"
                  value={resultForm.matchId}
                  onChange={event => setResultForm(prev => ({ ...prev, matchId: event.target.value }))}
                  required
                >
                  <option value="">Select match</option>
                  {matches.map((match, index) => (
                    <option key={match.id || `result-match-${index}`} value={match.id}>
                      {`${match.homeClubName || clubMap.get(match.homeClubId) || match.homeClubId} vs ${
                        match.awayClubName || clubMap.get(match.awayClubId) || match.awayClubId
                      } (${match.date || 'N/A'})`}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="input-field"
                  placeholder="Match ID"
                  value={resultForm.matchId}
                  onChange={event => setResultForm(prev => ({ ...prev, matchId: event.target.value }))}
                  required
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Home Score</label>
                <input
                  type="number"
                  min={0}
                  className="input-field"
                  value={resultForm.homeScore}
                  onChange={event => setResultForm(prev => ({ ...prev, homeScore: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Away Score</label>
                <input
                  type="number"
                  min={0}
                  className="input-field"
                  value={resultForm.awayScore}
                  onChange={event => setResultForm(prev => ({ ...prev, awayScore: event.target.value }))}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingResult}
              className="w-full py-2.5 rounded-lg font-semibold text-sm bg-[#E8A912] text-[#0A1628] hover:bg-[#F5C742] disabled:opacity-60 transition-colors"
            >
              {savingResult ? 'Saving...' : 'Set Result'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
