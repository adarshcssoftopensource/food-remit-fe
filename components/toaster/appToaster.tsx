"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      position="top-right"
      closeButton
      className="z-2147483647!"
      style={{ zIndex: 2147483647 }}
      toastOptions={{
        className: "pointer-events-auto",
      }}
    />
  );
}
