import React from "react";
import SurveyTableRow from "./SurveyTableRow.jsx";

export default function SurveyTable({ surveys = [], onShare, onDelete }) {
  return (
    <div className="bg-white border border-[#EFE4D6] rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FBF2EC]/80 border-b border-[#EFE4D6] text-[11px] font-semibold text-[#7d7461] tracking-wider uppercase font-inter">
              <th className="py-3.5 px-6">TITLE</th>
              <th className="py-3.5 px-4">STATUS</th>
              <th className="py-3.5 px-4">QUESTIONS</th>
              <th className="py-3.5 px-4">RESPONSES</th>
              <th className="py-3.5 px-4">CREATED</th>
              <th className="py-3.5 px-6 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE4D6]/60">
            {surveys.map((survey) => (
              <SurveyTableRow
                key={survey._id || survey.id || survey.slug}
                survey={survey}
                onShare={onShare}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="px-6 py-3.5 bg-[#FBF2EC]/40 border-t border-[#EFE4D6] flex items-center justify-between text-xs text-[#7d7461] font-inter">
        <span>
          Showing <strong className="text-[#1f1b18]">{surveys.length}</strong> of{" "}
          <strong className="text-[#1f1b18]">{surveys.length}</strong> surveys
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled
            className="px-2.5 py-1 rounded border border-[#EFE4D6] opacity-50 cursor-not-allowed bg-white text-[#1f1b18]"
          >
            Previous
          </button>
          <button className="px-3 py-1 rounded bg-[#bb0028] text-white font-medium text-xs">
            1
          </button>
          <button
            disabled
            className="px-2.5 py-1 rounded border border-[#EFE4D6] opacity-50 cursor-not-allowed bg-white text-[#1f1b18]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
