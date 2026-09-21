"use client";

import { type ReactNode, useState } from "react";
import { AlertCircle, KeyRound, Loader2, Lock, ShieldAlert, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/ui/password-input";
import { useVerifyAdminPassword } from "@/hooks/use-verify-admin-password";
import { cn } from "@/lib/utils";

export interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  icon?: ReactNode;
  onConfirm: () => Promise<void> | void;
}

interface FormContentProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: "destructive" | "default";
  icon?: ReactNode;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

function formatDescription(desc: string) {
  if (!desc) return null;
  const parts = desc.split(/(".*?")/g);
  return parts.map((part, index) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={index} className="font-semibold text-slate-900 dark:text-slate-100">
          {part}
        </span>
      );
    }
    return part;
  });
}

function AdminPasswordFormContent({
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant,
  icon,
  onConfirm,
  onClose,
}: FormContentProps) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const { mutateAsync: verifyPassword, isPending: isVerifying } = useVerifyAdminPassword();

  const isSubmitting = isVerifying || isActionLoading;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setErrorMessage("Please enter your admin password.");
      return;
    }

    setErrorMessage(null);

    try {
      // 1. Verify password with backend
      await verifyPassword({ password: trimmedPassword });

      // 2. Perform the confirmed action
      setIsActionLoading(true);
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const msg =
        apiErr?.response?.data?.message ||
        apiErr?.response?.data?.error ||
        apiErr?.message ||
        "Incorrect admin password. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const isDestructive = variant === "destructive";

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Top Accent Gradient Bar */}
      <div className={cn("h-1.5 w-full", isDestructive ? "bg-red-500" : "bg-teal-500")} />

      {/* Ambient background glow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 -top-16 mx-auto h-36 w-72 rounded-full opacity-40 blur-3xl dark:opacity-25",
          isDestructive ? "bg-red-500/20" : "bg-teal-500/20",
        )}
      />

      <DialogHeader className="relative flex flex-col items-center px-6 pt-7 pb-2 text-center">
        {/* Crisp Centered Icon Badge */}
        <div
          className={cn(
            "mb-3 flex size-16 shrink-0 items-center justify-center rounded-full ring-8 transition-transform",
            isDestructive
              ? "bg-red-100 text-red-600 ring-red-50 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-900/20"
              : "bg-teal-100 text-teal-700 ring-teal-50 dark:bg-teal-950/40 dark:text-teal-400 dark:ring-teal-900/20",
          )}
        >
          {icon ??
            (isDestructive ? (
              <ShieldAlert className="size-8 stroke-[1.9]" />
            ) : (
              <ShieldCheck className="size-8 stroke-[1.9]" />
            ))}
        </div>

        {/* Security Pill Tag */}
        <div className="mb-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase",
              isDestructive
                ? "border-red-200/80 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                : "border-teal-200/80 bg-teal-50 text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-400",
            )}
          >
            <Lock className="size-3" />
            Security Authorization
          </span>
        </div>

        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </DialogTitle>

        <DialogDescription className="mt-1.5 max-w-sm text-center text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">
          {formatDescription(description)}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="px-6 pt-3 pb-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="admin-password-input"
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300"
            >
              <KeyRound className="size-3.5 text-slate-400" />
              Admin Password
            </label>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Required
            </span>
          </div>

          <PasswordInput
            id="admin-password-input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Enter your password to authorize"
            leftIcon={<Lock className="size-4" />}
            isInvalid={!!errorMessage}
            disabled={isSubmitting}
            className="h-12 rounded-xl border-slate-200/90 bg-slate-50/70 text-sm transition-all focus-visible:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:focus-visible:bg-slate-900"
            autoFocus
          />

          {errorMessage && (
            <div className="animate-in fade-in slide-in-from-top-1 mt-2.5 flex items-center gap-2 rounded-xl border border-red-200/70 bg-red-50/90 p-2.5 text-xs font-medium text-red-600 duration-200 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 w-full flex-1 rounded-xl font-semibold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {cancelLabel}
          </Button>

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            style={{
              backgroundColor: isDestructive ? "#dc2626" : "#0d9488",
              color: "#ffffff",
            }}
            className={cn(
              "inline-flex h-11 w-full flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98]",
              isDestructive
                ? "shadow-red-500/25 hover:opacity-90"
                : "shadow-teal-500/25 hover:opacity-90",
              (isSubmitting || !password.trim()) && "cursor-not-allowed opacity-50 shadow-none",
            )}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin text-white" />}
            <span className="font-semibold text-white">{confirmLabel}</span>
          </button>
        </DialogFooter>
      </form>
    </div>
  );
}

export function AdminPasswordDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  icon,
  onConfirm,
}: AdminPasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 shadow-2xl sm:max-w-[440px] dark:border-slate-800 dark:bg-slate-950">
        {open && (
          <AdminPasswordFormContent
            title={title}
            description={description}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            variant={variant}
            icon={icon}
            onConfirm={onConfirm}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
