# Roxiler Ratings Backend

Express, TypeScript, Prisma, and PostgreSQL backend for the store ratings challenge.

## Run

1. Start PostgreSQL with `docker compose up -d postgres`.
2. From `backend`, copy `.env.example` to `.env`, install dependencies, apply migrations, and seed the admin account:

   ```powershell
   npm install
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

3. Start the API locally with `npm run dev`. It is available at `http://localhost:4000`.

The Docker PostgreSQL service is published on host port `5433` because host port `5432` was already in use. Prisma and the backend connect through `localhost:5433`.

The seed creates `admin@roxiler.local` with password `Admin@123`; change it before deployment.

## Main routes

- `POST /api/auth/register`, `POST /api/auth/login`, `PATCH /api/auth/password`
- `GET /api/stores`, `PUT /api/stores/:storeId/ratings`
- Admin: `GET /api/admin/dashboard`, `GET/POST /api/admin/users`, `GET /api/admin/users/:id`, `GET/POST /api/admin/stores`
- Store owner: `GET /api/owner/dashboard`

Send authenticated requests with `Authorization: Bearer <token>`. Query listings support `sortBy`, `sortOrder=asc|desc`; store search supports `name` and `address`.

The browser frontend authenticates with a JWT stored in an `HttpOnly` cookie. Login and registration set the cookie, logout clears it, and credentialed CORS is enabled for `FRONTEND_URL` (default `http://localhost:5173`). Bearer tokens remain supported for API clients.
