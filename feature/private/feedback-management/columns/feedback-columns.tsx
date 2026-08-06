import { FEEDBACK_STATUS_STYLES, FeedbackData } from "@/constants/feedback";
import { ColumnDef } from "@tanstack/react-table";

export const feedbackColumns: ColumnDef<FeedbackData>[] = [
  {
    accessorKey: "id",
    header: "S.no",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "userEmail",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${FEEDBACK_STATUS_STYLES[status]}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "submittedOn",
    header: "Submitted On",
    cell: ({ row }) => {
      const date = new Date(row.original.submittedOn);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
];
