"use client";

import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Mail, Smartphone, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { PageHeader } from "@/components/common/page-header";
import {
  RecipientMultiSelect,
  type RecipientOption,
} from "@/components/common/recipient-multi-select";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import {
  NOTIFICATION_ENDPOINTS,
  NOTIFICATION_ROLE_OPTIONS,
} from "@/lib/api/endpoints/notification.endpoints";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";
import {
  SendNotificationFormValues,
  sendNotificationSchema,
} from "../schema/send-notification.schema";

type RecipientsApiResponse = {
  status: boolean;
  data: Array<{
    id: string;
    name: string;
    email?: string | null;
    role: string;
    hasDeviceToken?: boolean;
  }>;
  pagination?: { total: number };
};

type SendApiResponse = {
  status: boolean;
  message?: string;
  data?: {
    recipientCount?: number;
    emailsSent?: number;
    pushSent?: number;
  };
};

export function SendNotificationForm({ className, ...props }: React.ComponentProps<"div">) {
  const [search, setSearch] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<RecipientOption[]>([]);
  const debouncedSearch = useDebounce(search, 350);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      role: "",
      targetMode: "all",
      recipientIds: [],
      sendEmail: true,
    },
    mode: "onChange",
  });

  const role = useWatch({ control, name: "role" });
  const targetMode = useWatch({ control, name: "targetMode" });
  const sendEmail = useWatch({ control, name: "sendEmail" });

  const { data: recipientsResponse, isFetching: isSearching } = useQuery({
    queryKey: [...API_CACHE_KEYS.NOTIFICATION_RECIPIENTS, role, debouncedSearch],
    enabled: Boolean(role) && targetMode === "selected",
    queryFn: async () => {
      const params = new URLSearchParams({
        role,
        page: "1",
        limit: "30",
      });
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      const res = await apiClient.get<RecipientsApiResponse>(
        `${NOTIFICATION_ENDPOINTS.RECIPIENTS}?${params.toString()}`,
      );
      return res.data;
    },
  });

  const recipientOptions = useMemo<RecipientOption[]>(() => {
    const list = recipientsResponse?.data || [];
    return list.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      meta: item.hasDeviceToken ? "Push enabled" : undefined,
    }));
  }, [recipientsResponse]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedRecipients([]);

    setValue("recipientIds", []);

    setSearch("");
  }, [role, setValue]);

  useEffect(() => {
    setValue(
      "recipientIds",
      selectedRecipients.map((r) => r.id),
      { shouldValidate: true },
    );
  }, [selectedRecipients, setValue]);

  const { mutateAsync, isPending } = useApiMutation<SendApiResponse, Record<string, unknown>>(
    "post",
    NOTIFICATION_ENDPOINTS.SEND,
  );

  const roleLabel =
    NOTIFICATION_ROLE_OPTIONS.find((opt) => opt.value === role)?.label || "selected role";

  async function onSubmit(data: SendNotificationFormValues) {
    try {
      const payload = {
        title: data.title.trim(),
        message: data.message.trim(),
        role: data.role,
        sendEmail: data.sendEmail,
        recipientIds: data.targetMode === "selected" ? data.recipientIds : [],
      };

      const response = await mutateAsync(payload);
      successToast({
        description:
          response?.message ||
          `Notification sent to ${response?.data?.recipientCount || 0} recipient(s).`,
      });
      reset({
        title: "",
        message: "",
        role: data.role,
        targetMode: "all",
        recipientIds: [],
        sendEmail: true,
      });
      setSelectedRecipients([]);
      setSearch("");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  return (
    <div>
      <PageHeader
        title="Send Notifications"
        description="Broadcast email, in-app, and Firebase push notifications to admins, managers, and app users."
        action={
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Bell className="size-6 text-emerald-600" />
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div
          className={cn(
            "w-full rounded-2xl border border-gray-200",
            "bg-white p-6 shadow-sm sm:p-8",
            className,
          )}
          {...props}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-6">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="Enter notification title"
                      className={cn(
                        "h-12 rounded-xl border-gray-200 bg-gray-50",
                        "focus:bg-white focus-visible:border-emerald-600",
                        errors.title && "border-red-400",
                      )}
                    />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                  </div>
                )}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700">
                      Audience Role <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12! w-full rounded-xl border-gray-200 bg-gray-50 focus:border-emerald-600">
                        <SelectValue placeholder="Select who should receive this" />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTIFICATION_ROLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                  </div>
                )}
              />

              <Controller
                name="targetMode"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <FieldLabel className="text-sm font-semibold text-gray-700">
                      Recipients
                    </FieldLabel>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => field.onChange("all")}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left transition-all",
                          field.value === "all"
                            ? "border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500/30"
                            : "border-slate-200 bg-slate-50 hover:bg-white",
                        )}
                      >
                        <p className="text-sm font-semibold text-slate-900">Entire role</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Send to every {roleLabel.toLowerCase()}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("selected")}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left transition-all",
                          field.value === "selected"
                            ? "border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500/30"
                            : "border-slate-200 bg-slate-50 hover:bg-white",
                        )}
                      >
                        <p className="text-sm font-semibold text-slate-900">Select people</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Search and pick one or many recipients
                        </p>
                      </button>
                    </div>
                  </div>
                )}
              />

              {targetMode === "selected" && (
                <div className="space-y-2">
                  <FieldLabel className="text-sm font-semibold text-gray-700">
                    Search & select <span className="text-red-500">*</span>
                  </FieldLabel>
                  <RecipientMultiSelect
                    options={recipientOptions}
                    value={selectedRecipients}
                    onChange={setSelectedRecipients}
                    searchValue={search}
                    onSearchChange={setSearch}
                    isLoading={isSearching}
                    disabled={!role}
                    placeholder={role ? "Search by name or email…" : "Select a role first"}
                  />
                  {errors.recipientIds && (
                    <p className="text-xs text-red-500">{errors.recipientIds.message as string}</p>
                  )}
                </div>
              )}

              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Write a clear, professional notification message"
                      className={cn(
                        "rounded-xl border-gray-200",
                        "resize-none bg-gray-50",
                        "focus:bg-white focus-visible:border-emerald-600",
                        errors.message && "border-red-400",
                      )}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500">{errors.message.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="sendEmail"
                control={control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Also send email</p>
                      <p className="text-xs text-slate-500">
                        Delivers the same title and message to each recipient&apos;s inbox
                      </p>
                    </div>
                  </label>
                )}
              />
            </div>

            <div className="mt-8 flex justify-end border-t pt-6">
              <Button
                type="submit"
                isLoading={isPending}
                className="h-12 rounded-xl px-8 font-semibold"
              >
                <Bell className="mr-2 size-4" />
                Send Notification
              </Button>
            </div>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-5">
            <p className="text-xs font-bold tracking-[0.14em] text-emerald-700 uppercase">
              Delivery channels
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 rounded-lg bg-white p-2 text-emerald-600 shadow-xs">
                  <Mail className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email</p>
                  <p className="text-xs text-slate-600">
                    {sendEmail ? "Enabled for this send" : "Disabled for this send"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 rounded-lg bg-white p-2 text-emerald-600 shadow-xs">
                  <Users className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Admin inbox</p>
                  <p className="text-xs text-slate-600">
                    Appears under the bell for admin & manager roles
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 rounded-lg bg-white p-2 text-emerald-600 shadow-xs">
                  <Smartphone className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Firebase push</p>
                  <p className="text-xs text-slate-600">
                    App users get FCM + mobile notification history (unchanged APIs)
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-sm font-semibold text-slate-900">Tips</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-relaxed text-slate-600">
              <li>Use “Select people” for targeted announcements.</li>
              <li>App Users receive Firebase push when a device token exists.</li>
              <li>Managers and admins see unread count on the top-bar bell.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
