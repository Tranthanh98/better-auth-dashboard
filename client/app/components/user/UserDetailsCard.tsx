import type { User } from "../../lib/auth-client";

interface UserDetailsCardProps {
  user: User;
  isEditing: boolean;
  editForm: {
    name: string;
    email: string;
    role: "user" | "admin";
    emailVerified: boolean;
  };
  onEditFormChange: (form: {
    name: string;
    email: string;
    role: "user" | "admin";
    emailVerified: boolean;
  }) => void;
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

export function UserDetailsCard({
  user,
  isEditing,
  editForm,
  onEditFormChange,
}: UserDetailsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Avatar */}
        <div className="shrink-0">
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
                    onEditFormChange({ ...editForm, name: e.target.value })
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
                    onEditFormChange({ ...editForm, email: e.target.value })
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
                    onEditFormChange({
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
                      onEditFormChange({
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
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Updated</p>
                  <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
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
  );
}
