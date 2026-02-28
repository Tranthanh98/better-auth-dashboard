interface DataFetchErrorProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  error?: string;
}

export function DataFetchError({
  title,
  description,
  onRetry,
  error,
}: DataFetchErrorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>

      <div className="flex items-center justify-center py-8">
        <div className="relative bg-red-50 border border-red-200 rounded-2xl p-10 max-w-xl w-full text-center overflow-hidden">
          {/* Decorative background icon */}
          <div className="absolute right-6 bottom-6 opacity-[0.07]">
            <svg
              className="w-32 h-32 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>

          {/* Error icon */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Failed to Load Data
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {error ||
              "An error occurred while fetching the data. Please try again or contact support if the problem persists."}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
