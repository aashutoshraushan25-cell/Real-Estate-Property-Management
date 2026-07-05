/* Agent dashboard — sales stats, listing CRUD, bookings & inquiry management */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { agents, money, monthlyRevenue, properties, propertyById } from '../../data/db';
import type { Property, PropertyStatus, PropertyType } from '../../types';
import { Badge, Icon, Modal, StatCard } from '../../components/ui';
import { AreaChart, BarChart } from '../../components/Charts';
import { DashShell, DataTable, downloadCSV } from './Shell';

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'chart' },
  { id: 'listings', label: 'My Listings', icon: 'building' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar' },
  { id: 'inquiries', label: 'Inquiries', icon: 'mail' },
];

const emptyForm = { title: '', type: 'House' as PropertyType, status: 'For Sale' as PropertyStatus, price: '', city: '', state: '', address: '', bedrooms: '3', bathrooms: '2', parking: '1', area: '' };

export default function AgentDashboard() {
  const { user, bookings, inquiries, updateBookingStatus, updateInquiryStatus, toast } = useApp();
  const [tab, setTab] = useState('overview');
  const agentProfile = agents.find((a) => a.userId === user?.id) ?? agents[0];
  const [myListings, setMyListings] = useState<Property[]>(() =>
    properties.filter((p) => p.agentId === agentProfile.id));
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState(emptyForm);

  const listingIds = useMemo(() => new Set(myListings.map((p) => p.id)), [myListings]);
  const myBookings = bookings.filter((b) => listingIds.has(b.propertyId));
  const myInquiries = inquiries.filter((q) => listingIds.has(q.propertyId));
  const portfolioValue = myListings.reduce((s, p) => s + (p.status === 'For Sale' || p.status === 'Sold' ? p.price : 0), 0);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFormOpen(true); };
  const openEdit = (p: Property) => {
    setEditing(p);
    setForm({ title: p.title, type: p.type, status: p.status, price: String(p.price), city: p.city, state: p.state, address: p.address, bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms), parking: String(p.parking), area: String(p.area) });
    setFormOpen(true);
  };

  const saveListing = (e: React.FormEvent) => {
    e.preventDefault();
    const base = {
      title: form.title, type: form.type, status: form.status, price: Number(form.price) || 0,
      city: form.city, state: form.state, address: form.address,
      bedrooms: Number(form.bedrooms) || 0, bathrooms: Number(form.bathrooms) || 0,
      parking: Number(form.parking) || 0, area: Number(form.area) || 0,
    };
    if (editing) {
      setMyListings((l) => l.map((p) => (p.id === editing.id ? { ...p, ...base } : p)));
      toast('Listing updated successfully.');
    } else {
      const fresh: Property = {
        ...base, id: 'p-' + Date.now(), country: 'USA', yearBuilt: new Date().getFullYear(),
        latitude: 37.77, longitude: -122.42, agentId: agentProfile.id, featured: false,
        images: [properties[(myListings.length + 2) % properties.length].images[0]],
        amenities: ['Central AC', 'Security System'],
        description: 'Newly added listing — full description, photo gallery and amenity details are managed through the media upload pipeline (Multer + Cloudinary on the API).',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setMyListings((l) => [fresh, ...l]);
      toast('Listing published! Images upload via Cloudinary on the live API.');
    }
    setFormOpen(false);
  };

  const removeListing = (id: string) => {
    setMyListings((l) => l.filter((p) => p.id !== id));
    toast('Listing deleted.', 'info');
  };

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <DashShell title="Agent Dashboard" subtitle="Agent workspace" tabs={tabs} active={tab} onChange={setTab}>
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon="building" label="Active listings" value={String(myListings.length)} sub="+2 this month" />
            <StatCard icon="calendar" label="Bookings" value={String(myBookings.length)} sub={`${myBookings.filter((b) => b.status === 'PENDING').length} pending`} color="from-emerald-500 to-teal-500" />
            <StatCard icon="mail" label="Open inquiries" value={String(myInquiries.filter((q) => q.status === 'OPEN').length)} color="from-amber-500 to-orange-500" />
            <StatCard icon="trend" label="Portfolio value" value={`$${(portfolioValue / 1_000_000).toFixed(1)}M`} sub="↑ 12% YoY" color="from-violet-500 to-purple-500" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-1 font-bold text-slate-900 dark:text-white">Sales revenue</h2>
              <p className="mb-4 text-xs text-slate-400">Commission revenue, last 12 months ($k)</p>
              <AreaChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.revenue }))} color="#3f6bf0" />
            </div>
            <div className="card p-6">
              <h2 className="mb-1 font-bold text-slate-900 dark:text-white">Tour bookings</h2>
              <p className="mb-4 text-xs text-slate-400">Visits scheduled per month</p>
              <BarChart data={monthlyRevenue.slice(6).map((m) => ({ label: m.month, value: m.bookings }))} color="#10b981" />
            </div>
          </div>
        </div>
      )}

      {tab === 'listings' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{myListings.length} listings</p>
            <button onClick={openAdd} className="btn-primary"><Icon name="building" className="h-4 w-4" /> Add Property</button>
          </div>
          <DataTable title="My listings" headers={['Property', 'Type', 'Price', 'Status', 'Actions']}
            onExport={() => downloadCSV('my-listings.csv', ['Title', 'Type', 'Price', 'Status', 'City'],
              myListings.map((p) => [p.title, p.type, p.price, p.status, p.city]))}
            rows={myListings.map((p) => [
              <div key="p" className="flex items-center gap-3">
                <img src={p.images[0]} alt="" className="h-10 w-14 rounded-lg object-cover" />
                <div>
                  <Link to={`/properties/${p.id}`} className="font-semibold text-slate-800 hover:text-brand-600 dark:text-slate-100">{p.title}</Link>
                  <p className="text-xs text-slate-400">{p.city}, {p.state}</p>
                </div>
              </div>,
              p.type, <span key="pr" className="font-bold">{money(p.price, p.status)}</span>, <Badge key="s" label={p.status} />,
              <div key="a" className="flex gap-3">
                <button onClick={() => openEdit(p)} className="text-xs font-bold text-brand-600 hover:underline">Edit</button>
                <button onClick={() => removeListing(p.id)} className="text-xs font-bold text-rose-500 hover:underline">Delete</button>
              </div>,
            ])} />
        </div>
      )}

      {tab === 'bookings' && (
        <DataTable title="Visit requests on my listings" headers={['Property', 'Date', 'Time', 'Status', 'Actions']}
          rows={myBookings.map((b) => [
            <span key="p" className="font-semibold">{propertyById(b.propertyId)?.title ?? '(deleted listing)'}</span>,
            b.visitDate, b.visitTime, <Badge key="s" label={b.status} />,
            b.status === 'PENDING' ? (
              <div key="a" className="flex gap-3">
                <button onClick={() => updateBookingStatus(b.id, 'CONFIRMED')} className="text-xs font-bold text-emerald-500 hover:underline">Confirm</button>
                <button onClick={() => updateBookingStatus(b.id, 'CANCELLED')} className="text-xs font-bold text-rose-500 hover:underline">Decline</button>
              </div>
            ) : b.status === 'CONFIRMED' ? (
              <button key="a" onClick={() => updateBookingStatus(b.id, 'COMPLETED')} className="text-xs font-bold text-sky-500 hover:underline">Mark completed</button>
            ) : <span key="a" className="text-xs text-slate-400">—</span>,
          ])} />
      )}

      {tab === 'inquiries' && (
        <DataTable title="Inquiries on my listings" headers={['From', 'Property', 'Message', 'Status', 'Action']}
          rows={myInquiries.map((q) => [
            <div key="f"><p className="font-semibold">{q.name}</p><p className="text-xs text-slate-400">{q.email}</p></div>,
            propertyById(q.propertyId)?.title ?? q.propertyId,
            <span key="m" className="line-clamp-2 max-w-xs text-slate-500">{q.message}</span>,
            <Badge key="s" label={q.status} />,
            q.status === 'OPEN'
              ? <button key="a" onClick={() => updateInquiryStatus(q.id, 'RESPONDED')} className="text-xs font-bold text-emerald-500 hover:underline">Mark responded</button>
              : <button key="a" onClick={() => updateInquiryStatus(q.id, 'CLOSED')} className="text-xs font-bold text-slate-400 hover:underline">Close</button>,
          ])} />
      )}

      {/* add / edit listing modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Listing' : 'Add New Property'}>
        <form onSubmit={saveListing} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Title</label>
            <input required value={form.title} onChange={set('title')} className="input" placeholder="e.g. Sunset Ridge Villa" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Type</label>
            <select value={form.type} onChange={set('type')} className="input">
              {['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Status</label>
            <select value={form.status} onChange={set('status')} className="input">
              {['For Sale', 'For Rent', 'Sold', 'Rented'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Price ($)</label>
            <input required type="number" min={1} value={form.price} onChange={set('price')} className="input" placeholder="750000" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Area (sqft)</label>
            <input required type="number" min={1} value={form.area} onChange={set('area')} className="input" placeholder="2400" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">City</label>
            <input required value={form.city} onChange={set('city')} className="input" placeholder="Austin" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">State</label>
            <input required value={form.state} onChange={set('state')} className="input" placeholder="TX" />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Address</label>
            <input required value={form.address} onChange={set('address')} className="input" placeholder="12 Hillside Ave" />
          </div>
          {(['bedrooms', 'bathrooms', 'parking'] as const).map((k) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-400">{k}</label>
              <input type="number" min={0} value={form[k]} onChange={set(k)} className="input" />
            </div>
          ))}
          <div className="col-span-2 rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
            <Icon name="doc" className="mx-auto mb-1 h-5 w-5" />
            Image upload handled by Multer → Cloudinary on the live API (demo uses stock gallery)
          </div>
          <button type="submit" className="btn-primary col-span-2">{editing ? 'Save changes' : 'Publish listing'}</button>
        </form>
      </Modal>
    </DashShell>
  );
}
