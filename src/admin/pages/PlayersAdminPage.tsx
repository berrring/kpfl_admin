import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPlayer, fetchClubs, fetchPlayers, updatePlayer } from '@/admin/api';
import type { ClubItem, PlayerItem, PlayerPayload } from '@/admin/types';

interface PlayerFormState {
  clubId: string;
  firstName: string;
  lastName: string;
  number: string;
  position: string;
  nationality: string;
  birthDate: string;
}

const EMPTY_FORM: PlayerFormState = {
  clubId: '',
  firstName: '',
  lastName: '',
  number: '',
  position: '',
  nationality: '',
  birthDate: '',
};

export function PlayersAdminPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('all');
  const [form, setForm] = useState<PlayerFormState>(EMPTY_FORM);

  const isEditMode = editingPlayerId !== null;

  const clubMap = useMemo(() => {
    const map = new Map<string, string>();
    clubs.forEach(club => {
      map.set(club.id, club.name || club.shortName || club.id);
    });
    return map;
  }, [clubs]);

  const filteredPlayers = useMemo(() => {
    if (selectedClubFilter === 'all') {
      return players;
    }
    return players.filter(player => player.clubId === selectedClubFilter);
  }, [players, selectedClubFilter]);

  const loadData = async () => {
    setError('');
    setLoading(true);
    try {
      const [clubsData, playersData] = await Promise.all([fetchClubs(), fetchPlayers()]);
      setClubs(clubsData);
      setPlayers(playersData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => {
    setEditingPlayerId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (player: PlayerItem) => {
    setEditingPlayerId(player.id);
    setForm({
      clubId: player.clubId || '',
      firstName: player.firstName || '',
      lastName: player.lastName || '',
      number: player.number !== null && player.number !== undefined ? String(player.number) : '',
      position: player.position || '',
      nationality: player.nationality || '',
      birthDate: player.birthDate || '',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload: PlayerPayload = {
      clubId: form.clubId,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      position: form.position.trim(),
      number: form.number ? Number(form.number) : null,
      nationality: form.nationality.trim() || undefined,
      birthDate: form.birthDate || undefined,
    };

    try {
      if (isEditMode && editingPlayerId) {
        await updatePlayer(editingPlayerId, payload);
      } else {
        await createPlayer(payload);
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
      <section className="card p-4 md:p-5">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <h2 className="text-lg font-black">Players</h2>
          <div className="flex items-center gap-2">
            <select
              value={selectedClubFilter}
              onChange={event => setSelectedClubFilter(event.target.value)}
              className="px-3 py-2 rounded-lg border border-[#D1D5DB] bg-white text-sm"
            >
              <option value="all">All clubs</option>
              {clubs.map((club, index) => (
                <option key={club.id || `club-option-${index}`} value={club.id}>
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
          <p className="text-sm text-[#6B7280]">Loading players...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
            <table className="data-table min-w-[860px]">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Club</th>
                  <th>№</th>
                  <th>Position</th>
                  <th>Nationality</th>
                  <th>Birth Date</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-[#6B7280]">
                      No players found
                    </td>
                  </tr>
                )}
                {filteredPlayers.map((player, index) => (
                  <tr key={player.id || `player-${index}`}>
                    <td className="font-semibold text-[#0F1729]">
                      {[player.firstName, player.lastName].filter(Boolean).join(' ') || '-'}
                    </td>
                    <td>{player.clubName || clubMap.get(player.clubId) || player.clubId || '-'}</td>
                    <td>{player.number ?? '-'}</td>
                    <td>{player.position || '-'}</td>
                    <td>{player.nationality || '-'}</td>
                    <td>{player.birthDate || '-'}</td>
                    <td className="text-right">
                      <button
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

      <section className="card p-4 md:p-5">
        <h2 className="text-lg font-black mb-4">{isEditMode ? 'Edit Player' : 'Create Player'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Club</label>
            {clubs.length > 0 ? (
              <select
                className="input-field"
                value={form.clubId}
                onChange={event => setForm(prev => ({ ...prev, clubId: event.target.value }))}
                required
              >
                <option value="">Select club</option>
                {clubs.map((club, index) => (
                  <option key={club.id || `club-form-option-${index}`} value={club.id}>
                    {club.name || club.shortName || club.id}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input-field"
                placeholder="Club ID"
                value={form.clubId}
                onChange={event => setForm(prev => ({ ...prev, clubId: event.target.value }))}
                required
              />
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">First Name</label>
            <input
              className="input-field"
              value={form.firstName}
              onChange={event => setForm(prev => ({ ...prev, firstName: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Last Name</label>
            <input
              className="input-field"
              value={form.lastName}
              onChange={event => setForm(prev => ({ ...prev, lastName: event.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Number</label>
              <input
                type="number"
                min={1}
                className="input-field"
                value={form.number}
                onChange={event => setForm(prev => ({ ...prev, number: event.target.value }))}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Position</label>
              <select
                className="input-field"
                value={form.position}
                onChange={event => setForm(prev => ({ ...prev, position: event.target.value }))}
                required
              >
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
            <input
              className="input-field"
              value={form.nationality}
              onChange={event => setForm(prev => ({ ...prev, nationality: event.target.value }))}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Birth Date</label>
            <input
              type="date"
              className="input-field"
              value={form.birthDate}
              onChange={event => setForm(prev => ({ ...prev, birthDate: event.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#F4F6F8] text-[#4B5563] hover:bg-[#E5E7EB] transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
