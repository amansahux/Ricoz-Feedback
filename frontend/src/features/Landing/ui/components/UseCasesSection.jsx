import React from "react";
import { ShoppingBag, Utensils, Briefcase, Store } from "lucide-react";

export default function UseCasesSection() {
  const cases = [
    {
      icon: ShoppingBag,
      title: "E-commerce",
      desc: "Measure post-purchase experience, delivery satisfaction, and unboxing feedback automatically.",
    },
    {
      icon: Utensils,
      title: "Restaurants & Cafes",
      desc: "Capture on-table dining feedback via tabletop QR codes before unhappy diners leave negative Yelp reviews.",
    },
    {
      icon: Briefcase,
      title: "Service & Agencies",
      desc: "Track client sentiment after project milestones and maintain retention across customer accounts.",
    },
    {
      icon: Store,
      title: "Retail Stores",
      desc: "Print receipt feedback codes and collect instant customer effort ratings right at POS checkout.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white border-t border-[#E8DFD5]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#F62440] block mb-3">
            Operational Fit
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#141210] tracking-tight mb-4">
            Built for teams that listen.
          </h2>
          <p className="text-base text-[#686058]">
            From digital products to retail storefronts, Recoz replaces guesswork with customer truth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5] hover:border-[#F62440]/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E8DFD5] flex items-center justify-center text-[#F62440] mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-semibold text-base text-[#141210] mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#686058] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
