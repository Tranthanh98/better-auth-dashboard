import { Link } from "react-router";
import type { User } from "../../lib/auth-client";

type SortField = "email" | "name" | "createdAt";
type SortOrder = "asc" | "desc";

interface UsersTableProps {
  users: User[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: SortField;
  sortField: SortField;
  sortOrder: SortOrder;
}) {
  if (sortField !== field) return null;
  return sortOrder === "asc" ? (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function UsersTable({
  users,
  sortField,
  sortOrder,
  onSort,
}: UsersTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("email")}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  User
                  <SortIcon
                    field="email"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("createdAt")}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Created
                  <SortIcon
                    field="createdAt"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || ""}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <span className="text-gray-500 font-medium">
                            {user.name?.[0] || user.email[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.name || "No name"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.banned ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                          Banned
                        </span>
                      ) : user.emailVerified ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                          Unverified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/dashboard/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
