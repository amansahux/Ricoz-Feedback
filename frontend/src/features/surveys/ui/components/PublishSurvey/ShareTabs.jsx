import React from "react";
import { Link2, QrCode, Code } from "lucide-react";

export default function ShareTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "link", label: "Link", icon: Link2 },
    { key: "qr", label: "QR Code", icon: QrCode },
    { key: "widget", label: "Widget", icon: Code },
  ];

  return (
    <div className="flex items-center gap-8 border-b border-[#EFE4D6]" role="tablist">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative pb-3.5 text-xs sm:text-sm font-inter font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              isActive ? "text-[#1f1b18] font-bold" : "text-[#7d7461] hover:text-[#1f1b18]"
            }`}
          >
            <Icon
              size={17}
              className={isActive ? "text-[#bb0028]" : "text-[#7d7461]"}
            />
            <span>{tab.label}</span>
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all ${
                isActive ? "bg-[#bb0028]" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
