import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createClub, fetchClubs } from '@/admin/api';
import { navigateTo } from '@/admin/router';
import type { ClubItem, ClubPayload } from '@/admin/types';

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

export function ClubsAdminPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<ClubFormState>(EMPTY_FORM);

  const visibleClubs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...clubs]
      .filter(club => {
        if (!query) {
          return true;
        }

        const haystack = [
          club.name,
          club.shortName,
          club.city,
          club.stadium,
          club.coachName,
          club.founded ? String(club.founded) : '',
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      })
      .sort((left, right) => (left.name || '').localeCompare(right.name || '', undefined, { sensitivity: 'base' }));
  }, [clubs, searchQuery]);

  const stats = useMemo(() => {
    const withFounded = clubs.filter(club => club.founded !== null && club.founded !== undefined).length;
    const withStadium = clubs.filter(club => Boolean(club.stadium)).length;
    const withCoach = clubs.filter(club => Boolean(club.coachName)).length;

    return {
      total: clubs.length,
      withFounded,
      withStadium,
      withCoach,
    };
  }, [clubs]);

  const loadClubs = async () => {
    setError('');
    setLoading(true);

    try {
      const data = await fetchClubs();
      setClubs(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClubs();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
  };

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
      await createClub(payload);
      setMessage('Club created.');
      resetForm();
      await loadClubs();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save club');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_0.95fr] gap-4 md:gap-6 animate-in">
      <div className="space-y-4 md:space-y-6">
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Clubs</p>
            <p className="mt-2 text-2xl font-black text-[#0F1729]">{stats.total}</p>
            <p className="mt-2 text-sm text-[#64748B]">Loaded from backend and DB.</p>
          </div>
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Founded Years</p>
            <p className="mt-2 text-2xl font-black text-[#0F1729]">{stats.withFounded}</p>
            <p className="mt-2 text-sm text-[#64748B]">Clubs with a recorded foundation year.</p>
          </div>
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Stadiums</p>
            <p className="mt-2 text-2xl font-black text-[#0F1729]">{stats.withStadium}</p>
            <p className="mt-2 text-sm text-[#64748B]">Clubs with stadium info available.</p>
          </div>
          <div className="card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Coaches</p>
            <p className="mt-2 text-2xl font-black text-[#0F1729]">{stats.withCoach}</p>
            <p className="mt-2 text-sm text-[#64748B]">Clubs that already have coach data.</p>
          </div>
        </section>

        <section className="card p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
            <div>
              <h2 className="text-lg font-black">Clubs Directory</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Search clubs and open a dedicated club page to edit stadium, founded year, coach, and branding.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                className="input-field min-w-[240px] md:w-[280px]"
                placeholder="Search by club, city, stadium, coach"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />
              <button
                type="button"
                onClick={() => void loadClubs()}
                disabled={loading}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] hover:bg-[#E5E7EB] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
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
            <p className="text-sm text-[#6B7280]">Loading clubs...</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
              <table className="data-table min-w-[980px]">
                <thead>
                  <tr>
                    <th>Club</th>
                    <th>Short</th>
                    <th>City</th>
                    <th>Stadium</th>
                    <th>Founded</th>
                    <th>Coach</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleClubs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-[#6B7280]">
                        No clubs found
                      </td>
                    </tr>
                  )}
                  {visibleClubs.map((club, index) => (
                    <tr key={club.id || `club-${index}`}>
                      <td>
                        <button
                          type="button"
                          onClick={() => navigateTo(`/admin/clubs/${encodeURIComponent(club.id)}`)}
                          className="flex items-center gap-3 text-left hover:text-[#0A1628]"
                        >
                          <div
                            className="club-logo"
                            style={{ background: club.primaryColor || 'linear-gradient(135deg, #F5C742, #E8A912)' }}
                          >
                            {getClubInitials(club)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0F1729]">{club.name || '-'}</p>
                            <p className="text-xs text-[#64748B]">Open full club page</p>
                          </div>
                        </button>
                      </td>
                      <td>{club.shortName || '-'}</td>
                      <td>{club.city || '-'}</td>
                      <td>{club.stadium || '-'}</td>
                      <td>{club.founded ?? '-'}</td>
                      <td>{club.coachName || '-'}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => navigateTo(`/admin/clubs/${encodeURIComponent(club.id)}`)}
                          className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#0A1628] text-white hover:bg-[#142238] transition-colors"
                        >
                          Open
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

      <section className="card p-4 md:p-5 self-start">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-black">Create Club</h2>
            <p className="mt-1 text-sm text-[#64748B]">Existing clubs are edited from their own detail page.</p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] text-[#334155] hover:bg-[#E5E7EB] transition-colors"
          >
            Reset
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
              className="input-field min-h-[100px] resize-y"
              value={form.coachInfo}
              onChange={event => setForm(prev => ({ ...prev, coachInfo: event.target.value }))}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg font-semibold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving...' : 'Create Club'}
          </button>
        </form>
      </section>
    </div>
  );
}
