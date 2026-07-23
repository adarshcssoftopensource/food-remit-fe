"use client";

import { toast } from "@/lib/toast";
import type { ReactNode } from "react";

export interface ToasterOptions {
  id?: string | number;
  title?: string;
  description?: string | ReactNode;
  duration?: number;
}

const defaultErrorDescription = "Something went wrong. Please try again.";

export function successToast(options: ToasterOptions) {
  const { id, title = "Success", description, duration } = options;
  toast.success(title, typeof description === "string" ? description : undefined, {
    id,
    duration: duration ?? 3000,
  });
}

export function errorToast(options: ToasterOptions) {
  const { id, title = "Error", description, duration } = options;
  const desc = description ?? defaultErrorDescription;
  toast.error(title, typeof desc === "string" ? desc : String(desc), {
    id,
    duration: duration ?? 5000,
  });
}

export function infoToast(options: ToasterOptions) {
  const { id, title = "Info", description, duration } = options;
  toast.info(title, typeof description === "string" ? description : undefined, {
    id,
    duration: duration ?? 4000,
  });
}
