"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useState } from "react";
import { TicketDetailBody, TicketDetailHeaderContent } from "./components/ticket-detail-sections";
import { getTicketStatusInfo } from "./components/ticket-detail-utils";
import { useChatAutoScroll } from "./hooks/use-chat-auto-scroll";
import { useGetTicketDetail } from "./hooks/use-get-ticket-detail";
import { useCloseTicket, useSendTicketReply } from "./hooks/use-ticket-actions";

interface TicketDetailDialogProps {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketDetailDialog({ ticketId, open, onOpenChange }: TicketDetailDialogProps) {
  const { data: ticket, isLoading } = useGetTicketDetail(ticketId);
  const sendReplyMutation = useSendTicketReply();
  const closeTicketMutation = useCloseTicket();

  const [replyMessage, setReplyMessage] = useState("");
  const chatEndRef = useChatAutoScroll(open, ticket);

  const handleSendReply = () => {
    if (!ticketId || !replyMessage.trim() || sendReplyMutation.isPending) return;
    sendReplyMutation.mutate(
      { id: ticketId, message: replyMessage.trim() },
      {
        onSuccess: () => {
          setReplyMessage("");
          setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleCloseTicket = () => {
    if (!ticketId) return;
    closeTicketMutation.mutate(ticketId);
  };

  const { isClosed, customerName } = getTicketStatusInfo(ticket);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[85vh] max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 p-0 shadow-2xl dark:border-slate-800">
        {/* Fixed Header */}
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-linear-to-r from-emerald-500/5 via-slate-50/50 to-emerald-500/10 px-6 py-4 pr-12 dark:border-slate-800/80 dark:from-slate-900 dark:to-slate-900/90">
          <TicketDetailHeaderContent
            ticket={ticket}
            ticketId={ticketId}
            isClosed={isClosed}
            isClosing={closeTicketMutation.isPending}
            onCloseTicket={handleCloseTicket}
          />
        </DialogHeader>

        <TicketDetailBody
          isLoading={isLoading}
          ticket={ticket}
          isClosed={isClosed}
          customerName={customerName}
          customerMessageClassName="pt-0.5 leading-relaxed break-all whitespace-pre-wrap text-slate-700 dark:text-slate-300"
          chatEndRef={chatEndRef}
          replyMessage={replyMessage}
          onReplyMessageChange={setReplyMessage}
          onKeyDown={handleKeyDown}
          onSend={handleSendReply}
          isSending={sendReplyMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
