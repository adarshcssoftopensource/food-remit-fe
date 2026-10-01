import { USER_TIME_ZONE } from "../../lib/user-time-zone";
import type { TicketDetailData } from "../hooks/use-get-ticket-detail";

export function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getTicketStatusInfo(ticket: TicketDetailData | null | undefined) {
  const isClosed = ticket?.ticketStatus === "INACTIVE" || ticket?.status === "Closed";
  const customerName = ticket?.customer?.name || "Customer";
  return { isClosed, customerName };
}

export function formatTicketDateTime(value: string) {
  return new Date(value).toLocaleString([], { timeZone: USER_TIME_ZONE });
}

export function formatTicketChatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: USER_TIME_ZONE,
  });
}
