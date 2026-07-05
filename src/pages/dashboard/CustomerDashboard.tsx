/* Customer dashboard — overview, saved properties, bookings, inquiries, profile */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { propertyById } from '../../data/db';
import { Badge, Icon, StatCard } from '../../components/ui';
import { PropertyCard } from '../../components/PropertyCard';
import { DashShell, DataTable } from './Shell';

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'chart' },
  { id: 'saved', label: 'Saved Properties', icon: 'heart' },
  { id: 'bookings', label: 'My Bookings', icon: 'calendar' },
  { id: 'inquiries', label: 'My Inquiries', icon: 'mail' },
  { id: 'profile', label: 'Profile', icon: 'settings' },
];

export default function CustomerDashboard() {
  const { user, favorites, bookings, inquiries, updateBookingStatus, updateProfile } = useApp();
  const [tab, setTab] = useState('overview');
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const myFavs = useMemo(() => favorites.filter((f) => f.userId === user?.id)
    .map((f) => propertyById(f.propertyId)!).filter(Boolean), [favorites, user]);
  const myBookings = useMemo(() => bookings.filter((b) => b.userId === user?.id), [bookings, user]);
  const myInquiries = useMemo(() => inquiries.filter((q) => q.userId === user?.id), [inquiries, user]);
  const upcoming = myBookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED');

  return (
    <DashShell title="My Dashboard" subtitle="Customer portal" tabs={tabs} active={tab} onChange={setTab}>
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon="heart" label="Saved" value={String(myFavs.length)} color="from-rose-500 to-pink-500" />
            <StatCard icon="calendar" label="Upcoming visits" value={String(upcoming.length)} color="from-emerald-500 to-teal-500" />
            <StatCard icon="mail" label="Inquiries" value={String(myInquiries.length)} color="from-amber-500 to-orange-500" />
            <StatCard icon="check" label="Completed tours" value={String(myBookings.filter((b) => b.status === 'COMPLETED').length)} />
          </div>
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Upcoming visits</h2>
            {upcoming.length === 0 && (
              <p className="text-sm text-slate-500">No upcoming visits. <Link to="/properties" className="font-bold text-brand-600 hover:underline">Browse properties →</Link></p>
            )}
            <div className="space-y-3">
              {upcoming.map((b) => {
                const p = propertyById(b.propertyId);
                return p && (
                  <div key={b.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                    <img src={p.images[0]} alt="" className="h-14 w-20 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/properties/${p.id}`} className="text-sm font-bold text-slate-900 hover:text-brand-600 dark:text-white">{p.title}</Link>
                      <p className="text-xs text-slate-500">{b.visitDate} at {b.visitTime} · {p.city}</p>
                    </div>
                    <Badge label={b.status} />
                  </div>
                );
              })}
            </div>
          </div>
          {myFavs.length > 0 && (
            <div>
              <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Recently saved</h2>
              <div className="grid gap-6 sm:grid-cols-2">{myFavs.slice(0, 2).map((p) => <PropertyCard key={p.id} p={p} />)}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'saved' && (
        myFavs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">{myFavs.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="card flex flex-col items-center gap-3 p-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500"><Icon name="heart" className="h-7 w-7" /></span>
            <h2 className="font-bold text-slate-900 dark:text-white">No saved properties yet</h2>
            <p className="text-sm text-slate-500">Tap the ♥ icon on any listing to save it here.</p>
            <Link to="/properties" className="btn-primary mt-2">Browse properties</Link>
          </div>
        )
      )}

      {tab === 'bookings' && (
        <DataTable title="Booking history" headers={['Property', 'Date', 'Time', 'Status', 'Action']}
          rows={myBookings.map((b) => {
            const p = propertyById(b.propertyId);
            return [
              <Link key="l" to={`/properties/${b.propertyId}`} className="font-semibold text-slate-800 hover:text-brand-600 dark:text-slate-100">{p?.title ?? b.propertyId}</Link>,
              b.visitDate, b.visitTime, <Badge key="s" label={b.status} />,
              (b.status === 'PENDING' || b.status === 'CONFIRMED')
                ? <button key="c" onClick={() => updateBookingStatus(b.id, 'CANCELLED')} className="text-xs font-bold text-rose-500 hover:underline">Cancel</button>
                : <span key="c" className="text-xs text-slate-400">—</span>,
            ];
          })} />
      )}

      {tab === 'inquiries' && (
        <DataTable title="My inquiries" headers={['Property', 'Message', 'Status', 'Sent']}
          rows={myInquiries.map((q) => [
            <Link key="l" to={`/properties/${q.propertyId}`} className="font-semibold text-slate-800 hover:text-brand-600 dark:text-slate-100">{propertyById(q.propertyId)?.title ?? q.propertyId}</Link>,
            <span key="m" className="line-clamp-2 max-w-xs text-slate-500">{q.message}</span>,
            <Badge key="s" label={q.status} />, q.createdAt,
          ])} />
      )}

      {tab === 'profile' && user && (
        <div className="card max-w-xl p-6">
          <h2 className="mb-5 font-bold text-slate-900 dark:text-white">Profile settings</h2>
          <div className="mb-5 flex items-center gap-4">
            <img src={user.profileImage} alt={user.name} className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{user.email}</p>
              <p className="text-xs text-slate-400">Member since {user.createdAt}</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); updateProfile({ name, phone }); }} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
            </div>
            <button type="submit" className="btn-primary">Save changes</button>
          </form>
        </div>
      )}
    </DashShell>
  );
}
