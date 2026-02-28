import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ManagementRestrictedHeader,
  OrganizationPluginDisabledCard,
} from "../../components/organisations/organization-plugin-disabled";
import { organizationApi, type Organization } from "../../lib/auth-client";

export function meta() {
  return [
    { title: "Organizations - Better Auth Admin" },
    { name: "description", content: "Manage organizations" },
  ];
}

type SortField = "name" | "slug" | "createdAt";
type SortOrder = "asc" | "desc";

interface OrganizationWithMemberCount extends Organization {
  memberCount?: number;
}

export default function OrganizationsListPage() {
  const [organizations, setOrganizations] = useState<
    OrganizationWithMemberCount[]
  >([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    OrganizationWithMemberCount[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all organizations (admin view)
      const { data, error: apiError } = await organizationApi.list();

      if (apiError || !data) {
        throw new Error(apiError?.message || "Failed to fetch organizations");
      }

      // Fetch member counts for each organization
      const orgsWithCounts = await Promise.all(
        data.map(async (org) => {
          try {
            const { data: fullOrg } = await organizationApi.getFullOrganization(
              {
                query: { organizationId: org.id },
              },
            );
            return {
              ...org,
              memberCount: fullOrg?.members?.length || 0,
            };
          } catch {
            return { ...org, memberCount: 0 };
          }
        }),
      );

      setOrganizations(orgsWithCounts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load organizations",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // Filter and sort organizations
  useEffect(() => {
    let result = [...organizations];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.slug.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | Date = "";
      let bVal: string | Date = "";

      switch (sortField) {
        case "name":
          aVal = a.name;
          bVal = b.name;
          break;
        case "slug":
          aVal = a.slug;
          bVal = b.slug;
          break;
        case "createdAt":
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredOrganizations(result);
    setCurrentPage(1);
  }, [organizations, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
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
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
            <p className="text-gray-500 mt-1">Manage organizations</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ManagementRestrictedHeader title="Organizations" />
        <OrganizationPluginDisabledCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-500 mt-1">
            {filteredOrganizations.length}{" "}
            {filteredOrganizations.length === 1
              ? "organization"
              : "organizations"}{" "}
            found
          </p>
        </div>
        <Link
          to="/dashboard/organizations/new"
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
          Add Organization
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSort("slug")}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Slug
                    <SortIcon field="slug" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSort("createdAt")}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Created
                    <SortIcon field="createdAt" />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrganizations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <p className="text-gray-500">No organizations found</p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {org.logo ? (
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {org.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <Link
                            to={`/dashboard/organizations/${org.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {org.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                        {org.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {org.memberCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(org.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/dashboard/organizations/${org.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredOrganizations.length,
              )}{" "}
              of {filteredOrganizations.length} organizations
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
