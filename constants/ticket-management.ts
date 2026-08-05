export type TicketSectionKey = "active-requests" | "closed-requests";

export type TicketRow = {
  id: string;
  orderId: string;
  ticketId: string;
  date: string;
  customerName: string;
  storeName: string;
  subject: string;
  status?: string;
  closedBy?: string;
};

export const TICKET_SECTION_META: Record<TicketSectionKey, { title: string; description: string }> =
  {
    "active-requests": {
      title: "Active Requests",
      description: "Track open support tickets and active customer requests.",
    },
    "closed-requests": {
      title: "Closed Requests",
      description: "Review closed tickets and resolution history.",
    },
  };
