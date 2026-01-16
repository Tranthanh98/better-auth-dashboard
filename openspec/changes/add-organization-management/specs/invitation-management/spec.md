# Invitation Management Interface

## ADDED Requirements

### Requirement: Send Invitation

The system SHALL allow admins to invite new members to organizations.

#### Scenario: Send Invitation with Valid Email

- **Given** an authenticated admin user viewing an organization
- **When** they enter a valid email address and role, then submit
- **Then** an invitation should be created
- **And** the invitation should appear in the pending invitations list

#### Scenario: Validate Email Format

- **Given** an authenticated admin user on the invite member form
- **When** they enter an invalid email format
- **Then** they should see an email validation error
- **And** the invitation should not be sent

#### Scenario: Select Role for Invitation

- **Given** an authenticated admin user sending an invitation
- **When** they fill the invitation form
- **Then** they should be able to select a role: admin or member
- **And** the selected role should be applied to the invitation

#### Scenario: Invite Existing Member

- **Given** an authenticated admin user
- **When** they try to invite an email that is already a member
- **Then** they should see an error indicating the user is already a member
- **And** no duplicate invitation should be created

### Requirement: List Invitations

The system SHALL display pending invitations for an organization.

#### Scenario: Display Pending Invitations

- **Given** an authenticated admin user viewing an organization
- **When** the invitations section loads
- **Then** all pending invitations should be displayed
- **And** each should show: email, role, status, expiration date

#### Scenario: Show Invitation Status

- **Given** pending invitations exist for an organization
- **When** an admin views the invitations list
- **Then** the status should be clearly displayed (pending, expired)

#### Scenario: Empty Invitations State

- **Given** no pending invitations exist for an organization
- **When** an admin views the invitations section
- **Then** an appropriate empty state message should be shown

### Requirement: Cancel Invitation

The system SHALL allow admins to cancel pending invitations.

#### Scenario: Cancel Pending Invitation

- **Given** an authenticated admin user viewing pending invitations
- **When** they click cancel on an invitation and confirm
- **Then** the invitation should be cancelled
- **And** it should be removed from the pending list

#### Scenario: Confirm Before Cancellation

- **Given** an authenticated admin user attempting to cancel an invitation
- **When** they click the cancel button
- **Then** they should see a confirmation dialog
- **And** cancellation should only proceed after confirmation
