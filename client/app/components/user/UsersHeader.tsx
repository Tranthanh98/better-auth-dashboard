import { Link } from "react-router";

interface UsersHeaderProps {
  filteredCount: number;
}

export function UsersHeader({ filteredCount }: UsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">
          {filteredCount} {filteredCount === 1 ? "user" : "users"} found
        </p>
      </div>
      <Link
        to="/dashboard/users/new"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add User
      </Link>
    </div>
  );
}
