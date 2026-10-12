"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DefaultStoreImage } from "@/constants/default-store-images";
import { cn } from "@/lib/utils";

interface DefaultStoreScrollerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  items: DefaultStoreImage[];
  itemRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  activeUrl?: string | null;
  className?: string;
}

export function DefaultStoreScroller({
  containerRef,
  items,
  itemRefs,
  activeUrl,
  className,
}: DefaultStoreScrollerProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [metrics, setMetrics] = useState({
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0,
    trackWidth: 0,
  });

  const updateMetrics = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container) return;

    setMetrics({
      scrollLeft: container.scrollLeft,
      scrollWidth: container.scrollWidth,
      clientWidth: container.clientWidth,
      trackWidth: track ? track.offsetWidth : 0,
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateMetrics();

    const handleScroll = () => updateMetrics();
    container.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
    });
    resizeObserver.observe(container);

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    window.addEventListener("resize", updateMetrics);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, [containerRef, updateMetrics]);

  const maxScroll = Math.max(0, metrics.scrollWidth - metrics.clientWidth);
  const canScrollLeft = metrics.scrollLeft > 3;
  const canScrollRight = metrics.scrollLeft < maxScroll - 3;

  // Track & Thumb Calculations
  const totalCount = items.length;
  // Total width of 9 bars (each 6px) + 8 gaps (each 6px) + 8px track padding = 110px
  const trackWidth = metrics.trackWidth || totalCount * 6 + (totalCount - 1) * 6 + 8;
  const visibleRatio =
    metrics.scrollWidth > 0
      ? Math.min(1, Math.max(0.25, metrics.clientWidth / metrics.scrollWidth))
      : 1;

  // Viewfinder covers proportional width with crisp rounded rectangle
  const thumbWidth = Math.max(38, Math.min(trackWidth, trackWidth * visibleRatio));
  const maxThumbTravel = Math.max(0, trackWidth - thumbWidth);
  const scrollProgress =
    maxScroll > 0 ? Math.min(1, Math.max(0, metrics.scrollLeft / maxScroll)) : 0;
  const thumbTranslateX = scrollProgress * maxThumbTravel;

  const activeIndex = items.findIndex((img) => img.imageUrl === activeUrl);

  const scrollByAmount = (direction: "prev" | "next") => {
    const container = containerRef.current;
    if (!container) return;
    const step = Math.max(180, Math.floor(container.clientWidth * 0.6));
    const target =
      direction === "next"
        ? Math.min(maxScroll, container.scrollLeft + step)
        : Math.max(0, container.scrollLeft - step);

    container.scrollTo({ left: target, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const targetElement = itemRefs.current[index];
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  // Drag on the mini-track
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || maxScroll <= 0) return;

    e.preventDefault();
    track.setPointerCapture(e.pointerId);

    const scrollToPointer = (clientX: number) => {
      const rect = track.getBoundingClientRect();
      const relativeX = clientX - rect.left - thumbWidth / 2;
      const clampedX = Math.max(0, Math.min(maxThumbTravel, relativeX));
      const ratio = maxThumbTravel > 0 ? clampedX / maxThumbTravel : 0;
      container.scrollLeft = ratio * maxScroll;
    };

    scrollToPointer(e.clientX);

    const onPointerMove = (moveEvent: PointerEvent) => {
      scrollToPointer(moveEvent.clientX);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      try {
        track.releasePointerCapture(upEvent.pointerId);
      } catch {
        // ignore
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", className)}>
      {/* Informative helper badge */}
      <div className="hidden items-center gap-2 text-[11px] text-slate-500 sm:flex">
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {activeIndex >= 0 ? items[activeIndex]?.label : "Preset Gallery"}
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-slate-400">
          Showing {Math.min(totalCount, Math.round(visibleRatio * totalCount))} of {totalCount}{" "}
          styles (drag or scroll)
        </span>
      </div>

      {/* Unified Floating Controller (Single cohesive pill) */}
      <div className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white p-1 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => scrollByAmount("prev")}
          disabled={!canScrollLeft}
          className="flex size-7 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-all hover:bg-emerald-50 hover:text-emerald-700 active:scale-90 disabled:pointer-events-none disabled:opacity-20 dark:text-slate-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
          aria-label="Previous presets"
          title="Scroll left"
        >
          <ChevronLeft className="size-3.5 stroke-[2.5]" />
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200/80 dark:bg-slate-800" />

        {/* 9-bar indicator track */}
        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          className="relative flex h-7 cursor-pointer touch-none items-center px-1 select-none"
          title="Click or drag to browse presets"
        >
          <div className="flex items-center gap-1.5">
            {items.map((item, idx) => {
              const isItemActive = idx === activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToIndex(idx);
                  }}
                  title={`Jump to ${item.label} (${idx + 1}/${totalCount})`}
                  className={cn(
                    "group relative flex h-5 w-1.5 cursor-pointer items-center justify-center rounded-full transition-all focus:outline-none",
                    isItemActive
                      ? "bg-emerald-600 shadow-2xs ring-2 ring-emerald-500/30 dark:bg-emerald-400"
                      : "bg-slate-200/90 hover:bg-emerald-200 dark:bg-slate-700 dark:hover:bg-emerald-900/50",
                  )}
                />
              );
            })}
          </div>

          {/* Theme-matched Viewfinder Frame (Emerald green) */}
          <div
            className="pointer-events-none absolute inset-y-0 rounded-[8px] border-2 border-emerald-600 bg-emerald-500/10 shadow-[0_1px_3px_rgba(5,150,105,0.22)] transition-transform duration-75 ease-out dark:border-emerald-500 dark:bg-emerald-400/10"
            style={{
              left: 0,
              width: `${thumbWidth}px`,
              transform: `${`translateX(${thumbTranslateX}px)`}`,
            }}
          />
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200/80 dark:bg-slate-800" />

        {/* Next Button */}
        <button
          type="button"
          onClick={() => scrollByAmount("next")}
          disabled={!canScrollRight}
          className="flex size-7 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-all hover:bg-emerald-50 hover:text-emerald-700 active:scale-90 disabled:pointer-events-none disabled:opacity-20 dark:text-slate-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
          aria-label="Next presets"
          title="Scroll right"
        >
          <ChevronRight className="size-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
