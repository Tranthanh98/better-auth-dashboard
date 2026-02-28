import { useState } from "react";
import { useNavigate } from "react-router";
import { adminApi, type User } from "../../lib/auth-client";

interface UserActionsPanelProps {
  user: User;
  onError: (error: string) => void;
  onSessionsToggle: () => void;
  showSessionsPanel: boolean;
}

export function UserActionsPanel({
  user,
  onError,
  onSessionsToggle,
  showSessionsPanel,
}: UserActionsPanelProps) {
  const navigate = useNavigate();

  // Modal states
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Loading states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Ban handler
  const handleBan = async () => {
    if (user.role === "admin") {
      onError("Cannot ban an admin user");
      setShowBanModal(false);
      return;
    }

    try {
      setActionLoading("ban");
      const { error: banError } = await adminApi.banUser({
        userId: user.id,
        banReason: banReason || undefined,
      });

      if (banError) {
        throw new Error(banError.message || "Failed to ban user");
      }

      setShowBanModal(false);
      setBanReason("");
      onError(""); // Clear any previous errors
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to ban user");
    } finally {
      setActionLoading(null);
    }
  };

  // Unban handler
  const handleUnban = async () => {
    try {
      setActionLoading("unban");
      const { error: unbanError } = await adminApi.unbanUser({
        userId: user.id,
      });

      if (unbanError) {
        throw new Error(unbanError.message || "Failed to unban user");
      }

      onError(""); // Clear any previous errors
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to unban user");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (user.role === "admin") {
      onError("Cannot delete an admin user");
      return;
    }

    try {
      setActionLoading("delete");
      const { error: deleteError } = await adminApi.removeUser({
        userId: user.id,
      });

      if (deleteError) {
        throw new Error(deleteError.message || "Failed to delete user");
      }

      navigate("/dashboard/users");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete user");
      setActionLoading(null);
    }
  };

  // Set password handler
  const handleSetPassword = async () => {
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
        userId: user.id,
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
        err instanceof Error ? err.message : "Failed to set password",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Impersonate handler
  const handleImpersonate = async () => {
    if (user.role === "admin") {
      onError("Cannot impersonate admin users");
      return;
    }

    try {
      setActionLoading("impersonate");
      const { data, error: impersonateError } = await adminApi.impersonateUser({
        userId: user.id,
      });

      if (impersonateError) {
        throw new Error(
          impersonateError.message || "Failed to impersonate user",
        );
      }

      if (data) {
        window.location.href = "/";
      }
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "Failed to impersonate user",
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
        <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
          Security Actions
        </h3>
        <div className="space-y-3">
          {user.banned ? (
            <button
              onClick={handleUnban}
              disabled={actionLoading === "unban"}
              className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
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
              </span>
              {actionLoading === "unban" && (
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowBanModal(true)}
              disabled={user.role === "admin"}
              className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                user.role === "admin" ? "Cannot ban admin users" : undefined
              }
            >
              <span className="flex items-center gap-2">
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
              </span>
            </button>
          )}

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
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
              Update Password
            </span>
            {actionLoading === "password" && (
              <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
            )}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={user.role === "admin"}
            className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              user.role === "admin" ? "Cannot delete admin users" : undefined
            }
          >
            <span className="flex items-center gap-2">
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
            </span>
            {actionLoading === "delete" && (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            )}
          </button>

          <button
            onClick={handleImpersonate}
            disabled={user.role === "admin" || actionLoading === "impersonate"}
            className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              user.role === "admin"
                ? "Cannot impersonate admin users"
                : undefined
            }
          >
            <span className="flex items-center gap-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Impersonate User
            </span>
            {actionLoading === "impersonate" && (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
          </button>

          {user.role === "admin" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Administrative Privileges
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    You are currently viewing a high-level administrative
                    profile. All actions are logged and traceable to your
                    account.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
}
