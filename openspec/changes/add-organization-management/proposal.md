# Change: Add Organization Management

## Why

The current admin dashboard supports user management but lacks multi-tenancy capabilities. Many SaaS applications require organization/team management where users belong to organizations with different roles and permissions. The better-auth organization plugin provides this functionality, and this change adds a management interface for administrators to manage organizations, members, and invitations.

## What Changes

- **Backend**: Add better-auth organization plugin to server configuration
- **Database**: Add organization, member, and invitation tables via migration
- **Client**: Add organizationClient plugin to auth-client configuration
- **UI**: Add organization management interface to admin dashboard
  - Organization listing, creation, editing, and deletion
  - Member management (list, add, remove, update roles)
  - Invitation management (send, cancel, list)
- **Navigation**: Add "Organizations" menu item to dashboard sidebar

## Impact

- Affected specs: New capability `organization-management`
- Affected code:
  - `server/src/auth.ts` - Add organization plugin
  - `server/src/db/schema.ts` - Add organization-related tables
  - `client/app/lib/auth-client.ts` - Add organizationClient plugin
  - `client/app/routes/dashboard.tsx` - Add navigation
  - `client/app/routes/dashboard/organizations.*` - New route files

## Dependencies

- better-auth organization plugin (included in better-auth)
- Existing admin dashboard implementation (implemented)
- better-auth admin plugin (already configured)

## Risk Assessment

**Low Risk:**

- Uses established better-auth organization plugin patterns
- Follows existing dashboard UI patterns

**Medium Risk:**

- Database migrations for new tables
- Permission handling between admin plugin and organization plugin

**Mitigation:**

- Test migrations in development before production
- Clear separation between admin-level and organization-level permissions
