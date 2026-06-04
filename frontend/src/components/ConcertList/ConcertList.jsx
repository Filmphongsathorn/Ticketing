/**
 * ConcertList.jsx
 * ---------------------------------------------------------------------------
 * Fetches upcoming concerts from GET /api/events (via the Axios instance)
 * and renders them in a responsive Tailwind grid.
 *
 * States handled:
 *  • loading  → skeleton cards (shimmer animation)
 *  • error    → error banner with retry button
 *  • empty    → friendly empty state
 *  • success  → responsive grid of ConcertCard
 * ---------------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../../api/api';
import ConcertCard from './ConcertCard';
import ErrorBanner from '../ui/ErrorBanner';
import Spinner from '../ui/Spinner';

// ─── Skeleton card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-stage-border bg-stage-card overflow-hidden animate-pulse">
      <div className="h-44 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 skeleton rounded-full" />
        <div className="h-5 w-3/4 skeleton rounded-lg" />
        <div className="h-4 w-1/2 skeleton rounded" />
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-7 w-16 skeleton rounded" />
          <div className="h-10 w-28 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Filter / sort bar ───────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'date_asc',   label: 'Date ↑' },
  { value: 'date_desc',  label: 'Date ↓' },
  { value: 'price_asc',  label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
];

function sortEvents(events, sortKey) {
  const sorted = [...events];
  switch (sortKey) {
    case 'date_asc':   return sorted.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    case 'date_desc':  return sorted.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
    case 'price_asc':  return sorted.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0));
    case 'price_desc': return sorted.sort((a, b) => (b.minPrice ?? 0) - (a.minPrice ?? 0));
    default:           return sorted;
  }
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function ConcertList() {
  const navigate = useNavigate();

  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');
  const [sortKey,  setSortKey]  = useState('date_asc');

  // ── Data fetching ──────────────────────────────────────────────────────────
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchEvents();
      // Gateway may return { content: [...] } (Page) or a plain array
      const list = Array.isArray(data) ? data : (data.content ?? []);
      setEvents(list);
    } catch (err) {
      setError(err.message ?? 'Failed to load concerts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  // ── Derived display list ──────────────────────────────────────────────────
  const displayEvents = sortEvents(
    events.filter((e) => {
      const q = search.toLowerCase();
      return (
        e.name?.toLowerCase().includes(q)   ||
        e.artist?.toLowerCase().includes(q) ||
        e.venue?.name?.toLowerCase().includes(q) ||
        e.venue?.city?.toLowerCase().includes(q)
      );
    }),
    sortKey,
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectEvent = (event) => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* ── Controls row ── */}
      <div className="mx-auto mb-10 max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"/>
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artist, venue, city…"
            aria-label="Search concerts"
            className="
              w-full rounded-full border border-white/10
              bg-white/5 pl-12 pr-4 py-3
              text-sm text-white placeholder-gray-400
              outline-none backdrop-blur-md
              focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50
              transition-all
            "
          />
        </div>

        {/* Sort + count */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-medium hidden sm:block">
            {loading ? '—' : `${displayEvents.length} event${displayEvents.length !== 1 ? 's' : ''}`}
          </span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Sort concerts"
            className="
              rounded-full border border-white/10 bg-white/5
              px-4 py-3 text-sm text-white font-medium
              outline-none focus:border-indigo-500/50
              cursor-pointer backdrop-blur-md transition-all
              appearance-none pr-10 relative
            "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.2em'
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-gray-900 text-white">{o.label}</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={loadEvents}
            disabled={loading}
            aria-label="Refresh concerts"
            className="
              rounded-full border border-white/10 bg-white/5
              p-3 text-gray-400
              hover:border-indigo-500/50 hover:text-indigo-400
              transition-all disabled:opacity-40 backdrop-blur-md
            "
          >
            <svg className={`h-5 w-5 ${loading ? 'animate-spin_slow' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Error state */}
        {error && !loading && (
          <div className="mb-6">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
            <button
              onClick={loadEvents}
              className="
                mt-4 rounded-full border border-indigo-500/50
                bg-indigo-500/10 px-6 py-3
                text-sm font-bold text-indigo-400
                hover:bg-indigo-600 hover:text-white
                transition-all duration-300
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading skeleton grid */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && displayEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full border border-white/10 bg-white/5 p-6">
              <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <h3 className="font-bold text-2xl text-white">
              {search ? 'No results found' : 'No upcoming events'}
            </h3>
            <p className="mt-2 text-gray-400 max-w-xs">
              {search
                ? `Nothing matched "${search}". Try a different search.`
                : 'Check back soon — new shows are added regularly.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-6 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Event grid */}
        {!loading && !error && displayEvents.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayEvents.map((event, idx) => (
              <ConcertCard
                key={event.id}
                event={event}
                onSelect={handleSelectEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
