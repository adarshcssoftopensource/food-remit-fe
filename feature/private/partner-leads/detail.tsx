"use client";

import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Activity,
  Building2,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePartnerLead, useUpdateLeadStatus } from "./hooks/use-partner-leads";
import { PARTNER_LEAD_STATUSES } from "./constants";
import { getStatusColor } from "./utils";
import { UpdateStatusDialog } from "./components/update-status-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PartnerLeadDetailProps {
  id: string;
}

export function PartnerLeadDetail({ id }: PartnerLeadDetailProps) {
  const router = useRouter();
  const { lead, isLoading } = usePartnerLead(id);
  const { isUpdatingStatus } = useUpdateLeadStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-slate-700">Lead not found</h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 pb-10">
      {dialogOpen && (
        <UpdateStatusDialog
          leadId={lead.id}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultStatus={selectedStatus}
        />
      )}

      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl border-slate-200 bg-white p-0 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-900">
              {lead.businessName}
            </h1>
            <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-slate-600">
                Ref: {lead.referenceNumber}
              </span>
              <span className="text-slate-300">•</span>
              Applied on {format(new Date(lead.createdAt), "MMMM do, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center self-start rounded-[1.25rem] border border-slate-200 bg-white p-1.5 shadow-sm md:self-auto">
          <Select
            value={lead.status}
            disabled={isUpdatingStatus}
            onValueChange={(value) => {
              if (value && value !== lead.status) {
                setSelectedStatus(value);
                setDialogOpen(true);
              }
            }}
          >
            <SelectTrigger
              className={`h-11 w-[260px] rounded-[1rem] border-0 px-4 font-extrabold transition-all hover:bg-slate-50 focus:ring-4 focus:ring-blue-500/20 ${getStatusColor(lead.status)}`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="h-4.5 w-4.5 opacity-75" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="min-w-[260px] rounded-2xl border-slate-200 p-1.5 shadow-2xl">
              {PARTNER_LEAD_STATUSES.map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  className={`my-0.5 cursor-pointer rounded-xl px-4 py-3 text-sm font-bold transition-colors focus:bg-slate-100 ${s === lead.status ? "bg-blue-50/50 text-blue-900" : "text-slate-700"}`}
                >
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Business Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Business Type
                </dt>
                <dd className="text-sm font-semibold text-slate-900">{lead.businessType}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Locations Count
                </dt>
                <dd className="text-sm font-semibold text-slate-900">{lead.locationsCount}</dd>
              </div>
              {lead.website && (
                <div className="col-span-2">
                  <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Website / Social
                  </dt>
                  <dd>
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      {lead.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
        min-h-30
        {/* Contact Person */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-emerald-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Full Name
                </dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {lead.firstName} {lead.lastName}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Job Title
                </dt>
                <dd className="text-sm font-semibold text-slate-900">{lead.jobTitle || "N/A"}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Email Address
                </dt>
                <dd className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a
                    href={`mailto:${lead.businessEmail}`}
                    className="transition-colors hover:text-emerald-600"
                  >
                    {lead.businessEmail}
                  </a>
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Phone Number
                </dt>
                <dd className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <a
                    href={`tel:${lead.phoneNumber}`}
                    className="transition-colors hover:text-emerald-600"
                  >
                    {lead.phoneNumber}
                  </a>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        {/* Location Info */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <dl className="grid grid-cols-3 gap-x-4 gap-y-6">
              <div>
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Country
                </dt>
                <dd className="text-sm font-semibold text-slate-900">{lead.country}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  State / Province
                </dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {lead.stateProvince || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  City
                </dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {lead.businessCity || "N/A"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        {/* Operational Preferences */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-5 w-5 text-emerald-600" />
              Operational Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Work Preferences
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lead.workPreferences.length > 0 ? (
                    lead.workPreferences.map((pref, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="border-emerald-200/60 bg-emerald-50 px-3 py-1 font-bold text-emerald-700 hover:bg-emerald-100"
                      >
                        {pref}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm font-medium text-slate-400">None selected</span>
                  )}
                </div>
              </div>
              <Separator className="bg-slate-100" />
              <div>
                <h4 className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Inventory Management
                </h4>
                <p className="text-sm font-semibold text-slate-900">
                  {lead.inventoryManagement || "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Additional Info & Consent */}
        <div className="space-y-6 md:col-span-2">
          {lead.statusRemark && (
            <Card className="overflow-hidden rounded-2xl border-blue-200 bg-blue-50/30 shadow-sm">
              <CardHeader className="border-b border-blue-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-base text-blue-900">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Latest Status Remark
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-slate-700">
                  {lead.statusRemark}
                </p>
              </CardContent>
            </Card>
          )}

          {lead.additionalInfo && (
            <Card className="overflow-hidden rounded-2xl border-slate-200 bg-amber-50/30 shadow-sm">
              <CardHeader className="border-b border-amber-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-base text-amber-900">
                  <FileText className="h-5 w-5 text-amber-600" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-slate-700">
                  {lead.additionalInfo}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-blue-900 shadow-sm">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-blue-600" />
            <p className="text-sm font-bold">
              {lead.firstName} agreed to be contacted by Food Remit regarding partnership
              opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
