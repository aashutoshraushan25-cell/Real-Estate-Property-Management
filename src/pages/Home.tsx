/* Home page — hero, search, featured, categories, agents, testimonials, FAQ */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, CITIES, TYPES, testimonials } from '../data/db';
import type { Agent, Property, User } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { CardSkeleton, Icon, Reveal, Stars } from '../components/ui';

const HERO_IMG = 'https://images.pexels.com/photos/8134745/pexels-photo-8134745.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600';

const categories = [
  { type: 'House', icon: 'home', desc: 'Family homes & cottages', color: 'from-emerald-500 to-teal-500' },
  { type: 'Apartment', icon: 'building', desc: 'City living, elevated', color: 'from-sky-500 to-blue-500' },
  { type: 'Villa', icon: 'spark', desc: 'Luxury & waterfront', color: 'from-violet-500 to-purple-500' },
  { type: 'Condo', icon: 'grid', desc: 'Lofts & condos', color: 'from-amber-500 to-orange-500' },
  { type: 'Commercial', icon: 'chart', desc: 'Offices & investment', color: 'from-rose-500 to-pink-500' },
  { type: 'Land', icon: 'pin', desc: 'Build your vision', color: 'from-lime-500 to-green-500' },
];

const whyUs = [
  { icon: 'shield', title: 'Verified Listings', desc: 'Every property is inspected and verified by our team before it goes live — zero fake listings.' },
  { icon: 'calendar', title: 'Instant Visit Booking', desc: 'Schedule property tours in seconds with real-time agent availability and reminders.' },
  { icon: 'trend', title: 'Market Intelligence', desc: 'Live pricing analytics and neighborhood reports so you always negotiate from strength.' },
  { icon: 'users', title: 'Expert Agents', desc: 'A curated network of top-rated agents with a 4.8★ average rating and deep local knowledge.' },
];

const faqs = [
  { q: 'How do I schedule a property visit?', a: 'Open any property page and click "Book a Visit". Pick a date and time slot, and the listing agent confirms your tour — usually within a couple of hours. You can track all your visits from your dashboard.' },
  { q: 'Are the listings verified?', a: 'Yes. Every listing goes through document verification and an on-site inspection by our operations team before publishing, so what you see is what you get.' },
  { q: 'What fees does EstateHub charge buyers?', a: 'Browsing, saving properties, booking visits and contacting agents is completely free for buyers and renters. Agents pay a small success fee only when a deal closes.' },
  { q: 'Can I list my own property?', a: 'Absolutely. Create an agent account (or upgrade an existing one) and use the Agent Dashboard to add listings, upload photos, and manage bookings and inquiries.' },
  { q: 'Do you support home financing?', a: 'We partner with leading lenders to provide pre-approval and mortgage comparison directly in the portal, with rates refreshed daily.' },
];

const heroWords = ['Dream Home', 'Perfect Villa', 'City Loft', 'Next Investment'];

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Property[] | null>(null);
  const [latest, setLatest] = useState<Property[] | null>(null);
  const [agents, setAgents] = useState<(Agent & { user: User })[] | null>(null);
  const [q, setQ] = useState('');
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [wordIdx, setWordIdx] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  useEffect(() => {
    api.getFeatured().then(setFeatured);
    api.getProperties({ sort: 'newest', pageSize: 3 }).then((r) => setLatest(r.data));
    api.getAgents().then(setAgents);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % heroWords.length), 2600);
    return () => clearInterval(t);
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (city !== 'All') params.set('city', city);
    if (type !== 'All') params.set('type', type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-20 sm:px-6 sm:pt-28">
          <div className="max-w-2xl">
            <p className="anim-fade-up chip mb-5 border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs text-white backdrop-blur">
              <Icon name="spark" className="h-3.5 w-3.5 text-amber-300" /> #1 Rated Property Portal · 12,000+ happy clients
            </p>
            <h1 className="anim-fade-up delay-1 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
              Find Your{' '}
              <span key={wordIdx} className="anim-fade-in inline-block bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                {heroWords[wordIdx]}
              </span>
              <br />Without the Hassle
            </h1>
            <p className="anim-fade-up delay-2 mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Browse verified listings, book visits instantly, and close with confidence — all in one beautifully simple platform.
            </p>
          </div>

          {/* animated glass search bar */}
          <form onSubmit={search}
            className="anim-fade-up delay-3 mt-10 grid max-w-4xl gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl sm:grid-cols-[1fr_170px_170px_auto]">
            <div className="relative">
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, city or address…"
                aria-label="Search properties"
                className="w-full rounded-xl border border-white/10 bg-white/90 py-3 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:ring-4 focus:ring-brand-400/40 dark:bg-slate-900/90 dark:text-white" />
            </div>
            <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City"
              className="rounded-xl border border-white/10 bg-white/90 px-3 py-3 text-sm font-medium text-slate-700 outline-none dark:bg-slate-900/90 dark:text-slate-200">
              {CITIES.map((c) => <option key={c}>{c === 'All' ? 'All Cities' : c}</option>)}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type"
              className="rounded-xl border border-white/10 bg-white/90 px-3 py-3 text-sm font-medium text-slate-700 outline-none dark:bg-slate-900/90 dark:text-slate-200">
              {TYPES.map((t) => <option key={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>
            <button type="submit" className="btn-primary !rounded-xl !px-7">
              <Icon name="search" className="h-4 w-4" /> Search
            </button>
          </form>

          {/* stats */}
          <div className="anim-fade-up delay-4 mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[['4.2k+', 'Properties Listed'], ['1.8k+', 'Deals Closed'], ['320+', 'Expert Agents'], ['98%', 'Client Satisfaction']].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-extrabold text-white sm:text-3xl">{v}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Handpicked for you</p>
            <h2 className="section-title mt-1.5">Featured Properties</h2>
          </div>
          <Link to="/properties" className="btn-ghost">View all <Icon name="chevR" className="h-4 w-4" /></Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured
            ? featured.slice(0, 6).map((p, i) => <Reveal key={p.id} delay={i * 80}><PropertyCard p={p} /></Reveal>)
            : Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="bg-white py-20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Browse by category</p>
            <h2 className="section-title mt-1.5">Explore Property Types</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c, i) => (
              <Reveal key={c.type} delay={i * 60}>
                <Link to={`/properties?type=${c.type}`}
                  className="card group flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1.5 hover:shadow-2xl">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-lg transition group-hover:scale-110`}>
                    <Icon name={c.icon} className="h-7 w-7" />
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{c.type}s</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{c.desc}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Why EstateHub</p>
            <h2 className="section-title mt-1.5">The smarter way to buy, rent & sell</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              We combined verified listings, instant scheduling and real market data into one seamless
              experience — so you spend less time searching and more time living.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {whyUs.map((w, i) => (
                <Reveal key={w.title} delay={i * 80} className="card p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                    <Icon name={w.icon} className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{w.desc}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150} className="relative hidden lg:block">
            <img src="https://images.pexels.com/photos/7031594/pexels-photo-7031594.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=700"
              alt="Modern villa" className="anim-float h-[560px] w-full rounded-3xl object-cover shadow-2xl" />
            <div className="glass absolute -left-8 bottom-14 rounded-2xl p-4 shadow-xl">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white"><Icon name="check" className="h-4 w-4" /></span>
                Tour booked in 42 seconds
              </p>
            </div>
            <div className="glass absolute -right-4 top-10 rounded-2xl p-4 shadow-xl">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg. days on market</p>
              <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-300">18 days</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= AGENTS ================= */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400">Meet the team</p>
            <h2 className="mt-1.5 text-2xl font-extrabold text-white sm:text-3xl">Featured Agents</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(agents ?? []).map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <Link to="/agents" className="group block rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:-translate-y-1.5 hover:border-brand-400/50 hover:bg-white/10">
                  <img src={a.user.profileImage} alt={a.user.name}
                    className="mx-auto h-20 w-20 rounded-2xl object-cover ring-4 ring-white/10 transition group-hover:ring-brand-400/40" />
                  <h3 className="mt-4 font-bold text-white">{a.user.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{a.specialization}</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Stars rating={a.rating} />
                    <span className="text-xs font-bold text-amber-400">{a.rating}</span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{a.deals} deals · {a.experience} yrs experience</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Testimonials</p>
          <h2 className="section-title mt-1.5">Loved by thousands of movers</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 100} className="card relative p-6">
              <span className="absolute right-6 top-5 text-6xl font-black text-brand-500/10">"</span>
              <Stars rating={t.rating} />
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= LATEST ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Just listed</p>
            <h2 className="section-title mt-1.5">Latest Properties</h2>
          </div>
          <Link to="/properties?sort=newest" className="btn-ghost">Browse newest <Icon name="chevR" className="h-4 w-4" /></Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest
            ? latest.map((p, i) => <Reveal key={p.id} delay={i * 80}><PropertyCard p={p} /></Reveal>)
            : Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <Reveal className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">FAQ</p>
          <h2 className="section-title mt-1.5">Frequently Asked Questions</h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="card overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  aria-expanded={faqOpen === i}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left">
                  <span className="font-bold text-slate-900 dark:text-white">{f.q}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 transition-transform dark:text-brand-300 ${faqOpen === i ? 'rotate-45' : ''}`}>
                    <Icon name="x" className="h-4 w-4 rotate-45" />
                  </span>
                </button>
                {faqOpen === i && (
                  <p className="anim-fade-in px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.a}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
