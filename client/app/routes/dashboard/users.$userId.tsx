import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  UserActionsPanel,
  UserDetailsCard,
  UserDetailsHeader,
  UserSessionsPanel,
} from "../../components/user";
import { adminApi, type Session, type User } from "../../lib/auth-client";
import type { Route } from "./+types/users.$userId";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Details - Better Auth Admin" },
    { name: "description", content: "View and manage user details" },
  ];
}

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    role: "user" | "admin";
    emailVerified: boolean;
  }>({ name: "", email: "", role: "user", emailVerified: false });
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [showSessionsPanel, setShowSessionsPanel] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);
        // Use listUsers with filter to get specific user
        const { data, error: apiError } = await adminApi.listUsers({
          query: {
            filterField: "id",
            filterValue: userId,
            filterOperator: "eq",
            limit: 1,
          },
        });

        if (apiError || !data) {
          throw new Error(apiError?.message || "Failed to fetch user");
        }

        if (data.users.length === 0) {
          throw new Error("User not found");
        }

        const fetchedUser = data.users[0] as User;
        setUser(fetchedUser);
        setEditForm({
          name: fetchedUser.name || "",
          email: fetchedUser.email,
          role: (fetchedUser.role as "user" | "admin") || "user",
          emailVerified: fetchedUser.emailVerified,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;

    try {
      setIsSaving(true);
      // Update user data
      const { data, error: updateError } = await adminApi.updateUser({
        userId,
        data: {
          name: editForm.name,
          email: editForm.email,
          emailVerified: editForm.emailVerified,
        },
      });

      if (updateError) {
        throw new Error(updateError.message || "Failed to update user");
      }

      // Update role if changed
      if (editForm.role !== user?.role) {
        const { error: roleError } = await adminApi.setRole({
          userId,
          role: editForm.role,
        });

        if (roleError) {
          throw new Error(roleError.message || "Failed to update role");
        }
      }

      // Refetch user to get updated data
      const { data: refreshData } = await adminApi.listUsers({
        query: {
          filterField: "id",
          filterValue: userId,
          filterOperator: "eq",
          limit: 1,
        },
      });

      if (refreshData && refreshData.users.length > 0) {
        setUser(refreshData.users[0] as User);
      }

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchUserSessions = async () => {
    if (!userId) return;

    try {
      setIsLoadingSessions(true);
      const { data, error: sessionsError } = await adminApi.listUserSessions({
        userId,
      });

      if (sessionsError) {
        throw new Error(sessionsError.message || "Failed to fetch sessions");
      }

      setSessions((data?.sessions as Session[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      setActionLoading(`revoke-${sessionToken}`);
      const { error: revokeError } = await adminApi.revokeUserSession({
        sessionToken,
      });

      if (revokeError) {
        throw new Error(revokeError.message || "Failed to revoke session");
      }

      // Remove the revoked session from the list
      setSessions((prev) => prev.filter((s) => s.token !== sessionToken));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke session");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokAllSessions = async () => {
    if (!userId) return;

    try {
      setActionLoading("revoke-all");
      const { error: revokeError } = await adminApi.revokeUserSessions({
        userId,
      });

      if (revokeError) {
        throw new Error(revokeError.message || "Failed to revoke all sessions");
      }

      setSessions([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to revoke all sessions",
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-900 text-white rounded w-48">
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <UserDetailsHeader
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={() => setIsEditing(true)}
        onCancel={() => {
          setIsEditing(false);
          setEditForm({
            name: user.name || "",
            email: user.email,
            role: (user.role as "user" | "admin") || "user",
            emailVerified: user.emailVerified,
          });
        }}
        onSave={handleSave}
      />

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Details Card & Sessions Panel */}
        <div className="lg:col-span-2 space-y-6">
          <UserDetailsCard
            user={user}
            isEditing={isEditing}
            editForm={editForm}
            onEditFormChange={setEditForm}
          />

          {/* Sessions Panel - Constrained to left column */}
          <UserSessionsPanel
            sessions={sessions}
            isLoading={isLoadingSessions}
            actionLoading={actionLoading}
            onRefresh={fetchUserSessions}
            onRevokeSession={handleRevokeSession}
            onRevokeAll={handleRevokAllSessions}
          />
        </div>

        {/* Right Column - Actions Panel */}
        <div>
          <UserActionsPanel
            user={user}
            onError={setError}
            onSessionsToggle={() => {
              setShowSessionsPanel(!showSessionsPanel);
              if (!showSessionsPanel) {
                fetchUserSessions();
              }
            }}
            showSessionsPanel={showSessionsPanel}
          />
        </div>
      </div>
    </div>
  );
}
