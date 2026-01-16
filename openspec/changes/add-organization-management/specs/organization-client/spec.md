# Organization Client Configuration

## ADDED Requirements

### Requirement: Organization Client Plugin

The client SHALL integrate the better-auth organizationClient plugin.

#### Scenario: Plugin Configuration

- **Given** the client auth configuration
- **When** the client is initialized
- **Then** the organizationClient plugin should be registered
- **And** `authClient.organization` namespace should be available

#### Scenario: Type Safety

- **Given** TypeScript is configured
- **When** calling organization methods
- **Then** proper type inference should be available for all methods
- **And** organization, member, and invitation types should be accessible

### Requirement: Organization API Methods

The client SHALL expose organization management methods.

#### Scenario: Create Organization Method

- **Given** an authenticated user
- **When** calling `authClient.organization.create()`
- **Then** the method should accept name, slug, and optional logo
- **And** return the created organization or error

#### Scenario: Update Organization Method

- **Given** an authenticated user with permissions
- **When** calling `authClient.organization.update()`
- **Then** the method should accept data and organizationId
- **And** return the updated organization or error

#### Scenario: Delete Organization Method

- **Given** an authenticated user with owner permission
- **When** calling `authClient.organization.delete()`
- **Then** the method should accept organizationId
- **And** return success or error

#### Scenario: Get Full Organization Method

- **Given** an authenticated organization member
- **When** calling `authClient.organization.getFullOrganization()`
- **Then** the method should return organization details with members

### Requirement: Member Management Methods

The client SHALL expose member management methods.

#### Scenario: List Members Method

- **Given** an authenticated organization member
- **When** calling `authClient.organization.listMembers()`
- **Then** the method should return all organization members

#### Scenario: Remove Member Method

- **Given** an authenticated user with admin permissions
- **When** calling `authClient.organization.removeMember()`
- **Then** the method should remove the specified member

#### Scenario: Update Member Role Method

- **Given** an authenticated user with admin permissions
- **When** calling `authClient.organization.updateMemberRole()`
- **Then** the method should update the member's role

### Requirement: Invitation Management Methods

The client SHALL expose invitation management methods.

#### Scenario: Invite Member Method

- **Given** an authenticated user with invite permissions
- **When** calling `authClient.organization.inviteMember()`
- **Then** the method should create an invitation for the email

#### Scenario: List Invitations Method

- **Given** an authenticated organization member
- **When** calling `authClient.organization.listInvitations()`
- **Then** the method should return all pending invitations

#### Scenario: Cancel Invitation Method

- **Given** an authenticated user with admin permissions
- **When** calling `authClient.organization.cancelInvitation()`
- **Then** the method should cancel the specified invitation
