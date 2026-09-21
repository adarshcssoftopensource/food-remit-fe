"use client";

import { type ReactNode, useState } from "react";
import { Lock, ShieldAlert, ShieldCheck } from "lucide-react";

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

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute inset-x-0 -top-10 h-40 w-full rounded-t-3xl blur-3xl",
          variant === "destructive"
            ? "bg-red-500/10 dark:bg-red-500/20"
            : "bg-primary/10 dark:bg-primary/20",
        )}
      />

      <DialogHeader className="relative flex flex-col items-center space-y-3 px-6 pt-8 pb-4 text-center">
        <div
          className={cn(
            "mb-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full ring-8",
            variant === "destructive"
              ? "bg-red-100 text-red-600 ring-red-50 dark:bg-red-900/30 dark:text-red-500 dark:ring-red-900/20"
              : "bg-primary/10 text-primary ring-primary/5 dark:bg-primary/20 dark:ring-primary/10",
          )}
        >
          <div
            className={cn(
              "[&>svg]:h-8 [&>svg]:w-8",
              variant === "destructive" ? "[&>svg]:text-red-600" : "[&>svg]:text-primary",
            )}
          >
            {icon ?? (variant === "destructive" ? <ShieldAlert /> : <ShieldCheck />)}
          </div>
        </div>

        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </DialogTitle>

        <DialogDescription className="text-muted-foreground max-w-xs text-sm leading-relaxed">
          {description}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="px-6 py-2">
        <div className="space-y-2">
          <label
            htmlFor="admin-password-input"
            className="text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300"
          >
            Admin Password
          </label>
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
            autoFocus
          />
          {errorMessage && (
            <p className="animate-in fade-in slide-in-from-top-1 text-xs font-medium text-red-500 duration-200">
              {errorMessage}
            </p>
          )}
        </div>

        <DialogFooter className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 w-full flex-1 rounded-xl font-semibold shadow-xs"
          >
            {cancelLabel}
          </Button>

          <Button
            type="submit"
            variant={variant}
            isLoading={isSubmitting}
            disabled={isSubmitting || !password.trim()}
            className="h-11 w-full flex-1 rounded-xl font-semibold shadow-xs hover:brightness-110"
          >
            {confirmLabel}
          </Button>
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
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-0 p-0 shadow-2xl sm:max-w-[440px]">
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
