/* Admin dashboard — platform analytics, user/property/booking/agent/review
 * management with CSV exports and monthly reports. */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { agents, money, monthlyRevenue, properties, propertyById, users } from '../../data/db';
import { Badge, Icon, StatCard, Stars } from '../../components/ui';
import { AreaChart, BarChart, DonutChart } from '../../components/Charts';
import { DashShell, DataTable, downloadCSV } from './Shell';

const tabs = [
  { id: 'analytics', label: 'Dashboard', icon: 'chart' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'properties', label: 'Properties', icon: 'building' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar' },
  { id: 'agents', label: 'Agents', icon: 'shield' },
  { id: 'reviews', label: 'Reviews', icon: 'star' },
  { id: 'reports', label: 'Reports', icon: 'doc' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export default function AdminDashboard() {
  const { bookings, inquiries, reviews, registeredUsers, updateBookingStatus, toast } = useApp();
  const [tab, setTab] = useState('analytics');
  const [userQuery, setUserQuery] = useState('');

  const allUsers = registeredUsers.length ? registeredUsers : users;
  const filteredUsers = useMemo(() =>
    allUsers.filter((u) => (u.name + u.email + u.role).toLowerCase().includes(userQuery.toLowerCase())),
    [allUsers, userQuery]);

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    properties.forEach((p) => { counts[p.type] = (counts[p.type] ?? 0) + 1; });
    const palette = ['#3f6bf0', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'];
    return Object.entries(counts).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
  }, []);

  return (
    <DashShell title="Admin Console" subtitle="Platform administration" tabs={tabs} active={tab} onChange={setTab}>
      {/* ---------------- analytics ---------------- */}
      {tab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon="users" label="Total users" value={String(allUsers.length)} sub="+3 this week" />
            <StatCard icon="building" label="Properties" value={String(properties.length)} sub="+2 new listings" color="from-emerald-500 to-teal-500" />
            <StatCard icon="calendar" label="Bookings" value={String(bookings.length)} sub={`${bookings.filter((b) => b.status === 'PENDING').length} pending`} color="from-amber-500 to-orange-500" />
            <StatCard icon="trend" label="Revenue (12mo)" value={`$${(totalRevenue / 1000).toFixed(1)}M`} sub="↑ 18% YoY" color="from-violet-500 to-purple-500" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-1 font-bold text-slate-900 dark:text-white">Platform revenue</h2>
              <p className="mb-4 text-xs text-slate-400">Monthly revenue, last 12 months ($k)</p>
              <AreaChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.revenue }))} color="#8b5cf6" />
            </div>
            <div className="card p-6">
              <h2 className="mb-1 font-bold text-slate-900 dark:text-white">Monthly bookings</h2>
              <p className="mb-4 text-xs text-slate-400">Property visits scheduled</p>
              <BarChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.bookings }))} />
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Inventory by property type</h2>
              <DonutChart data={typeCounts} />
            </div>
            <div className="card p-6">
              <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Recent inquiries</h2>
              <div className="space-y-3">
                {inquiries.slice(0, 4).map((q) => (
                  <div key={q.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{q.name} <span className="font-normal text-slate-400">on</span> {propertyById(q.propertyId)?.title}</p>
                      <p className="line-clamp-1 text-xs text-slate-500">{q.message}</p>
                    </div>
                    <Badge label={q.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- users ---------------- */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search users…" className="input !pl-9" />
          </div>
          <DataTable title={`Users (${filteredUsers.length})`} headers={['User', 'Contact', 'Role', 'Joined', 'Action']}
            onExport={() => downloadCSV('users.csv', ['Name', 'Email', 'Phone', 'Role', 'Joined'],
              filteredUsers.map((u) => [u.name, u.email, u.phone, u.role, u.createdAt]))}
            rows={filteredUsers.map((u) => [
              <div key="u" className="flex items-center gap-3">
                <img src={u.profileImage} alt="" className="h-9 w-9 rounded-lg object-cover" />
                <span className="font-semibold text-slate-800 dark:text-slate-100">{u.name}</span>
              </div>,
              <div key="c"><p>{u.email}</p><p className="text-xs text-slate-400">{u.phone}</p></div>,
              <Badge key="r" label={u.role} />, u.createdAt,
              <button key="a" onClick={() => toast('User suspension requires DELETE /api/users/:id (admin JWT).', 'info')}
                className="text-xs font-bold text-rose-500 hover:underline">Suspend</button>,
            ])} />
        </div>
      )}

      {/* ---------------- properties ---------------- */}
      {tab === 'properties' && (
        <DataTable title={`All properties (${properties.length})`} headers={['Property', 'Agent', 'Price', 'Status', 'Featured']}
          onExport={() => downloadCSV('properties.csv', ['Title', 'Type', 'City', 'Price', 'Status', 'Agent'],
            properties.map((p) => [p.title, p.type, p.city, p.price, p.status, p.agentId]))}
          rows={properties.map((p) => [
            <div key="p" className="flex items-center gap-3">
              <img src={p.images[0]} alt="" className="h-10 w-14 rounded-lg object-cover" />
              <div>
                <Link to={`/properties/${p.id}`} className="font-semibold text-slate-800 hover:text-brand-600 dark:text-slate-100">{p.title}</Link>
                <p className="text-xs text-slate-400">{p.city}, {p.state}</p>
              </div>
            </div>,
            users.find((u) => u.id === agents.find((a) => a.id === p.agentId)?.userId)?.name ?? '—',
            <span key="pr" className="font-bold">{money(p.price, p.status)}</span>,
            <Badge key="s" label={p.status} />,
            p.featured ? <span key="f" className="chip bg-amber-500/15 text-amber-500">★ Featured</span> : <span key="f" className="text-xs text-slate-400">—</span>,
          ])} />
      )}

      {/* ---------------- bookings ---------------- */}
      {tab === 'bookings' && (
        <DataTable title={`All bookings (${bookings.length})`} headers={['Property', 'Customer', 'Date', 'Status', 'Action']}
          onExport={() => downloadCSV('bookings.csv', ['Property', 'User', 'Date', 'Time', 'Status'],
            bookings.map((b) => [propertyById(b.propertyId)?.title ?? b.propertyId, b.userId, b.visitDate, b.visitTime, b.status]))}
          rows={bookings.map((b) => [
            <span key="p" className="font-semibold">{propertyById(b.propertyId)?.title ?? b.propertyId}</span>,
            allUsers.find((u) => u.id === b.userId)?.name ?? b.userId,
            `${b.visitDate} · ${b.visitTime}`,
            <Badge key="s" label={b.status} />,
            b.status === 'PENDING'
              ? <button key="a" onClick={() => updateBookingStatus(b.id, 'CONFIRMED')} className="text-xs font-bold text-emerald-500 hover:underline">Approve</button>
              : <span key="a" className="text-xs text-slate-400">—</span>,
          ])} />
      )}

      {/* ---------------- agents ---------------- */}
      {tab === 'agents' && (
        <DataTable title={`Agents (${agents.length})`} headers={['Agent', 'Specialization', 'Rating', 'Listings', 'Deals']}
          onExport={() => downloadCSV('agents.csv', ['Name', 'Specialization', 'Rating', 'Listings', 'Deals'],
            agents.map((a) => [users.find((u) => u.id === a.userId)?.name ?? a.id, a.specialization, a.rating, a.listings, a.deals]))}
          rows={agents.map((a) => {
            const u = users.find((x) => x.id === a.userId)!;
            return [
              <div key="a" className="flex items-center gap-3">
                <img src={u.profileImage} alt="" className="h-9 w-9 rounded-lg object-cover" />
                <div><p className="font-semibold text-slate-800 dark:text-slate-100">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
              </div>,
              a.specialization,
              <span key="r" className="flex items-center gap-1.5"><Stars rating={a.rating} className="h-3.5 w-3.5" /> {a.rating}</span>,
              a.listings, a.deals,
            ];
          })} />
      )}

      {/* ---------------- reviews ---------------- */}
      {tab === 'reviews' && (
        <DataTable title={`Reviews (${reviews.length})`} headers={['Reviewer', 'Property', 'Rating', 'Comment', 'Date']}
          rows={reviews.map((r) => [
            <div key="u" className="flex items-center gap-2"><img src={r.userImage} alt="" className="h-8 w-8 rounded-full object-cover" /><span className="font-semibold">{r.userName}</span></div>,
            propertyById(r.propertyId)?.title ?? r.propertyId,
            <Stars key="s" rating={r.rating} className="h-3.5 w-3.5" />,
            <span key="c" className="line-clamp-2 max-w-xs text-slate-500">{r.comment}</span>,
            r.createdAt,
          ])} />
      )}

      {/* ---------------- reports ---------------- */}
      {tab === 'reports' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: 'Monthly Revenue Report', d: 'Revenue, commissions & fees by month', f: () => downloadCSV('revenue-report.csv', ['Month', 'Revenue ($k)', 'Bookings'], monthlyRevenue.map((m) => [m.month, m.revenue, m.bookings])) },
              { t: 'Inventory Report', d: 'All active listings with pricing', f: () => downloadCSV('inventory-report.csv', ['Title', 'Type', 'Status', 'Price', 'City'], properties.map((p) => [p.title, p.type, p.status, p.price, p.city])) },
              { t: 'Inquiry Report', d: 'Lead pipeline & response status', f: () => downloadCSV('inquiry-report.csv', ['Name', 'Email', 'Property', 'Status', 'Date'], inquiries.map((q) => [q.name, q.email, propertyById(q.propertyId)?.title ?? q.propertyId, q.status, q.createdAt])) },
            ].map((r) => (
              <div key={r.t} className="card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300"><Icon name="doc" className="h-5 w-5" /></span>
                <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{r.t}</h3>
                <p className="mt-1 text-xs text-slate-500">{r.d}</p>
                <button onClick={r.f} className="btn-ghost mt-4 w-full !py-2 text-xs">Download CSV</button>
              </div>
            ))}
          </div>
          <div className="card p-6">
            <h2 className="mb-1 font-bold text-slate-900 dark:text-white">Booking conversion trend</h2>
            <p className="mb-4 text-xs text-slate-400">Visits per month across the platform</p>
            <AreaChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.bookings }))} color="#f59e0b" />
          </div>
        </div>
      )}

      {/* ---------------- settings ---------------- */}
      {tab === 'settings' && (
        <div className="card max-w-2xl p-6">
          <h2 className="mb-5 font-bold text-slate-900 dark:text-white">Platform settings</h2>
          <div className="space-y-4">
            {[
              ['Maintenance mode', 'Take the public site offline for maintenance', false],
              ['New agent auto-approval', 'Automatically approve verified agent sign-ups', true],
              ['Email notifications', 'Send booking & inquiry alerts via SMTP', true],
              ['Rate limiting', 'Throttle API requests (100 req / 15 min per IP)', true],
            ].map(([label, desc, on]) => (
              <SettingRow key={label as string} label={label as string} desc={desc as string} initial={on as boolean} />
            ))}
          </div>
          <p className="mt-6 rounded-xl bg-slate-500/5 p-4 text-xs leading-relaxed text-slate-400">
            <strong>Security stack:</strong> Helmet, CORS allow-list, JWT + refresh-token rotation, bcrypt (12 rounds),
            Prisma parameterized queries (SQLi-safe), express-validator sanitization, httpOnly secure cookies.
          </p>
        </div>
      )}
    </DashShell>
  );
}

function SettingRow({ label, desc, initial }: { label: string; desc: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button onClick={() => setOn((o) => !o)} role="switch" aria-checked={on} aria-label={label}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
