# Member Management Interface

## ADDED Requirements

### Requirement: Member Role Management

The system SHALL allow admins to update member roles within an organization.

#### Scenario: Change Member Role

- **Given** an authenticated admin user viewing organization members
- **When** they change a member's role from the role selector
- **Then** the member's role should be updated
- **And** they should see a success confirmation

#### Scenario: Available Roles

- **Given** an authenticated admin user editing a member's role
- **When** they open the role selector
- **Then** they should see available roles: owner, admin, member

#### Scenario: Prevent Demoting Last Owner

- **Given** an organization with only one owner
- **When** an admin attempts to change that owner's role
- **Then** they should see an error message
- **And** the role change should be prevented

### Requirement: Member Removal

The system SHALL allow admins to remove members from organizations.

#### Scenario: Remove Member

- **Given** an authenticated admin user viewing organization members
- **When** they click remove on a member and confirm
- **Then** the member should be removed from the organization
- **And** the member list should update

#### Scenario: Confirm Before Removal

- **Given** an authenticated admin user attempting to remove a member
- **When** they click the remove button
- **Then** they should see a confirmation dialog
- **And** removal should only proceed after confirmation

#### Scenario: Prevent Removing Last Owner

- **Given** an organization with only one owner
- **When** an admin attempts to remove that owner
- **Then** they should see an error message
- **And** the removal should be prevented

### Requirement: Member Display

The system SHALL display member information clearly.

#### Scenario: Display Member Details

- **Given** an authenticated admin user viewing organization members
- **When** the member list loads
- **Then** each member should display: name (or email if no name), email, role, join date

#### Scenario: Visual Role Indication

- **Given** an authenticated admin user viewing organization members
- **When** they view the member list
- **Then** member roles should be visually distinct (e.g., badge or icon)
- **And** the owner should be clearly identifiable
