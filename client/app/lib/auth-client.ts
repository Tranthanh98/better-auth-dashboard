// Better-Auth Admin Client Configuration
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Runtime config interface (injected by Express adapter)
declare global {
  interface Window {
    __BETTER_AUTH_ADMIN__?: {
      authUrl: string;
    };
  }
}

// Base URL for the auth API
// Priority: 1. Runtime config (Express adapter) -> 2. Env variable (standalone) -> 3. Default
const AUTH_API_URL =
  (typeof window !== "undefined" && window.__BETTER_AUTH_ADMIN__?.authUrl) ||
  import.meta.env.VITE_AUTH_API_URL ||
  "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: AUTH_API_URL,
  plugins: [adminClient(), organizationClient()],
});

// Re-export commonly used hooks and methods
export const { signIn, signOut, signUp, useSession, getSession } = authClient;

// Export admin API directly from authClient
export const adminApi = authClient.admin;

// Export organization API directly from authClient
export const organizationApi = authClient.organization;

// User type based on better-auth schema
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | string | null;
  role: string | null;
}

// Session type
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date | string;
  token: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  ipAddress: string | null;
  userAgent: string | null;
}

// Admin user type (user with admin role)
export interface AdminUser extends User {
  role: "admin";
}

// Organization type
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date | string;
}

// Organization member type
export interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "member";
  createdAt: Date | string;
  user?: User;
}

// Organization invitation type
export interface Invitation {
  id: string;
  email: string;
  inviterId: string;
  organizationId: string;
  role: "admin" | "member";
  status: "pending" | "accepted" | "rejected" | "canceled";
  expiresAt: Date | string;
  createdAt: Date | string;
}
