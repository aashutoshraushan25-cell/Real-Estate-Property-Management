# EstateHub REST API — Reference

Base URL: `https://api.estatehub.com/api` · All responses: `{ success, data | error }`
Auth: `Authorization: Bearer <accessToken>` — refresh token rotates via httpOnly cookie.

## Auth
| Method | Endpoint | Body | Access |
|---|---|---|---|
| POST | `/auth/register` | `name, email, phone?, password` | Public |
| POST | `/auth/login` | `email, password` | Public |
| POST | `/auth/refresh` | (cookie) | Public |
| POST | `/auth/logout` | — | Authed |
| POST | `/auth/forgot-password` | `email` | Public |
| POST | `/auth/reset-password` | `token, password` | Public |
| GET  | `/auth/verify-email/:token` | — | Public |

## Users
| GET `/users` | list (paginated) | Admin |
|---|---|---|
| GET `/users/:id` | profile | Owner/Admin |
| PUT `/users/:id` | `name, phone, profileImage` | Owner/Admin |
| DELETE `/users/:id` | suspend/delete | Admin |

## Properties
`GET /properties` — query params: `q, city, type, status, minPrice, maxPrice, bedrooms, bathrooms, minArea, sort(newest|price_asc|price_desc|area_desc), page, pageSize, featured`
Response: `{ data: Property[], total, page, pageSize, totalPages }`

| POST `/properties` | multipart (fields + images[]) → Multer → Cloudinary | Agent/Admin |
|---|---|---|
| GET `/properties/:id` | includes images, amenities, agent, avgRating | Public |
| PUT `/properties/:id` | partial update | Owner-agent/Admin |
| DELETE `/properties/:id` | cascades images/bookings | Owner-agent/Admin |

## Bookings
| POST `/bookings` | `propertyId, visitDate, visitTime` | Customer |
|---|---|---|
| GET `/bookings` | own (customer), on-my-listings (agent), all (admin) | Authed |
| PUT `/bookings/:id` | `status: CONFIRMED|COMPLETED|CANCELLED` | Agent/Admin/Owner(cancel) |
| DELETE `/bookings/:id` | remove | Owner/Admin |

## Favorites / Reviews / Inquiries
- `POST /favorites` `{ propertyId }` · `DELETE /favorites/:id` — Customer
- `POST /reviews` `{ propertyId, rating(1-5), comment }` · `GET /reviews/:propertyId` — Public read
- `POST /inquiries` `{ propertyId, name, email, message }` (guest allowed) · `GET /inquiries` — Agent/Admin

## Admin analytics
- `GET /admin/stats` → totals (users, properties, bookings, revenue)
- `GET /admin/reports/revenue?year=2026` → monthly series (CSV via `?format=csv`)

## Error codes
`400` validation · `401` missing/expired token · `403` role forbidden · `404` not found ·
`409` conflict (duplicate email/favorite) · `429` rate limited · `500` server.
