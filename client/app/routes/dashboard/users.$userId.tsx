import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
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

  const handleBan = async () => {
    if (!userId) return;

    // Prevent banning admin users
    if (user?.role === "admin") {
      setError("Cannot ban an admin user");
      setShowBanModal(false);
      return;
    }

    try {
      setActionLoading("ban");
      const { error: banError } = await adminApi.banUser({
        userId,
        banReason: banReason || undefined,
      });

      if (banError) {
        throw new Error(banError.message || "Failed to ban user");
      }

      setUser((prev) =>
        prev ? { ...prev, banned: true, banReason: banReason || null } : null
      );
      setShowBanModal(false);
      setBanReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ban user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async () => {
    if (!userId) return;

    try {
      setActionLoading("unban");
      const { error: unbanError } = await adminApi.unbanUser({
        userId,
      });

      if (unbanError) {
        throw new Error(unbanError.message || "Failed to unban user");
      }

      setUser((prev) =>
        prev
          ? { ...prev, banned: false, banReason: null, banExpires: null }
          : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unban user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    // Prevent deleting admin users
    if (user?.role === "admin") {
      setError("Cannot delete an admin user");
      return;
    }

    try {
      setActionLoading("delete");
      const { error: deleteError } = await adminApi.removeUser({
        userId,
      });

      if (deleteError) {
        throw new Error(deleteError.message || "Failed to delete user");
      }

      navigate("/dashboard/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      setActionLoading(null);
    }
  };

  const handleSetPassword = async () => {
    if (!userId) return;

    // Validate password
    if (!newPassword) {
      setPasswordError("Password is required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setActionLoading("password");
      setPasswordError(null);

      const { error: passwordError } = await adminApi.setUserPassword({
        userId,
        newPassword,
      });

      if (passwordError) {
        throw new Error(passwordError.message || "Failed to set password");
      }

      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to set password"
      );
    } finally {
      setActionLoading(null);
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
        err instanceof Error ? err.message : "Failed to revoke all sessions"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/users"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
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
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/users"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/users"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    name: user.name || "",
                    email: user.email,
                    role: (user.role as "user" | "admin") || "user",
                    emailVerified: user.emailVerified,
                  });
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-medium text-gray-500">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || ""}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                user.name?.[0] || user.email[0].toUpperCase()
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        role: e.target.value as "user" | "admin",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.emailVerified}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          emailVerified: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Email Verified
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.name || "No name"}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.banned ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                      Banned
                    </span>
                  ) : user.emailVerified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                      Unverified
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {user.role || "user"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">User ID</p>
                    <p className="font-mono text-gray-900">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email Verified</p>
                    <p className="text-gray-900">
                      {user.emailVerified ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="text-gray-900">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Updated</p>
                    <p className="text-gray-900">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                  {user.banned && user.banReason && (
                    <div className="md:col-span-2">
                      <p className="text-gray-500">Ban Reason</p>
                      <p className="text-red-600">{user.banReason}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {user.banned ? (
            <button
              onClick={handleUnban}
              disabled={actionLoading === "unban"}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {actionLoading === "unban" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Unbanning...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Unban User
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowBanModal(true)}
              disabled={user.role === "admin"}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                user.role === "admin" ? "Cannot ban admin users" : undefined
              }
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              Ban User
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={user.role === "admin"}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              user.role === "admin" ? "Cannot delete admin users" : undefined
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete User
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            Set Password
          </button>
          <button
            onClick={() => {
              setShowSessionsPanel(!showSessionsPanel);
              if (!showSessionsPanel) {
                fetchUserSessions();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            {showSessionsPanel ? "Hide Sessions" : "View Sessions"}
          </button>
        </div>
      </div>

      {/* Sessions Panel */}
      {showSessionsPanel && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Active Sessions
            </h3>
            <div className="flex gap-2">
              <button
                onClick={fetchUserSessions}
                disabled={isLoadingSessions}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 ${
                    isLoadingSessions ? "animate-spin" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
              {sessions.length > 0 && (
                <button
                  onClick={handleRevokAllSessions}
                  disabled={actionLoading === "revoke-all"}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading === "revoke-all"
                    ? "Revoking..."
                    : "Revoke All"}
                </button>
              )}
            </div>
          </div>

          {isLoadingSessions ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active sessions</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {session.userAgent || "Unknown Device"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>IP: {session.ipAddress || "Unknown"}</span>
                      <span>Expires: {formatDate(session.expiresAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeSession(session.token)}
                    disabled={actionLoading === `revoke-${session.token}`}
                    className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === `revoke-${session.token}`
                      ? "Revoking..."
                      : "Revoke"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ban User
            </h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to ban this user? They will not be able to
              log in.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ban Reason (optional)
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                rows={3}
                placeholder="Enter reason for ban..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason("");
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                disabled={actionLoading === "ban"}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading === "ban" ? "Banning..." : "Ban User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete User
            </h3>
            {user.role === "admin" ? (
              <p className="text-red-600 mb-4">
                Cannot delete an admin user. Remove admin role first.
              </p>
            ) : (
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {user.role !== "admin" && (
                <button
                  onClick={handleDelete}
                  disabled={actionLoading === "delete"}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading === "delete" ? "Deleting..." : "Delete User"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Set Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Set User Password
            </h3>
            <p className="text-gray-500 mb-4">
              Set a new password for this user. They will need to use this
              password to log in.
            </p>
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {passwordError}
              </div>
            )}
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordError(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSetPassword}
                disabled={actionLoading === "password"}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading === "password" ? "Setting..." : "Set Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
