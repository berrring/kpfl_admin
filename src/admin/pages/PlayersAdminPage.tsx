import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPlayer, fetchClubs, fetchPlayers, updatePlayer } from '@/admin/api';
import type { ClubItem, PlayerItem, PlayerPayload } from '@/admin/types';

type PlayerSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'club-asc'
  | 'value-desc'
  | 'value-asc'
  | 'age-desc'
  | 'age-asc'
  | 'number-asc';

interface PlayerFormState {
  clubId: string;
  firstName: string;
  lastName: string;
  number: string;
  position: string;
  nationality: string;
  birthDate: string;
  heightCm: string;
  weightKg: string;
  ageYears: string;
  marketValueEur: string;
  photoUrl: string;
  sourceUrl: string;
  sourceNote: string;
}

const EMPTY_FORM: PlayerFormState = {
  clubId: '',
  firstName: '',
  lastName: '',
  number: '',
  position: '',
  nationality: '',
  birthDate: '',
  heightCm: '',
  weightKg: '',
  ageYears: '',
  marketValueEur: '',
  photoUrl: '',
  sourceUrl: '',
  sourceNote: '',
};

const VALUE_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function getPlayerName(player: PlayerItem): string {
  return [player.firstName, player.lastName].filter(Boolean).join(' ') || 'Unnamed player';
}

function getBirthYear(birthDate?: string): string {
  const match = birthDate?.match(/^(\d{4})/);
  return match ? match[1] : '-';
}

function getDerivedAge(player: PlayerItem): number | null {
  if (player.ageYears !== null && player.ageYears !== undefined) {
    return player.ageYears;
  }

  const match = player.birthDate?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return null;
  }

  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]);
  const birthDay = Number(match[3]);
  if (!Number.isFinite(birthYear) || !Number.isFinite(birthMonth) || !Number.isFinite(birthDay)) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const hasBirthdayPassed =
    today.getMonth() + 1 > birthMonth || (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay);

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function toDateInputValue(value?: string): string {
  const match = value?.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : value || '';
}

function formatValue(value?: number | null): string {
  if (value === null || value === undefined) {
    return '-';
  }

  return VALUE_FORMATTER.format(value);
}

function compareNullableNumber(left?: number | null, right?: number | null, direction: 'asc' | 'desc' = 'asc'): number {
  if (left === null || left === undefined) {
    return right === null || right === undefined ? 0 : 1;
  }

  if (right === null || right === undefined) {
    return -1;
  }

  return direction === 'asc' ? left - right : right - left;
}

function getPositionBadgeClass(position: string): string {
  switch (position) {
    case 'GK':
      return 'position-gk';
    case 'DF':
      return 'position-df';
    case 'MF':
      return 'position-mf';
    case 'FW':
      return 'position-fw';
    default:
      return 'bg-[#F1F5F9] text-[#334155]';
  }
}

export function PlayersAdminPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('all');
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<PlayerSortOption>('name-asc');
  const [form, setForm] = useState<PlayerFormState>(EMPTY_FORM);

  const isEditMode = editingPlayerId !== null;

  const clubMap = useMemo(() => {
    const map = new Map<string, string>();
    clubs.forEach(club => {
      map.set(club.id, club.name || club.shortName || club.id);
    });
    return map;
  }, [clubs]);

  const positionOptions = useMemo(() => {
    return Array.from(new Set(players.map(player => player.position).filter(Boolean))).sort((left, right) =>
      left.localeCompare(right),
    );
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const nextPlayers = players.filter(player => {
      if (selectedClubFilter !== 'all' && player.clubId !== selectedClubFilter) {
        return false;
      }

      if (selectedPositionFilter !== 'all' && player.position !== selectedPositionFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        getPlayerName(player),
        player.clubName,
        clubMap.get(player.clubId),
        player.position,
        player.nationality,
        player.number !== null && player.number !== undefined ? String(player.number) : '',
        getBirthYear(player.birthDate),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    return nextPlayers.sort((left, right) => {
      switch (sortOption) {
        case 'name-asc':
          return getPlayerName(left).localeCompare(getPlayerName(right), undefined, { sensitivity: 'base' });
        case 'name-desc':
          return getPlayerName(right).localeCompare(getPlayerName(left), undefined, { sensitivity: 'base' });
        case 'club-asc': {
          const clubNameDelta = (left.clubName || clubMap.get(left.clubId) || '').localeCompare(
            right.clubName || clubMap.get(right.clubId) || '',
            undefined,
            { sensitivity: 'base' },
          );
          return clubNameDelta !== 0
            ? clubNameDelta
            : getPlayerName(left).localeCompare(getPlayerName(right), undefined, { sensitivity: 'base' });
        }
        case 'value-desc':
          return compareNullableNumber(left.marketValueEur, right.marketValueEur, 'desc');
        case 'value-asc':
          return compareNullableNumber(left.marketValueEur, right.marketValueEur, 'asc');
        case 'age-desc':
          return compareNullableNumber(getDerivedAge(left), getDerivedAge(right), 'desc');
        case 'age-asc':
          return compareNullableNumber(getDerivedAge(left), getDerivedAge(right), 'asc');
        case 'number-asc':
          return compareNullableNumber(left.number, right.number, 'asc');
        default:
          return 0;
      }
    });
  }, [clubMap, players, searchQuery, selectedClubFilter, selectedPositionFilter, sortOption]);

  const playerStats = useMemo(() => {
    const clubsRepresented = new Set(players.map(player => player.clubId).filter(Boolean)).size;
    const withValue = players.filter(player => player.marketValueEur !== null && player.marketValueEur !== undefined).length;
    const withBirthDate = players.filter(player => Boolean(player.birthDate)).length;

    return {
      total: players.length,
      clubsRepresented,
      withValue,
      withBirthDate,
    };
  }, [players]);

  const previewPlayer = useMemo(() => {
    if (editingPlayerId) {
      return players.find(player => player.id === editingPlayerId) ?? null;
    }

    const fallbackId =
      selectedPlayerId && filteredPlayers.some(player => player.id === selectedPlayerId)
        ? selectedPlayerId
        : filteredPlayers[0]?.id;

    return fallbackId ? players.find(player => player.id === fallbackId) ?? null : null;
  }, [editingPlayerId, filteredPlayers, players, selectedPlayerId]);

  const loadData = async () => {
    setError('');
    setLoading(true);
    try {
      const [clubsData, playersData] = await Promise.all([fetchClubs(), fetchPlayers()]);
      setClubs(clubsData);
      setPlayers(playersData);
      setSelectedPlayerId(previous => previous ?? playersData[0]?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!filteredPlayers.length) {
      if (!editingPlayerId) {
        setSelectedPlayerId(null);
      }
      return;
    }

    if (!selectedPlayerId || !filteredPlayers.some(player => player.id === selectedPlayerId)) {
      if (!editingPlayerId) {
        setSelectedPlayerId(filteredPlayers[0].id);
      }
    }
  }, [editingPlayerId, filteredPlayers, selectedPlayerId]);

  const resetForm = () => {
    setEditingPlayerId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (player: PlayerItem) => {
    setEditingPlayerId(player.id);
    setSelectedPlayerId(player.id);
    setForm({
      clubId: player.clubId || '',
      firstName: player.firstName || '',
      lastName: player.lastName || '',
      number: player.number !== null && player.number !== undefined ? String(player.number) : '',
      position: player.position || '',
      nationality: player.nationality || '',
      birthDate: toDateInputValue(player.birthDate),
      heightCm: player.heightCm !== null && player.heightCm !== undefined ? String(player.heightCm) : '',
      weightKg: player.weightKg !== null && player.weightKg !== undefined ? String(player.weightKg) : '',
      ageYears: player.ageYears !== null && player.ageYears !== undefined ? String(player.ageYears) : '',
      marketValueEur:
        player.marketValueEur !== null && player.marketValueEur !== undefined ? String(player.marketValueEur) : '',
      photoUrl: player.photoUrl || '',
      sourceUrl: player.sourceUrl || '',
      sourceNote: player.sourceNote || '',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    const payload: PlayerPayload = {
      clubId: form.clubId,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      position: form.position.trim(),
      number: form.number ? Number(form.number) : null,
      nationality: form.nationality.trim() || undefined,
      birthDate: form.birthDate || undefined,
      heightCm: form.heightCm ? Number(form.heightCm) : undefined,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      ageYears: form.ageYears ? Number(form.ageYears) : undefined,
      marketValueEur: form.marketValueEur ? Number(form.marketValueEur) : undefined,
      photoUrl: form.photoUrl.trim() || undefined,
      sourceUrl: form.sourceUrl.trim() || undefined,
      sourceNote: form.sourceNote.trim() || undefined,
    };

    try {
      if (isEditMode && editingPlayerId) {
        await updatePlayer(editingPlayerId, payload);
        setMessage('Player updated.');
      } else {
        await createPlayer(payload);
        setMessage('Player created.');
      }

      resetForm();
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save player');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.9fr_1fr] gap-4 md:gap-6 animate-in">
      <div className="space-y-4 md:space-y-6">
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Players</p>
            <p className="mt-2 text-2xl font-black text-[#0F1729]">{playerStats.total}</p>
            <p className="mt-2 text-sm text-[#64748B]">Full backend-loaded player records.</p>
          </div>
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Filtered</p>
            <p className="mt-2 text-2xl font-black text-[#0F1729]">{filteredPlayers.length}</p>
            <p className="mt-2 text-sm text-[#64748B]">Players visible after search and sorting.</p>
          </div>
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Clubs</p>
            <p className="mt-2 text-2xl font-black text-[#0F1729]">{playerStats.clubsRepresented}</p>
            <p className="mt-2 text-sm text-[#64748B]">Clubs represented in player data.</p>
          </div>
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Filled Fields</p>
            <p className="mt-2 text-2xl font-black text-[#0F1729]">
              {playerStats.withBirthDate} / {playerStats.withValue}
            </p>
            <p className="mt-2 text-sm text-[#64748B]">Birth dates and values already present.</p>
          </div>
        </section>

        <section className="card p-4 md:p-5">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-black">Players</h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Search by name, filter by club and position, and sort alphabetically, by value, age, or squad number.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadData()}
                disabled={loading}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] hover:bg-[#E5E7EB] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <input
                className="input-field"
                placeholder="Search by name, club, nationality"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />
              <select value={selectedClubFilter} onChange={event => setSelectedClubFilter(event.target.value)} className="input-field">
                <option value="all">All clubs</option>
                {clubs.map((club, index) => (
                  <option key={club.id || `club-option-${index}`} value={club.id}>
                    {club.name || club.shortName || club.id}
                  </option>
                ))}
              </select>
              <select value={selectedPositionFilter} onChange={event => setSelectedPositionFilter(event.target.value)} className="input-field">
                <option value="all">All positions</option>
                {positionOptions.map(position => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              <select value={sortOption} onChange={event => setSortOption(event.target.value as PlayerSortOption)} className="input-field">
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="club-asc">Club A-Z</option>
                <option value="value-desc">Value high-low</option>
                <option value="value-asc">Value low-high</option>
                <option value="age-desc">Age high-low</option>
                <option value="age-asc">Age low-high</option>
                <option value="number-asc">Number low-high</option>
              </select>
            </div>
          </div>

          {(error || message) && (
            <div className="mb-4 space-y-3">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-3 py-2">
                  {message}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-[#6B7280]">Loading players...</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
              <table className="data-table min-w-[1280px]">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Club</th>
                    <th>No.</th>
                    <th>Position</th>
                    <th>Nationality</th>
                    <th>Birth Year</th>
                    <th>Birth Date</th>
                    <th>Age</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Value</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.length === 0 && (
                    <tr>
                      <td colSpan={12} className="text-center text-[#6B7280]">
                        No players found
                      </td>
                    </tr>
                  )}
                  {filteredPlayers.map((player, index) => (
                    <tr key={player.id || `player-${index}`} className={previewPlayer?.id === player.id ? 'bg-[#FFF8E7]' : undefined}>
                      <td>
                        <button type="button" onClick={() => setSelectedPlayerId(player.id)} className="text-left">
                          <p className="font-semibold text-[#0F1729]">{getPlayerName(player)}</p>
                          <p className="text-xs text-[#64748B]">{player.sourceNote || 'Select to inspect details'}</p>
                        </button>
                      </td>
                      <td>{player.clubName || clubMap.get(player.clubId) || player.clubId || '-'}</td>
                      <td>{player.number ?? '-'}</td>
                      <td>
                        <span className={`badge ${getPositionBadgeClass(player.position)}`}>{player.position || '-'}</span>
                      </td>
                      <td>{player.nationality || '-'}</td>
                      <td>{getBirthYear(player.birthDate)}</td>
                      <td>{player.birthDate || '-'}</td>
                      <td>{getDerivedAge(player) ?? '-'}</td>
                      <td>{player.heightCm ? `${player.heightCm} cm` : '-'}</td>
                      <td>{player.weightKg ? `${player.weightKg} kg` : '-'}</td>
                      <td>{formatValue(player.marketValueEur)}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => handleEdit(player)}
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
          )}
        </section>
      </div>

      <div className="space-y-4 md:space-y-6 self-start">
        <section className="card p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Selected Player</h2>
              <p className="mt-1 text-sm text-[#64748B]">Shows the current backend data for the selected row.</p>
            </div>
            {previewPlayer && (
              <button
                type="button"
                onClick={() => handleEdit(previewPlayer)}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] text-[#334155] hover:bg-[#E5E7EB] transition-colors"
              >
                Load to Form
              </button>
            )}
          </div>

          {!previewPlayer ? (
            <p className="mt-4 text-sm text-[#6B7280]">Select a player from the list to inspect the profile.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                {previewPlayer.photoUrl ? (
                  <img src={previewPlayer.photoUrl} alt={getPlayerName(previewPlayer)} className="w-16 h-16 rounded-2xl object-cover border border-[#E5E7EB]" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] flex items-center justify-center text-white text-lg font-black">
                    {getPlayerName(previewPlayer).split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-[#0F1729]">{getPlayerName(previewPlayer)}</h3>
                  <p className="mt-1 text-sm text-[#64748B]">
                    {previewPlayer.clubName || clubMap.get(previewPlayer.clubId) || previewPlayer.clubId || 'Club missing'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`badge ${getPositionBadgeClass(previewPlayer.position)}`}>{previewPlayer.position || '-'}</span>
                    <span className="badge bg-[#F8FAFC] text-[#334155]">No. {previewPlayer.number ?? '-'}</span>
                    <span className="badge bg-[#F8FAFC] text-[#334155]">{previewPlayer.nationality || 'Nationality missing'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Birth Year</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F1729]">{getBirthYear(previewPlayer.birthDate)}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Birth Date</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F1729]">{previewPlayer.birthDate || '-'}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Age</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F1729]">{getDerivedAge(previewPlayer) ?? '-'}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Market Value</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F1729]">{formatValue(previewPlayer.marketValueEur)}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Height</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F1729]">{previewPlayer.heightCm ? `${previewPlayer.heightCm} cm` : '-'}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Weight</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F1729]">{previewPlayer.weightKg ? `${previewPlayer.weightKg} kg` : '-'}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Source</p>
                <p className="mt-2 text-sm text-[#0F1729]">{previewPlayer.sourceNote || 'Source note is missing.'}</p>
                {previewPlayer.sourceUrl && (
                  <a href={previewPlayer.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]">
                    Open source link
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="card p-4 md:p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-black">{isEditMode ? 'Edit Player' : 'Create Player'}</h2>
              <p className="mt-1 text-sm text-[#64748B]">This form matches the admin backend payload.</p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] text-[#334155] hover:bg-[#E5E7EB] transition-colors"
            >
              Reset
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#94A3B8]">Identity</h3>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Club</label>
                {clubs.length > 0 ? (
                  <select className="input-field" value={form.clubId} onChange={event => setForm(prev => ({ ...prev, clubId: event.target.value }))} required>
                    <option value="">Select club</option>
                    {clubs.map((club, index) => (
                      <option key={club.id || `club-form-option-${index}`} value={club.id}>
                        {club.name || club.shortName || club.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input className="input-field" placeholder="Club ID" value={form.clubId} onChange={event => setForm(prev => ({ ...prev, clubId: event.target.value }))} required />
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">First Name</label>
                  <input className="input-field" value={form.firstName} onChange={event => setForm(prev => ({ ...prev, firstName: event.target.value }))} required />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Last Name</label>
                  <input className="input-field" value={form.lastName} onChange={event => setForm(prev => ({ ...prev, lastName: event.target.value }))} required />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#94A3B8]">Squad Data</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Number</label>
                  <input type="number" min={1} className="input-field" value={form.number} onChange={event => setForm(prev => ({ ...prev, number: event.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Position</label>
                  <select className="input-field" value={form.position} onChange={event => setForm(prev => ({ ...prev, position: event.target.value }))} required>
                    <option value="">Select</option>
                    <option value="GK">GK</option>
                    <option value="DF">DF</option>
                    <option value="MF">MF</option>
                    <option value="FW">FW</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Nationality</label>
                <input className="input-field" value={form.nationality} onChange={event => setForm(prev => ({ ...prev, nationality: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Birth Date</label>
                <input type="date" className="input-field" value={form.birthDate} onChange={event => setForm(prev => ({ ...prev, birthDate: event.target.value }))} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#94A3B8]">Physical and Value</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Height (cm)</label>
                  <input type="number" min={0} className="input-field" value={form.heightCm} onChange={event => setForm(prev => ({ ...prev, heightCm: event.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Weight (kg)</label>
                  <input type="number" min={0} className="input-field" value={form.weightKg} onChange={event => setForm(prev => ({ ...prev, weightKg: event.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Age</label>
                  <input type="number" min={0} className="input-field" value={form.ageYears} onChange={event => setForm(prev => ({ ...prev, ageYears: event.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Market Value (EUR)</label>
                  <input type="number" min={0} className="input-field" value={form.marketValueEur} onChange={event => setForm(prev => ({ ...prev, marketValueEur: event.target.value }))} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#94A3B8]">Media and Source</h3>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Photo URL</label>
                <input className="input-field" value={form.photoUrl} onChange={event => setForm(prev => ({ ...prev, photoUrl: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Source URL</label>
                <input className="input-field" value={form.sourceUrl} onChange={event => setForm(prev => ({ ...prev, sourceUrl: event.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Source Note</label>
                <textarea className="input-field min-h-[92px] resize-y" value={form.sourceNote} onChange={event => setForm(prev => ({ ...prev, sourceNote: event.target.value }))} />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-lg font-semibold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving...' : isEditMode ? 'Update Player' : 'Create Player'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
