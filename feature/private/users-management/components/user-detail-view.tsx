"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";

import {
  UserData,
  MOCK_REQUESTED_ORDERS,
  MOCK_SENT_ORDERS,
  MOCK_RECEIVED_ORDERS,
  USER_MANAGEMENT_VIEW_TABS,
} from "@/constants/users-management";

import {
  REQUESTED_ORDER_COLUMNS,
  SENT_ORDER_COLUMNS,
  RECEIVED_ORDER_COLUMNS,
} from "../columns/order-columns";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";

type TabKey = "profile" | "requested" | "sent" | "received";

function InfoCard({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{title}</p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

export function UserDetailView({ user }: { user: UserData }) {
  const router = useRouter();

  const [tab, setTab] = useState<TabKey>("profile");

  const orders = {
    requested: MOCK_REQUESTED_ORDERS[user.id] ?? [],
    sent: MOCK_SENT_ORDERS[user.id] ?? [],
    received: MOCK_RECEIVED_ORDERS[user.id] ?? [],
  };

  const tableConfig = {
    requested: {
      columns: REQUESTED_ORDER_COLUMNS,
      data: orders.requested,
    },
    sent: {
      columns: SENT_ORDER_COLUMNS,
      data: orders.sent,
    },
    received: {
      columns: RECEIVED_ORDER_COLUMNS,
      data: orders.received,
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:text-primary mb-4 gap-2 px-0 text-slate-500 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <PageHeader title="User Management" description="Manage user details and order activity." />
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
          <div className="mb-8 overflow-x-auto">
            <TabsList className="flex h-auto w-full gap-1 rounded-xl bg-slate-100 p-1">
              {USER_MANAGEMENT_VIEW_TABS.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="data-[state=active]:bg-primary rounded-lg px-5 py-2.5 text-sm font-medium whitespace-nowrap text-slate-600 transition data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="profile">
            <div className="overflow-hidden rounded-xl border">
              <div className="bg-primary/5 flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center">
                <div className="ring-primary/10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow ring-4">
                  <User className="text-primary h-12 w-12" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {user.firstName} {user.lastName}
                  </h2>

                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard title="User ID" value={user.id} />
                <InfoCard title="First Name" value={user.firstName} />
                <InfoCard title="Last Name" value={user.lastName} />
                <InfoCard title="Username" value={user.userName} />
                <InfoCard title="Phone" value={user.contactNumber} />
                <InfoCard title="Country" value={user.country} />
                <InfoCard title="State" value={user.state} />
                <InfoCard title="City" value={user.city} />
                <InfoCard title="Registered On" value={user.registeredOn} />
              </div>
            </div>
          </TabsContent>

          {(["requested", "sent", "received"] as const).map((key) => (
            <TabsContent key={key} value={key}>
              <div className="rounded-xl border bg-white p-4">
                <DataTable
                  columns={tableConfig[key].columns}
                  data={tableConfig[key].data}
                  searchKey="orderId"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
