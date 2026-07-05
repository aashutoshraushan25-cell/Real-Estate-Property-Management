/* Reusable property card — grid & list variants with favorite toggle */
import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { agentById, money } from '../data/db';
import { useApp } from '../context/AppContext';
import { Badge, Icon } from './ui';

export function PropertyCard({ p, variant = 'grid' }: { p: Property; variant?: 'grid' | 'list' }) {
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(p.id);
  const agent = agentById(p.agentId);

  const facts = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
      {p.bedrooms > 0 && <span className="flex items-center gap-1.5"><Icon name="bed" className="h-4 w-4 text-brand-500" />{p.bedrooms} Beds</span>}
      {p.bathrooms > 0 && <span className="flex items-center gap-1.5"><Icon name="bath" className="h-4 w-4 text-brand-500" />{p.bathrooms} Baths</span>}
      {p.parking > 0 && <span className="flex items-center gap-1.5"><Icon name="car" className="h-4 w-4 text-brand-500" />{p.parking} Parking</span>}
      <span className="flex items-center gap-1.5"><Icon name="area" className="h-4 w-4 text-brand-500" />{p.area.toLocaleString()} sqft</span>
    </div>
  );

  const favBtn = (
    <button
      onClick={(e) => { e.preventDefault(); toggleFavorite(p.id); }}
      aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
      className={`absolute right-3 top-3 z-10 rounded-full p-2 shadow-lg backdrop-blur transition hover:scale-110 ${fav ? 'bg-rose-500 text-white' : 'bg-white/85 text-slate-500 hover:text-rose-500 dark:bg-slate-900/80'}`}>
      <Icon name="heart" filled={fav} className="h-4.5 w-4.5" />
    </button>
  );

  if (variant === 'list') {
    return (
      <Link to={`/properties/${p.id}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl sm:flex-row">
        <div className="relative sm:w-72 sm:shrink-0">
          <img src={p.images[0]} alt={p.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-full" />
          {favBtn}
          <div className="absolute left-3 top-3 flex gap-1.5"><Badge label={p.status} />{p.featured && <span className="chip bg-amber-500/90 text-white">★ Featured</span>}</div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-brand-600 dark:text-white">{p.title}</h3>
            <p className="whitespace-nowrap text-lg font-extrabold text-brand-600 dark:text-brand-300">{money(p.price, p.status)}</p>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Icon name="pin" className="h-3.5 w-3.5" />{p.address}, {p.city}, {p.state}</p>
          <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            {facts}
            {agent && <img src={agent.user.profileImage} alt={agent.user.name} title={agent.user.name} className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800" />}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/properties/${p.id}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1.5 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img src={p.images[0]} alt={p.title} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
        {favBtn}
        <div className="absolute left-3 top-3 flex gap-1.5"><Badge label={p.status} />{p.featured && <span className="chip bg-amber-500/90 text-white">★ Featured</span>}</div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-3 pt-8">
          <p className="text-lg font-extrabold text-white drop-shadow">{money(p.price, p.status)}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-bold text-slate-900 transition group-hover:text-brand-600 dark:text-white">{p.title}</h3>
          <span className="chip shrink-0 bg-slate-500/10 text-slate-500 dark:text-slate-400">{p.type}</span>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Icon name="pin" className="h-3.5 w-3.5 shrink-0" />{p.city}, {p.state}</p>
        <div className="mt-auto border-t border-slate-100 pt-3 dark:border-slate-800">{facts}</div>
      </div>
    </Link>
  );
}
