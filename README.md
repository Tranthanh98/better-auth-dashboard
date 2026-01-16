# Better Auth Admin Dashboard

Admin Dashboard for [Better Auth](https://better-auth.com) - Manage users, organizations, and sessions with a beautiful, modern UI.

![License](https://img.shields.io/npm/l/better-auth-admin)
![NPM Version](https://img.shields.io/npm/v/better-auth-admin)

## ✨ Features

- 👥 **User Management**: View, create, edit, ban/unban users
- 🏢 **Organization Management**: Manage organizations, members, and invitations
- 🔐 **Session Management**: View and revoke user sessions
- 🎨 **Modern UI**: Built with React and Tailwind CSS
- 🔒 **Secure**: Only accessible to authenticated admin users

## 🚀 Quick Start (Express.js)

The easiest way to add an admin dashboard to your Express app:

```bash
npm install better-auth-admin
```

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

app.listen(3000);
// Admin dashboard: http://localhost:3000/admin
```

That's it! 🎉

For complete setup guide (including Better Auth configuration), see the [package documentation](./packages/express-adapter/README.md).

---

## 📦 Alternative: Run Client Standalone

If you want to run the dashboard as a standalone application or use it with a different backend framework, you can run the client separately.

### Prerequisites

- Node.js 18+
- pnpm
- A backend server with Better Auth configured with the [admin plugin](https://www.better-auth.com/docs/plugins/admin)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/Tranthanh98/better-auth-dashboard.git
cd better-auth-dashboard
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment**

Create a `.env` file in the `client` directory:

```bash
cd client
cp .env.example .env
```

Update the `VITE_AUTH_API_URL` to point to your Better Auth backend:

```env
VITE_AUTH_API_URL=http://localhost:3000
```

4. **Run development server**

```bash
pnpm dev
```

The dashboard will be available at `http://localhost:5173`.

### Build for Production

```bash
pnpm build
```

The build output will be in `client/build/`.

---

## 📂 Project Structure

```
better-auth-dashboard/
├── client/                    # React Router dashboard app
│   ├── app/
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React contexts (auth)
│   │   ├── lib/               # Utilities and API clients
│   │   └── routes/            # Route components
│   │       └── dashboard/     # Dashboard pages
│   └── build/                 # Production build
│
├── packages/
│   └── express-adapter/       # NPM package for Express integration
│       ├── src/               # Adapter source code
│       └── client/            # Built client assets
│
├── server/                    # Example Better Auth server
│   └── src/
│       ├── auth.ts            # Better Auth configuration
│       ├── index.ts           # Express server
│       └── db/                # Database setup (Drizzle)
│
└── openspec/                  # Project specifications
```

## 🔐 Backend Requirements

Your Better Auth backend must have the admin plugin configured:

```typescript
import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: {
    // your database config
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRole: "admin",
      adminUserIds: ["your-admin-user-id"],
    }),
    organization(), // Optional: enable organization management
  ],
});
```

Make sure you have at least one user with the `admin` role in your database.

## 🛠️ Development

### Run the example server

```bash
cd server
pnpm install
pnpm dev
```

### Run the client

```bash
cd client
pnpm dev
```

### Build the package

```bash
pnpm build:all
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📞 Support

- [GitHub Issues](https://github.com/Tranthanh98/better-auth-dashboard/issues)
- [Better Auth Documentation](https://better-auth.com)
