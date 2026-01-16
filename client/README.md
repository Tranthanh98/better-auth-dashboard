# Better Auth Admin Dashboard

A comprehensive admin dashboard for managing users with [Better Auth](https://www.better-auth.com/).

## Features

- 🔐 **Secure Admin Authentication** - Admin-only access using Better Auth's admin plugin
- 👥 **User Management** - Complete CRUD operations for user accounts
- 🔍 **Search & Filter** - Find users by email, name, or status
- 🚫 **Ban Management** - Ban/unban users with reason tracking
- 📊 **Dashboard Overview** - User statistics and quick actions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Prerequisites

- Node.js 18+
- A backend server with Better Auth configured with the [admin plugin](https://www.better-auth.com/docs/plugins/admin)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the `VITE_AUTH_API_URL` to point to your Better Auth backend:

```env
VITE_AUTH_API_URL=http://localhost:3000
```

### 3. Backend Requirements

Your Better Auth backend must have the admin plugin configured:

```typescript
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  // ... your config
  plugins: [
    admin({
      // Optionally configure admin settings
    }),
  ],
});
```

Ensure you have at least one user with the `admin` role in your database.

### 4. Run Development Server

```bash
pnpm dev
```

The dashboard will be available at `http://localhost:5173`.

## Project Structure

```
app/
├── components/          # Reusable UI components
│   └── require-admin.tsx    # Admin route guard
├── contexts/            # React contexts
│   └── auth-context.tsx     # Authentication state
├── lib/                 # Utilities and API clients
│   └── auth-client.ts       # Better Auth client & admin API
└── routes/              # Route components
    ├── home.tsx             # Landing page
    ├── login.tsx            # Admin login
    ├── dashboard.tsx        # Dashboard layout
    └── dashboard/           # Dashboard pages
        ├── dashboard.index.tsx  # Overview
        ├── users.index.tsx      # User list
        ├── users.new.tsx        # Create user
        └── users.$userId.tsx    # User details
```

## Admin API Endpoints

The dashboard uses these Better Auth admin endpoints:

| Endpoint                           | Description      |
| ---------------------------------- | ---------------- |
| `GET /api/auth/admin/list-users`   | List all users   |
| `GET /api/auth/admin/get-user`     | Get user by ID   |
| `POST /api/auth/admin/create-user` | Create new user  |
| `POST /api/auth/admin/update-user` | Update user info |
| `POST /api/auth/admin/remove-user` | Delete user      |
| `POST /api/auth/admin/ban-user`    | Ban a user       |
| `POST /api/auth/admin/unban-user`  | Unban a user     |
| `POST /api/auth/admin/set-role`    | Set user role    |

## Scripts

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Start development server     |
| `pnpm build`     | Build for production         |
| `pnpm start`     | Start production server      |
| `pnpm typecheck` | Run TypeScript type checking |

## Tech Stack

- **React 19** - UI library
- **React Router 7** - Routing and data loading
- **Tailwind CSS 4** - Styling
- **Better Auth** - Authentication
- **TypeScript** - Type safety

## License

MIT
