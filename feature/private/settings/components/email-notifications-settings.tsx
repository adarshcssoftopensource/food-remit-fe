"use client";

import { useState } from "react";
import { Headphones, Info, Loader2, Mail, Megaphone, PackageCheck, Users } from "lucide-react";

import { successToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/components/providers/profile-provider";
import {
  useGetEmailNotifications,
  useUpdateEmailNotifications,
  UpdateEmailNotificationPayload,
} from "../hooks/use-email-notifications";

export function EmailNotificationsSettings() {
  const { profile } = useProfile();
  const { data: prefResponse, isLoading, isError } = useGetEmailNotifications();
  const { mutateAsync: updatePreferences, isPending } = useUpdateEmailNotifications();

  const prefData = prefResponse?.data;

  // Track optimistic user overrides without requiring setState in an effect
  const [overrides, setOverrides] = useState<Partial<UpdateEmailNotificationPayload>>({});

  const formState = {
    emailNotifications: overrides.emailNotifications ?? prefData?.emailNotifications ?? true,
    orderEmails: overrides.orderEmails ?? prefData?.orderEmails ?? true,
    broadcastEmails: overrides.broadcastEmails ?? prefData?.broadcastEmails ?? true,
    leadEmails: overrides.leadEmails ?? prefData?.leadEmails ?? true,
    ticketEmails: overrides.ticketEmails ?? prefData?.ticketEmails ?? true,
  };

  const handleToggle = async (key: keyof UpdateEmailNotificationPayload, value: boolean) => {
    // Apply optimistic override
    setOverrides((prev) => ({ ...prev, [key]: value }));

    try {
      await updatePreferences({ [key]: value });

      // Clean up override once mutation succeeds and query invalidation updates cache
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      const labels: Record<string, string> = {
        emailNotifications: "Master Email Notifications",
        orderEmails: "Order Alerts",
        broadcastEmails: "Platform Announcements",
        leadEmails: "Partner Leads",
        ticketEmails: "Support Tickets",
      };

      successToast({
        title: "Preference Updated",
        description: `${labels[key] || "Setting"} ${value ? "enabled" : "disabled"}.`,
      });
    } catch (err: unknown) {
      console.error("Failed to update email preferences:", err);
      // Revert optimistic override on error
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2 className="size-6 animate-spin text-emerald-600" />
          <span className="text-sm font-medium">Loading email notification preferences...</span>
        </div>
      </div>
    );
  }

  if (isError || !prefData) {
    return (
      <Card className="rounded-2xl border-red-200 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
          <Info className="size-5 shrink-0" />
          <p className="text-sm font-medium">
            Failed to load email notification settings. Please refresh the page.
          </p>
        </div>
      </Card>
    );
  }

  const available = prefData.availableOptions || {
    orderEmails: true,
    broadcastEmails: true,
    leadEmails: true,
    ticketEmails: true,
  };

  const masterEnabled = formState.emailNotifications;

  return (
    <div className="max-w-4xl space-y-6">
      {/* User Context & Role Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-5 backdrop-blur-md dark:border-slate-800 dark:from-emerald-950/30 dark:via-slate-900/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Mail className="size-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {profile?.name || "User"}
                </h3>
                <Badge variant="default" className="text-[11px] font-medium tracking-wide">
                  {prefData.roleTitle || profile?.role || "Staff"}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Email destination:{" "}
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {profile?.email}
                </span>
              </p>
            </div>
          </div>

          {isPending && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
        </div>
      </div>

      {/* Master Toggle Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Email Notifications Master Switch
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn off to pause all email notifications. When enabled, your category preferences
                below will apply.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {masterEnabled ? "Active" : "Muted"}
              </span>
              <Switch
                checked={masterEnabled}
                onCheckedChange={(val) => handleToggle("emailNotifications", val)}
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Granular Preferences */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Category Notifications
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure specific types of emails you would like to receive for your role.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Order Notifications */}
          {available.orderEmails && (
            <Card
              className={`rounded-2xl border transition-all duration-200 ${
                !masterEnabled
                  ? "border-slate-200/50 bg-slate-50/50 opacity-60 dark:border-slate-800/40 dark:bg-slate-900/30"
                  : formState.orderEmails
                    ? "border-emerald-200/70 bg-emerald-50/20 shadow-xs dark:border-emerald-800/40 dark:bg-emerald-950/10"
                    : "border-slate-200/80 bg-white/60 dark:border-slate-800/80 dark:bg-slate-900/60"
              }`}
            >
              <CardContent className="flex items-start justify-between gap-3.5 p-4.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <PackageCheck className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Order Alerts
                    </h5>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Receive real-time email notifications for newly placed store orders and
                      processing receipts.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={masterEnabled && formState.orderEmails}
                  disabled={!masterEnabled || isPending}
                  onCheckedChange={(val) => handleToggle("orderEmails", val)}
                />
              </CardContent>
            </Card>
          )}

          {/* Platform Broadcast Announcements */}
          {available.broadcastEmails && (
            <Card
              className={`rounded-2xl border transition-all duration-200 ${
                !masterEnabled
                  ? "border-slate-200/50 bg-slate-50/50 opacity-60 dark:border-slate-800/40 dark:bg-slate-900/30"
                  : formState.broadcastEmails
                    ? "border-blue-200/70 bg-blue-50/20 shadow-xs dark:border-blue-800/40 dark:bg-blue-950/10"
                    : "border-slate-200/80 bg-white/60 dark:border-slate-800/80 dark:bg-slate-900/60"
              }`}
            >
              <CardContent className="flex items-start justify-between gap-3.5 p-4.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    <Megaphone className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Platform Announcements
                    </h5>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Stay informed about system maintenance, major feature updates, and platform
                      broadcasts.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={masterEnabled && formState.broadcastEmails}
                  disabled={!masterEnabled || isPending}
                  onCheckedChange={(val) => handleToggle("broadcastEmails", val)}
                />
              </CardContent>
            </Card>
          )}

          {/* Partner Leads */}
          {available.leadEmails && (
            <Card
              className={`rounded-2xl border transition-all duration-200 ${
                !masterEnabled
                  ? "border-slate-200/50 bg-slate-50/50 opacity-60 dark:border-slate-800/40 dark:bg-slate-900/30"
                  : formState.leadEmails
                    ? "border-amber-200/70 bg-amber-50/20 shadow-xs dark:border-amber-800/40 dark:bg-amber-950/10"
                    : "border-slate-200/80 bg-white/60 dark:border-slate-800/80 dark:bg-slate-900/60"
              }`}
            >
              <CardContent className="flex items-start justify-between gap-3.5 p-4.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    <Users className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Partner Leads
                    </h5>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Receive immediate alerts whenever a prospective store partner or franchise
                      registers interest.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={masterEnabled && formState.leadEmails}
                  disabled={!masterEnabled || isPending}
                  onCheckedChange={(val) => handleToggle("leadEmails", val)}
                />
              </CardContent>
            </Card>
          )}

          {/* Support Tickets */}
          {available.ticketEmails && (
            <Card
              className={`rounded-2xl border transition-all duration-200 ${
                !masterEnabled
                  ? "border-slate-200/50 bg-slate-50/50 opacity-60 dark:border-slate-800/40 dark:bg-slate-900/30"
                  : formState.ticketEmails
                    ? "border-purple-200/70 bg-purple-50/20 shadow-xs dark:border-purple-800/40 dark:bg-purple-950/10"
                    : "border-slate-200/80 bg-white/60 dark:border-slate-800/80 dark:bg-slate-900/60"
              }`}
            >
              <CardContent className="flex items-start justify-between gap-3.5 p-4.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                    <Headphones className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Support Tickets
                    </h5>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Receive notifications when new support issues are raised or tickets assigned
                      to you are updated.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={masterEnabled && formState.ticketEmails}
                  disabled={!masterEnabled || isPending}
                  onCheckedChange={(val) => handleToggle("ticketEmails", val)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Helper Footer Note */}
      <div className="flex items-center gap-2 rounded-xl bg-slate-100/70 p-3.5 text-xs text-slate-600 dark:bg-slate-900/40 dark:text-slate-400">
        <Info className="size-4 shrink-0 text-slate-500" />
        <span>
          Critical account security and password recovery emails will always be sent regardless of
          your notification preferences.
        </span>
      </div>
    </div>
  );
}
