export function OrganizationPluginDisabledCard() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative bg-blue-50 border border-blue-200 rounded-2xl p-10 max-w-xl w-full text-center overflow-hidden">
        {/* Decorative background icon */}
        <div className="absolute right-6 bottom-6 opacity-[0.07]">
          <svg
            className="w-32 h-32 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Shield icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Organization Plugin Not Enabled
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The multi-tenant organization management system is currently inactive.
          To activate this protocol, update your backend configuration.
        </p>

        {/* Code snippet */}
        <div className="relative bg-white border border-blue-200 rounded-xl p-5 text-left overflow-hidden">
          <div className="absolute right-4 top-4 opacity-[0.07]">
            <svg
              className="w-16 h-16 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">
            Activation Required
          </p>
          <pre className="text-sm leading-relaxed">
            <code>
              <span className="text-gray-400">
                {"// better-auth.config.ts"}
              </span>
              {"\n"}
              <span className="text-gray-900 font-semibold">
                {"plugins: ["}
              </span>
              {"\n"}
              <span className="text-blue-500 font-semibold">
                {"  organization()"}
              </span>
              {"\n"}
              <span className="text-gray-900 font-semibold">{"]"}</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

interface ManagementRestrictedHeaderProps {
  title: string;
  icon?: React.ReactNode;
}

export function ManagementRestrictedHeader({
  title,
  icon,
}: ManagementRestrictedHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon || (
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <p className="text-xs font-semibold text-blue-600 tracking-wider uppercase mt-0.5">
        Management Restricted
      </p>
    </div>
  );
}
