# 🏠 EstateHub — Real Estate Property Management Portal

A production-style, full-stack real estate platform where customers browse & book property visits,
agents manage listings and leads, and admins run the whole platform with analytics — built as a
portfolio / major-project showcase.

> **Live demo (this build):** a fully interactive React SPA with a simulated API layer that mirrors
> the real Express + Prisma backend contract. Demo logins — `admin@estatehub.com`,
> `agent@estatehub.com`, `customer@estatehub.com` (password: `demo123`).

---

## ✨ Features

| Customer | Agent | Admin |
|---|---|---|
| Browse / search / filter / sort listings | Dashboard with sales stats & charts | Analytics dashboard (revenue, bookings, inventory) |
| Property details, gallery, map, nearby places | Add / edit / delete properties | Manage users, agents, properties, bookings |
| Save favorites ♥ | Image upload (Multer → Cloudinary) | Review moderation |
| Schedule visits (booking flow) | Manage visit bookings | CSV reports (revenue / inventory / inquiries) |
| Contact agent + inquiry forms | Manage inquiries | Platform settings & security toggles |
| Reviews & ratings | | |
| Dashboard: profile, bookings, saved | | |

Plus: **JWT + refresh-token auth**, **role-based access control**, dark/light mode, glassmorphism UI,
skeleton loading, on-scroll animations, pagination, grid/list views, URL-synced filters,
responsive design, accessibility (labels/ARIA), toasts & notifications.

## 🧱 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router
- **Backend (reference impl.):** Node.js, Express, JWT + refresh tokens, bcrypt, Multer, Cloudinary,
  Helmet, CORS, Morgan, cookie-parser, express-validator, rate limiting
- **Database:** PostgreSQL + Prisma ORM (`server/prisma/schema.prisma`)
- **Deployment:** Vercel (client) · Render/Railway (API) · Neon (PostgreSQL) · Cloudinary (media)

## 📁 Project Structure

```
/
├── src/                     # client
│   ├── components/          # Layout, PropertyCard, Charts, ui primitives
│   ├── context/             # AppContext (auth, favorites, bookings, theme…)
│   ├── data/                # db.ts — seeded data + simulated REST API
│   ├── pages/               # Home, Listings, PropertyDetails, Auth, Misc
│   │   └── dashboard/       # Customer / Agent / Admin dashboards + Shell
│   └── types.ts             # shared domain models
├── server/
│   ├── prisma/schema.prisma # full PostgreSQL schema (Prisma ORM)
│   └── .env.example         # backend environment template
└── docs/API_DOCUMENTATION.md
```

## 🗄️ ER Diagram (text form)

```
User 1───1 Agent 1───* Property 1───* PropertyImage
 │                        │ *───* Amenity (via PropertyAmenity)
 ├──* Booking *──────────1┤
 ├──* Favorite *─────────1┤
 ├──* Inquiry *──────────1┤
 ├──* Review *───────────1┘
 └──* Notification
```

## 🚀 Getting Started

```bash
# client (this repo)
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/

# backend (reference)
cd server
cp .env.example .env # fill in DATABASE_URL, JWT secrets, Cloudinary keys
npx prisma migrate dev && npx prisma db seed
npm run dev          # http://localhost:5000
```

## 🔐 Security Checklist (API)

Helmet headers · CORS allow-list · JWT (15 min) + rotating refresh tokens (httpOnly, Secure,
SameSite=strict cookies) · bcrypt 12 rounds · Prisma parameterized queries (SQLi-safe) ·
express-validator input sanitization (XSS-safe) · rate limiting (100 req / 15 min / IP) ·
CSRF double-submit tokens · secrets via environment variables.

## ☁️ Deployment Guide

1. **Database:** create a Neon PostgreSQL project → copy `DATABASE_URL`.
2. **API:** deploy `server/` on Render/Railway; set env vars; run `prisma migrate deploy`.
3. **Client:** deploy on Vercel; set `VITE_API_URL` to the API origin.
4. **Media:** create a Cloudinary account; add cloud name/key/secret to the API env.

## 📚 More Docs

- API reference: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)
- Database schema: [`server/prisma/schema.prisma`](server/prisma/schema.prisma)

---

Built with ❤️ as a portfolio-grade demonstration of modern full-stack architecture.
