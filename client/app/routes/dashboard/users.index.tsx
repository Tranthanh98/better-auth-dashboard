import { useCallback, useEffect, useState } from "react";
import { DataFetchError } from "../../components/data-fetch-error";
import {
  UsersFilters,
  UsersHeader,
  UsersLoadingSkeleton,
  UsersPagination,
  UsersTable,
} from "../../components/user";
import { adminApi, type User } from "../../lib/auth-client";
import type { Route } from "./+types/users.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Users - Better Auth Admin" },
    { name: "description", content: "Manage users" },
  ];
}

type SortField = "email" | "name" | "createdAt";
type SortOrder = "asc" | "desc";
type FilterStatus = "all" | "active" | "banned" | "unverified";

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: apiError } = await adminApi.listUsers({
        query: {
          limit: 1000,
        },
      });

      if (apiError || !data) {
        throw new Error(apiError?.message || "Failed to fetch users");
      }

      setUsers(data.users as User[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter and sort users
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query),
      );
    }

    // Apply status filter
    switch (filterStatus) {
      case "active":
        result = result.filter((u) => !u.banned && u.emailVerified);
        break;
      case "banned":
        result = result.filter((u) => u.banned);
        break;
      case "unverified":
        result = result.filter((u) => !u.emailVerified);
        break;
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | Date = "";
      let bVal: string | Date = "";

      switch (sortField) {
        case "email":
          aVal = a.email;
          bVal = b.email;
          break;
        case "name":
          aVal = a.name || "";
          bVal = b.name || "";
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

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchQuery, sortField, sortOrder, filterStatus]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (isLoading) {
    return <UsersLoadingSkeleton />;
  }

  if (error) {
    return (
      <DataFetchError
        title="Users"
        description="Manage user accounts"
        error={error}
        onRetry={fetchUsers}
      />
    );
  }

  return (
    <div className="space-y-6">
      <UsersHeader filteredCount={filteredUsers.length} />
      <UsersFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />
      <UsersTable
        users={paginatedUsers}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={toggleSort}
      />
      <UsersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredUsers.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
