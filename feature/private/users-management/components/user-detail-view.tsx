"use client";

import type { SortingState } from "@tanstack/react-table";
import { User } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/config/routes";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { USER_MANAGEMENT_VIEW_TABS } from "@/constants/users-management";
import { orderColumns } from "@/feature/private/order-management/columns/order-columns";
import { useGetOrders } from "@/feature/private/order-management/hooks/use-get-orders";
import { formatDate } from "@/lib/date";
import { useDebounce } from "@/lib/debounce";
import { useGetUserById } from "../hooks/use-get-user-by-id";
import { UserData } from "../types/user.types";

type TabKey = "profile" | "requested" | "sent" | "received";

function InfoCard({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

export function UserDetailView({ user: initialUser, id }: { user?: UserData; id: string }) {
  const { data: userData, isLoading } = useGetUserById(id);
  const user = userData?.data || initialUser;

  const [tab, setTab] = useState<TabKey>("profile");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [searchValue, setSearchValue] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const debouncedSearch = useDebounce(searchValue, 500);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const orderQuery = useMemo(() => {
    if (tab === "requested") {
      return { userId: id, type: 2 as const };
    }
    if (tab === "sent") {
      return { userId: id, type: 1 as const };
    }
    if (tab === "received") {
      return { recieverId: id };
    }
    return null;
  }, [tab, id]);

  const { data: ordersResponse, isLoading: ordersLoading } = useGetOrders(
    orderQuery
      ? {
          ...orderQuery,
          page,
          limit,
          search: debouncedSearch || undefined,
          sortBy,
          sortOrder,
        }
      : undefined,
    Boolean(orderQuery),
  );

  const orders = ordersResponse?.data ?? [];
  const pagination = ordersResponse?.pagination ?? {
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  };

  const infoCardArray = [
    { value: user?.firstName, title: "First Name" },
    { value: user?.lastName, title: "Last Name" },
    { value: user?.country ?? "N/A", title: "Country" },
    { value: user?.state ?? "N/A", title: "State" },
    { value: user?.city ?? "N/A", title: "City" },
    { value: user?.address ?? "N/A", title: "Address" },
    { value: `${user?.countryCode} ${user?.phoneNumber}`, title: "Phone" },
    { value: user?.userType, title: "User Type" },
    { value: user?.userStatus, title: "Status" },
    { value: formatDate(user?.createdAt), title: "Registered On" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <PageHeader
          breadcrumbs={[
            { label: "User Management", href: ROUTES.ADMIN.USERS_MANAGEMENT },
            { label: "User Details" },
          ]}
        />
      </div>

      <div className="rounded-2xl border p-4 shadow-sm sm:p-6">
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as TabKey);
            setPage(1);
            setSearchValue("");
            setSorting([]);
          }}
        >
          <div className="mb-8 overflow-x-auto pb-2">
            <TabsList className="inline-flex h-11 w-auto items-center justify-start gap-1 rounded-full bg-slate-100/80 p-1 px-1.5 shadow-inner dark:bg-slate-800/50">
              {USER_MANAGEMENT_VIEW_TABS.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground inline-flex h-8 items-center justify-center rounded-full px-5 text-sm font-medium whitespace-nowrap text-slate-600 transition-all hover:text-slate-900 data-active:shadow-md dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="profile">
            <div className="overflow-hidden rounded-xl border">
              <div className="bg-primary/5 flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center">
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="ring-primary/10 h-24 w-24 shrink-0 rounded-full object-cover shadow ring-4"
                    width={96}
                    height={96}
                  />
                ) : (
                  <div className="ring-primary/10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow ring-4">
                    <User className="text-primary h-12 w-12" />
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {infoCardArray?.map((item) => (
                  <InfoCard key={item?.title} title={item?.title} value={item?.value} />
                ))}
              </div>
            </div>
          </TabsContent>

          {(["requested", "sent", "received"] as const).map((key) => (
            <TabsContent key={key} value={key}>
              <div className="rounded-xl border bg-white p-4">
                <DataTable
                  columns={orderColumns}
                  data={orders}
                  loading={ordersLoading}
                  searchKey="id"
                  searchValue={searchValue}
                  onSearchChange={(val) => {
                    setSearchValue(val);
                    setPage(1);
                  }}
                  onSortingChange={(next) => {
                    setSorting(next);
                    setPage(1);
                  }}
                  manualSorting
                  manualFiltering
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  rowsPerPage={pagination.limit}
                  onPageChange={setPage}
                  onRowsPerPageChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
