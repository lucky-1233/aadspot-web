# AdSpot Rwanda Marketplace

AdSpot is a marketplace frontend and backend foundation for a multi-vendor e-commerce platform serving Rwanda. The project currently includes a React + Vite frontend and a Node.js + Express backend with MongoDB integration and JWT-based authentication.

## Project structure

- `src/` - Vite React frontend
- `backend/` - Express API server
- `backend/config` - database connection config
- `backend/middleware` - auth and error handling
- `backend/models` - MongoDB schemas
- `backend/routes` - API endpoints
- `backend/services` - payment and external service integration
- `backend/utils` - utility helpers
- `.env.example` - sample environment file

## Prerequisites

- Node.js 18+
- MongoDB running locally or remotely
- A `.env` file in the project root

## Install dependencies

```bash
npm install
```

## Environment setup

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update the values for your environment. At minimum:

- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/adspot`
- `JWT_SECRET=your_secure_secret`
- `CLIENT_URL=http://localhost:5173`

## Start the frontend

```bash
npm run dev
```

## Start the backend

```bash
npm run dev:server
```

## Seed demo data

```bash
npm run seed
```

## Production server

```bash
npm run start:server
```

## Main API endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/me` (requires auth)
- `GET /api/users` (admin only)

### Stores

- `GET /api/stores`
- `POST /api/stores` (seller only)

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (seller only)
- `PUT /api/products/:id` (seller only)
- `DELETE /api/products/:id` (seller only)

### Orders

- `GET /api/orders` (auth required)
- `POST /api/orders` (auth required)
- `PATCH /api/orders/:id/status` (seller/admin)

### Admin

- `GET /api/admin/overview` (admin only)
- `GET /api/admin/users` (admin only)

## Authentication

Passwords are hashed using `bcryptjs`, and API access is protected with JWT tokens. Protect routes use the `Authorization: Bearer <token>` header.

## Marketplace roadmap

This project is intentionally structured as a practical foundation for the full AdSpot marketplace. The frontend is already built for marketplace browsing, product discovery, cart flows, and pages for stores, auth, profile, orders, and checkout.

The backend now includes the initial foundation for:

- user authentication and role-based access
- MongoDB models for users, stores, products, orders, and categories
- seller store and product management
- order creation with stock validation
- payment-service abstraction
- admin overview endpoints

## Notes

- This is a development foundation, not a fully production-complete payment or cloud deployment setup.
- No real secrets are stored in frontend code.
- Demo data is intentionally separate from protected production workflows.
