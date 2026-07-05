/* ============================================================
 * Domain models — mirrors the Prisma schema (server/prisma)
 * ============================================================ */

export type Role = 'ADMIN' | 'AGENT' | 'CUSTOMER';
export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Condo' | 'Townhouse' | 'Land' | 'Commercial';
export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type InquiryStatus = 'OPEN' | 'RESPONDED' | 'CLOSED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // bcrypt-hashed on the real backend; kept for demo auth only
  role: Role;
  profileImage: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  userId: string;
  experience: number; // years
  specialization: string;
  bio: string;
  rating: number;
  listings: number;
  deals: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  city: string;
  state: string;
  country: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number; // sqft
  yearBuilt: number;
  latitude: number;
  longitude: number;
  agentId: string;
  featured: boolean;
  images: string[];
  amenities: string[];
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  visitDate: string;
  visitTime: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
}

export interface Inquiry {
  id: string;
  userId: string;
  name: string;
  email: string;
  propertyId: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
}

/* ---------- query helpers ---------- */
export interface PropertyFilters {
  q?: string;
  city?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'area_desc';
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
