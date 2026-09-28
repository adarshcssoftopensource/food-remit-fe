"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Store, User } from "lucide-react";
import type { OrderData } from "../types/order.types";

interface PersonCardProps {
  role: "Sender" | "Receiver";
  name: string;
  phone: string;
  address: string;
}

function PersonCard({ role, name, phone, address }: PersonCardProps) {
  const isSender = role === "Sender";
  const color = isSender ? "blue" : "amber";

  return (
    <div
      className={`rounded-xl border p-4 border-${color}-100/60 bg-${color}-50/40 dark:border-${color}-900/30 dark:bg-${color}-950/20`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex size-8 items-center justify-center rounded-full bg-${color}-500 text-white shadow-xs`}
        >
          <User className="size-4" />
        </div>
        <div>
          <p
            className={`text-[10px] font-bold tracking-wider text-${color}-600 uppercase dark:text-${color}-400`}
          >
            {role}
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{name || "N/A"}</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 text-xs">
        <p className="flex items-center text-slate-600 dark:text-slate-300">
          <Phone className={`mr-2 size-3.5 shrink-0 text-${color}-500`} />
          {phone || "N/A"}
        </p>
        <p className="flex items-start text-slate-600 dark:text-slate-300">
          <MapPin className={`mr-2 size-3.5 shrink-0 text-${color}-500`} />
          {address || "N/A"}
        </p>
      </div>
    </div>
  );
}

interface OrderPeopleAndStoreProps {
  order: OrderData;
}

export function OrderPeopleAndStore({ order }: OrderPeopleAndStoreProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Sender & Receiver */}
      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <CardTitle className="flex items-center text-base font-bold tracking-tight text-slate-900 dark:text-white">
            <User className="mr-2.5 size-5 text-blue-500" />
            Sender &amp; Receiver Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <PersonCard
            role="Sender"
            name={order.userName || ""}
            phone={order.senderPhoneNumber || ""}
            address={order.senderAddress || ""}
          />
          <PersonCard
            role="Receiver"
            name={order.recieverName || ""}
            phone={order.receiverPhoneNumber || ""}
            address={order.receiverAddress || ""}
          />
        </CardContent>
      </Card>

      {/* Fulfilling Store */}
      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <CardTitle className="flex items-center text-base font-bold tracking-tight text-slate-900 dark:text-white">
            <Store className="mr-2.5 size-5 text-emerald-500" />
            Fulfilling Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-xl border border-emerald-100/60 bg-emerald-50/40 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                <Store className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                  Assigned Store
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {order.storeName || "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-start">
                <MapPin className="mr-2 size-4 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Store Address</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {order.storeAddress || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
