/* Shared UI primitives: icons, stars, badges, toasts, modal, reveal */
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

/* ---------------------------- Icon set (inline SVG) ---------------------------- */
const paths: Record<string, React.ReactNode> = {
  search: <path d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />,
  heart: <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2.6 4.5 6.2 4.5c2 0 3.5 1 4.6 2.6l1.2 1.7 1.2-1.7c1.1-1.6 2.6-2.6 4.6-2.6 3.6 0 5.7 3.5 4.2 7.2C19.5 16.3 12 21 12 21z" />,
  bed: <path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M3 18v2m18-2v2M6 10V7a2 2 0 012-2h8a2 2 0 012 2v3" />,
  bath: <path d="M4 12h16a1 1 0 011 1c0 3.5-2.5 6-6 6h-6c-3.5 0-6-2.5-6-6a1 1 0 011-1zM6 12V5a2 2 0 014 0M8 19l-1 2m10-2l1 2" />,
  car: <path d="M5 13l1.5-4.5A2 2 0 018.4 7h7.2a2 2 0 011.9 1.5L19 13m-14 0h14m-14 0a2 2 0 00-2 2v3h2m14-5a2 2 0 012 2v3h-2m-12 0v1.5m0-1.5h10m0 0v1.5M8 15.5h.01M16 15.5h.01" />,
  area: <path d="M4 4h16v16H4zM4 9h5V4m6 16v-5h5" />,
  pin: <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />,
  star: <path d="M12 2l3 6.3 7 .9-5.1 4.8 1.3 6.8L12 17.5 5.8 20.8l1.3-6.8L2 9.2l7-.9L12 2z" />,
  sun: <path d="M12 17a5 5 0 100-10 5 5 0 000 10zm0-15v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4m0-14.2l-1.4 1.4M6.3 17.7l-1.4 1.4" />,
  moon: <path d="M21 12.8A8.5 8.5 0 1111.2 3 6.6 6.6 0 0021 12.8z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M4 12.5l5 5L20 6.5" />,
  chevL: <path d="M15 5l-7 7 7 7" />,
  chevR: <path d="M9 5l7 7-7 7" />,
  calendar: <path d="M7 3v3m10-3v3M4 8h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />,
  user: <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm-8 9c0-3.9 3.6-6.5 8-6.5s8 2.6 8 6.5" />,
  logout: <path d="M15 12H4m0 0l3.5-3.5M4 12l3.5 3.5M10 4h8a2 2 0 012 2v12a2 2 0 01-2 2h-8" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" />,
  home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
  building: <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M3 21h18M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2" />,
  phone: <path d="M4 5c0 8.3 6.7 15 15 15l2-4-4.5-2-2 1.5A11.5 11.5 0 018.5 9.5L10 7.5 8 3 4 5z" />,
  mail: <path d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zm0 1l8 6 8-6" />,
  bell: <path d="M18 9a6 6 0 10-12 0c0 6-2 7-2 7h16s-2-1-2-7zm-4.7 10a2 2 0 01-2.6 0" />,
  chart: <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />,
  users: <path d="M16 21v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1m20 0v-1a4 4 0 00-3-3.87M15 3.13A4 4 0 0115 11M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
  shield: <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />,
  spark: <path d="M12 2l2.1 6.4L21 10l-6.9 1.6L12 18l-2.1-6.4L3 10l6.9-1.6L12 2zM19 15l.9 2.6L23 18l-3.1.7L19 22l-.9-3.3L15 18l3.1-.4L19 15z" />,
  doc: <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zm0 0v5h5M9 13h6M9 17h6" />,
  trend: <path d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />,
  settings: <path d="M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1.2l2.1-1.6-2-3.4-2.5 1a7.6 7.6 0 00-2-1.2L14.5 3h-5l-.4 2.6a7.6 7.6 0 00-2 1.2l-2.5-1-2 3.4 2.1 1.6a7.4 7.4 0 000 2.4L2.6 14.8l2 3.4 2.5-1a7.6 7.6 0 002 1.2l.4 2.6h5l.4-2.6a7.6 7.6 0 002-1.2l2.5 1 2-3.4-2.1-1.6c.07-.4.1-.8.1-1.2z" />,
  key: <path d="M21 2l-2 2m-5.6 5.6a5 5 0 11-7 7 5 5 0 017-7zm0 0L19 4m-3 3l2 2" />,
  eye: <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zm10 3a3 3 0 100-6 3 3 0 000 6z" />,
};

export function Icon({ name, className = 'h-5 w-5', filled = false }: { name: keyof typeof paths | string; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/* ---------------------------- Star rating ---------------------------- */
export function Stars({ rating, className = 'h-4 w-4' }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" filled className={`${className} ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
      ))}
    </span>
  );
}

/* ---------------------------- Status badge ---------------------------- */
const badgeColors: Record<string, string> = {
  'For Sale': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  'For Rent': 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  Sold: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  Rented: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  PENDING: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  CONFIRMED: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  COMPLETED: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  CANCELLED: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  OPEN: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  RESPONDED: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  CLOSED: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  ADMIN: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  AGENT: 'bg-brand-500/15 text-brand-600 dark:text-brand-300',
  CUSTOMER: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};
export function Badge({ label }: { label: string }) {
  return <span className={`chip ${badgeColors[label] ?? 'bg-slate-500/15 text-slate-600 dark:text-slate-300'}`}>{label}</span>;
}

/* ---------------------------- Toast stack ---------------------------- */
export function ToastStack() {
  const { toasts } = useApp();
  const colors = {
    success: 'border-emerald-400/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200',
    error: 'border-rose-400/40 bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200',
    info: 'border-sky-400/40 bg-sky-50 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200',
  };
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} role="status"
          className={`anim-fade-up pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur ${colors[t.type]}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- Modal ---------------------------- */
export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="anim-fade-in absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="anim-fade-up card relative w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------------------- Reveal on scroll ---------------------------- */
export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${shown ? 'revealed' : ''} ${className}`}>
      {children}
    </div>
  );
}

/* ---------------------------- Skeletons ---------------------------- */
export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-8 w-1/3" />
      </div>
    </div>
  );
}

/* ---------------------------- Stat card ---------------------------- */
export function StatCard({ icon, label, value, sub, color = 'from-brand-500 to-indigo-500' }: {
  icon: string; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs font-medium text-emerald-500">{sub}</p>}
      </div>
    </div>
  );
}
