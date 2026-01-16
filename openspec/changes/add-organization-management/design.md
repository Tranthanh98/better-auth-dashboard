# Design: Organization Management Architecture

## System Overview

Organization management extends the existing admin dashboard with multi-tenancy capabilities using better-auth's organization plugin. The design maintains consistency with the existing user management patterns while introducing organization-specific workflows.

## Architecture Decisions

### 1. Plugin Integration Strategy

**Decision:** Use better-auth organization plugin with default configuration initially

**Rationale:**

- Minimizes initial complexity
- Provides all core organization features out-of-the-box
- Can be extended later with custom roles and teams

**Implementation:**

```
Server (auth.ts):
├── organization plugin (default roles: owner, admin, member)
├── Default permissions (organization, member, invitation resources)
└── No teams enabled initially (can be added later)

Client (auth-client.ts):
├── organizationClient plugin
└── Organization namespace for API calls
```

### 2. Admin vs Organization Permissions

**Decision:** Admin dashboard users can manage all organizations, while organization roles are for within-organization permissions

**Rationale:**

- System admins (via admin plugin) have global oversight
- Organization owners/admins manage their own organizations
- Clear separation of concerns

**Permission Model:**

```
System Admin (role: "admin" via admin plugin)
├── View all organizations
├── Create/Edit/Delete any organization
├── Manage members in any organization
└── Cancel any invitation

Organization Owner (role: "owner" in organization)
├── Full control within their organization
├── Cannot access other organizations unless member
└── Uses organization plugin permissions
```

### 3. Database Schema Approach

**Decision:** Use better-auth CLI migration for organization tables

**Rationale:**

- Ensures compatibility with better-auth expectations
- Reduces manual schema definition errors
- Provides proper foreign key relationships

**Tables Added:**

```
organization
├── id, name, slug, logo, metadata, createdAt

member
├── id, userId, organizationId, role, createdAt

invitation
├── id, email, inviterId, organizationId, role, status, expiresAt, createdAt

session (modified)
├── activeOrganizationId (nullable)
```

### 4. UI Component Structure

**Decision:** Mirror user management patterns for consistency

**Rationale:**

- Familiar UI patterns for existing dashboard users
- Reduces development time
- Maintains code consistency

**Route Structure:**

```
/dashboard/organizations          → Organization list with search/filter
/dashboard/organizations/new      → Create organization form
/dashboard/organizations/:orgId   → Organization details & member management
/dashboard/organizations/:orgId/edit → Edit organization
/dashboard/organizations/:orgId/invite → Invite member form
```

**Component Hierarchy:**

```
OrganizationsIndex (list page)
├── OrganizationTable
├── SearchFilter
└── Pagination

OrganizationDetail (detail page)
├── OrganizationHeader
├── MemberList
│   ├── MemberRow
│   └── RoleDropdown
├── InvitationList
│   └── InvitationRow
└── ActionButtons (Delete, Edit)

OrganizationForm (create/edit)
├── NameInput
├── SlugInput
└── LogoInput (optional)
```

### 5. API Integration Patterns

**Decision:** Use better-auth's built-in organization namespace methods

**Rationale:**

- Type-safe API calls
- Consistent with better-auth patterns
- Automatic error handling

**Client API Usage:**

```typescript
// Organization CRUD
authClient.organization.create({ name, slug, logo });
authClient.organization.update({ data, organizationId });
authClient.organization.delete({ organizationId });
authClient.organization.getFullOrganization({ query: { organizationId } });

// Member management (via admin API on server)
auth.api.addMember({ body: { userId, role, organizationId } });
authClient.organization.removeMember({ memberIdOrEmail, organizationId });
authClient.organization.updateMemberRole({ memberId, role, organizationId });
authClient.organization.listMembers({ query: { organizationId } });

// Invitations
authClient.organization.inviteMember({ email, role, organizationId });
authClient.organization.cancelInvitation({ invitationId });
authClient.organization.listInvitations({ query: { organizationId } });
```

## Data Flow

### Organization Listing

```
Dashboard Route Loader
    ↓
Fetch Organizations (admin endpoint or custom query)
    ↓
OrganizationsIndex Component
    ↓
Display paginated table with search/filter
```

### Member Management

```
Organization Detail Page
    ↓
Fetch Full Organization (includes members)
    ↓
Display MemberList
    ↓
User Actions (remove, change role)
    ↓
Optimistic Update → API Call → Confirm/Rollback
```

## Security Considerations

1. **Route Protection:** All organization routes are protected by RequireAdmin component
2. **API Validation:** better-auth handles permission validation on API level
3. **Input Sanitization:** Form inputs validated before submission
4. **CSRF Protection:** Handled by better-auth session management

## Future Extensibility

This design allows for future additions:

- **Teams:** Enable teams configuration when needed
- **Custom Roles:** Define project-specific roles via access control
- **Dynamic Roles:** Enable runtime role creation per organization
- **Organization Limits:** Add subscription-based limits on organization creation
