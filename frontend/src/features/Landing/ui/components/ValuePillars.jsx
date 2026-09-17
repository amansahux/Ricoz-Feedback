import React from "react";

export default function ValuePillars() {
  const pillars = [
    {
      num: "01",
      title: "Multi-Channel",
      desc: "Collect feedback continuously through public links, printable QR codes, and lightweight website widgets.",
    },
    {
      num: "02",
      title: "Measure",
      desc: "Compute standardized NPS, CSAT, and CES metrics automatically from verified customer responses.",
    },
    {
      num: "03",
      title: "Understand",
      desc: "Surface recurring friction topics and sentiment trends before customer churn escalates.",
    },
    {
      num: "04",
      title: "Act & Resolve",
      desc: "Follow up directly on tickets, add internal notes, and move issues from Open to Resolved.",
    },
  ];

  return (
    <section className="border-y border-[#E8DFD5] bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.num} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#F62440] bg-[#fff0f2] px-2 py-1 rounded border border-[#F62440]/20">
                  {pillar.num}
                </span>
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-[#141210]">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-sm text-[#686058] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
