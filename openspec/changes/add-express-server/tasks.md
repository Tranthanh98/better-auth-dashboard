## 1. Project Setup

- [x] 1.1 Initialize package.json with pnpm in `server/` directory
- [x] 1.2 Install dependencies: express, better-auth, drizzle-orm, better-sqlite3, cors, dotenv
- [x] 1.3 Install dev dependencies: typescript, tsx, @types/express, @types/cors, @types/better-sqlite3, drizzle-kit
- [x] 1.4 Create tsconfig.json with strict TypeScript configuration
- [x] 1.5 Create .env file with default configuration

## 2. Database Setup

- [x] 2.1 Create drizzle.config.ts for Drizzle Kit
- [x] 2.2 Create `src/db/schema.ts` with Better Auth required tables (user, session, account, verification)
- [x] 2.3 Create `src/db/index.ts` with Drizzle client initialization
- [x] 2.4 Run initial database migration to create tables

## 3. Better Auth Configuration

- [x] 3.1 Create `src/auth.ts` with Better Auth instance configuration
- [x] 3.2 Configure Drizzle adapter with schema
- [x] 3.3 Enable admin plugin for user management APIs
- [x] 3.4 Configure session and cookie settings

## 4. Express Server

- [x] 4.1 Create `src/index.ts` with Express server setup
- [x] 4.2 Configure CORS middleware for client origin
- [x] 4.3 Mount Better Auth handler on `/api/auth/*` routes
- [x] 4.4 Add health check endpoint

## 5. Scripts and Testing

- [x] 5.1 Add npm scripts: dev, build, start, db:generate, db:migrate
- [x] 5.2 Verify server starts and accepts requests
- [x] 5.3 Test admin API endpoints are accessible
- [x] 5.4 Verify client can connect and authenticate

## Dependencies

- Tasks 2.x depend on 1.x completion
- Task 3.x depends on 2.x completion
- Task 4.x depends on 3.x completion
- Task 5.x depends on all previous tasks
