"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { AlertCircle, Clock } from "lucide-react";
import { useChatAutoScroll } from "../hooks/use-chat-auto-scroll";
import { useGetTicketDetail, type TicketDetailData } from "../hooks/use-get-ticket-detail";
import { useCloseTicket, useSendTicketReply } from "../hooks/use-ticket-actions";
import { TicketDetailBody, TicketDetailHeaderContent } from "./ticket-detail-sections";
import { formatTicketDateTime, getTicketStatusInfo } from "./ticket-detail-utils";

interface TicketDetailDialogProps {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TicketInitialComplaint({ ticket }: { ticket: TicketDetailData }) {
  if (!ticket.description) return null;

  return (
    <div className="relative space-y-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-xs shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
          <span>Initial Complaint Issue</span>
        </div>
        {ticket.addedOn && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700/80 dark:text-amber-400/80">
            <Clock className="size-3" />
            {formatTicketDateTime(ticket.addedOn)}
          </span>
        )}
      </div>
      <p className="pl-6 leading-relaxed font-normal whitespace-pre-wrap text-slate-800 dark:text-slate-200">
        {ticket.description}
      </p>
    </div>
  );
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
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-500/5 via-slate-50/50 to-emerald-500/10 px-6 py-4 pr-12 dark:border-slate-800/80 dark:from-slate-900 dark:to-slate-900/90">
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
          customerMessageClassName="pt-0.5 leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300"
          chatEndRef={chatEndRef}
          renderPinned={(t) => <TicketInitialComplaint ticket={t} />}
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
