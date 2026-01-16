# Tasks: Add Organization Management

## Phase 1: Backend Configuration

### 1.1 Add Organization Plugin to Server

- [x] Add organization plugin import to `server/src/auth.ts`
- [x] Configure organization plugin with default settings
- [x] Update database schema exports if needed

**Validation:** Server starts without errors; organization plugin is active

### 1.2 Database Migration

- [x] Run `npx drizzle-kit push` to add organization tables
- [x] Verify organization, member, invitation tables are created
- [x] Verify session table has activeOrganizationId column

**Validation:** Database contains all required organization tables

## Phase 2: Client Configuration

### 2.1 Add Organization Client Plugin

- [x] Add organizationClient plugin to `client/app/lib/auth-client.ts`
- [x] Export organization types (Organization, Member, Invitation)
- [x] Verify TypeScript types are available for organization methods

**Validation:** authClient.organization namespace is available with proper types

## Phase 3: Organization CRUD Interface

### 3.1 Organization Listing Page

- [x] Create `dashboard/organizations.index.tsx` route
- [x] Implement organization table with columns (name, slug, member count, created)
- [x] Add search by name/slug functionality
- [x] Implement pagination for organization list

**Validation:** Organizations are listed with search and pagination working

### 3.2 Create Organization

- [x] Create `dashboard/organizations.new.tsx` route
- [x] Implement organization creation form (name, slug, logo)
- [x] Add slug availability check
- [x] Handle form validation and error states
- [x] Redirect to organization detail on success

**Validation:** New organizations can be created with proper validation

### 3.3 Organization Detail Page

- [x] Create `dashboard/organizations.$orgId.tsx` route
- [x] Display organization info (name, slug, logo, created date)
- [x] Show member list with roles
- [x] Show pending invitations list
- [x] Add delete organization button with confirmation

**Validation:** Organization details, members, and invitations are displayed

### 3.4 Edit Organization

- [x] Create `dashboard/organizations.$orgId.edit.tsx` route (or modal)
- [x] Implement organization update form
- [x] Handle name, slug, and logo updates
- [x] Show success/error feedback

**Validation:** Organization details can be updated

## Phase 4: Member Management

### 4.1 Member List Display

- [x] Display members in organization detail page
- [x] Show member role (owner, admin, member)
- [x] Show member user info (name, email)
- [x] Indicate organization owner distinctly

**Validation:** All organization members are visible with their roles

### 4.2 Update Member Role

- [x] Add role dropdown/selector for each member
- [x] Implement role update functionality
- [x] Prevent demoting last owner
- [x] Show success/error feedback

**Validation:** Member roles can be changed appropriately

### 4.3 Remove Member

- [x] Add remove button for each member
- [x] Implement confirmation dialog
- [x] Call removeMember API
- [x] Refresh member list after removal

**Validation:** Members can be removed from organizations

## Phase 5: Invitation Management

### 5.1 Send Invitation

- [x] Create invite member form/modal
- [x] Implement email and role inputs
- [x] Add form validation (email format, role selection)
- [x] Call inviteMember API
- [x] Show invitation in pending list

**Validation:** Invitations can be sent to email addresses

### 5.2 List Invitations

- [x] Display pending invitations in organization detail
- [x] Show invitation email, role, status, expires

**Validation:** Pending invitations are visible

### 5.3 Cancel Invitation

- [x] Add cancel button for each pending invitation
- [x] Implement cancellation confirmation
- [x] Call cancelInvitation API
- [x] Remove from list on success

**Validation:** Invitations can be cancelled

## Phase 6: Navigation & Integration

### 6.1 Dashboard Navigation

- [x] Add "Organizations" nav item to sidebar in `dashboard.tsx`
- [x] Add organization icon
- [x] Ensure active state styling works

**Validation:** Organizations menu item appears and navigates correctly

### 6.2 Dashboard Overview Integration

- [ ] Add organization count to dashboard overview (optional)
- [ ] Add quick link to organizations from dashboard home

**Validation:** Organization stats visible on dashboard home

## Phase 7: Polish & Error Handling

### 7.1 Loading States

- [x] Add loading skeletons for organization list
- [x] Add loading states for member operations
- [x] Add loading indicators for invitation actions

**Validation:** All async operations show appropriate loading states

### 7.2 Error Handling

- [x] Handle API errors gracefully
- [x] Show user-friendly error messages
- [ ] Implement retry mechanisms where appropriate

**Validation:** Errors are displayed appropriately without breaking UI

### 7.3 Empty States

- [x] Design empty state for no organizations
- [x] Design empty state for no members (shouldn't happen)
- [x] Design empty state for no pending invitations

**Validation:** Empty states guide users appropriately
