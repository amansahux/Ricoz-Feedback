import React from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowDown, Download, CheckCircle2 } from "lucide-react";
import { getInitials, formatCustomerDate } from "../Customer/CustomerTable.jsx";

export default function CustomerProfileHeader({ customer, onExportJson }) {
  const name = customer?.name || "Anonymous Respondent";
  const email = customer?.email || "—";
  const initials = getInitials(name);
  const createdAt = customer?.createdAt;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Action & Breadcrumb Strip */}
      <div className="flex items-center justify-between">
        <Link
          to="/customers"
          className="inline-flex items-center gap-1.5 text-xs font-medium font-inter text-[#7d7461] hover:text-[#bb0028] transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          <span>Back to Customers</span>
        </Link>

        <button
          type="button"
          onClick={onExportJson}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EFE4D6] bg-white hover:bg-[#FBF2EC] text-[#1f1b18] text-xs font-medium font-inter transition-colors shadow-2xs cursor-pointer"
        >
          <Download size={14} />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Customer Identity Card Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#EFE4D6] p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-4">
          {/* Avatar Monogram */}
          <div className="w-16 h-16 rounded-full bg-[#FFE5BF] border-2 border-[#E6D7C3] flex items-center justify-center shrink-0 shadow-xs">
            <span className="font-epilogue font-bold text-xl text-[#bb0028] tracking-tight">
              {initials}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
                CUSTOMER
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Contact
              </span>
            </div>
            <h1 className="font-epilogue font-semibold text-2xl sm:text-3xl text-[#1f1b18] tracking-tight mt-0.5">
              {name}
            </h1>
            <p className="text-xs sm:text-sm font-inter text-[#7d7461] mt-0.5 flex flex-wrap items-center gap-2">
              <span className="font-medium text-[#1f1b18]">{email}</span>
              {createdAt && (
                <>
                  <span className="text-[#EFE4D6]">•</span>
                  <span>
                    Customer since{" "}
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action Anchor Button */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <a
            href="#feedback-history-list"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EFE4D6] text-xs font-semibold font-inter text-[#1f1b18] hover:bg-[#FBF2EC] transition shadow-xs group"
          >
            <span>View feedback history</span>
            <ArrowDown
              size={14}
              className="text-[#bb0028] group-hover:translate-y-0.5 transition-transform"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
