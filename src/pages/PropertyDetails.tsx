/* Property details — gallery, facts, amenities, map, agent card,
 * booking + inquiry forms, reviews and related listings. */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { agentById, api, money, properties } from '../data/db';
import type { Property } from '../types';
import { useApp } from '../context/AppContext';
import { Badge, Icon, Modal, Stars } from '../components/ui';
import { PropertyCard } from '../components/PropertyCard';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite, addBooking, addInquiry, addReview, reviews, toast } = useApp();
  const [p, setP] = useState<Property | null | undefined>(undefined);
  const [imgIdx, setImgIdx] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00');
  const [inqName, setInqName] = useState(user?.name ?? '');
  const [inqEmail, setInqEmail] = useState(user?.email ?? '');
  const [inqMsg, setInqMsg] = useState('');
  const [rvRating, setRvRating] = useState(5);
  const [rvComment, setRvComment] = useState('');

  useEffect(() => {
    setP(undefined); setImgIdx(0);
    api.getProperty(id!).then(setP);
    window.scrollTo({ top: 0 });
  }, [id]);

  const agent = p ? agentById(p.agentId) : null;
  const propReviews = useMemo(() => reviews.filter((r) => r.propertyId === id), [reviews, id]);
  const avgRating = propReviews.length
    ? propReviews.reduce((s, r) => s + r.rating, 0) / propReviews.length : 0;
  const related = useMemo(() =>
    p ? properties.filter((x) => x.id !== p.id && (x.city === p.city || x.type === p.type)).slice(0, 3) : [],
    [p]);

  /* skeleton */
  if (p === undefined) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <div className="skeleton h-[420px] w-full" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2"><div className="skeleton h-8 w-2/3" /><div className="skeleton h-4 w-1/2" /><div className="skeleton h-40 w-full" /></div>
          <div className="skeleton h-72 w-full" />
        </div>
      </div>
    );
  }
  if (p === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold">Property not found</h1>
        <Link to="/properties" className="btn-primary mt-6">Back to listings</Link>
      </div>
    );
  }

  const fav = isFavorite(p.id);
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast('Please sign in to book a visit.', 'info'); navigate('/login'); return; }
    addBooking({ propertyId: p.id, visitDate, visitTime });
    setBookOpen(false); setVisitDate('');
  };

  const submitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({ propertyId: p.id, name: inqName, email: inqEmail, message: inqMsg });
    setInqMsg('');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast('Please sign in to write a review.', 'info'); navigate('/login'); return; }
    addReview({ propertyId: p.id, rating: rvRating, comment: rvComment });
    setRvComment('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-xs font-medium text-slate-400" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand-500">Home</Link> /
        <Link to="/properties" className="hover:text-brand-500">Properties</Link> /
        <span className="text-slate-600 dark:text-slate-300">{p.title}</span>
      </nav>

      {/* ---------- gallery ---------- */}
      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="relative overflow-hidden rounded-2xl">
          <img src={p.images[imgIdx]} alt={`${p.title} photo ${imgIdx + 1}`} className="anim-fade-in h-[300px] w-full object-cover sm:h-[460px]" />
          <div className="absolute left-4 top-4 flex gap-2"><Badge label={p.status} /><span className="chip bg-slate-900/70 text-white backdrop-blur">{p.type}</span></div>
          <button onClick={() => toggleFavorite(p.id)}
            aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
            className={`absolute right-4 top-4 rounded-full p-2.5 shadow-lg backdrop-blur transition hover:scale-110 ${fav ? 'bg-rose-500 text-white' : 'bg-white/85 text-slate-500 dark:bg-slate-900/80'}`}>
            <Icon name="heart" filled={fav} className="h-5 w-5" />
          </button>
          {p.images.length > 1 && (
            <>
              <button aria-label="Previous image" onClick={() => setImgIdx((i) => (i - 1 + p.images.length) % p.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 shadow-lg backdrop-blur transition hover:scale-110 dark:bg-slate-900/80"><Icon name="chevL" className="h-5 w-5" /></button>
              <button aria-label="Next image" onClick={() => setImgIdx((i) => (i + 1) % p.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 shadow-lg backdrop-blur transition hover:scale-110 dark:bg-slate-900/80"><Icon name="chevR" className="h-5 w-5" /></button>
            </>
          )}
          <span className="absolute bottom-4 right-4 rounded-lg bg-slate-950/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">{imgIdx + 1} / {p.images.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-3 lg:grid-cols-1">
          {p.images.slice(0, 4).map((src, i) => (
            <button key={src} onClick={() => setImgIdx(i)} aria-label={`Show photo ${i + 1}`}
              className={`overflow-hidden rounded-xl ring-2 transition ${imgIdx === i ? 'ring-brand-500' : 'ring-transparent hover:ring-brand-300'}`}>
              <img src={src} alt="" loading="lazy" className="h-20 w-full object-cover lg:h-[104px]" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ---------------- main column ---------------- */}
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">{p.title}</h1>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Icon name="pin" className="h-4 w-4 text-brand-500" />{p.address}, {p.city}, {p.state}, {p.country}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-300">{money(p.price, p.status)}</p>
                {p.area > 0 && p.status === 'For Sale' && (
                  <p className="text-xs text-slate-400">${Math.round(p.price / p.area).toLocaleString()}/sqft</p>
                )}
              </div>
            </div>
            {propReviews.length > 0 && (
              <div className="mt-3 flex items-center gap-2"><Stars rating={avgRating} /><span className="text-sm font-bold">{avgRating.toFixed(1)}</span><span className="text-xs text-slate-400">({propReviews.length} reviews)</span></div>
            )}
          </div>

          {/* key facts */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['bed', 'Bedrooms', p.bedrooms || '—'], ['bath', 'Bathrooms', p.bathrooms || '—'],
              ['car', 'Parking', p.parking || '—'], ['area', 'Area', `${p.area.toLocaleString()} sqft`],
            ].map(([icon, label, val]) => (
              <div key={label as string} className="card flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300"><Icon name={icon as string} className="h-5 w-5" /></span>
                <div><p className="text-xs text-slate-400">{label}</p><p className="font-bold text-slate-900 dark:text-white">{val}</p></div>
              </div>
            ))}
          </div>

          {/* description */}
          <section className="card p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">About this property</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3 dark:border-slate-800">
              {[['Year built', p.yearBuilt], ['Property ID', p.id.toUpperCase()], ['Listed', p.createdAt], ['Type', p.type], ['Status', p.status], ['City', p.city]].map(([k, v]) => (
                <p key={k as string} className="flex justify-between gap-2 py-1"><span className="text-slate-400">{k}</span><span className="font-semibold text-slate-700 dark:text-slate-200">{v}</span></p>
              ))}
            </div>
          </section>

          {/* amenities */}
          {p.amenities.length > 0 && (
            <section className="card p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Amenities</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.amenities.map((a) => (
                  <p key={a} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"><Icon name="check" className="h-3.5 w-3.5" /></span>{a}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* location map */}
          <section className="card overflow-hidden">
            <h2 className="p-6 pb-3 text-lg font-bold text-slate-900 dark:text-white">Location</h2>
            <iframe title={`Map of ${p.title}`} loading="lazy" className="h-72 w-full border-0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${p.longitude - 0.02}%2C${p.latitude - 0.012}%2C${p.longitude + 0.02}%2C${p.latitude + 0.012}&layer=mapnik&marker=${p.latitude}%2C${p.longitude}`} />
            <div className="flex flex-wrap gap-2 p-4">
              {['🏫 Schools · 0.6 mi', '🛒 Grocery · 0.4 mi', '🚇 Transit · 0.8 mi', '🏥 Hospital · 1.9 mi', '🌳 Park · 0.3 mi'].map((n) => (
                <span key={n} className="chip bg-slate-500/10 text-slate-600 dark:text-slate-300">{n}</span>
              ))}
            </div>
          </section>

          {/* reviews */}
          <section className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Reviews ({propReviews.length})</h2>
            <div className="space-y-4">
              {propReviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet — be the first to share your experience.</p>}
              {propReviews.map((r) => (
                <div key={r.id} className="flex gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <img src={r.userImage} alt={r.userName} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{r.userName}</p>
                      <Stars rating={r.rating} className="h-3.5 w-3.5" />
                      <span className="text-xs text-slate-400">{r.createdAt}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* add review */}
            <form onSubmit={submitReview} className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
              <p className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Write a review</p>
              <div className="mb-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" onClick={() => setRvRating(i)} aria-label={`${i} stars`}>
                    <Icon name="star" filled className={`h-6 w-6 transition ${i <= rvRating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300 dark:text-slate-600'}`} />
                  </button>
                ))}
              </div>
              <textarea required value={rvComment} onChange={(e) => setRvComment(e.target.value)} rows={3}
                placeholder="Share your experience touring or living here…" className="input resize-none" />
              <button type="submit" className="btn-primary mt-3">Submit review</button>
            </form>
          </section>
        </div>

        {/* ---------------- sidebar ---------------- */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          {/* agent */}
          {agent && (
            <div className="card p-6">
              <div className="flex items-center gap-4">
                <img src={agent.user.profileImage} alt={agent.user.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{agent.user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{agent.specialization}</p>
                  <div className="mt-1 flex items-center gap-1.5"><Stars rating={agent.rating} className="h-3.5 w-3.5" /><span className="text-xs font-bold text-amber-500">{agent.rating}</span></div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-center dark:border-slate-800">
                {[['Exp.', `${agent.experience} yrs`], ['Listings', agent.listings], ['Deals', agent.deals]].map(([k, v]) => (
                  <div key={k as string}><p className="text-sm font-extrabold text-slate-900 dark:text-white">{v}</p><p className="text-[10px] uppercase tracking-wide text-slate-400">{k}</p></div>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => setBookOpen(true)} className="btn-primary w-full"><Icon name="calendar" className="h-4 w-4" /> Book a Visit</button>
                <a href={`tel:${agent.user.phone.replace(/\s/g, '')}`} className="btn-ghost w-full"><Icon name="phone" className="h-4 w-4" /> {agent.user.phone}</a>
              </div>
            </div>
          )}

          {/* inquiry form */}
          <div className="card p-6">
            <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Send an Inquiry</h3>
            <form onSubmit={submitInquiry} className="space-y-3">
              <input required value={inqName} onChange={(e) => setInqName(e.target.value)} placeholder="Your name" aria-label="Your name" className="input" />
              <input required type="email" value={inqEmail} onChange={(e) => setInqEmail(e.target.value)} placeholder="Email address" aria-label="Email address" className="input" />
              <textarea required rows={4} value={inqMsg} onChange={(e) => setInqMsg(e.target.value)}
                placeholder={`I'm interested in ${p.title}. Please contact me…`} aria-label="Message" className="input resize-none" />
              <button type="submit" className="btn-primary w-full"><Icon name="mail" className="h-4 w-4" /> Send message</button>
              <p className="text-center text-[11px] text-slate-400">Protected by validation & rate limiting on the API.</p>
            </form>
          </div>
        </aside>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-8">Related Properties</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <PropertyCard key={r.id} p={r} />)}
          </div>
        </section>
      )}

      {/* booking modal */}
      <Modal open={bookOpen} onClose={() => setBookOpen(false)} title="Schedule a Property Visit">
        <form onSubmit={submitBooking} className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-brand-500/5 p-3">
            <img src={p.images[0]} alt="" className="h-14 w-20 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</p>
              <p className="text-xs text-slate-500">{p.city}, {p.state} · {money(p.price, p.status)}</p>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Visit date</label>
            <input required type="date" min={minDate} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Time slot</label>
            <div className="grid grid-cols-3 gap-2">
              {['10:00', '11:30', '13:00', '14:30', '16:00', '17:30'].map((t) => (
                <button key={t} type="button" onClick={() => setVisitTime(t)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${visitTime === t
                    ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300'
                    : 'border-slate-200 text-slate-600 hover:border-brand-300 dark:border-slate-700 dark:text-slate-300'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Confirm visit request</button>
          {!user && <p className="text-center text-xs text-amber-500">You'll be asked to sign in to complete the booking.</p>}
        </form>
      </Modal>
    </div>
  );
}
