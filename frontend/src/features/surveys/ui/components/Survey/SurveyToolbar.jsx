import React from "react";
import { Link } from "react-router";
import { Search, Plus } from "lucide-react";

export default function SurveyToolbar({
  activeFilter,
  setActiveFilter,
  filterCounts = { all: 0, published: 0, draft: 0, archived: 0 },
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) {
  const tabs = [
    { key: "all", label: "All", count: filterCounts.all },
    { key: "published", label: "Published", count: filterCounts.published },
    { key: "draft", label: "Draft", count: filterCounts.draft },
    { key: "archived", label: "Archived", count: filterCounts.archived },
  ];

  return (
    <section className="bg-white border border-[#EFE4D6] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Status Tabs Segmented Switch */}
      <div className="flex items-center gap-1 bg-[#FBF2EC] p-1 rounded-xl border border-[#EFE4D6]/70 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-inter font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-white text-[#1f1b18] shadow-xs font-semibold"
                  : "text-[#7d7461] hover:text-[#1f1b18] hover:bg-white/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? tab.key === "published"
                      ? "bg-[#D2EED7] text-[#1C7332]"
                      : "bg-[#F0E6E1] text-[#5d3f3e]"
                    : "bg-[#EAE1DB] text-[#7d7461]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Search Input + Sort Dropdown + Create CTA */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:flex-initial">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7461] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surveys..."
            className="h-[38px] pl-9 pr-3 w-full sm:w-56 bg-[#FBF2EC] border border-[#EFE4D6] rounded-xl text-xs sm:text-sm text-[#1f1b18] placeholder:text-[#926e6d]/70 focus:outline-none focus:border-[#bb0028] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-[#EFE4D6] pl-3">
          <span className="text-xs text-[#7d7461] font-medium hidden sm:inline">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-[38px] px-3 py-1 bg-white border border-[#EFE4D6] rounded-xl text-xs sm:text-sm text-[#1f1b18] focus:outline-none focus:border-[#bb0028] cursor-pointer"
          >
            <option value="recent">Recently created</option>
            <option value="responses">Most responses</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <Link
          to="/surveys/create"
          className="h-[38px] px-4 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white font-inter text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-[#bb0028]/20 transition-all ml-auto md:ml-0"
        >
          <Plus size={16} />
          <span>Create survey</span>
        </Link>
      </div>
    </section>
  );
}
