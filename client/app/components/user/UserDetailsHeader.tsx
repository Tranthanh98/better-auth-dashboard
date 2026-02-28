import { Link } from "react-router";

interface UserDetailsHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function UserDetailsHeader({
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
}: UserDetailsHeaderProps) {
  return (
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
            onClick={onEdit}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
