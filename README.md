# Portfolio Generator API

A REST API that lets users sign up, build portfolios with projects, and publish them on a public URL (`/p/:slug`). Built with Express, TypeScript, Prisma and Postgres.

## Features

- Email and password auth with bcrypt-hashed passwords and JWT access tokens
- Portfolios and projects with strict ownership checks (other users get `404`, never someone else's data)
- Public read-only portfolio endpoint that exposes only safe fields
- Request validation with Zod, and fail-fast environment validation at startup
- Security basics: Helmet, CORS limited to the frontend origin, rate limiting on login and register
- Integration tests with Vitest and Supertest, run against a separate Neon branch

## Tech stack

Node.js, Express, TypeScript, Prisma 7, PostgreSQL (Neon), Zod, JSON Web Tokens, Vitest, Supertest. Managed as a pnpm workspace (`apps/api`).

## Getting started

```bash
pnpm install
cd apps/api
cp .env.example .env      # then fill in the values
pnpm prisma migrate deploy
pnpm dev
```

The API runs on `http://localhost:3001` by default.

### Environment variables

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development`, `production` or `test` |
| `PORT` | Port to listen on (default `3001`) |
| `CLIENT_URL` | Frontend origin allowed by CORS, e.g. `http://localhost:3000` |
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Secret for signing tokens (at least 32 characters) |

The app refuses to start if any required variable is missing or invalid.

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Log in and receive a JWT |
| GET | `/auth/me` | Yes | Current user profile |
| GET | `/portfolios` | Yes | List your portfolios |
| POST | `/portfolios` | Yes | Create a portfolio |
| GET | `/portfolios/:id` | Yes | Get one of your portfolios with its projects |
| PATCH | `/portfolios/:id` | Yes | Update your portfolio |
| DELETE | `/portfolios/:id` | Yes | Delete your portfolio |
| POST | `/portfolios/:id/projects` | Yes | Add a project |
| PATCH | `/portfolios/:id/projects/:projectId` | Yes | Update a project |
| DELETE | `/portfolios/:id/projects/:projectId` | Yes | Delete a project |
| GET | `/p/:slug` | No | Public portfolio page data |

Send the token as `Authorization: Bearer <token>`.

## Tests

Tests run against a separate database so your real data is never touched.

1. Create a second database or branch (for example a Neon branch called `test`).
2. Create `apps/api/.env.test` with `NODE_ENV=test`, `TEST_DB=true`, and the test branch's `DATABASE_URL`, `JWT_SECRET` and `CLIENT_URL`.
3. Run:

```bash
cd apps/api
pnpm test
```

## Project structure

```
apps/api/
  prisma/          schema and migrations
  src/
    config/        validated environment
    controllers/   request handlers
    middleware/    auth, rate limit, error handling
    routes/        route definitions
    schemas/       Zod schemas
    lib/           Prisma client, password helpers
    tests/         integration tests
```