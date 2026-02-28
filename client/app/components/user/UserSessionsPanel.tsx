import type { Session } from "../../lib/auth-client";

interface UserSessionsPanelProps {
  sessions: Session[];
  isLoading: boolean;
  actionLoading: string | null;
  onRefresh: () => void;
  onRevokeSession: (sessionToken: string) => void;
  onRevokeAll: () => void;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UserSessionsPanel({
  sessions,
  isLoading,
  actionLoading,
  onRefresh,
  onRevokeSession,
  onRevokeAll,
}: UserSessionsPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
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
              onClick={onRevokeAll}
              disabled={actionLoading === "revoke-all"}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {actionLoading === "revoke-all" ? "Revoking..." : "Revoke All"}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
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
                onClick={() => onRevokeSession(session.token)}
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
  );
}
