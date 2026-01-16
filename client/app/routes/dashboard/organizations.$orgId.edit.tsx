import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { organizationApi, type Organization } from "../../lib/auth-client";

export function meta() {
  return [
    { title: "Edit Organization - Better Auth Admin" },
    { name: "description", content: "Edit organization details" },
  ];
}

export default function EditOrganizationPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSlug, setOriginalSlug] = useState("");
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
  });

  const fetchOrganization = useCallback(async () => {
    if (!orgId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: apiError } =
        await organizationApi.getFullOrganization({
          query: { organizationId: orgId },
        });

      if (apiError || !data) {
        throw new Error(apiError?.message || "Failed to fetch organization");
      }

      const org = data as Organization;
      setForm({
        name: org.name,
        slug: org.slug,
        logo: org.logo || "",
      });
      setOriginalSlug(org.slug);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load organization"
      );
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Check slug availability with debounce
  const checkSlugAvailability = useCallback(
    async (slug: string) => {
      if (!slug || slug.length < 2 || slug === originalSlug) {
        setSlugAvailable(slug === originalSlug ? true : null);
        return;
      }

      setIsCheckingSlug(true);
      try {
        const { data } = await organizationApi.checkSlug({ slug });
        setSlugAvailable(data?.status === true);
      } catch {
        setSlugAvailable(null);
      } finally {
        setIsCheckingSlug(false);
      }
    },
    [originalSlug]
  );

  // Debounced slug check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.slug && form.slug !== originalSlug) {
        checkSlugAvailability(form.slug);
      } else if (form.slug === originalSlug) {
        setSlugAvailable(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.slug, originalSlug, checkSlugAvailability]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!orgId) return;

    // Validation
    if (!form.name || !form.slug) {
      setError("Name and slug are required");
      return;
    }

    if (form.slug.length < 2) {
      setError("Slug must be at least 2 characters");
      return;
    }

    if (slugAvailable === false) {
      setError("This slug is already taken");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error: updateError } = await organizationApi.update({
        organizationId: orgId,
        data: {
          name: form.name,
          slug: form.slug,
          logo: form.logo || undefined,
        },
      });

      if (updateError) {
        throw new Error(updateError.message || "Failed to update organization");
      }

      navigate(`/dashboard/organizations/${orgId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update organization"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to={`/dashboard/organizations/${orgId}`}
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
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-full bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/organizations"
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
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Organization
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchOrganization}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/organizations/${orgId}`}
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Organization</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Acme Corporation"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm({ ...form, slug: generateSlug(e.target.value) })
                }
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono ${
                  slugAvailable === true
                    ? "border-green-300"
                    : slugAvailable === false
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="acme-corporation"
              />
              {isCheckingSlug && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              )}
              {!isCheckingSlug && slugAvailable === true && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {!isCheckingSlug && slugAvailable === false && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Used in URLs. Only lowercase letters, numbers, and hyphens.
            </p>
            {slugAvailable === false && (
              <p className="mt-1 text-sm text-red-600">
                This slug is already taken
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Logo URL
            </label>
            <input
              id="logo"
              type="url"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://example.com/logo.png"
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional. Provide a URL to the organization's logo.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || slugAvailable === false}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              Save Changes
            </button>
            <Link
              to={`/dashboard/organizations/${orgId}`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
