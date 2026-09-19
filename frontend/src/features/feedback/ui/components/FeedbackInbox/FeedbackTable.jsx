import React from "react";
import FeedbackTableRow from "./FeedbackTableRow.jsx";

export default function FeedbackTable({ responses, onMarkResolved }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse font-inter">
        <thead>
          <tr className="border-b border-[#EFE4D6] bg-[#FBF2EC]/60 text-[11px] font-mono text-[#7d7461] font-semibold uppercase tracking-wider">
            <th className="py-3 px-4">CUSTOMER</th>
            <th className="py-3 px-3">RATING</th>
            <th className="py-3 px-3">SENTIMENT</th>
            <th className="py-3 px-4">TOPICS & FEEDBACK</th>
            <th className="py-3 px-3">SOURCE</th>
            <th className="py-3 px-3">STATUS</th>
            <th className="py-3 px-3">DATE</th>
            <th className="py-3 px-4 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFE4D6]/60 text-xs sm:text-sm">
          {responses.map((response) => (
            <FeedbackTableRow
              key={response._id}
              response={response}
              onMarkResolved={onMarkResolved}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
