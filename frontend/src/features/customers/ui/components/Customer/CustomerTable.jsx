import React from "react";
import { Link } from "react-router";
import { Star, ChevronRight } from "lucide-react";

export const getInitials = (name) => {
  if (!name) return "AN";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export const formatCustomerDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export function CustomerTableRow({ customer }) {
  const name = customer.name || "Anonymous Respondent";
  const email = customer.email || "—";
  const initials = getInitials(name);
  const totalResponses = customer.stats?.totalResponses || 0;
  const avgRating = customer.stats?.avgCsat || customer.stats?.avgNps || "—";
  const lastActive = customer.stats?.latestResponseAt || customer.createdAt;

  return (
    <tr
      className="hover:bg-[#FBF2EC]/40 transition-colors group cursor-pointer"
    >
      {/* Customer Name & Avatar */}
      <td className="py-4.5 px-6">
        <Link to={`/customers/${customer._id}`} className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-[#F9DFB9] border border-[#dbc39f]/50 flex items-center justify-center text-[#746243] font-inter font-semibold text-xs shrink-0 shadow-xs">
            {initials}
          </div>
          <div>
            <span className="font-semibold text-sm font-inter text-[#1f1b18] group-hover:text-[#bb0028] transition-colors block">
              {name}
            </span>
            <span className="text-xs text-[#7d7461] md:hidden block font-inter">
              {email}
            </span>
          </div>
        </Link>
      </td>

      {/* Email */}
      <td className="py-4.5 px-6 text-[#7d7461] text-xs sm:text-sm font-inter">
        <Link to={`/customers/${customer._id}`} className="hover:text-[#1f1b18]">
          {email}
        </Link>
      </td>

      {/* Total Responses */}
      <td className="py-4.5 px-6">
        <Link to={`/customers/${customer._id}`}>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0e6e1] text-[#1f1b18] border border-[#EFE4D6]">
            {totalResponses} {totalResponses === 1 ? "response" : "responses"}
          </span>
        </Link>
      </td>

      {/* Avg Rating */}
      <td className="py-4.5 px-6">
        <Link to={`/customers/${customer._id}`} className="flex items-center gap-1.5">
          <span className="font-semibold text-sm font-epilogue text-[#1f1b18]">
            {avgRating}
          </span>
          {avgRating !== "—" && (
            <Star size={14} className="text-[#f59e0b] fill-[#f59e0b]" />
          )}
        </Link>
      </td>

      {/* Last Activity */}
      <td className="py-4.5 px-6 text-[#7d7461] text-xs font-inter">
        <Link to={`/customers/${customer._id}`} className="flex flex-col">
          <span className="text-[#1f1b18] font-medium text-xs">
            {formatCustomerDate(lastActive)}
          </span>
          {lastActive && (
            <span className="text-[11px] text-[#7d7461]/70">
              {new Date(lastActive).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
        </Link>
      </td>

      {/* Trailing action link */}
      <td className="py-4.5 px-6 text-right">
        <Link
          to={`/customers/${customer._id}`}
          className="inline-flex items-center gap-1 text-[#7d7461] group-hover:text-[#bb0028] transition-colors text-xs font-semibold"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 mr-0.5">
            Details
          </span>
          <ChevronRight
            size={16}
            className="group-hover:translate-x-0.5 transition-transform text-[#bb0028]"
          />
        </Link>
      </td>
    </tr>
  );
}

export default function CustomerTable({ customers = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EFE4D6] shadow-xs overflow-hidden">
      {/* Desktop / Tablet Table */}
      <div className="overflow-x-auto">
        <table
          aria-label="Customer feedback intelligence directory"
          className="w-full text-left border-collapse"
        >
          <thead>
            <tr className="border-b border-[#EFE4D6]/70 bg-[#FBF2EC]/40">
              <th
                className="py-4 px-6 text-[11px] font-bold font-inter text-[#926e6d] tracking-wider uppercase"
                scope="col"
              >
                Customer
              </th>
              <th
                className="py-4 px-6 text-[11px] font-bold font-inter text-[#926e6d] tracking-wider uppercase"
                scope="col"
              >
                Email
              </th>
              <th
                className="py-4 px-6 text-[11px] font-bold font-inter text-[#926e6d] tracking-wider uppercase"
                scope="col"
              >
                Responses
              </th>
              <th
                className="py-4 px-6 text-[11px] font-bold font-inter text-[#926e6d] tracking-wider uppercase"
                scope="col"
              >
                Avg Rating
              </th>
              <th
                className="py-4 px-6 text-[11px] font-bold font-inter text-[#926e6d] tracking-wider uppercase"
                scope="col"
              >
                Last Activity
              </th>
              <th
                className="py-4 px-6 text-[11px] font-bold font-inter text-[#926e6d] tracking-wider uppercase text-right"
                scope="col"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE4D6]/50 text-sm">
            {customers.map((customer) => (
              <CustomerTableRow key={customer._id} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
