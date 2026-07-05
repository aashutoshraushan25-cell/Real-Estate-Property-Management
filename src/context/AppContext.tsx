/* ============================================================
 * Global application state: auth session (JWT-style, persisted),
 * theme, favorites, bookings, inquiries, reviews, notifications
 * and toast messages. On the real backend these map to the
 * /api/auth, /api/favorites, /api/bookings ... endpoints.
 * ============================================================ */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppNotification, Booking, Favorite, Inquiry, Review, Role, User } from '../types';
import { seedBookings, seedInquiries, seedNotifications, seedReviews, users as seedUsers } from '../data/db';

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info' }

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  favorites: Favorite[];
  bookings: Booking[];
  inquiries: Inquiry[];
  reviews: Review[];
  notifications: AppNotification[];
  toasts: Toast[];
  registeredUsers: User[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: { name: string; email: string; phone: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  toggleTheme: () => void;
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  addBooking: (b: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  addInquiry: (q: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  addReview: (r: Omit<Review, 'id' | 'createdAt' | 'userId' | 'userName' | 'userImage'>) => void;
  markAllNotificationsRead: () => void;
  toast: (message: string, type?: Toast['type']) => void;
}

const Ctx = createContext<AppState>(null as unknown as AppState);
export const useApp = () => useContext(Ctx);

/* localStorage persistence helpers */
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
const save = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
};

let toastId = 0;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load('eh_session', null));
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => load('eh_users', seedUsers));
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [favorites, setFavorites] = useState<Favorite[]>(() => load('eh_favorites', [
    { id: 'f-1', userId: 'u-cust1', propertyId: 'p-1' },
    { id: 'f-2', userId: 'u-cust1', propertyId: 'p-6' },
  ]));
  const [bookings, setBookings] = useState<Booking[]>(() => load('eh_bookings', seedBookings));
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => load('eh_inquiries', seedInquiries));
  const [reviews, setReviews] = useState<Review[]>(() => load('eh_reviews', seedReviews));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => load('eh_notifications', seedNotifications));
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* persist slices */
  useEffect(() => save('eh_session', user), [user]);
  useEffect(() => save('eh_users', registeredUsers), [registeredUsers]);
  useEffect(() => save('eh_favorites', favorites), [favorites]);
  useEffect(() => save('eh_bookings', bookings), [bookings]);
  useEffect(() => save('eh_inquiries', inquiries), [inquiries]);
  useEffect(() => save('eh_reviews', reviews), [reviews]);
  useEffect(() => save('eh_notifications', notifications), [notifications]);

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try { localStorage.setItem('eh_theme', next); } catch { /* noop */ }
      return next;
    });
  }, []);

  /* ---------- auth (POST /api/auth/login|register|logout) ---------- */
  const login = useCallback((email: string, password: string) => {
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    setUser(found);
    toast(`Welcome back, ${found.name.split(' ')[0]}!`);
    return { ok: true };
  }, [registeredUsers, toast]);

  const register = useCallback((data: { name: string; email: string; phone: string; password: string }) => {
    if (registeredUsers.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: 'u-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: 'CUSTOMER' as Role,
      profileImage: `https://i.pravatar.cc/160?u=${encodeURIComponent(data.email)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRegisteredUsers((u) => [...u, newUser]);
    setUser(newUser);
    toast('Account created! Welcome to EstateHub.');
    return { ok: true };
  }, [registeredUsers, toast]);

  const logout = useCallback(() => {
    setUser(null);
    toast('You have been signed out.', 'info');
  }, [toast]);

  const updateProfile = useCallback((patch: Partial<User>) => {
    setUser((u) => {
      if (!u) return u;
      const next = { ...u, ...patch };
      setRegisteredUsers((list) => list.map((x) => (x.id === u.id ? next : x)));
      return next;
    });
    toast('Profile updated successfully.');
  }, [toast]);

  /* ---------- favorites (POST/DELETE /api/favorites) ---------- */
  const isFavorite = useCallback(
    (propertyId: string) => !!user && favorites.some((f) => f.userId === user.id && f.propertyId === propertyId),
    [user, favorites]);

  const toggleFavorite = useCallback((propertyId: string) => {
    if (!user) { toast('Please sign in to save properties.', 'info'); return; }
    setFavorites((f) => {
      const existing = f.find((x) => x.userId === user.id && x.propertyId === propertyId);
      if (existing) { toast('Removed from saved properties.', 'info'); return f.filter((x) => x.id !== existing.id); }
      toast('Property saved to favorites!');
      return [...f, { id: 'f-' + Date.now(), userId: user.id, propertyId }];
    });
  }, [user, toast]);

  /* ---------- bookings (POST /api/bookings) ---------- */
  const addBooking = useCallback((b: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    if (!user) return;
    setBookings((list) => [
      { ...b, id: 'b-' + Date.now(), userId: user.id, status: 'PENDING', createdAt: new Date().toISOString().slice(0, 10) },
      ...list,
    ]);
    toast('Visit request submitted! An agent will confirm shortly.');
  }, [user, toast]);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));
    toast(`Booking ${status.toLowerCase()}.`, 'info');
  }, [toast]);

  /* ---------- inquiries (POST /api/inquiries) ---------- */
  const addInquiry = useCallback((q: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    setInquiries((list) => [
      { ...q, id: 'q-' + Date.now(), userId: user?.id ?? 'guest', status: 'OPEN', createdAt: new Date().toISOString().slice(0, 10) },
      ...list,
    ]);
    toast('Inquiry sent! The agent will get back to you soon.');
  }, [user, toast]);

  const updateInquiryStatus = useCallback((id: string, status: Inquiry['status']) => {
    setInquiries((list) => list.map((q) => (q.id === id ? { ...q, status } : q)));
    toast(`Inquiry marked as ${status.toLowerCase()}.`, 'info');
  }, [toast]);

  /* ---------- reviews (POST /api/reviews) ---------- */
  const addReview = useCallback((r: Omit<Review, 'id' | 'createdAt' | 'userId' | 'userName' | 'userImage'>) => {
    if (!user) { toast('Please sign in to write a review.', 'info'); return; }
    setReviews((list) => [
      { ...r, id: 'r-' + Date.now(), userId: user.id, userName: user.name, userImage: user.profileImage, createdAt: new Date().toISOString().slice(0, 10) },
      ...list,
    ]);
    toast('Thanks for your review!');
  }, [user, toast]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((n) => n.map((x) => ({ ...x, isRead: true })));
  }, []);

  const value = useMemo<AppState>(() => ({
    user, theme, favorites, bookings, inquiries, reviews, notifications, toasts, registeredUsers,
    login, register, logout, updateProfile, toggleTheme, toggleFavorite, isFavorite,
    addBooking, updateBookingStatus, addInquiry, updateInquiryStatus, addReview,
    markAllNotificationsRead, toast,
  }), [user, theme, favorites, bookings, inquiries, reviews, notifications, toasts, registeredUsers,
    login, register, logout, updateProfile, toggleTheme, toggleFavorite, isFavorite,
    addBooking, updateBookingStatus, addInquiry, updateInquiryStatus, addReview,
    markAllNotificationsRead, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
