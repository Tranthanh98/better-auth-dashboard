# better-auth-admin

Express adapter for [Better Auth](https://better-auth.com) Admin Dashboard.

Easily add a beautiful admin dashboard to manage users, organizations, and sessions in your Better Auth powered application.

## Installation

```bash
npm install better-auth-admin
# or
pnpm add better-auth-admin
# or
yarn add better-auth-admin
```

## Quick Start

```typescript
import express from "express";
import { betterAuthAdmin } from "better-auth-admin";

const app = express();

// Mount admin dashboard at /admin
app.use(
  "/admin",
  betterAuthAdmin({
    authUrl: "http://localhost:3000", // Your Better Auth server URL
  })
);

app.listen(8080, () => {
  console.log("Admin dashboard available at http://localhost:8080/admin");
});
```

## Configuration Options

| Option    | Type     | Required | Default               | Description                             |
| --------- | -------- | -------- | --------------------- | --------------------------------------- |
| `authUrl` | `string` | ✅       | -                     | The base URL of your Better Auth server |
| `title`   | `string` | ❌       | `"Better Auth Admin"` | Custom title for the dashboard          |

## Example with Better Auth

```typescript
import express from "express";
import { betterAuth } from "better-auth";
import { betterAuthAdmin } from "better-auth-admin";

const app = express();

// Your Better Auth configuration
const auth = betterAuth({
  // ... your config
});

// Mount Better Auth API
app.all("/api/auth/*", (req, res) => auth.handler(req, res));

// Mount Admin Dashboard
app.use(
  "/admin",
  betterAuthAdmin({
    authUrl: "http://localhost:3000",
  })
);

app.listen(3000);
```

## Standalone Deployment

If you prefer to deploy the admin dashboard separately (e.g., on Vercel, Netlify, or your own server), you can use the React client directly:

1. Clone the repository
2. Set environment variable: `VITE_AUTH_API_URL=https://your-auth-server.com`
3. Build and deploy: `pnpm build`

## Features

- 👥 **User Management**: View, create, edit, ban/unban users
- 🏢 **Organization Management**: Manage organizations, members, and invitations
- 🔐 **Session Management**: View and revoke user sessions
- 🎨 **Modern UI**: Built with React and Tailwind CSS
- 🔒 **Secure**: Only accessible to admin users

## Requirements

- Express.js 4.x or 5.x
- Better Auth server with admin plugin enabled

## License

MIT
