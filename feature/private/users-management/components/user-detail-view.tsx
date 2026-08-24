"use client";

import { User } from "lucide-react";
import { useState } from "react";

import { USER_MANAGEMENT_VIEW_TABS } from "@/constants/users-management";
import { useGetUserById } from "../hooks/use-get-user-by-id";
import { UserData } from "../types/user.types";

import { orderColumns } from "@/feature/private/order-management/columns/order-columns";
import { useGetOrders } from "@/feature/private/order-management/hooks/use-get-orders";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/date";
import Image from "next/image";

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

  const infoCardArray = [
    {
      value: user?.firstName,
      title: "First Name",
    },
    {
      value: user?.lastName,
      title: "Last Name",
    },
    {
      value: user?.country ?? "N/A",
      title: "Country",
    },
    {
      value: user?.state ?? "N/A",
      title: "State",
    },
    {
      value: user?.city ?? "N/A",
      title: "City",
    },
    {
      value: `${user?.countryCode} ${user?.phoneNumber}`,
      title: "Phone",
    },
    {
      value: user?.userType,
      title: "User Type",
    },
    {
      value: user?.userStatus,
      title: "Status",
    },
    {
      value: formatDate(user?.createdAt),
      title: "Registered On",
    },
  ];

  const { data: requestedOrdersResponse } = useGetOrders({ userId: id, type: 2 });
  const { data: sentOrdersResponse } = useGetOrders({ userId: id, type: 1 });
  const { data: receivedOrdersResponse } = useGetOrders({ recieverId: id });

  const orders = {
    requested: requestedOrdersResponse?.data || [],
    sent: sentOrdersResponse?.data || [],
    received: receivedOrdersResponse?.data || [],
  };

  const tableConfig = {
    requested: {
      columns: orderColumns,
      data: orders.requested,
    },
    sent: {
      columns: orderColumns,
      data: orders.sent,
    },
    received: {
      columns: orderColumns,
      data: orders.received,
    },
  };

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
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
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
                  columns={tableConfig[key].columns}
                  data={tableConfig[key].data}
                  searchKey="id"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
