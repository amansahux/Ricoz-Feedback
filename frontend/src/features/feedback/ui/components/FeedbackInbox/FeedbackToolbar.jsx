import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  Check,
  Activity,
  Smile,
  Globe,
  Star,
  SlidersHorizontal,
} from "lucide-react";

/**
 * Custom Premium Dropdown Component with smooth animated popover,
 * badge indicator, active item checkmark, and click-outside dismissal.
 */
function FilterDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  badgeCount,
  align = "left",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Selected item object
  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const isActive = value !== "all" && value !== "newest";

  return (
    <div className="relative flex-1 sm:flex-none" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full sm:w-auto inline-flex items-center justify-between gap-2.5 px-3.5 py-2 text-xs font-medium font-inter rounded-xl transition-all cursor-pointer border select-none ${
          isActive
            ? "bg-[#FBF2EC] border-[#e7bcbb] text-[#1f1b18] shadow-xs ring-1 ring-[#bb0028]/15"
            : "bg-white border-[#EFE4D6] text-[#635b4a] hover:text-[#1f1b18] hover:border-[#cfc4b6] shadow-2xs"
        } ${isOpen ? "ring-2 ring-[#bb0028]/20 border-[#bb0028]" : ""}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && (
            <Icon
              size={13}
              className={`shrink-0 ${isActive ? "text-[#bb0028]" : "text-[#7d7461]"}`}
            />
          )}
          <span className="truncate">
            <span className="text-[#7d7461] font-normal">{label}: </span>
            <span className="font-semibold text-[#1f1b18]">{selectedOption?.label}</span>
          </span>
          {badgeCount != null && badgeCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#bb0028] text-white text-[10px] font-bold">
              {badgeCount}
            </span>
          )}
        </div>

        <ChevronDown
          size={13}
          className={`shrink-0 text-[#7d7461] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#bb0028]" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 min-w-[190px] w-full sm:w-max bg-white rounded-2xl border border-[#EFE4D6] shadow-[0_12px_32px_-4px_rgba(31,27,24,0.12)] py-1.5 px-1 animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="px-2.5 py-1.5 border-b border-[#EFE4D6]/60 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
              Filter by {label}
            </span>
            {isActive && (
              <button
                type="button"
                onClick={() => {
                  onChange(options[0].value);
                  setIsOpen(false);
                }}
                className="text-[10px] text-[#bb0028] hover:underline font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-xs font-inter transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#FBF2EC] text-[#bb0028] font-semibold"
                      : "text-[#1f1b18] hover:bg-[#fff8f5] font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {option.dotColor && (
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${option.dotColor}`}
                      ></span>
                    )}
                    {option.icon && (
                      <option.icon
                        size={13}
                        className={`shrink-0 ${
                          isSelected ? "text-[#bb0028]" : "text-[#7d7461]"
                        }`}
                      />
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>

                  {isSelected && (
                    <Check size={14} className="text-[#bb0028] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeedbackToolbar({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedSentiment,
  setSelectedSentiment,
  selectedSource,
  setSelectedSource,
  selectedRating,
  setSelectedRating,
  sortBy,
  setSortBy,
  hasActiveFilters,
  resetFilters,
}) {
  // Option definitions with icons, badges & styling
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "open", label: "Open", dotColor: "bg-[#7d7461]" },
    { value: "in_progress", label: "In Progress", dotColor: "bg-[#f59e0b]" },
    { value: "resolved", label: "Resolved", dotColor: "bg-emerald-600" },
  ];

  const sentimentOptions = [
    { value: "all", label: "All Sentiments" },
    { value: "positive", label: "Positive", dotColor: "bg-emerald-600" },
    { value: "neutral", label: "Neutral", dotColor: "bg-[#7d7461]" },
    { value: "negative", label: "Negative", dotColor: "bg-[#bb0028]" },
  ];

  const sourceOptions = [
    { value: "all", label: "All Channels" },
    { value: "link", label: "Direct Link" },
    { value: "qr", label: "QR Code" },
    { value: "widget", label: "Embed Widget" },
  ];

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars (Excellent)" },
    { value: "4", label: "4 Stars (Good)" },
    { value: "3", label: "3 Stars (Average)" },
    { value: "2", label: "2 Stars (Poor)" },
    { value: "1", label: "1 Star (Critical)" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "rating-high", label: "Highest Rating" },
    { value: "rating-low", label: "Lowest Rating" },
  ];

  return (
    <section className="bg-white rounded-2xl border border-[#EFE4D6] p-4 space-y-3.5 shadow-xs">
      {/* Search & Custom Filter Dropdowns */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7461] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search responses by name, email, feedback verbatim, topic..."
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm font-inter rounded-xl bg-white border border-[#EFE4D6] text-[#1f1b18] placeholder:text-[#7d7461]/60 focus:outline-none focus:ring-1 focus:ring-[#bb0028] focus:border-[#bb0028] transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7461] hover:text-[#1f1b18] p-1 rounded-md hover:bg-[#FBF2EC] transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Strip */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Status Dropdown */}
          <FilterDropdown
            label="Status"
            value={selectedStatus}
            options={statusOptions}
            onChange={setSelectedStatus}
            icon={Activity}
          />

          {/* Sentiment Dropdown */}
          <FilterDropdown
            label="Sentiment"
            value={selectedSentiment}
            options={sentimentOptions}
            onChange={setSelectedSentiment}
            icon={Smile}
          />

          {/* Source Dropdown */}
          <FilterDropdown
            label="Source"
            value={selectedSource}
            options={sourceOptions}
            onChange={setSelectedSource}
            icon={Globe}
          />

          {/* Rating Dropdown */}
          <FilterDropdown
            label="Rating"
            value={selectedRating}
            options={ratingOptions}
            onChange={setSelectedRating}
            icon={Star}
          />

          {/* Sort By Dropdown */}
          <FilterDropdown
            label="Sort"
            value={sortBy}
            options={sortOptions}
            onChange={setSortBy}
            icon={ArrowUpDown}
            align="right"
          />
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between border-t border-[#EFE4D6]/70 pt-3 text-xs font-inter">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-[#7d7461] text-[11px] uppercase tracking-wider font-semibold mr-1">
              Active filters:
            </span>

            {selectedStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F9DFB9]/70 text-[#746243] font-medium border border-[#EFE4D6] text-xs">
                <span>
                  Status:{" "}
                  {selectedStatus === "in_progress"
                    ? "In Progress"
                    : selectedStatus}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("all")}
                  className="hover:text-[#bb0028] p-0.5 cursor-pointer rounded-full"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedSentiment !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FBF2EC] text-[#1f1b18] font-medium border border-[#EFE4D6] text-xs">
                <span>Sentiment: {selectedSentiment}</span>
                <button
                  type="button"
                  onClick={() => setSelectedSentiment("all")}
                  className="hover:text-[#bb0028] p-0.5 cursor-pointer rounded-full"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedSource !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FBF2EC] text-[#1f1b18] font-medium border border-[#EFE4D6] text-xs">
                <span>Source: {selectedSource.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => setSelectedSource("all")}
                  className="hover:text-[#bb0028] p-0.5 cursor-pointer rounded-full"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedRating !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FBF2EC] text-[#1f1b18] font-medium border border-[#EFE4D6] text-xs">
                <span>Rating: {selectedRating}★</span>
                <button
                  type="button"
                  onClick={() => setSelectedRating("all")}
                  className="hover:text-[#bb0028] p-0.5 cursor-pointer rounded-full"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FBF2EC] text-[#1f1b18] font-medium border border-[#EFE4D6] text-xs">
                <span>Query: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-[#bb0028] p-0.5 cursor-pointer rounded-full"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-[#bb0028] hover:underline font-semibold flex items-center gap-1 shrink-0 cursor-pointer ml-2"
          >
            <RotateCcw size={13} />
            <span>Reset all</span>
          </button>
        </div>
      )}
    </section>
  );
}
