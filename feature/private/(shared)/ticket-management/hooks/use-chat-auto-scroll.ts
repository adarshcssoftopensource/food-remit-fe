import { useEffect, useRef } from "react";
import type { TicketDetailData } from "./use-get-ticket-detail";

export function useChatAutoScroll(open: boolean, ticket: TicketDetailData | null | undefined) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasChats = Boolean(ticket?.chats);
  const chatCount = ticket?.chats?.length;
  const currentTicketId = ticket?.id;

  // Auto scroll down to bottom on initial load and when chat messages update
  useEffect(() => {
    if (open && hasChats) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, hasChats, chatCount, currentTicketId]);

  return chatEndRef;
}
