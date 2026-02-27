import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createClub, fetchClubs, updateClub } from '@/admin/api';
import type { ClubItem, ClubPayload } from '@/admin/types';

interface ClubFormState {
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  founded: string;
}

const EMPTY_FORM: ClubFormState = {
  name: '',
  shortName: '',
  city: '',
  stadium: '',
  founded: '',
};

export function ClubsAdminPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [form, setForm] = useState<ClubFormState>(EMPTY_FORM);

  const isEditMode = useMemo(() => editingClubId !== null, [editingClubId]);

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
    setEditingClubId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (club: ClubItem) => {
    setEditingClubId(club.id);
    setForm({
      name: club.name ?? '',
      shortName: club.shortName ?? '',
      city: club.city ?? '',
      stadium: club.stadium ?? '',
      founded: club.founded ? String(club.founded) : '',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload: ClubPayload = {
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      city: form.city.trim(),
      stadium: form.stadium.trim(),
      founded: form.founded ? Number(form.founded) : null,
    };

    try {
      if (isEditMode && editingClubId) {
        await updateClub(editingClubId, payload);
      } else {
        await createClub(payload);
      }

      resetForm();
      await loadClubs();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save club');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 md:gap-6 animate-in">
      <section className="card p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black">Clubs</h2>
          <button
            onClick={() => void loadClubs()}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#F4F6F8] hover:bg-[#E5E7EB] transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-[#6B7280]">Loading clubs...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
            <table className="data-table min-w-[680px]">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Short</th>
                  <th>City</th>
                  <th>Stadium</th>
                  <th>Founded</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {clubs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-[#6B7280]">
                      No clubs found
                    </td>
                  </tr>
                )}
                {clubs.map((club, index) => (
                  <tr key={club.id || `club-${index}`}>
                    <td className="font-semibold text-[#0F1729]">{club.name || '-'}</td>
                    <td>{club.shortName || '-'}</td>
                    <td>{club.city || '-'}</td>
                    <td>{club.stadium || '-'}</td>
                    <td>{club.founded ?? '-'}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleEdit(club)}
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
        <h2 className="text-lg font-black mb-4">{isEditMode ? 'Edit Club' : 'Create Club'}</h2>
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
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Stadium</label>
            <input
              className="input-field"
              value={form.stadium}
              onChange={event => setForm(prev => ({ ...prev, stadium: event.target.value }))}
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
