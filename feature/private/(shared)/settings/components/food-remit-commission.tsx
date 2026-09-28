import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Percent } from "lucide-react";
import { useProfile } from "@/components/providers/profile-provider";
import { useGetStore } from "@/feature/private/(super-admin)/store-management/hooks/use-get-stores";

export function FoodRemitCommission() {
  const { profile } = useProfile();

  // Get the first store's commission if available. Store managers typically manage one store in this context.
  const storeId = profile?.stores?.[0]?.id || "";
  const { data: store, isLoading } = useGetStore(storeId);
  const commission = isLoading ? "..." : (store?.foodRemitCommission ?? 0);

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
              <Percent className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Food Remit Commission</p>
              <p className="text-xs text-slate-500">
                The commission percentage applied by the platform.
              </p>
            </div>
          </div>
          <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
            Read-Only
          </span>
        </div>
        <CardContent className="p-6">
          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <FieldLabel className="text-sm font-semibold">Food Remit Commission (%)</FieldLabel>
              <div className="relative">
                <Percent className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type={isLoading ? "text" : "number"}
                  value={commission}
                  disabled
                  readOnly
                  className="h-11 pr-12 pl-9 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-80"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  %
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                This commission rate is set by the super admin and cannot be changed here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
