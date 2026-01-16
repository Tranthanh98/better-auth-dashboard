import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),

  // Dashboard routes (protected)
  layout("routes/dashboard.tsx", [
    route("dashboard", "routes/dashboard/dashboard.index.tsx", { index: true }),
    route("dashboard/users", "routes/dashboard/users.index.tsx"),
    route("dashboard/users/new", "routes/dashboard/users.new.tsx"),
    route("dashboard/users/:userId", "routes/dashboard/users.$userId.tsx"),
    route(
      "dashboard/organizations",
      "routes/dashboard/organizations.index.tsx"
    ),
    route(
      "dashboard/organizations/new",
      "routes/dashboard/organizations.new.tsx"
    ),
    route(
      "dashboard/organizations/:orgId",
      "routes/dashboard/organizations.$orgId.tsx"
    ),
    route(
      "dashboard/organizations/:orgId/edit",
      "routes/dashboard/organizations.$orgId.edit.tsx"
    ),
  ]),
] satisfies RouteConfig;
