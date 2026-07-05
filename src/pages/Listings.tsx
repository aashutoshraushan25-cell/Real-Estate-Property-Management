/* Property listings — filters, sort, grid/list toggle, pagination.
 * All filter state is synced to the URL (shareable searches). */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, CITIES, STATUSES, TYPES } from '../data/db';
import type { Paginated, Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { CardSkeleton, Icon } from '../components/ui';

const priceRanges = [
  { label: 'Any price', min: 0, max: 0 },
  { label: 'Under $500k', min: 0, max: 500_000 },
  { label: '$500k – $1M', min: 500_000, max: 1_000_000 },
  { label: '$1M – $2M', min: 1_000_000, max: 2_000_000 },
  { label: 'Above $2M', min: 2_000_000, max: 0 },
  { label: 'Rentals under $3k/mo', min: 0, max: 3_000 },
  { label: 'Rentals $3k+/mo', min: 3_000, max: 20_000 },
];

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState<Paginated<Property> | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  /* read filters from URL */
  const filters = useMemo(() => ({
    q: params.get('q') ?? '',
    city: params.get('city') ?? 'All',
    type: params.get('type') ?? 'All',
    status: params.get('status') ?? 'All',
    priceIdx: Number(params.get('price') ?? 0),
    bedrooms: Number(params.get('beds') ?? 0),
    bathrooms: Number(params.get('baths') ?? 0),
    minArea: Number(params.get('area') ?? 0),
    sort: (params.get('sort') ?? 'newest') as 'newest' | 'price_asc' | 'price_desc' | 'area_desc',
    page: Number(params.get('page') ?? 1),
  }), [params]);

  const setFilter = (key: string, value: string, resetPage = true) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'All' || value === '0') next.delete(key); else next.set(key, value);
    if (resetPage) next.delete('page');
    setParams(next, { replace: true });
  };

  useEffect(() => {
    setLoading(true);
    const range = priceRanges[filters.priceIdx] ?? priceRanges[0];
    api.getProperties({
      q: filters.q || undefined,
      city: filters.city,
      type: filters.type,
      status: filters.status,
      minPrice: range.min || undefined,
      maxPrice: range.max || undefined,
      bedrooms: filters.bedrooms || undefined,
      bathrooms: filters.bathrooms || undefined,
      minArea: filters.minArea || undefined,
      sort: filters.sort,
      page: filters.page,
      pageSize: 6,
    }).then((r) => { setResult(r); setLoading(false); });
  }, [filters]);

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });
  const activeCount = ['q', 'city', 'type', 'status', 'price', 'beds', 'baths', 'area']
    .filter((k) => params.get(k)).length;

  const selectCls = 'input !py-2';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Property marketplace</p>
        <h1 className="section-title mt-1.5">Browse Properties</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {result ? `${result.total} listings found` : 'Loading listings…'}{filters.q && ` for “${filters.q}”`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* ---------------- filters sidebar ---------------- */}
        <aside className="card h-fit p-5 lg:sticky lg:top-24" aria-label="Filters">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white">Filters</h2>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs font-bold text-rose-500 hover:underline">Clear all ({activeCount})</button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Search</label>
              <div className="relative">
                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input defaultValue={filters.q} placeholder="Keyword, city…" aria-label="Keyword search"
                  onKeyDown={(e) => e.key === 'Enter' && setFilter('q', (e.target as HTMLInputElement).value)}
                  onBlur={(e) => setFilter('q', e.target.value)}
                  className="input !py-2 !pl-9" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">City</label>
              <select value={filters.city} onChange={(e) => setFilter('city', e.target.value)} className={selectCls}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Type</label>
              <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)} className={selectCls}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Status</label>
              <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={selectCls}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Price range</label>
              <select value={filters.priceIdx} onChange={(e) => setFilter('price', e.target.value)} className={selectCls}>
                {priceRanges.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Beds</label>
                <select value={filters.bedrooms} onChange={(e) => setFilter('beds', e.target.value)} className={selectCls}>
                  {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? 'Any' : `${n}+`}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Baths</label>
                <select value={filters.bathrooms} onChange={(e) => setFilter('baths', e.target.value)} className={selectCls}>
                  {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 0 ? 'Any' : `${n}+`}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Min area (sqft)</label>
              <select value={filters.minArea} onChange={(e) => setFilter('area', e.target.value)} className={selectCls}>
                {[0, 1000, 2000, 3000, 4000, 5000].map((n) => <option key={n} value={n}>{n === 0 ? 'Any' : `${n.toLocaleString()}+`}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* ---------------- results ---------------- */}
        <div>
          {/* toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-700">
              {(['grid', 'list'] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} aria-label={`${v} view`}
                  className={`rounded-lg p-2 transition ${view === v ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-brand-500'}`}>
                  <Icon name={v} className="h-4 w-4" />
                </button>
              ))}
            </div>
            <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value, false)}
              aria-label="Sort listings" className="input w-auto !py-2">
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: low → high</option>
              <option value="price_desc">Price: high → low</option>
              <option value="area_desc">Largest area</option>
            </select>
          </div>

          {/* cards */}
          {loading ? (
            <div className={view === 'grid' ? 'grid gap-6 sm:grid-cols-2' : 'space-y-5'}>
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : result && result.data.length > 0 ? (
            <div className={`anim-fade-in ${view === 'grid' ? 'grid gap-6 sm:grid-cols-2' : 'space-y-5'}`}>
              {result.data.map((p) => <PropertyCard key={p.id} p={p} variant={view} />)}
            </div>
          ) : (
            <div className="card flex flex-col items-center gap-3 p-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500"><Icon name="search" className="h-7 w-7" /></span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No properties match your filters</h3>
              <p className="text-sm text-slate-500">Try widening your price range or removing some filters.</p>
              <button onClick={clearAll} className="btn-primary mt-2">Reset filters</button>
            </div>
          )}

          {/* pagination */}
          {result && result.totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
              <button disabled={filters.page <= 1}
                onClick={() => setFilter('page', String(filters.page - 1), false)}
                className="btn-ghost !px-3 disabled:opacity-40"><Icon name="chevL" className="h-4 w-4" /></button>
              {Array.from({ length: result.totalPages }).map((_, i) => (
                <button key={i} onClick={() => setFilter('page', String(i + 1), false)}
                  aria-current={filters.page === i + 1 ? 'page' : undefined}
                  className={`h-10 w-10 rounded-xl text-sm font-bold transition ${filters.page === i + 1
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg'
                    : 'border border-slate-200 text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300'}`}>
                  {i + 1}
                </button>
              ))}
              <button disabled={filters.page >= result.totalPages}
                onClick={() => setFilter('page', String(filters.page + 1), false)}
                className="btn-ghost !px-3 disabled:opacity-40"><Icon name="chevR" className="h-4 w-4" /></button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
