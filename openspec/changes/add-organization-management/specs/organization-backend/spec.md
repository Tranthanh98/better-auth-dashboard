# Organization Backend Configuration

## ADDED Requirements

### Requirement: Organization Plugin Configuration

The server SHALL integrate the better-auth organization plugin to enable multi-tenancy support.

#### Scenario: Plugin Initialization

- **Given** the server auth configuration
- **When** the server starts
- **Then** the organization plugin should be initialized with default settings
- **And** organization API endpoints should be available

#### Scenario: Database Schema Migration

- **Given** the organization plugin is configured
- **When** database migrations are run
- **Then** the `organization` table should be created with fields: id, name, slug, logo, metadata, createdAt
- **And** the `member` table should be created with fields: id, userId, organizationId, role, createdAt
- **And** the `invitation` table should be created with fields: id, email, inviterId, organizationId, role, status, expiresAt, createdAt
- **And** the `session` table should have an `activeOrganizationId` column added

### Requirement: Organization API Endpoints

The server SHALL expose organization management endpoints via the better-auth organization plugin.

#### Scenario: Create Organization Endpoint

- **Given** an authenticated user
- **When** they call POST `/api/auth/organization/create` with valid data
- **Then** a new organization should be created
- **And** the user should be added as the owner

#### Scenario: Update Organization Endpoint

- **Given** an organization owner or admin
- **When** they call POST `/api/auth/organization/update` with updated data
- **Then** the organization details should be updated

#### Scenario: Delete Organization Endpoint

- **Given** an organization owner
- **When** they call POST `/api/auth/organization/delete`
- **Then** the organization and all members should be removed

#### Scenario: List Organizations Endpoint

- **Given** an authenticated user
- **When** they call GET `/api/auth/organization/list`
- **Then** they should receive a list of organizations they belong to

#### Scenario: Get Full Organization Endpoint

- **Given** an organization member
- **When** they call GET `/api/auth/organization/get-full-organization`
- **Then** they should receive complete organization details including members

### Requirement: Member Management Endpoints

The server SHALL expose member management endpoints.

#### Scenario: Add Member Endpoint

- **Given** an organization admin or owner (server-side only)
- **When** they call the addMember API with userId and role
- **Then** the user should be added as a member with the specified role

#### Scenario: Remove Member Endpoint

- **Given** an organization admin or owner
- **When** they call POST `/api/auth/organization/remove-member`
- **Then** the member should be removed from the organization

#### Scenario: Update Member Role Endpoint

- **Given** an organization admin or owner
- **When** they call POST `/api/auth/organization/update-member-role`
- **Then** the member's role should be updated

#### Scenario: List Members Endpoint

- **Given** an organization member
- **When** they call GET `/api/auth/organization/list-members`
- **Then** they should receive a list of all organization members

### Requirement: Invitation Management Endpoints

The server SHALL expose invitation management endpoints.

#### Scenario: Invite Member Endpoint

- **Given** an organization admin or owner
- **When** they call POST `/api/auth/organization/invite-member`
- **Then** an invitation should be created for the email address

#### Scenario: Cancel Invitation Endpoint

- **Given** an organization admin or owner
- **When** they call POST `/api/auth/organization/cancel-invitation`
- **Then** the invitation should be cancelled

#### Scenario: List Invitations Endpoint

- **Given** an organization member
- **When** they call GET `/api/auth/organization/list-invitations`
- **Then** they should receive a list of pending invitations
