"use client";

import { apiRequest, formatDate } from "@/components/api";
import Pagination from "@/components/Pagination";
import {
  AlertCircle,
  Archive,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  PenSquare,
  RefreshCw,
  Reply,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  User,
  X,
  ExternalLink,
  Phone,
  Building,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const TABS = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "all", label: "All Messages", icon: MessageSquare },
  { id: "unread", label: "Unread", icon: Mail },
  { id: "replied", label: "Replied", icon: Reply },
  { id: "sent", label: "Sent Emails", icon: Send },
  { id: "failed", label: "Failed Emails", icon: AlertCircle },
  { id: "archived", label: "Archived", icon: Archive },
];

const SOURCES = [
  { id: "all", label: "All Sources" },
  { id: "contact_form", label: "Contact Form" },
  { id: "service_lead", label: "Service Lead" },
  { id: "direct_inbound", label: "Direct Inbound" },
  { id: "admin_outbound", label: "Admin Outbound" },
];

const STATUS_STYLES = {
  unread: "border-orange-200 bg-orange-50 text-orange-700",
  read: "border-blue-200 bg-blue-50 text-blue-700",
  replied: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  sent: "border-sky-200 bg-sky-50 text-sky-700",
  queued: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  bounced: "border-red-200 bg-red-50 text-red-700",
  received: "border-teal-200 bg-teal-50 text-teal-700",
};

function StatusPill({ status }) {
  const key = (status || "unread").toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        STATUS_STYLES[key] || STATUS_STYLES.unread
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          key === "unread"
            ? "bg-orange-500"
            : key === "replied" || key === "delivered"
            ? "bg-emerald-500"
            : key === "failed" || key === "bounced"
            ? "bg-rose-500"
            : "bg-sky-500"
        }`}
      />
      {key}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, highlight = false, alert = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm transition ${
        alert && Number(value) > 0
          ? "border-rose-200 bg-rose-50/50"
          : highlight && Number(value) > 0
          ? "border-orange-200 bg-orange-50/40"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p
            className={`mt-1.5 text-2xl font-black ${
              alert && Number(value) > 0
                ? "text-rose-700"
                : highlight && Number(value) > 0
                ? "text-orange-700"
                : "text-slate-900"
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            alert && Number(value) > 0
              ? "bg-rose-100 text-rose-700"
              : highlight && Number(value) > 0
              ? "bg-orange-100 text-orange-700"
              : "bg-[#235056]/10 text-[#235056]"
          }`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

/**
 * Modal to view complete conversation thread and reply directly to customer
 */
function ConversationDetailModal({
  conversationId,
  onClose,
  onConversationUpdated,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const loadThread = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/emails/conversations/${conversationId}?markRead=true`);
      setData(res.data);
      if (onConversationUpdated) onConversationUpdated();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Could not load conversation",
        text: err.message,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }, [conversationId, onClose, onConversationUpdated]);

  useEffect(() => {
    const timer = setTimeout(loadThread, 0);
    return () => clearTimeout(timer);
  }, [loadThread]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSendingReply(true);
    try {
      await apiRequest(`/emails/conversations/${conversationId}/reply`, {
        method: "POST",
        body: JSON.stringify({ replyText: replyText.trim() }),
      });

      Swal.fire({
        icon: "success",
        title: "Reply sent successfully",
        text: "The customer has been notified via Resend.",
        timer: 1800,
        showConfirmButton: false,
      });

      setReplyText("");
      setPreviewMode(false);
      await loadThread();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to send reply",
        text: err.message || "Please check your Resend configuration.",
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleToggleArchive = async () => {
    if (!data?.conversation) return;
    const nextArchived = !data.conversation.isArchived;

    try {
      await apiRequest(`/emails/conversations/${conversationId}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: nextArchived }),
      });
      await loadThread();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Archive update failed", text: err.message });
    }
  };

  const handleToggleReadStatus = async () => {
    if (!data?.conversation) return;
    const nextStatus = data.conversation.status === "unread" ? "read" : "unread";

    try {
      await apiRequest(`/emails/conversations/${conversationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      await loadThread();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Status update failed", text: err.message });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 shadow-2xl">
          <Loader2 size={32} className="animate-spin text-[#235056]" />
          <p className="text-sm font-semibold text-slate-700">Loading conversation thread...</p>
        </div>
      </div>
    );
  }

  const { conversation, messages = [] } = data || {};
  const customer = conversation?.customer || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-3 sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#d26c51]">
                {conversation?.conversationId}
              </span>
              <StatusPill status={conversation?.status} />
              {conversation?.isArchived && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  Archived
                </span>
              )}
            </div>
            <h2 className="mt-1 truncate text-lg font-bold text-slate-950">
              {conversation?.subject || "No Subject"}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleReadStatus}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              title="Toggle Read/Unread"
            >
              Mark {conversation?.status === "unread" ? "Read" : "Unread"}
            </button>
            <button
              type="button"
              onClick={handleToggleArchive}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              title="Archive/Unarchive"
            >
              {conversation?.isArchived ? "Unarchive" : "Archive"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Customer Information Bar */}
        <div className="grid grid-cols-1 border-b border-slate-100 bg-[#123f46]/[0.03] px-6 py-3 text-xs sm:grid-cols-4 sm:gap-4">
          <div className="flex items-center gap-2 py-1">
            <User size={14} className="text-[#235056]" />
            <span className="font-semibold text-slate-800">{customer.name || "-"}</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <Mail size={14} className="text-[#235056]" />
            <a
              href={`mailto:${customer.email}`}
              className="truncate font-semibold text-[#0f766e] hover:underline"
            >
              {customer.email || "-"}
            </a>
          </div>
          <div className="flex items-center gap-2 py-1">
            <Phone size={14} className="text-[#235056]" />
            <span className="text-slate-700">{customer.phone || "No phone"}</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <Building size={14} className="text-[#235056]" />
            <span className="text-slate-700">{customer.company || "Direct inquiry"}</span>
          </div>
        </div>

        {/* Message Thread History */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Conversation Thread ({messages.length} message{messages.length === 1 ? "" : "s"})
            </p>
            <span className="text-xs text-slate-400">
              Source: {conversation?.source?.replace("_", " ")}
            </span>
          </div>

          {messages.map((msg, index) => {
            const isInbound = msg.direction === "inbound";
            return (
              <div
                key={msg._id || index}
                className={`rounded-2xl border p-5 transition ${
                  isInbound
                    ? "border-teal-100 bg-teal-50/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        isInbound
                          ? "bg-teal-600 text-white"
                          : "bg-[#123f46] text-white"
                      }`}
                    >
                      {isInbound ? "IN" : "OUT"}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {isInbound ? msg.sender?.name || "Customer" : "Kraviona Support"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isInbound ? msg.sender?.email : `To: ${msg.recipient?.email}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <StatusPill status={msg.status} />
                    <span className="text-xs text-slate-400">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {msg.bodyText || "(No message body)"}
                </div>

                {msg.resendEmailId && (
                  <div className="mt-3 flex items-center gap-1 border-t border-slate-100/80 pt-2 text-[11px] text-slate-400">
                    <span>Resend ID:</span>
                    <code className="font-mono">{msg.resendEmailId}</code>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reply Section */}
        <div className="border-t border-slate-200 bg-slate-50/80 p-5">
          <form onSubmit={handleSendReply} className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="replyText" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Reply size={14} className="text-[#235056]" />
                Reply to {customer.name || customer.email}
              </label>

              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-xs font-semibold text-[#0f766e] hover:underline"
              >
                {previewMode ? "Hide Preview" : "Preview Branded Email"}
              </button>
            </div>

            {previewMode ? (
              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                <p className="font-bold text-slate-800">
                  Preview of email sent from Kraviona Support &lt;support@kraviona.com&gt;:
                </p>
                <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3 leading-relaxed">
                  <p className="font-medium text-slate-900">Hello {customer.name || "there"},</p>
                  <p className="mt-2 whitespace-pre-line text-slate-800">{replyText || "(Type your reply below to preview)"}</p>
                  <p className="mt-4 text-slate-500 font-semibold">Warm regards,<br />Kraviona Support Team</p>
                </div>
              </div>
            ) : (
              <textarea
                id="replyText"
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your response to the customer. This will be sent as a verified email from Kraviona Support via Resend..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/15"
                required
              />
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-400">
                Sent from <strong className="text-slate-600">support@kraviona.com</strong> via Resend SDK.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#235056] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#183b40] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sendingReply ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal to compose brand new email without prior conversation
 */
function ComposeEmailModal({ onClose, onEmailSent }) {
  const [to, setTo] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim() || !bodyText.trim()) return;

    setSending(true);
    try {
      await apiRequest("/emails/compose", {
        method: "POST",
        body: JSON.stringify({
          to: to.trim(),
          recipientName: recipientName.trim(),
          subject: subject.trim(),
          bodyText: bodyText.trim(),
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Email dispatched",
        text: `Email successfully sent to ${to.trim()} via Resend.`,
        timer: 1800,
        showConfirmButton: false,
      });

      if (onEmailSent) onEmailSent();
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to send email",
        text: err.message || "Please check your Resend configuration and sender domain.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-3 sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#235056] text-white">
              <PenSquare size={16} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-950">Compose Email</h2>
              <p className="text-xs text-slate-500">
                Send from support@kraviona.com via Resend
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="compose-to" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Recipient Email *
              </label>
              <input
                id="compose-to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="client@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:bg-white focus:ring-2 focus:ring-[#235056]/15"
                required
              />
            </div>

            <div>
              <label htmlFor="compose-name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Recipient Name
              </label>
              <input
                id="compose-name"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Amar Kumar"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:bg-white focus:ring-2 focus:ring-[#235056]/15"
              />
            </div>
          </div>

          <div>
            <label htmlFor="compose-subject" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Subject *
            </label>
            <input
              id="compose-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Next.js Website Architecture & Scope"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:bg-white focus:ring-2 focus:ring-[#235056]/15"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="compose-message" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Message Body *
              </label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="text-xs font-semibold text-[#0f766e] hover:underline"
              >
                {preview ? "Edit Body" : "Preview Email"}
              </button>
            </div>

            {preview ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                <p className="font-semibold text-slate-900">
                  Subject: {subject || "(Untitled)"}
                </p>
                <div className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-700">
                  {bodyText || "(No content yet)"}
                </div>
              </div>
            ) : (
              <textarea
                id="compose-message"
                rows={6}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Write your email content..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:bg-white focus:ring-2 focus:ring-[#235056]/15"
                required
              />
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-[11px] text-slate-400">
              Sender identity: <strong className="text-slate-600">support@kraviona.com</strong>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending || !to.trim() || !subject.trim() || !bodyText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#235056] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#183b40] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Main Super Admin Email & Messages Management Page
 */
export default function MainMessagesPage() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [conversations, setConversations] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [retryingId, setRetryingId] = useState("");

  // Load stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await apiRequest("/emails/stats");
      setStats(res.data);
    } catch {
      // Stats failure is non-blocking
    }
  }, []);

  // Load active tab data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) params.set("search", search.trim());
      if (sourceFilter !== "all") params.set("source", sourceFilter);

      if (activeTab === "sent") {
        const res = await apiRequest(`/emails/messages/sent?${params.toString()}`);
        setSentEmails(res.data || []);
        setPagination(res.pagination || null);
      } else if (activeTab === "failed") {
        const res = await apiRequest(`/emails/messages/failed?${params.toString()}`);
        setSentEmails(res.data || []);
        setPagination(res.pagination || null);
      } else {
        if (activeTab !== "all") {
          params.set("status", activeTab);
        }
        const res = await apiRequest(`/emails/conversations?${params.toString()}`);
        setConversations(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch (err) {
      setError(err.message || "Failed to load messages.");
      setConversations([]);
      setSentEmails([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search, sourceFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchStats, 0);
    return () => clearTimeout(timer);
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(fetchData, search.trim() ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchData, search]);

  const handleRetryFailed = async (message) => {
    setRetryingId(message._id);
    try {
      await apiRequest(`/emails/messages/${message._id}/retry`, { method: "POST" });
      Swal.fire({
        icon: "success",
        title: "Email retried",
        text: "Outbound message re-sent successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchData();
      fetchStats();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Retry failed",
        text: err.message,
      });
    } finally {
      setRetryingId("");
    }
  };

  const handleTestSend = async () => {
    const { value: targetEmail } = await Swal.fire({
      title: "Send Test Email via Resend",
      text: "Enter recipient email to verify domain verification & delivery:",
      input: "email",
      inputPlaceholder: "you@example.com",
      showCancelButton: true,
      confirmButtonText: "Send Test",
      confirmButtonColor: "#235056",
    });

    if (!targetEmail) return;

    Swal.fire({
      title: "Sending test email...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await apiRequest("/emails/test-send", {
        method: "POST",
        body: JSON.stringify({ to: targetEmail }),
      });
      Swal.fire({
        icon: "success",
        title: "Test Sent Successfully",
        text: res.message || `Email sent to ${targetEmail}`,
      });
      fetchStats();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Test Send Failed",
        text: err.message,
      });
    }
  };

  return (
    <div className="min-h-full w-full bg-[#F8F9FB] p-4 sm:p-6 lg:p-8">
      {/* Page Title & Main Actions */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full bg-[#d26c51]" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Communication & Inquiries
            </p>
          </div>
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
            Email & Messages Inbox
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Send, receive, and manage customer communications with Resend email delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleTestSend}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            title="Test Resend configuration"
          >
            <Sparkles size={15} className="text-[#d26c51]" />
            Test Connection
          </button>

          <button
            type="button"
            onClick={() => {
              fetchData();
              fetchStats();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setIsComposeOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#235056] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#183b40]"
          >
            <PenSquare size={15} />
            Compose Email
          </button>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="mb-6 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={Inbox}
          label="Total Inquiries"
          value={stats ? stats.totalConversations : "-"}
        />
        <StatCard
          icon={Mail}
          label="Unread"
          value={stats ? stats.unreadCount : "-"}
          highlight={true}
        />
        <StatCard
          icon={Reply}
          label="Replied"
          value={stats ? stats.repliedCount : "-"}
        />
        <StatCard
          icon={Send}
          label="Sent Emails"
          value={stats ? stats.sentCount : "-"}
        />
        <StatCard
          icon={AlertCircle}
          label="Failed Emails"
          value={stats ? stats.failedCount : "-"}
          alert={true}
        />
      </div>

      {/* Main Inbox Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/60 px-3 pt-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count =
              tab.id === "unread"
                ? stats?.unreadCount
                : tab.id === "failed"
                ? stats?.failedCount
                : null;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "border-b-2 border-[#235056] text-[#235056]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon size={15} />
                {tab.label}
                {Boolean(count && count > 0) && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                      tab.id === "failed"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search sender, email, subject, phone, message content..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 outline-none transition focus:border-[#235056] focus:bg-white focus:ring-2 focus:ring-[#235056]/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <Filter size={13} className="text-slate-400" />
              <span>Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                {SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Table View */}
        <div className="overflow-x-auto">
          {activeTab === "sent" || activeTab === "failed" ? (
            /* Sent / Failed Outbound Emails Table */
            <table className="w-full whitespace-nowrap text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Recipient</th>
                  <th className="px-5 py-3.5">Subject</th>
                  <th className="px-5 py-3.5">Delivery Status</th>
                  <th className="px-5 py-3.5">Resend Email ID</th>
                  <th className="px-5 py-3.5">Sent Date</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                      <Loader2 size={24} className="mx-auto animate-spin" />
                      <span className="mt-2 block text-xs">Loading outbound emails...</span>
                    </td>
                  </tr>
                ) : sentEmails.length ? (
                  sentEmails.map((msg) => (
                    <tr key={msg._id} className="transition hover:bg-[#235056]/[0.02]">
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-slate-900">
                          {msg.recipient?.name || msg.recipient?.email}
                        </p>
                        <p className="text-[11px] text-slate-400">{msg.recipient?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="max-w-[280px] truncate text-xs font-semibold text-slate-800">
                          {msg.subject}
                        </p>
                        <p className="max-w-[280px] truncate text-[11px] text-slate-400">
                          {msg.bodyText}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={msg.status} />
                        {msg.errorMessage && (
                          <p className="mt-1 max-w-[200px] truncate text-[10px] text-rose-600">
                            {msg.errorMessage}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                        {msg.resendEmailId || "-"}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {msg.status === "failed" || msg.status === "bounced" ? (
                          <button
                            type="button"
                            disabled={retryingId === msg._id}
                            onClick={() => handleRetryFailed(msg)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                            title="Retry sending"
                          >
                            {retryingId === msg._id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <RotateCcw size={13} />
                            )}
                            Retry
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedConversationId(msg.conversationId)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                            title="View thread"
                          >
                            <Eye size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                      <p className="text-xs">No outbound emails match this filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* Conversations List Table */
            <table className="w-full whitespace-nowrap text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Subject & Preview</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Source</th>
                  <th className="px-5 py-3.5">Last Activity</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                      <Loader2 size={24} className="mx-auto animate-spin" />
                      <span className="mt-2 block text-xs">Loading conversations...</span>
                    </td>
                  </tr>
                ) : conversations.length ? (
                  conversations.map((conv) => {
                    const isUnread = conv.status === "unread";
                    return (
                      <tr
                        key={conv._id}
                        className={`transition hover:bg-[#235056]/[0.02] ${
                          isUnread ? "bg-orange-50/25 font-medium" : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#235056]/10 text-xs font-black text-[#235056]">
                              {(conv.customer?.name || "C").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-900">
                                {conv.customer?.name || "-"}
                              </p>
                              <p className="truncate text-[11px] text-slate-400">
                                {conv.customer?.email || "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="max-w-[320px] truncate text-xs font-bold text-slate-900">
                            {conv.subject || "-"}
                          </p>
                          <p className="max-w-[320px] truncate text-[11px] text-slate-400">
                            {conv.latestMessageSnippet || "(No content)"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill status={conv.status} />
                        </td>
                        <td className="px-5 py-4 text-xs capitalize text-slate-600">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700">
                            {conv.source?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-400">
                          {formatDate(conv.lastMessageAt || conv.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedConversationId(conv.conversationId)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#235056]/40 hover:bg-[#235056] hover:text-white"
                              title="Open conversation and reply"
                            >
                              <Eye size={13} />
                              Open
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                        <Inbox size={28} className="text-slate-300" />
                        <p className="text-xs font-semibold text-slate-500">
                          No messages match the current view.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          page={pagination?.page || page}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total || 0}
          limit={pagination?.limit || 20}
          itemLabel={activeTab === "sent" ? "sent emails" : "messages"}
          onPageChange={setPage}
        />
      </div>

      {/* Conversation Thread & Reply Modal */}
      {selectedConversationId && (
        <ConversationDetailModal
          conversationId={selectedConversationId}
          onClose={() => setSelectedConversationId(null)}
          onConversationUpdated={() => {
            fetchData();
            fetchStats();
          }}
        />
      )}

      {/* Compose New Email Modal */}
      {isComposeOpen && (
        <ComposeEmailModal
          onClose={() => setIsComposeOpen(false)}
          onEmailSent={() => {
            fetchData();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}
