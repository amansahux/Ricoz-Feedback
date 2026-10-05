import React, { useState } from "react";
import { Link } from "react-router";
import {
  MessageSquare,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  Clock,
  Inbox,
} from "lucide-react";

const SAMPLE_FEEDBACK_ITEMS = [
  {
    id: "fb-1",
    customerName: "Ananya Singh",
    customerInitials: "AS",
    avatarBg: "bg-[#f9dfb9] text-[#261903]",
    verbatim: "Checkout process was confusing and card got charged twice...",
    context: "Order #ORD-9912 • Stripe Gateway",
    sentiment: "negative",
    status: "in_progress",
    statusLabel: "In Progress",
    updatedAt: "2h ago",
  },
  {
    id: "fb-2",
    customerName: "Rohit Kumar",
    customerInitials: "RK",
    avatarBg: "bg-[#eae1db] text-[#1f1b18]",
    verbatim: "Really happy with the swift support on our account tier upgrade!",
    context: "Account #ACC-4100 • Enterprise Plan",
    sentiment: "positive",
    status: "resolved",
    statusLabel: "Resolved",
    updatedAt: "Yesterday",
  },
  {
    id: "fb-3",
    customerName: "Meera Patel",
    customerInitials: "MP",
    avatarBg: "bg-[#eee1cb] text-[#4e4635]",
    verbatim: "Shipping took 7 business days instead of the promised 2...",
    context: "Logistics Track #FDX-220",
    sentiment: "negative",
    status: "waiting",
    statusLabel: "Waiting for customer",
    updatedAt: "Oct 02",
  },
  {
    id: "fb-4",
    customerName: "David Chen",
    customerInitials: "DC",
    avatarBg: "bg-[#f0e6e1] text-[#1f1b18]",
    verbatim: "Pricing transparency is great, would love multi-currency exports.",
    context: "Billing Feature Request",
    sentiment: "neutral",
    status: "assigned",
    statusLabel: "Assigned",
    updatedAt: "Sep 28",
  },
];

const SAMPLE_CONVERSATIONS = [
  {
    id: "conv-1",
    customerName: "Ananya Singh",
    customerInitials: "AS",
    avatarBg: "bg-[#f9dfb9] text-[#261903]",
    topic: "Checkout billing & delivery experience",
    lastMessage:
      "I've initiated the partial reversal for transaction #TXN-491. Please check your banking statement.",
    status: "Waiting for customer",
    statusClass: "bg-blue-50 text-blue-800 border-blue-200",
    time: "12 min ago",
  },
  {
    id: "conv-2",
    customerName: "Vikram Seth",
    customerInitials: "VS",
    avatarBg: "bg-[#eae1db] text-[#1f1b18]",
    topic: "API Webhook responses for NPS",
    lastMessage:
      "The HMAC signature header was indeed malformed on version 2.4. We've rolled out a patch.",
    status: "Open",
    statusClass: "bg-[#f9dfb9]/70 text-[#261903] border-[#dbc39f]",
    time: "3 hours ago",
  },
  {
    id: "conv-3",
    customerName: "Elena Vance",
    customerInitials: "EV",
    avatarBg: "bg-[#eee1cb] text-[#4e4635]",
    topic: "Onboarding feedback walkthrough",
    lastMessage:
      "Thank you for sharing your screen yesterday! Team configuration has been completed.",
    status: "Resolved",
    statusClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    time: "1 day ago",
  },
];

export default function MemberFeedbackWorkload({ memberName = "Member" }) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = SAMPLE_FEEDBACK_ITEMS.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "assigned") return item.status === "assigned";
    if (activeTab === "in_progress") return item.status === "in_progress";
    if (activeTab === "resolved") return item.status === "resolved";
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. FEEDBACK WORKLOAD CARD */}
      <div className="bg-white border border-[#eae1db] rounded-xl shadow-sm overflow-hidden">
        {/* Header & Filter Tabs */}
        <div className="p-5 pb-0 border-b border-[#eae1db]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#1f1b18]">
                Feedback Workload
              </h2>
              <p className="text-xs text-[#5d3f3e]">
                Customer items under {memberName}&apos;s operational custody
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#926e6d] font-medium">Sort:</span>
              <select className="h-8 text-xs bg-[#fff8f5] border border-[#eae1db] rounded-lg px-2 text-[#1f1b18] focus:outline-none focus:border-[#bb0028]">
                <option>Recently updated</option>
                <option>Highest priority</option>
                <option>Negative sentiment first</option>
              </select>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-5 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "all"
                  ? "text-[#bb0028] border-[#bb0028]"
                  : "text-[#5d3f3e] border-transparent hover:text-[#1f1b18]"
              }`}
            >
              <span>All</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f9dfb9] text-[#261903]">
                24
              </span>
            </button>

            <button
              onClick={() => setActiveTab("assigned")}
              className={`pb-3 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "assigned"
                  ? "text-[#bb0028] border-[#bb0028]"
                  : "text-[#5d3f3e] border-transparent hover:text-[#1f1b18]"
              }`}
            >
              <span>Assigned</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f6ece7] text-[#5d3f3e]">
                8
              </span>
            </button>

            <button
              onClick={() => setActiveTab("in_progress")}
              className={`pb-3 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "in_progress"
                  ? "text-[#bb0028] border-[#bb0028]"
                  : "text-[#5d3f3e] border-transparent hover:text-[#1f1b18]"
              }`}
            >
              <span>In Progress</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f6ece7] text-[#5d3f3e]">
                8
              </span>
            </button>

            <button
              onClick={() => setActiveTab("resolved")}
              className={`pb-3 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "resolved"
                  ? "text-[#bb0028] border-[#bb0028]"
                  : "text-[#5d3f3e] border-transparent hover:text-[#1f1b18]"
              }`}
            >
              <span>Resolved</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f6ece7] text-[#5d3f3e]">
                16
              </span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Inbox size={28} className="text-[#926e6d] mb-2" />
              <h4 className="text-sm font-semibold text-[#1f1b18]">No feedback items in this tab</h4>
              <p className="text-xs text-[#5d3f3e] mt-0.5">Switch to another tab to view tickets.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fbf2ec] text-[11px] font-semibold text-[#5d3f3e] uppercase tracking-wider border-b border-[#eae1db]">
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Feedback Verbatim</th>
                  <th className="py-3 px-4">Sentiment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f6ece7] text-xs">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#fbf2ec]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full text-[11px] font-semibold flex items-center justify-center shrink-0 ${item.avatarBg}`}
                        >
                          {item.customerInitials}
                        </div>
                        <span className="font-semibold text-[#1f1b18] group-hover:text-[#bb0028] transition-colors truncate">
                          {item.customerName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 max-w-xs">
                      <p className="text-[#1f1b18] font-medium line-clamp-1">
                        {item.verbatim}
                      </p>
                      <span className="text-[11px] text-[#926e6d]">{item.context}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.sentiment === "positive" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1 h-1 rounded-full bg-emerald-600" />
                          <span>Positive</span>
                        </span>
                      ) : item.sentiment === "negative" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-[#bb0028] border border-red-200">
                          <span className="w-1 h-1 rounded-full bg-[#bb0028]" />
                          <span>Negative</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f6ece7] text-[#5d3f3e] border border-[#eae1db]">
                          <span className="w-1 h-1 rounded-full bg-[#926e6d]" />
                          <span>Neutral</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.status === "resolved" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800">
                          Resolved
                        </span>
                      ) : item.status === "in_progress" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f9dfb9]/70 text-[#261903]">
                          In Progress
                        </span>
                      ) : item.status === "waiting" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                          Waiting for customer
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f6ece7] text-[#5d3f3e]">
                          Assigned
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap text-[#926e6d] font-medium">
                      {item.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Link */}
        <div className="px-5 py-3 border-t border-[#eae1db] bg-[#fbf2ec]/30 flex items-center justify-between text-xs text-[#5d3f3e]">
          <span>Showing {filteredItems.length} of 24 assigned items</span>
          <Link
            to="/feedback"
            className="text-[#bb0028] hover:underline font-semibold inline-flex items-center gap-1"
          >
            <span>View full inbox</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 2. CUSTOMER CONVERSATIONS SECTION */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#1f1b18]">
              Customer conversations
            </h3>
            <p className="text-xs text-[#5d3f3e]">
              Recent customer communications handled by this member
            </p>
          </div>
          <span className="text-[11px] font-medium bg-[#f6ece7] text-[#5d3f3e] px-2 py-0.5 rounded">
            3 Active Threads
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {SAMPLE_CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              className="p-3.5 rounded-lg border border-[#eae1db] hover:border-[#6e5c3e]/50 hover:bg-[#fbf2ec]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 ${conv.avatarBg}`}
                >
                  {conv.customerInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-[#1f1b18]">
                      {conv.customerName}
                    </span>
                    <span className="text-[#926e6d] text-xs">•</span>
                    <span className="text-xs text-[#5d3f3e] font-medium">{conv.topic}</span>
                  </div>
                  <p className="text-xs text-[#5d3f3e] mt-0.5 line-clamp-1">
                    &ldquo;{conv.lastMessage}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border ${conv.statusClass}`}
                >
                  {conv.status}
                </span>
                <span className="text-[11px] text-[#926e6d] whitespace-nowrap">
                  {conv.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
