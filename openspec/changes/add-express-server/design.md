## Context

The admin dashboard client is already built with Better Auth client SDK and expects a backend API at `http://localhost:3000`. The server directory is empty and needs to be scaffolded with a complete Express + TypeScript setup.

## Goals

- Provide a working authentication backend for the admin dashboard
- Support all Better Auth admin plugin APIs (user CRUD, session management)
- Use Drizzle ORM for type-safe database operations
- Keep the setup simple and development-friendly

## Non-Goals

- Production deployment configuration
- Advanced database migrations workflow
- Rate limiting or advanced security (initial version)
- Multi-database support

## Decisions

### Decision: Use SQLite with better-sqlite3

**Rationale**: SQLite is the simplest setup for local development. No external database server required. Drizzle has excellent SQLite support via `better-sqlite3`.

**Alternatives considered**:

- PostgreSQL: More production-ready but requires external setup
- MySQL: Similar complexity to PostgreSQL

### Decision: Single auth.ts configuration file

**Rationale**: Better Auth recommends keeping configuration in a single file that exports the auth instance. This file configures plugins, database adapter, and session settings.

### Decision: Use Drizzle schema generation from Better Auth

**Rationale**: Better Auth provides CLI to generate Drizzle schema, ensuring compatibility. We'll generate the schema and extend it if needed.

## Project Structure

```
server/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── .env
├── src/
│   ├── index.ts          # Express server entry
│   ├── auth.ts           # Better Auth configuration
│   └── db/
│       ├── index.ts      # Drizzle client
│       └── schema.ts     # Database schema
└── drizzle/              # Generated migrations
```

## Risks / Trade-offs

- **SQLite limitations**: Not suitable for production at scale → Can migrate to PostgreSQL later
- **Schema sync**: Must keep Drizzle schema in sync with Better Auth expectations → Use Better Auth CLI for generation

## Migration Plan

Not applicable - this is a new server setup.

## Open Questions

- None at this time
