import { FormEvent, useEffect, useMemo, useState } from 'react';
import { fetchClub, fetchPlayersBasic, updateClub } from '@/admin/api';
import { navigateTo } from '@/admin/router';
import type { ClubItem, ClubPayload, PlayerItem } from '@/admin/types';

interface ClubFormState {
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  founded: string;
  primaryColor: string;
  logoUrl: string;
  coachName: string;
  coachInfo: string;
}

const EMPTY_FORM: ClubFormState = {
  name: '',
  shortName: '',
  city: '',
  stadium: '',
  founded: '',
  primaryColor: '',
  logoUrl: '',
  coachName: '',
  coachInfo: '',
};

function getClubInitials(club: ClubItem): string {
  const source = club.shortName || club.name || 'CL';
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

function getPlayerName(player: PlayerItem): string {
  return [player.firstName, player.lastName].filter(Boolean).join(' ') || 'Unnamed player';
}

function createFormState(club: ClubItem): ClubFormState {
  return {
    name: club.name ?? '',
    shortName: club.shortName ?? '',
    city: club.city ?? '',
    stadium: club.stadium ?? '',
    founded: club.founded ? String(club.founded) : '',
    primaryColor: club.primaryColor ?? '',
    logoUrl: club.logoUrl ?? '',
    coachName: club.coachName ?? '',
    coachInfo: club.coachInfo ?? '',
  };
}

export function ClubDetailAdminPage({ clubId }: { clubId: string }) {
  const [club, setClub] = useState<ClubItem | null>(null);
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [form, setForm] = useState<ClubFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const roster = useMemo(() => {
    return [...players]
      .filter(player => player.clubId === clubId)
      .sort((left, right) => {
        const numberDelta = (left.number ?? Number.MAX_SAFE_INTEGER) - (right.number ?? Number.MAX_SAFE_INTEGER);
        if (numberDelta !== 0) {
          return numberDelta;
        }
        return getPlayerName(left).localeCompare(getPlayerName(right));
      });
  }, [clubId, players]);

  const loadClubData = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const [clubData, playersData] = await Promise.all([fetchClub(clubId), fetchPlayersBasic()]);
      setClub(clubData);
      setPlayers(playersData);
      setForm(createFormState(clubData));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load club details');
      setClub(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClubData();
  }, [clubId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    const payload: ClubPayload = {
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      city: form.city.trim(),
      stadium: form.stadium.trim(),
      founded: form.founded ? Number(form.founded) : null,
      primaryColor: form.primaryColor.trim() || undefined,
      logoUrl: form.logoUrl.trim() || undefined,
      coachName: form.coachName.trim() || undefined,
      coachInfo: form.coachInfo.trim() || undefined,
    };

    try {
      await updateClub(clubId, payload);
      setMessage('Club data updated.');
      await loadClubData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to update club');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigateTo('/admin/clubs')}
          className="px-3 py-2 rounded-lg text-sm font-semibold bg-white border border-[#D1D5DB] text-[#334155] hover:bg-[#F8FAFC] transition-colors"
        >
          Back to Clubs
        </button>
        <button
          type="button"
          onClick={() => void loadClubData()}
          disabled={loading}
          className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] text-[#334155] hover:bg-[#E5E7EB] disabled:opacity-60 transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh Club'}
        </button>
      </div>

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

      {loading ? (
        <section className="card p-5">
          <p className="text-sm text-[#64748B]">Loading club profile...</p>
        </section>
      ) : !club ? (
        <section className="card p-5">
          <h2 className="text-lg font-black">Club not found</h2>
          <p className="mt-2 text-sm text-[#64748B]">The backend did not return a club for ID {clubId}.</p>
        </section>
      ) : (
        <>
          <section className="card overflow-hidden">
            <div className="h-2" style={{ backgroundColor: club.primaryColor || '#E8A912' }} />
            <div className="p-4 md:p-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="club-logo w-16 h-16 text-lg"
                  style={{ background: club.primaryColor || 'linear-gradient(135deg, #F5C742, #E8A912)' }}
                >
                  {getClubInitials(club)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black">{club.name || 'Club'}</h2>
                    <span className="badge bg-[#EEF2FF] text-[#3730A3]">{club.shortName || 'No short name'}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#64748B]">
                    {[club.city, club.stadium].filter(Boolean).join(' · ') || 'City and stadium are not filled yet.'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="badge bg-[#F8FAFC] text-[#334155]">Founded {club.founded ?? '-'}</span>
                    <span className="badge bg-[#F8FAFC] text-[#334155]">Coach {club.coachName || '-'}</span>
                    <span className="badge bg-[#F8FAFC] text-[#334155]">Players {roster.length}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[420px]">
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">City</p>
                  <p className="mt-2 text-sm font-bold text-[#0F1729]">{club.city || '-'}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Stadium</p>
                  <p className="mt-2 text-sm font-bold text-[#0F1729]">{club.stadium || '-'}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Founded</p>
                  <p className="mt-2 text-sm font-bold text-[#0F1729]">{club.founded ?? '-'}</p>
                </div>
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Color</p>
                  <p className="mt-2 text-sm font-bold text-[#0F1729]">{club.primaryColor || '-'}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.95fr] gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6">
              <section className="card p-4 md:p-5">
                <h3 className="text-lg font-black">Current Club Data</h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Full Name</p>
                    <p className="mt-2 text-sm font-semibold text-[#0F1729]">{club.name || '-'}</p>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Short Name</p>
                    <p className="mt-2 text-sm font-semibold text-[#0F1729]">{club.shortName || '-'}</p>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Coach</p>
                    <p className="mt-2 text-sm font-semibold text-[#0F1729]">{club.coachName || '-'}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{club.coachInfo || 'Coach info is not filled yet.'}</p>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">Logo URL</p>
                    <p className="mt-2 break-all text-sm font-semibold text-[#0F1729]">{club.logoUrl || '-'}</p>
                  </div>
                </div>
              </section>

              <section className="card p-4 md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black">Linked Players</h3>
                    <p className="mt-1 text-sm text-[#64748B]">Players currently connected to this club in the backend.</p>
                  </div>
                  <span className="badge bg-[#F8FAFC] text-[#334155]">{roster.length} players</span>
                </div>

                <div className="mt-4 overflow-x-auto rounded-lg border border-[#E5E7EB]">
                  <table className="data-table min-w-[680px]">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Nationality</th>
                        <th>Birth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roster.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-[#6B7280]">
                            No players linked to this club yet
                          </td>
                        </tr>
                      )}
                      {roster.map((player, index) => (
                        <tr key={player.id || `club-roster-${index}`}>
                          <td>{player.number ?? '-'}</td>
                          <td className="font-semibold text-[#0F1729]">{getPlayerName(player)}</td>
                          <td>{player.position || '-'}</td>
                          <td>{player.nationality || '-'}</td>
                          <td>{player.birthDate || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <section className="card p-4 md:p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-black">Edit Club</h3>
                  <p className="mt-1 text-sm text-[#64748B]">All changes are sent to the backend and then reloaded from DB.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(createFormState(club))}
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] text-[#334155] hover:bg-[#E5E7EB] transition-colors"
                >
                  Reset Form
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Name</label>
                  <input
                    className="input-field"
                    value={form.name}
                    onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Short Name</label>
                  <input
                    className="input-field"
                    value={form.shortName}
                    onChange={event => setForm(prev => ({ ...prev, shortName: event.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">City</label>
                    <input
                      className="input-field"
                      value={form.city}
                      onChange={event => setForm(prev => ({ ...prev, city: event.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Founded Year</label>
                    <input
                      className="input-field"
                      type="number"
                      min={1800}
                      max={2100}
                      value={form.founded}
                      onChange={event => setForm(prev => ({ ...prev, founded: event.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Stadium</label>
                  <input
                    className="input-field"
                    value={form.stadium}
                    onChange={event => setForm(prev => ({ ...prev, stadium: event.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Primary Color</label>
                    <input
                      className="input-field"
                      placeholder="#0A1628"
                      value={form.primaryColor}
                      onChange={event => setForm(prev => ({ ...prev, primaryColor: event.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Logo URL</label>
                    <input
                      className="input-field"
                      value={form.logoUrl}
                      onChange={event => setForm(prev => ({ ...prev, logoUrl: event.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Coach Name</label>
                  <input
                    className="input-field"
                    value={form.coachName}
                    onChange={event => setForm(prev => ({ ...prev, coachName: event.target.value }))}
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Coach Info</label>
                  <textarea
                    className="input-field min-h-[110px] resize-y"
                    value={form.coachInfo}
                    onChange={event => setForm(prev => ({ ...prev, coachInfo: event.target.value }))}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Club Changes'}
                </button>
              </form>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
