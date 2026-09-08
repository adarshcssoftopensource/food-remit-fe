export const map: Record<number, { label: string; cls: string }> = {
  0: {
    label: "Declined",
    cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400",
  },
  1: {
    label: "Pending",
    cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
  },
  2: {
    label: "Preparing",
    cls: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400",
  },
  5: {
    label: "Sent",
    cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
  },
  6: {
    label: "Completed",
    cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  7: {
    label: "Cancelled",
    cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400",
  },
};
