/* ============================================================
 * Demo data layer — simulates the Express + Prisma + PostgreSQL
 * backend (see /server). The `api` object mirrors the REST
 * contract documented in docs/API_DOCUMENTATION.md.
 * ============================================================ */

import type {
  Agent, AppNotification, Booking, Inquiry, Paginated, Property,
  PropertyFilters, Review, Testimonial, User,
} from '../types';

const img = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

/* exteriors */
const E = [7031594, 7031600, 7031412, 7031598, 8134847, 7031602, 7031593, 7031405, 8082328, 8134745].map(img);
/* interiors */
const I = [7587828, 8089172, 6920439, 7546648, 7173666, 7167073, 6489117, 7587783].map(img);

const avatar = (n: number) => `https://i.pravatar.cc/160?img=${n}`;

/* ------------------------------ USERS ------------------------------ */
export const users: User[] = [
  { id: 'u-admin', name: 'Ava Mitchell', email: 'admin@estatehub.com', phone: '+1 202 555 0101', password: 'demo123', role: 'ADMIN', profileImage: avatar(47), createdAt: '2024-01-05' },
  { id: 'u-agent1', name: 'Daniel Brooks', email: 'agent@estatehub.com', phone: '+1 202 555 0102', password: 'demo123', role: 'AGENT', profileImage: avatar(12), createdAt: '2024-01-12' },
  { id: 'u-agent2', name: 'Sofia Reyes', email: 'sofia@estatehub.com', phone: '+1 202 555 0103', password: 'demo123', role: 'AGENT', profileImage: avatar(32), createdAt: '2024-02-02' },
  { id: 'u-agent3', name: 'Marcus Chen', email: 'marcus@estatehub.com', phone: '+1 202 555 0104', password: 'demo123', role: 'AGENT', profileImage: avatar(53), createdAt: '2024-02-20' },
  { id: 'u-agent4', name: 'Elena Petrova', email: 'elena@estatehub.com', phone: '+1 202 555 0105', password: 'demo123', role: 'AGENT', profileImage: avatar(45), createdAt: '2024-03-08' },
  { id: 'u-cust1', name: 'Jordan Lee', email: 'customer@estatehub.com', phone: '+1 202 555 0110', password: 'demo123', role: 'CUSTOMER', profileImage: avatar(15), createdAt: '2024-04-01' },
  { id: 'u-cust2', name: 'Priya Sharma', email: 'priya@example.com', phone: '+1 202 555 0111', password: 'demo123', role: 'CUSTOMER', profileImage: avatar(25), createdAt: '2024-05-15' },
  { id: 'u-cust3', name: 'Tom Becker', email: 'tom@example.com', phone: '+1 202 555 0112', password: 'demo123', role: 'CUSTOMER', profileImage: avatar(60), createdAt: '2024-06-21' },
];

/* ------------------------------ AGENTS ------------------------------ */
export const agents: Agent[] = [
  { id: 'a-1', userId: 'u-agent1', experience: 9, specialization: 'Luxury Villas & Waterfront', bio: 'Top-producing agent focused on premium villas and coastal estates. Known for record-time closings and white-glove service.', rating: 4.9, listings: 42, deals: 128 },
  { id: 'a-2', userId: 'u-agent2', experience: 7, specialization: 'Urban Apartments & Condos', bio: 'City-living specialist helping young professionals find their perfect downtown home with data-driven pricing.', rating: 4.8, listings: 35, deals: 96 },
  { id: 'a-3', userId: 'u-agent3', experience: 11, specialization: 'Commercial & Investment', bio: 'Investment strategist with a decade of experience in commercial assets, ROI modeling and portfolio growth.', rating: 4.7, listings: 28, deals: 141 },
  { id: 'a-4', userId: 'u-agent4', experience: 6, specialization: 'Family Homes & Suburbs', bio: 'Passionate about matching growing families with safe, connected neighborhoods and great school districts.', rating: 4.9, listings: 31, deals: 87 },
];

export const AMENITIES = [
  'Swimming Pool', 'Gym & Fitness', 'Smart Home', 'Garden', 'Fireplace', 'Home Theater',
  'Solar Panels', 'EV Charging', 'Security System', 'Balcony', 'Walk-in Closet', 'Central AC',
  'Concierge', 'Pet Friendly', 'Rooftop Deck', 'Wine Cellar',
];

/* ---------------------------- PROPERTIES ---------------------------- */
const P = (p: Omit<Property, 'country'>): Property => ({ ...p, country: 'USA' });

export const properties: Property[] = [
  P({
    id: 'p-1', title: 'Skyline Modern Villa', type: 'Villa', status: 'For Sale', price: 1985000,
    city: 'Los Angeles', state: 'CA', address: '128 Crestview Drive, Beverly Hills',
    bedrooms: 5, bathrooms: 4, parking: 3, area: 4820, yearBuilt: 2021, latitude: 34.0736, longitude: -118.4004,
    agentId: 'a-1', featured: true, images: [E[0], I[0], I[2], E[6]],
    amenities: ['Swimming Pool', 'Smart Home', 'Home Theater', 'Solar Panels', 'Security System', 'Wine Cellar'],
    description: 'A striking architectural statement in the hills — floor-to-ceiling glass, a cantilevered infinity pool and panoramic skyline views. The open-plan chef\'s kitchen flows into indoor-outdoor living spaces designed for effortless entertaining.',
    createdAt: '2025-11-02',
  }),
  P({
    id: 'p-2', title: 'The Marlow Penthouse', type: 'Apartment', status: 'For Sale', price: 1240000,
    city: 'New York', state: 'NY', address: '450 W 42nd St, Midtown Manhattan',
    bedrooms: 3, bathrooms: 3, parking: 1, area: 2150, yearBuilt: 2019, latitude: 40.7601, longitude: -73.9945,
    agentId: 'a-2', featured: true, images: [I[1], I[3], I[5], I[7]],
    amenities: ['Concierge', 'Gym & Fitness', 'Rooftop Deck', 'Smart Home', 'Central AC', 'Pet Friendly'],
    description: 'Corner penthouse bathed in light with Hudson views, wide-plank oak floors, a marble island kitchen and full-service amenities including 24/7 concierge, rooftop lounge and residents\' gym.',
    createdAt: '2025-10-18',
  }),
  P({
    id: 'p-3', title: 'Willow Creek Family Home', type: 'House', status: 'For Sale', price: 689000,
    city: 'Austin', state: 'TX', address: '77 Willow Creek Lane, Barton Hills',
    bedrooms: 4, bathrooms: 3, parking: 2, area: 3120, yearBuilt: 2016, latitude: 30.2554, longitude: -97.7876,
    agentId: 'a-4', featured: true, images: [E[1], I[4], I[6], E[3]],
    amenities: ['Garden', 'Fireplace', 'EV Charging', 'Central AC', 'Walk-in Closet', 'Pet Friendly'],
    description: 'Warm, light-filled family home on a quiet tree-lined street. Chef\'s kitchen with breakfast nook, a shaded backyard with mature oaks, and a bonus room perfect for a home office or studio.',
    createdAt: '2025-11-20',
  }),
  P({
    id: 'p-4', title: 'Lakeside Glass Retreat', type: 'Villa', status: 'For Rent', price: 8500,
    city: 'Seattle', state: 'WA', address: '9 Lakeshore Blvd, Lake Washington',
    bedrooms: 4, bathrooms: 4, parking: 2, area: 3890, yearBuilt: 2022, latitude: 47.6205, longitude: -122.2648,
    agentId: 'a-1', featured: true, images: [E[9], I[2], I[1], E[4]],
    amenities: ['Swimming Pool', 'Smart Home', 'Garden', 'Fireplace', 'Security System', 'Balcony'],
    description: 'A serene lakeside sanctuary with walls of glass, heated pool and private dock access. Rented fully furnished with designer interiors and integrated smart-home control throughout.',
    createdAt: '2025-12-01',
  }),
  P({
    id: 'p-5', title: 'Downtown Loft No. 12', type: 'Condo', status: 'For Rent', price: 3200,
    city: 'Chicago', state: 'IL', address: '212 N Sangamon St, West Loop',
    bedrooms: 2, bathrooms: 2, parking: 1, area: 1480, yearBuilt: 2015, latitude: 41.8858, longitude: -87.6512,
    agentId: 'a-2', featured: false, images: [I[0], I[7], I[5]],
    amenities: ['Gym & Fitness', 'Rooftop Deck', 'Central AC', 'Pet Friendly', 'Concierge'],
    description: 'Industrial-chic loft with exposed brick, 14-ft ceilings and oversized factory windows in the heart of the West Loop restaurant district. Steps from transit, coffee and galleries.',
    createdAt: '2025-11-11',
  }),
  P({
    id: 'p-6', title: 'Casa Verde Courtyard Villa', type: 'Villa', status: 'For Sale', price: 1425000,
    city: 'Miami', state: 'FL', address: '35 Palma Vista Ct, Coral Gables',
    bedrooms: 5, bathrooms: 5, parking: 2, area: 4310, yearBuilt: 2018, latitude: 25.7215, longitude: -80.2684,
    agentId: 'a-1', featured: true, images: [E[6], I[3], E[8], I[4]],
    amenities: ['Swimming Pool', 'Garden', 'Smart Home', 'Balcony', 'Central AC', 'Security System'],
    description: 'Mediterranean-modern villa wrapped around a lush private courtyard with saltwater pool. Vaulted ceilings, imported stone finishes and a resort-style primary suite.',
    createdAt: '2025-09-27',
  }),
  P({
    id: 'p-7', title: 'Aspen View Townhouse', type: 'Townhouse', status: 'For Sale', price: 540000,
    city: 'Denver', state: 'CO', address: '18 Summit Row, Highland',
    bedrooms: 3, bathrooms: 2, parking: 2, area: 1980, yearBuilt: 2017, latitude: 39.7645, longitude: -105.0110,
    agentId: 'a-4', featured: false, images: [E[2], I[6], I[1]],
    amenities: ['Fireplace', 'Balcony', 'EV Charging', 'Walk-in Closet', 'Central AC'],
    description: 'Mountain-view townhouse with a rooftop terrace built for Colorado sunsets. Open living level, quartz kitchen and an attached two-car garage with EV charging.',
    createdAt: '2025-10-05',
  }),
  P({
    id: 'p-8', title: 'The Beacon Apartments 4B', type: 'Apartment', status: 'For Rent', price: 2450,
    city: 'Boston', state: 'MA', address: '4B Beacon Wharf, Seaport',
    bedrooms: 1, bathrooms: 1, parking: 0, area: 860, yearBuilt: 2020, latitude: 42.3519, longitude: -71.0421,
    agentId: 'a-2', featured: false, images: [I[5], I[0], I[3]],
    amenities: ['Concierge', 'Gym & Fitness', 'Pet Friendly', 'Central AC', 'Balcony'],
    description: 'Bright harbor-side one-bedroom with a private balcony, in-unit laundry and hotel-grade building amenities. Walk to the waterfront, ICA and Seaport dining.',
    createdAt: '2025-12-08',
  }),
  P({
    id: 'p-9', title: 'Sierra Stone Estate', type: 'House', status: 'Sold', price: 2350000,
    city: 'Scottsdale', state: 'AZ', address: '600 Sierra Stone Rd, North Scottsdale',
    bedrooms: 6, bathrooms: 5, parking: 4, area: 5640, yearBuilt: 2014, latitude: 33.6845, longitude: -111.9200,
    agentId: 'a-3', featured: false, images: [E[7], I[2], E[5]],
    amenities: ['Swimming Pool', 'Wine Cellar', 'Home Theater', 'Solar Panels', 'Garden', 'Security System'],
    description: 'Desert-contemporary estate on 1.2 acres with mountain vistas, a resort backyard, and a detached casita. Sold — contact us for comparable listings.',
    createdAt: '2025-08-14',
  }),
  P({
    id: 'p-10', title: 'Harborline Office Suites', type: 'Commercial', status: 'For Sale', price: 3150000,
    city: 'San Diego', state: 'CA', address: '900 Harborline Ave, Marina District',
    bedrooms: 0, bathrooms: 4, parking: 12, area: 8200, yearBuilt: 2012, latitude: 32.7112, longitude: -117.1685,
    agentId: 'a-3', featured: false, images: [E[5], I[1], I[6]],
    amenities: ['Security System', 'EV Charging', 'Central AC', 'Concierge'],
    description: 'Fully leased Class-A office building with waterfront exposure, 12 parking bays and a 6.1% cap rate. Ideal stabilized asset for portfolio investors.',
    createdAt: '2025-07-30',
  }),
  P({
    id: 'p-11', title: 'Maple Grove Cottage', type: 'House', status: 'For Sale', price: 415000,
    city: 'Portland', state: 'OR', address: '22 Maple Grove Ave, Sellwood',
    bedrooms: 3, bathrooms: 2, parking: 1, area: 1620, yearBuilt: 2009, latitude: 45.4646, longitude: -122.6539,
    agentId: 'a-4', featured: false, images: [E[3], I[4], I[7]],
    amenities: ['Garden', 'Fireplace', 'Pet Friendly', 'Walk-in Closet'],
    description: 'Storybook cottage with a wraparound porch, raised garden beds and a sun-drenched reading nook. Minutes from Sellwood parks, cafés and the riverfront trail.',
    createdAt: '2025-11-28',
  }),
  P({
    id: 'p-12', title: 'Vista Ridge Land Parcel', type: 'Land', status: 'For Sale', price: 260000,
    city: 'Nashville', state: 'TN', address: 'Lot 7, Vista Ridge, Whites Creek',
    bedrooms: 0, bathrooms: 0, parking: 0, area: 21780, yearBuilt: 2025, latitude: 36.2686, longitude: -86.8253,
    agentId: 'a-3', featured: false, images: [E[4], E[8]],
    amenities: [],
    description: 'Half-acre buildable ridge lot with approved utilities, gentle grade and long-range valley views. Bring your architect — zoning allows single-family plus ADU.',
    createdAt: '2025-10-22',
  }),
];

/* ------------------------------ REVIEWS ------------------------------ */
export const seedReviews: Review[] = [
  { id: 'r-1', userId: 'u-cust2', userName: 'Priya Sharma', userImage: avatar(25), propertyId: 'p-1', rating: 5, comment: 'Toured this villa twice — the views are even better in person. Daniel was incredibly knowledgeable and never pushy.', createdAt: '2025-11-20' },
  { id: 'r-2', userId: 'u-cust3', userName: 'Tom Becker', userImage: avatar(60), propertyId: 'p-1', rating: 4, comment: 'Stunning build quality and the smart home setup is genuinely useful. Parking access road is a bit steep.', createdAt: '2025-11-25' },
  { id: 'r-3', userId: 'u-cust1', userName: 'Jordan Lee', userImage: avatar(15), propertyId: 'p-2', rating: 5, comment: 'The rooftop deck alone is worth it. Booking a visit through the portal took under a minute.', createdAt: '2025-11-02' },
  { id: 'r-4', userId: 'u-cust2', userName: 'Priya Sharma', userImage: avatar(25), propertyId: 'p-3', rating: 5, comment: 'We ended up making an offer! Elena guided us through every step. The backyard is perfect for kids.', createdAt: '2025-12-05' },
  { id: 'r-5', userId: 'u-cust3', userName: 'Tom Becker', userImage: avatar(60), propertyId: 'p-5', rating: 4, comment: 'Great loft with real character. West Loop location can be lively on weekends — bring earplugs or join the fun.', createdAt: '2025-11-30' },
];

/* ---------------------------- TESTIMONIALS ---------------------------- */
export const testimonials: Testimonial[] = [
  { id: 't-1', name: 'Rachel Nguyen', role: 'Bought a villa in Miami', image: avatar(44), rating: 5, quote: 'EstateHub made a cross-country purchase feel effortless. Virtual tours, instant scheduling and an agent who answered at 9pm — flawless.' },
  { id: 't-2', name: 'David Osei', role: 'Rented in Boston', image: avatar(59), rating: 5, quote: 'I filtered by budget and commute, saved three places, and toured all of them the same week. Signed a lease in 6 days.' },
  { id: 't-3', name: 'Lena Fischer', role: 'Property investor', image: avatar(35), rating: 4, quote: 'The analytics dashboard gives me a clear read on every market I invest in. It has become part of my weekly workflow.' },
];

/* ------------------------------ BOOKINGS ------------------------------ */
export const seedBookings: Booking[] = [
  { id: 'b-1', userId: 'u-cust1', propertyId: 'p-2', visitDate: '2026-02-24', visitTime: '11:00', status: 'CONFIRMED', createdAt: '2026-02-10' },
  { id: 'b-2', userId: 'u-cust1', propertyId: 'p-5', visitDate: '2026-01-18', visitTime: '15:30', status: 'COMPLETED', createdAt: '2026-01-05' },
  { id: 'b-3', userId: 'u-cust2', propertyId: 'p-1', visitDate: '2026-02-27', visitTime: '10:00', status: 'PENDING', createdAt: '2026-02-15' },
  { id: 'b-4', userId: 'u-cust3', propertyId: 'p-4', visitDate: '2026-02-20', visitTime: '14:00', status: 'CONFIRMED', createdAt: '2026-02-08' },
  { id: 'b-5', userId: 'u-cust2', propertyId: 'p-6', visitDate: '2026-01-30', visitTime: '16:00', status: 'CANCELLED', createdAt: '2026-01-22' },
];

/* ------------------------------ INQUIRIES ------------------------------ */
export const seedInquiries: Inquiry[] = [
  { id: 'q-1', userId: 'u-cust2', name: 'Priya Sharma', email: 'priya@example.com', propertyId: 'p-1', message: 'Is the seller open to including the home theater equipment in the sale?', status: 'RESPONDED', createdAt: '2026-02-11' },
  { id: 'q-2', userId: 'u-cust3', name: 'Tom Becker', email: 'tom@example.com', propertyId: 'p-4', message: 'Is a 6-month lease possible, and is the dock shared or private?', status: 'OPEN', createdAt: '2026-02-14' },
  { id: 'q-3', userId: 'u-cust1', name: 'Jordan Lee', email: 'customer@estatehub.com', propertyId: 'p-3', message: 'What are the average utility costs and HOA obligations?', status: 'OPEN', createdAt: '2026-02-16' },
];

/* ---------------------------- NOTIFICATIONS ---------------------------- */
export const seedNotifications: AppNotification[] = [
  { id: 'n-1', userId: 'u-cust1', title: 'Visit confirmed', message: 'Your visit to The Marlow Penthouse is confirmed for Feb 24, 11:00 AM.', isRead: false, createdAt: '2026-02-12' },
  { id: 'n-2', userId: 'u-cust1', title: 'Price drop alert', message: 'Willow Creek Family Home price context updated — check the latest report.', isRead: false, createdAt: '2026-02-15' },
  { id: 'n-3', userId: 'u-cust1', title: 'New listing match', message: 'Maple Grove Cottage matches your saved search "Portland under $500k".', isRead: true, createdAt: '2026-01-29' },
];

/* ---------------------- ANALYTICS (admin/agent) ---------------------- */
export const monthlyRevenue = [
  { month: 'Mar', revenue: 182, bookings: 34 }, { month: 'Apr', revenue: 210, bookings: 41 },
  { month: 'May', revenue: 265, bookings: 48 }, { month: 'Jun', revenue: 241, bookings: 44 },
  { month: 'Jul', revenue: 298, bookings: 53 }, { month: 'Aug', revenue: 322, bookings: 57 },
  { month: 'Sep', revenue: 305, bookings: 51 }, { month: 'Oct', revenue: 356, bookings: 62 },
  { month: 'Nov', revenue: 389, bookings: 68 }, { month: 'Dec', revenue: 371, bookings: 64 },
  { month: 'Jan', revenue: 402, bookings: 71 }, { month: 'Feb', revenue: 438, bookings: 77 },
];

/* ============================================================
 * Simulated REST API — same shapes as the Express backend.
 * ============================================================ */
const LATENCY = 450;
const delay = <T,>(v: T, ms = LATENCY) => new Promise<T>((res) => setTimeout(() => res(v), ms));

export const api = {
  /** GET /api/properties */
  getProperties(f: PropertyFilters = {}): Promise<Paginated<Property>> {
    let list = [...properties];
    if (f.q) {
      const q = f.q.toLowerCase();
      list = list.filter((p) =>
        [p.title, p.city, p.state, p.address, p.type].join(' ').toLowerCase().includes(q));
    }
    if (f.city && f.city !== 'All') list = list.filter((p) => p.city === f.city);
    if (f.type && f.type !== 'All') list = list.filter((p) => p.type === f.type);
    if (f.status && f.status !== 'All') list = list.filter((p) => p.status === f.status);
    if (f.minPrice) list = list.filter((p) => p.price >= f.minPrice!);
    if (f.maxPrice) list = list.filter((p) => p.price <= f.maxPrice!);
    if (f.bedrooms) list = list.filter((p) => p.bedrooms >= f.bedrooms!);
    if (f.bathrooms) list = list.filter((p) => p.bathrooms >= f.bathrooms!);
    if (f.minArea) list = list.filter((p) => p.area >= f.minArea!);
    switch (f.sort) {
      case 'price_asc': list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'area_desc': list.sort((a, b) => b.area - a.area); break;
      default: list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    const pageSize = f.pageSize ?? 6;
    const page = f.page ?? 1;
    const total = list.length;
    return delay({
      data: list.slice((page - 1) * pageSize, page * pageSize),
      total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  },

  /** GET /api/properties/:id */
  getProperty(id: string) {
    return delay(properties.find((p) => p.id === id) ?? null, 350);
  },

  /** GET /api/properties?featured=true */
  getFeatured() {
    return delay(properties.filter((p) => p.featured), 400);
  },

  /** GET /api/agents */
  getAgents() {
    return delay(agents.map((a) => ({ ...a, user: users.find((u) => u.id === a.userId)! })), 300);
  },
};

/* helpers */
export const agentById = (id: string) => {
  const a = agents.find((x) => x.id === id);
  return a ? { ...a, user: users.find((u) => u.id === a.userId)! } : null;
};
export const propertyById = (id: string) => properties.find((p) => p.id === id);
export const CITIES = ['All', ...Array.from(new Set(properties.map((p) => p.city))).sort()];
export const TYPES = ['All', 'House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial'];
export const STATUSES = ['All', 'For Sale', 'For Rent', 'Sold', 'Rented'];

export const money = (n: number, status?: string) =>
  '$' + n.toLocaleString('en-US') + (status === 'For Rent' || status === 'Rented' ? '/mo' : '');
