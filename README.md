# Roxiler Ratings

A full-stack store-rating application that lets users discover stores, submit ratings, and manage their accounts. Administrators can manage users and stores from a dashboard, while store owners can view ratings for the stores they own.

## Overview

Roxiler Ratings provides a role-based platform for collecting and reviewing store ratings. The Express API validates requests, persists data with Prisma and PostgreSQL, and authenticates users with JWTs stored in secure HTTP-only cookies. The React frontend provides separate experiences for administrators, regular users, and store owners.

## Features

- User registration, login, logout, and password changes
- Role-based access control for administrators, users, and store owners
- Store listing with case-insensitive name and address search
- Sorting stores and administrative listings by supported fields
- Create or update a user's rating for a store
- Calculated overall store ratings and each user's own rating
- Administrator dashboard with user, store, and rating totals
- Administrator views for managing users and stores
- Store-owner dashboard with ratings and reviewer details
- Request validation with Zod and centralized error handling
- PostgreSQL database managed through Prisma migrations
- Responsive React frontend styled with Tailwind CSS

## Screenshots

The screenshots below show the main user journeys and role-specific screens in Roxiler Ratings.

### Authentication

#### User login

The focused login screen allows existing users to securely access their dashboard.

![Roxiler login screen](frontend/public/screenshots/login.png)

### User experience

#### Store discovery and ratings

Users can search stores by name or address, view overall ratings, submit a rating from 1 to 5, and update their password.

![Store discovery and rating screen](frontend/public/screenshots/user-store-ratings.png)

### Administration

#### Admin dashboard overview

Administrators can see platform totals for users, stores, and ratings, then switch between user and store management views.

![Admin dashboard overview](frontend/public/screenshots/admin-dashboard.png)

#### User management

The user management view supports filtering by name, email, address, and role, as well as adding users with a selected role.

![Admin user management screen](frontend/public/screenshots/admin-user-management.png)

## Tech Stack

- **Frontend:** React, React Router, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, HTTP-only cookies, bcrypt
- **Validation:** Zod
- **Infrastructure:** Docker Compose

## Project Structure

```text
roxiler/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── app.js
│   │   ├── config.js
│   │   ├── db.js
│   │   ├── middleware.js
│   │   ├── server.js
│   │   └── validation.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│   ├── public/
│   │   └── screenshots/
│   │       ├── login.png
│   │       ├── user-store-ratings.png
│   │       ├── admin-dashboard.png
│   │       └── admin-user-management.png
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- Docker Desktop with Docker Compose

### 1. Start PostgreSQL

From the project root, start the database container:

```bash
docker compose up -d postgres
```

PostgreSQL is exposed on `localhost:5433` to avoid conflicts with a local PostgreSQL service using port `5432`.

### 2. Configure and initialize the backend

```bash
cd backend
copy .env.example .env
npm install
npx prisma migrate dev --name init
npm run prisma:seed
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`.

Start the API in development mode:

```bash
npm run dev
```

The backend runs at `http://localhost:4000`.

### 3. Configure and start the frontend

Open a second terminal:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`.

The frontend runs at `http://localhost:5173`.

### Default administrator

The seed script creates the following development administrator:

```text
Email:    admin@roxiler.local
Password: Admin@123
```

Change this password before using the application outside local development.

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`:

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5433/roxiler?schema=public` |
| `JWT_SECRET` | Secret used to sign authentication tokens | `replace-with-a-long-random-secret` |
| `PORT` | API server port | `4000` |
| `FRONTEND_URL` | Allowed frontend origin for credentialed CORS | `http://localhost:5173` |
| `NODE_ENV` | Runtime environment; enables secure cookies in production | `development` |

### Frontend

Create `frontend/.env` from `frontend/.env.example`:

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000/api` |

Never commit `.env` files or real credentials. The repository includes `.env.example` files for safe configuration templates.

## API Reference

All endpoints are prefixed with `/api`. Except where noted, protected endpoints require the authentication cookie set during login or registration.

### Health and authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Check API availability |
| `POST` | `/api/auth/register` | Public | Register a regular user |
| `POST` | `/api/auth/login` | Public | Authenticate a user |
| `POST` | `/api/auth/logout` | Public | Clear the authentication cookie |
| `PATCH` | `/api/auth/password` | Authenticated | Change the current user's password |

### Stores and ratings

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/stores` | Authenticated | List stores with optional search and sorting |
| `PUT` | `/api/stores/:storeId/ratings` | User | Create or update the current user's rating |

Supported store-list query parameters include:

- `name` — case-insensitive store-name search
- `address` — case-insensitive address search
- `sortBy` — `name`, `address`, or `createdAt`
- `sortOrder` — `asc` or `desc`

Ratings use integer scores from 1 to 5. Each user can have one rating per store; submitting another rating updates the existing one.

### Administrator

All administrator endpoints require an authenticated user with the `ADMIN` role.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/dashboard` | Return total users, stores, and ratings |
| `POST` | `/api/admin/users` | Create a user with a selected role |
| `GET` | `/api/admin/users` | List and filter users |
| `GET` | `/api/admin/users/:id` | View a user and owned-store details |
| `POST` | `/api/admin/stores` | Create a store |
| `GET` | `/api/admin/stores` | List and filter stores |

### Store owner

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/owner/dashboard` | Store owner | View owned stores and their ratings |

## Useful Commands

### Backend

```bash
npm run dev             # Start the API with file watching
npm start               # Start the API
npm run prisma:generate # Generate the Prisma client
npm run prisma:migrate  # Create and apply a development migration
npm run prisma:seed     # Seed the development administrator
```

### Frontend

```bash
npm run dev     # Start the Vite development server
npm run build   # Create a production build
npm run preview # Preview the production build locally
```

### Database

Stop the database container without deleting its data:

```bash
docker compose stop postgres
```

Stop the container and remove the database volume:

```bash
docker compose down -v
```

Only remove the volume when you intentionally want to reset local database data.

## Security Notes

- Use a long, randomly generated `JWT_SECRET` in deployed environments.
- Set `NODE_ENV=production` to enable secure authentication cookies over HTTPS.
- Replace the seeded administrator password before deployment.
- Keep all `.env` files out of version control.
- Configure `FRONTEND_URL` to the exact production frontend origin.

## Future Improvements

- Add automated API and end-to-end test coverage
- Add pagination for large user, store, and rating collections
- Add store editing and deletion workflows for administrators
- Add password reset and email verification
- Add production deployment documentation and monitoring

## License

This project is available under the MIT License.
