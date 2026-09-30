"use client";

import { useEffect } from "react";

export function LockAuthScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateScrollLock = () => {
      if (mediaQuery.matches) {
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
      } else {
        html.style.overflow = "";
        body.style.overflow = "";
      }
    };

    updateScrollLock();
    mediaQuery.addEventListener("change", updateScrollLock);

    return () => {
      mediaQuery.removeEventListener("change", updateScrollLock);
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  return null;
}
