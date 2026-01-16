## ADDED Requirements

### Requirement: Better Auth Integration

The server SHALL integrate Better Auth as the authentication provider with all auth routes mounted under `/api/auth/*`.

#### Scenario: Auth routes available

- **WHEN** the server is running
- **THEN** Better Auth endpoints SHALL be accessible at `/api/auth/*`
- **AND** include sign-in, sign-up, sign-out, and session endpoints

#### Scenario: Session management

- **WHEN** a user successfully authenticates
- **THEN** a session SHALL be created and stored in the database
- **AND** a session cookie SHALL be set on the response

### Requirement: Admin Plugin Enabled

The server SHALL enable the Better Auth admin plugin to support administrative operations.

#### Scenario: Admin endpoints available

- **WHEN** the admin plugin is enabled
- **THEN** admin API endpoints SHALL be accessible
- **AND** support user listing, creation, modification, and deletion

#### Scenario: Admin role enforcement

- **WHEN** admin API endpoints are called
- **THEN** only users with admin role SHALL be authorized
- **AND** non-admin users SHALL receive HTTP 403 Forbidden

### Requirement: Drizzle Database Adapter

The server SHALL use Drizzle ORM as the database adapter for Better Auth with SQLite backend.

#### Scenario: Database schema

- **WHEN** the database is initialized
- **THEN** required tables SHALL exist: user, session, account, verification

#### Scenario: Data persistence

- **WHEN** users or sessions are created
- **THEN** data SHALL be persisted to the SQLite database file

### Requirement: User Schema Extension

The server SHALL extend the default Better Auth user schema to include admin-specific fields.

#### Scenario: User role field

- **WHEN** a user is created
- **THEN** the user record SHALL include a `role` field
- **AND** the role field SHALL support "admin" and "user" values

#### Scenario: Ban fields

- **WHEN** a user is created
- **THEN** the user record SHALL include ban-related fields: banned, banReason, banExpires
