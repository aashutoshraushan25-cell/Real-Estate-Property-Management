/* Site shell: sticky glass navbar (role-aware) + rich footer */
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Badge, Icon } from './ui';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties' },
  { to: '/agents', label: 'Agents' },
  { to: '/about', label: 'About' },
];

export function Navbar() {
  const { user, theme, toggleTheme, logout, notifications, markAllNotificationsRead } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.isRead && n.userId === user?.id).length;
  const myNotifs = notifications.filter((n) => n.userId === user?.id);

  const dashPath = user?.role === 'ADMIN' ? '/admin' : user?.role === 'AGENT' ? '/agent' : '/dashboard';

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30">
            <Icon name="home" className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Estate<span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">Hub</span>
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-semibold transition ${isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300'
                  : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle dark mode"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-4.5 w-4.5" />
          </button>

          {/* notifications */}
          {user && (
            <div className="relative">
              <button onClick={() => { setNotifOpen((o) => !o); if (!notifOpen) markAllNotificationsRead(); }}
                aria-label="Notifications"
                className="relative rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300">
                <Icon name="bell" className="h-4.5 w-4.5" />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">{unread}</span>
                )}
              </button>
              {notifOpen && (
                <div className="anim-fade-up card absolute right-0 top-12 w-80 p-3">
                  <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-400">Notifications</p>
                  {myNotifs.length === 0 && <p className="px-1 pb-2 text-sm text-slate-500">No notifications yet.</p>}
                  <ul className="max-h-72 space-y-1 overflow-y-auto">
                    {myNotifs.map((n) => (
                      <li key={n.id} className="rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* auth actions */}
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to={dashPath} className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3 transition hover:border-brand-400 dark:border-slate-700">
                <img src={user.profileImage} alt={user.name} className="h-7 w-7 rounded-lg object-cover" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name.split(' ')[0]}</span>
                <Badge label={user.role} />
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} aria-label="Sign out"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-rose-400 hover:text-rose-500 dark:border-slate-700 dark:text-slate-300">
                <Icon name="logout" className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-ghost !py-2">Sign in</Link>
              <Link to="/register" className="btn-primary !py-2">Get Started</Link>
            </div>
          )}

          {/* mobile menu button */}
          <button onClick={() => setMobileOpen((o) => !o)} aria-label="Open menu"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden dark:border-slate-700 dark:text-slate-300">
            <Icon name={mobileOpen ? 'x' : 'menu'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="anim-fade-in border-t border-slate-200/60 px-4 pb-4 pt-2 md:hidden dark:border-slate-800">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-brand-500/10 dark:text-slate-200">
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to={dashPath} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-600 dark:text-brand-300">My Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); navigate('/'); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-500">Sign out</button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost flex-1">Sign in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1">Get Started</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { toast } = useApp();
  const [email, setEmail] = useState('');
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
      {/* newsletter band */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative -mt-10 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-indigo-700 to-violet-700 p-8 shadow-2xl shadow-brand-900/30 sm:p-10">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="text-xl font-extrabold text-white sm:text-2xl">Never miss a new listing</h3>
              <p className="mt-1 text-sm text-indigo-100">Weekly market insights & fresh properties, straight to your inbox.</p>
            </div>
            <form className="flex w-full max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); if (email) { toast('Subscribed! Check your inbox to confirm.'); setEmail(''); } }}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
                placeholder="you@example.com" aria-label="Email address"
                className="w-full rounded-xl border border-white/25 bg-white/15 px-4 py-2.5 text-sm text-white placeholder-indigo-200 outline-none backdrop-blur focus:border-white/60" />
              <button type="submit" className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-indigo-50">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white"><Icon name="home" className="h-5 w-5" /></span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">EstateHub</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            A modern full-stack real estate platform — browse, book visits, and manage properties with a premium experience.
          </p>
        </div>
        {[
          { h: 'Explore', links: [['Properties', '/properties'], ['Featured Agents', '/agents'], ['About Us', '/about'], ['Sign In', '/login']] },
          { h: 'Property Types', links: [['Houses', '/properties?type=House'], ['Apartments', '/properties?type=Apartment'], ['Villas', '/properties?type=Villa'], ['Commercial', '/properties?type=Commercial']] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">{col.h}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2.5"><Icon name="pin" className="h-4 w-4 text-brand-500" /> 500 Market Street, San Francisco, CA</li>
            <li className="flex items-center gap-2.5"><Icon name="phone" className="h-4 w-4 text-brand-500" /> +1 (800) 555-0199</li>
            <li className="flex items-center gap-2.5"><Icon name="mail" className="h-4 w-4 text-brand-500" /> hello@estatehub.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} EstateHub · Built with React, TypeScript, Tailwind CSS, Node.js, Express & PostgreSQL · Demo project
      </div>
    </footer>
  );
}
