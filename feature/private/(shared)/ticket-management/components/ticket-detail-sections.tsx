"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Headphones,
  Lock,
  MessageSquare,
  Package,
  Send,
  Store,
  User,
} from "lucide-react";
import type { KeyboardEvent, ReactNode, RefObject } from "react";
import type { TicketDetailData } from "../hooks/use-get-ticket-detail";
import { formatTicketChatTime, getInitials } from "./ticket-detail-utils";

interface TicketDetailHeaderContentProps {
  ticket: TicketDetailData | null | undefined;
  ticketId: string | null;
  isClosed: boolean;
  isClosing: boolean;
  onCloseTicket: () => void;
}

export function TicketDetailHeaderContent({
  ticket,
  ticketId,
  isClosed,
  isClosing,
  onCloseTicket,
}: TicketDetailHeaderContentProps) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
            <MessageSquare className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Ticket #{ticket?.refrenceNumber || ticket?.orderId || ticketId}
            </DialogTitle>
          </div>
        </div>
        <DialogDescription className="pl-11 text-xs text-slate-500 dark:text-slate-400">
          Subject:{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {ticket?.subject || "No Subject"}
          </span>
        </DialogDescription>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        <Badge
          variant={isClosed ? "secondary" : "default"}
          className={
            isClosed
              ? "rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              : "flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          }
        >
          {!isClosed && <span className="size-2 animate-pulse rounded-full bg-emerald-500" />}
          {isClosed ? "Closed" : "Active"}
        </Badge>

        {!isClosed && ticketId && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCloseTicket}
            disabled={isClosing}
            className="h-8 rounded-xl border-rose-200 text-xs font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:border-rose-950 dark:hover:bg-rose-950/50"
          >
            <CheckCircle2 className="mr-1.5 size-3.5 text-rose-500" />
            {isClosing ? "Closing..." : "Close Ticket"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function TicketMetadataBar({ ticket }: { ticket: TicketDetailData }) {
  return (
    <div className="grid shrink-0 grid-cols-1 gap-4 border-b border-slate-100 bg-white/80 px-6 py-3 text-xs shadow-2xs sm:grid-cols-3 dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <User className="size-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Customer
          </span>
          <span className="block truncate font-semibold text-slate-800 dark:text-slate-200">
            {ticket.customer?.name || "N/A"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <Store className="size-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Store
          </span>
          <span className="block truncate font-semibold text-slate-800 dark:text-slate-200">
            {ticket.store?.storeName || "N/A"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
          <Package className="size-4" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Product
          </span>
          <span className="block truncate font-semibold text-slate-800 dark:text-slate-200">
            {ticket.productName || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

interface TicketCustomerMessageProps {
  customerName: string;
  message: string;
  addedOn?: string;
  messageClassName: string;
}

export function TicketCustomerMessage({
  customerName,
  message,
  addedOn,
  messageClassName,
}: TicketCustomerMessageProps) {
  return (
    <div className="flex items-start justify-start gap-3">
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-xs font-bold text-slate-700 shadow-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
        {getInitials(customerName)}
      </div>
      <div className="max-w-[80%] space-y-1.5 rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white p-4 text-xs shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-1 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
            {customerName}{" "}
            <span className="text-[10px] font-normal text-slate-400">(Customer)</span>
          </span>
          {addedOn && (
            <span className="font-mono text-[10px] text-slate-400">
              {formatTicketChatTime(addedOn)}
            </span>
          )}
        </div>
        <p className={messageClassName}>{message}</p>
      </div>
    </div>
  );
}

export function TicketSupportMessage({ message, addedOn }: { message: string; addedOn?: string }) {
  return (
    <div className="flex items-start justify-end gap-3">
      <div className="max-w-[80%] space-y-1.5 rounded-2xl rounded-tr-xs bg-emerald-600 p-4 text-xs text-white shadow-md">
        <div className="flex items-center justify-between gap-3 border-b border-emerald-500/40 pb-1">
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-100">
            <Headphones className="size-3" /> Support Agent
          </span>
          {addedOn && (
            <span className="font-mono text-[10px] text-emerald-200/80">
              {formatTicketChatTime(addedOn)}
            </span>
          )}
        </div>
        <p className="pt-0.5 leading-relaxed whitespace-pre-wrap text-emerald-50">{message}</p>
      </div>
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-700 text-xs font-bold text-white shadow-xs">
        <Headphones className="size-4" />
      </div>
    </div>
  );
}

interface TicketReplyFooterProps {
  replyMessage: string;
  onReplyMessageChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isSending: boolean;
}

export function TicketReplyFooter({
  replyMessage,
  onReplyMessageChange,
  onKeyDown,
  onSend,
  isSending,
}: TicketReplyFooterProps) {
  return (
    <div className="shrink-0 space-y-3 border-t border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-2 shadow-xs transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950/50">
        <Textarea
          placeholder="Type your official response to the customer..."
          value={replyMessage}
          onChange={(e) => onReplyMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="max-h-[120px] min-h-[70px] resize-none border-0 bg-transparent p-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-slate-100"
        />
        <div className="flex items-center justify-between border-t border-slate-100 px-1 pt-2 dark:border-slate-800">
          <span className="text-[10px] font-medium text-slate-400">
            Press{" "}
            <kbd className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[9px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Enter
            </kbd>{" "}
            to send,{" "}
            <kbd className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[9px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Shift + Enter
            </kbd>{" "}
            for new line
          </span>
          <Button
            size="sm"
            onClick={onSend}
            disabled={isSending || !replyMessage.trim()}
            className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow"
          >
            <Send className="mr-1.5 size-3.5" />
            {isSending ? "Sending..." : "Send Reply"}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface TicketDetailBodyProps extends TicketReplyFooterProps {
  isLoading: boolean;
  ticket: TicketDetailData | null | undefined;
  isClosed: boolean;
  customerName: string;
  customerMessageClassName: string;
  chatEndRef: RefObject<HTMLDivElement | null>;
  renderPinned?: (ticket: TicketDetailData) => ReactNode;
}

export function TicketDetailBody({
  isLoading,
  ticket,
  isClosed,
  customerName,
  customerMessageClassName,
  chatEndRef,
  renderPinned,
  ...replyFooterProps
}: TicketDetailBodyProps) {
  if (isLoading) {
    return (
      <div className="flex flex-1 animate-pulse flex-col items-center justify-center gap-2 p-12 text-center text-xs font-medium text-slate-400">
        <div className="size-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        Loading ticket details...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-center text-xs text-slate-500">
        Ticket details not available
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50/40 dark:bg-slate-950/40">
      {/* Fixed Metadata Info Bar */}
      <TicketMetadataBar ticket={ticket} />

      {/* Scrollable Messages Area ONLY */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
        {renderPinned?.(ticket)}

        {/* Chat Messages */}
        {ticket.chats.map((chat) => (
          <div key={chat.id} className="space-y-3">
            {/* Customer Message */}
            {chat.userMessage && (
              <TicketCustomerMessage
                customerName={customerName}
                message={chat.userMessage}
                addedOn={chat.addedOn}
                messageClassName={customerMessageClassName}
              />
            )}

            {/* Support Agent Message */}
            {chat.supportMessage && (
              <TicketSupportMessage message={chat.supportMessage} addedOn={chat.addedOn} />
            )}
          </div>
        ))}

        {/* Anchor for auto scroll down */}
        <div ref={chatEndRef} />
      </div>

      {/* Fixed Reply Footer */}
      {!isClosed ? <TicketReplyFooter {...replyFooterProps} /> : <TicketClosedNotice />}
    </div>
  );
}

export function TicketClosedNotice() {
  return (
    <div className="flex shrink-0 items-center justify-center gap-2 border-t border-slate-200/80 bg-slate-100/80 p-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/80">
      <Lock className="size-4 text-slate-400" />
      This ticket has been marked as closed. No further replies can be sent.
    </div>
  );
}
