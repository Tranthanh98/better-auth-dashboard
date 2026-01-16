# Change: Add Express Server with Better Auth and Drizzle

## Why

The admin dashboard client expects an authentication API backend at `http://localhost:3000`. Currently, no server exists to handle authentication requests. We need an Express server with Better Auth configured using the Drizzle adapter to provide the authentication backend for the admin dashboard.

## What Changes

- Create a new Express server in the `server/` directory using TypeScript
- Configure Better Auth with the admin plugin to support admin user management
- Set up Drizzle ORM as the database adapter for Better Auth
- Configure SQLite as the database (simple local development setup)
- Add proper CORS configuration to allow client requests from the dashboard
- Create database schema for Better Auth tables
- Add development and build scripts

## Impact

- Affected specs: None (new capability)
- Affected code: `server/` directory (new)
- Dependencies: express, better-auth, drizzle-orm, drizzle-kit, better-sqlite3

## Technical Notes

- Server will run on port 3000 by default (matching client's `VITE_AUTH_API_URL`)
- Uses SQLite for simplicity; can be migrated to PostgreSQL/MySQL later
- Better Auth admin plugin enables user management APIs used by the client
- CORS configured for `http://localhost:5173` (Vite dev server default)
