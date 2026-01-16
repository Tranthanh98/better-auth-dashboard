## ADDED Requirements

### Requirement: Express Server Foundation

The server SHALL provide an Express.js HTTP server running on a configurable port (default 3000) with TypeScript support.

#### Scenario: Server starts successfully

- **WHEN** the server application is started
- **THEN** it SHALL listen on the configured port
- **AND** log a startup message indicating the port

#### Scenario: Health check endpoint

- **WHEN** a GET request is made to `/health`
- **THEN** the server SHALL return HTTP 200 with status "ok"

### Requirement: CORS Configuration

The server SHALL configure CORS to allow cross-origin requests from the admin dashboard client.

#### Scenario: Client origin allowed

- **WHEN** a request is made from `http://localhost:5173`
- **THEN** the server SHALL include appropriate CORS headers
- **AND** allow credentials in cross-origin requests

#### Scenario: Preflight requests handled

- **WHEN** an OPTIONS preflight request is made
- **THEN** the server SHALL respond with allowed methods and headers

### Requirement: Environment Configuration

The server SHALL load configuration from environment variables with sensible defaults.

#### Scenario: Default configuration

- **WHEN** environment variables are not set
- **THEN** the server SHALL use default values:
  - PORT: 3000
  - DATABASE_URL: ./data/auth.db
  - BETTER_AUTH_SECRET: (required, no default)
  - CORS_ORIGIN: http://localhost:5173

#### Scenario: Environment override

- **WHEN** environment variables are set
- **THEN** the server SHALL use the provided values
