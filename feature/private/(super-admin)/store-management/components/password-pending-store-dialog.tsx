"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, KeyRound, Mail, Store, UserRound } from "lucide-react";
import type { ImpersonationPreview } from "../hooks/use-impersonate-store";

type PasswordPendingStoreDialogProps = {
  preview: ImpersonationPreview | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

/** Shown before viewing a store whose manager hasn't set their own password. */
export function PasswordPendingStoreDialog({
  preview,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: PasswordPendingStoreDialogProps) {
  return (
    <Dialog open={!!preview} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl p-0 sm:max-w-md">
        <div className="bg-linear-to-br from-amber-500/15 via-orange-500/5 to-transparent px-6 pt-6 pb-4">
          <DialogHeader className="gap-3 text-left">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/20">
                <KeyRound className="size-5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Password not set up yet
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  This store manager hasn&apos;t signed in and replaced their system-generated
                  password yet.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {preview && (
          <div className="space-y-4 px-6 pb-2">
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm dark:border-slate-800 dark:bg-slate-900/50">
              <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <Store className="size-4 shrink-0 text-emerald-600" />
                {preview.storeName}
              </p>
              {preview.managerName && (
                <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <UserRound className="size-4 shrink-0 text-slate-400" />
                  {preview.managerName}
                </p>
              )}
              <p className="flex items-center gap-2 break-all text-slate-600 dark:text-slate-300">
                <Mail className="size-4 shrink-0 text-slate-400" />
                {preview.managerEmail}
              </p>
            </div>

            <ul className="space-y-1.5 text-xs leading-5 text-slate-600 dark:text-slate-400">
              <li className="flex gap-2">
                <Eye className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                You can still open the store in view-only mode and see its dashboard and pages.
              </li>
              <li className="flex gap-2">
                <KeyRound className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                You won&apos;t be asked to change the password — the manager will set it themselves
                the first time they sign in.
              </li>
            </ul>
          </div>
        )}

        <DialogFooter className="gap-2 border-t border-slate-100 px-6 py-4 sm:gap-2 dark:border-slate-800">
          <Button
            variant="outline"
            className="rounded-xl"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="gap-2 rounded-xl" isLoading={isLoading} onClick={onConfirm}>
            {!isLoading && <Eye className="size-4" />}
            View store anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
