"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  User,
  Store,
  Package,
  Headphones,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useGetTicketDetail } from "../hooks/use-get-ticket-detail";
import { useCloseTicket, useSendTicketReply } from "../hooks/use-ticket-actions";

interface TicketDetailDialogProps {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function TicketDetailDialog({ ticketId, open, onOpenChange }: TicketDetailDialogProps) {
  const { data: ticket, isLoading } = useGetTicketDetail(ticketId);
  const sendReplyMutation = useSendTicketReply();
  const closeTicketMutation = useCloseTicket();

  const [replyMessage, setReplyMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll down to bottom on initial load and when chat messages update
  useEffect(() => {
    if (open && ticket?.chats) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, ticket?.chats?.length, ticket?.id]);

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

  const isClosed = ticket?.ticketStatus === "INACTIVE" || ticket?.status === "Closed";
  const customerName = ticket?.customer?.name || "Customer";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[85vh] max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 p-0 shadow-2xl dark:border-slate-800">
        {/* Fixed Header */}
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-500/5 via-slate-50/50 to-emerald-500/10 px-6 py-4 pr-12 dark:border-slate-800/80 dark:from-slate-900 dark:to-slate-900/90">
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
                  onClick={handleCloseTicket}
                  disabled={closeTicketMutation.isPending}
                  className="h-8 rounded-xl border-rose-200 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-700 dark:border-rose-950 dark:hover:bg-rose-950/50"
                >
                  <CheckCircle2 className="mr-1.5 size-3.5 text-rose-500" />
                  {closeTicketMutation.isPending ? "Closing..." : "Close Ticket"}
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-1 animate-pulse flex-col items-center justify-center gap-2 p-12 text-center text-xs font-medium text-slate-400">
            <div className="size-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            Loading ticket details...
          </div>
        ) : !ticket ? (
          <div className="flex flex-1 items-center justify-center p-12 text-center text-xs text-slate-500">
            Ticket details not available
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50/40 dark:bg-slate-950/40">
            {/* Fixed Metadata Info Bar */}
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

            {/* Scrollable Messages Area ONLY */}
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
              {/* Pinned Initial Complaint Card */}
              {ticket.description && (
                <div className="relative space-y-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                      <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                      <span>Initial Complaint Issue</span>
                    </div>
                    {ticket.addedOn && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700/80 dark:text-amber-400/80">
                        <Clock className="size-3" />
                        {new Date(ticket.addedOn).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="pl-6 leading-relaxed font-normal whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                    {ticket.description}
                  </p>
                </div>
              )}

              {/* Chat Messages */}
              {ticket.chats.map((chat) => (
                <div key={chat.id} className="space-y-3">
                  {/* Customer Message */}
                  {chat.userMessage && (
                    <div className="flex items-start justify-start gap-3">
                      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-xs font-bold text-slate-700 shadow-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
                        {getInitials(customerName)}
                      </div>
                      <div className="max-w-[80%] space-y-1.5 rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white p-4 text-xs shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-1 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
                            {customerName}{" "}
                            <span className="text-[10px] font-normal text-slate-400">
                              (Customer)
                            </span>
                          </span>
                          {chat.addedOn && (
                            <span className="font-mono text-[10px] text-slate-400">
                              {new Date(chat.addedOn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                        <p className="pt-0.5 leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                          {chat.userMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Support Agent Message */}
                  {chat.supportMessage && (
                    <div className="flex items-start justify-end gap-3">
                      <div className="max-w-[80%] space-y-1.5 rounded-2xl rounded-tr-xs bg-emerald-600 p-4 text-xs text-white shadow-md">
                        <div className="flex items-center justify-between gap-3 border-b border-emerald-500/40 pb-1">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-100">
                            <Headphones className="size-3" /> Support Agent
                          </span>
                          {chat.addedOn && (
                            <span className="font-mono text-[10px] text-emerald-200/80">
                              {new Date(chat.addedOn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                        <p className="pt-0.5 leading-relaxed whitespace-pre-wrap text-emerald-50">
                          {chat.supportMessage}
                        </p>
                      </div>
                      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-emerald-500 bg-emerald-700 text-xs font-bold text-white shadow-xs">
                        <Headphones className="size-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Anchor for auto scroll down */}
              <div ref={chatEndRef} />
            </div>

            {/* Fixed Reply Footer */}
            {!isClosed ? (
              <div className="shrink-0 space-y-3 border-t border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-2 shadow-xs transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950/50">
                  <Textarea
                    placeholder="Type your official response to the customer..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
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
                      onClick={handleSendReply}
                      disabled={sendReplyMutation.isPending || !replyMessage.trim()}
                      className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow"
                    >
                      <Send className="mr-1.5 size-3.5" />
                      {sendReplyMutation.isPending ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex shrink-0 items-center justify-center gap-2 border-t border-slate-200/80 bg-slate-100/80 p-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/80">
                <Lock className="size-4 text-slate-400" />
                This ticket has been marked as closed. No further replies can be sent.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
