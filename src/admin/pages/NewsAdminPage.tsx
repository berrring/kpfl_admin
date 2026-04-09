import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createNews, fetchClubs, fetchNews, fetchPlayersBasic, updateNews } from '@/admin/api';
import type { ClubItem, NewsItem, NewsPayload, PlayerItem } from '@/admin/types';

interface NewsFormState {
  title: string;
  shortText: string;
  publishedAt: string;
  tag: string;
  clubId: string;
  playerId: string;
}

const EMPTY_FORM: NewsFormState = {
  title: '',
  shortText: '',
  publishedAt: '',
  tag: '',
  clubId: '',
  playerId: '',
};

const TAGS = [
  { value: 'TRANSFER', label: 'TRANSFER' },
  { value: 'MATCHDAY', label: 'MATCHDAY' },
  { value: 'INJURY', label: 'INJURY' },
  { value: 'OFFICIAL', label: 'OFFICIAL' },
  { value: 'OTHER', label: 'OTHER' },
];

export function NewsAdminPage() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsFormState>(EMPTY_FORM);

  const isEditMode = editingNewsId !== null;

  const clubMap = useMemo(() => {
    const map = new Map<string, string>();
    clubs.forEach(club => {
      map.set(club.id, club.name || club.shortName || club.id);
    });
    return map;
  }, [clubs]);

  const playerMap = useMemo(() => {
    const map = new Map<string, string>();
    players.forEach(player => {
      map.set(player.id, [player.firstName, player.lastName].filter(Boolean).join(' ') || player.id);
    });
    return map;
  }, [players]);

  const loadData = async () => {
    setError('');
    setLoading(true);
    try {
      const [clubsData, newsData, playersData] = await Promise.all([
        fetchClubs(),
        fetchNews(50),
        fetchPlayersBasic(),
      ]);
      setClubs(clubsData);
      setNews(newsData);
      setPlayers(playersData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => {
    setEditingNewsId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setForm({
      title: item.title || '',
      shortText: item.summary || '',
      publishedAt: item.date ? item.date.slice(0, 16) : '',
      tag: item.tag || '',
      clubId: item.clubId || '',
      playerId: item.playerId || '',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const publishedAt = form.publishedAt.length === 16 ? `${form.publishedAt}:00` : form.publishedAt;
    const payload: NewsPayload = {
      title: form.title.trim(),
      shortText: form.shortText.trim() || undefined,
      publishedAt,
      tag: form.tag,
      clubId: form.clubId || undefined,
      playerId: form.playerId || undefined,
    };

    try {
      if (isEditMode && editingNewsId) {
        await updateNews(editingNewsId, payload);
      } else {
        await createNews(payload);
      }
      resetForm();
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save news');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-4 md:gap-6 animate-in">
      <section className="card p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black">News</h2>
          <button
            onClick={() => void loadData()}
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
          <p className="text-sm text-[#6B7280]">Loading news...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
            <table className="data-table min-w-[960px]">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tag</th>
                  <th>Date</th>
                  <th>Club</th>
                  <th>Player</th>
                  <th>Summary</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {news.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-[#6B7280]">
                      No news found
                    </td>
                  </tr>
                )}
                {news.map((item, index) => (
                  <tr key={item.id || `news-${index}`}>
                    <td className="font-semibold text-[#0F1729]">{item.title || '-'}</td>
                    <td>{item.tag || '-'}</td>
                    <td>{item.date ? item.date.slice(0, 16).replace('T', ' ') : '-'}</td>
                    <td>{item.clubName || (item.clubId ? clubMap.get(item.clubId) || item.clubId : '-')}</td>
                    <td>{item.playerName || (item.playerId ? playerMap.get(item.playerId) || item.playerId : '-')}</td>
                    <td className="max-w-[240px] truncate">{item.summary || '-'}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleEdit(item)}
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
        <h2 className="text-lg font-black mb-4">{isEditMode ? 'Edit News' : 'Create News'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Title</label>
            <input
              className="input-field"
              value={form.title}
              onChange={event => setForm(prev => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Short Text</label>
            <textarea
              className="input-field min-h-[86px] resize-y"
              value={form.shortText}
              onChange={event => setForm(prev => ({ ...prev, shortText: event.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Published At</label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.publishedAt}
                onChange={event => setForm(prev => ({ ...prev, publishedAt: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Tag</label>
              <select
                className="input-field"
                value={form.tag}
                onChange={event => setForm(prev => ({ ...prev, tag: event.target.value }))}
                required
              >
                <option value="">Select</option>
                {TAGS.map(tag => (
                  <option key={tag.value} value={tag.value}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Club (optional)</label>
            <select
              className="input-field"
              value={form.clubId}
              onChange={event => setForm(prev => ({ ...prev, clubId: event.target.value }))}
            >
              <option value="">Not linked to club</option>
              {clubs.map((club, index) => (
                <option key={club.id || `news-club-${index}`} value={club.id}>
                  {club.name || club.shortName || club.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Player (optional)</label>
            <select
              className="input-field"
              value={form.playerId}
              onChange={event => setForm(prev => ({ ...prev, playerId: event.target.value }))}
            >
              <option value="">Not linked to player</option>
              {players.map((player, index) => (
                <option key={player.id || `news-player-${index}`} value={player.id}>
                  {[player.firstName, player.lastName].filter(Boolean).join(' ') || player.id}
                </option>
              ))}
            </select>
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
