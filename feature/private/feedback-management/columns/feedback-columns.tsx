import { FEEDBACK_STATUS_STYLES } from "@/constants/feedback";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/date";
import { FeedbackRowData } from "../hooks/use-get-feedback";

export const feedbackColumns: ColumnDef<FeedbackRowData>[] = [
  {
    accessorKey: "id",
    header: "S.no",
    enableSorting: false,
    cell: ({ row, table }) =>
      table.getState().pagination.pageIndex * table.getState().pagination.pageSize + row.index + 1,
  },
  {
    accessorKey: "userName",
    header: "User Name",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium text-slate-900 dark:text-slate-100">
        {row.original.userName || "Anonymous User"}
      </span>
    ),
  },
  {
    accessorKey: "userEmail",
    header: "Email",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-slate-600 dark:text-slate-400">{row.original.userEmail || "N/A"}</span>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium text-slate-700 dark:text-slate-300">{row.original.subject}</span>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    enableSorting: true,
    cell: ({ row }) => {
      const rating = Math.round(Number(row.original.rating) || 0);
      return (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < rating ? "text-sm text-yellow-400" : "text-sm text-gray-300"}
            >
              ★
            </span>
          ))}
          <span className="text-muted-foreground ml-1 font-mono text-xs">({rating})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "useApplicationAgain",
    header: "Use Again",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-slate-600 dark:text-slate-400">
        {row.original.useApplicationAgain || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "recommend",
    header: "Recommed Application",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-slate-600 dark:text-slate-400">{row.original.recommend || "N/A"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status || "Pending";
      const style =
        FEEDBACK_STATUS_STYLES[status] || "bg-yellow-100 text-yellow-700 border-yellow-200";
      return (
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "submittedOn",
    id: "date",
    header: "Submitted On",
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {formatDate(row.original.submittedOn)}
        </span>
      );
    },
  },
];
