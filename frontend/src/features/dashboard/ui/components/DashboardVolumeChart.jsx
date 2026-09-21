import React, { useState, useMemo } from "react";
import { Radio } from "lucide-react";

export default function DashboardVolumeChart({
  responseVolume = [],
  chartView = "daily",
  onViewChange,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { points, currentPath, fillPath, maxVal } = useMemo(() => {
    const list = responseVolume.length > 0 ? responseVolume : [];
    const width = 700;
    const height = 220;
    const topPad = 25;
    const botPad = 30;
    const usableHeight = height - topPad - botPad;

    const values = list.map((item) => item.current || 0);
    const calculatedMax = Math.max(...values, 2);
    const yMax = calculatedMax <= 5 ? 5 : Math.ceil(calculatedMax / 5) * 5;

    const count = list.length;
    const xStep = count > 1 ? width / (count - 1) : width / 2;

    const calculatedPoints = list.map((item, idx) => {
      const x = count > 1 ? idx * xStep : width / 2;
      const normalized = Math.min((item.current || 0) / yMax, 1);
      const y = height - botPad - normalized * usableHeight;
      return {
        ...item,
        x,
        y,
        formattedDate: item.date
          ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : `Day ${idx + 1}`,
      };
    });

    if (calculatedPoints.length === 0) {
      return { points: [], currentPath: "", fillPath: "", maxVal: yMax };
    }

    if (calculatedPoints.length === 1) {
      const p = calculatedPoints[0];
      return {
        points: calculatedPoints,
        currentPath: `M 0,${p.y} L ${width},${p.y}`,
        fillPath: `M 0,${p.y} L ${width},${p.y} L ${width},${height - botPad} L 0,${height - botPad} Z`,
        maxVal: yMax,
      };
    }

    // Build smooth Bezier Curve
    let d = `M ${calculatedPoints[0].x},${calculatedPoints[0].y}`;
    for (let i = 0; i < calculatedPoints.length - 1; i++) {
      const p0 = calculatedPoints[i];
      const p1 = calculatedPoints[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
    }

    const lastX = calculatedPoints[calculatedPoints.length - 1].x;
    const firstX = calculatedPoints[0].x;
    const baselineY = height - botPad;
    const fill = `${d} L ${lastX},${baselineY} L ${firstX},${baselineY} Z`;

    return {
      points: calculatedPoints,
      currentPath: d,
      fillPath: fill,
      maxVal: yMax,
    };
  }, [responseVolume]);

  const activePoint =
    hoveredIndex !== null
      ? points[hoveredIndex]
      : points.length > 0
      ? points[points.length - 1]
      : null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFE4D6] shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-epilogue font-semibold text-[#1f1b18]">
              Response volume
            </h3>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-inter font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Live
            </span>
          </div>
          <p className="text-xs text-[#7d7461] font-inter mt-0.5">
            Daily telemetry trend over selected period
          </p>
        </div>

        {/* Daily / Weekly View Switcher */}
        <div className="flex items-center gap-1 bg-[#FBF2EC] p-1 rounded-xl text-xs font-inter self-start sm:self-auto border border-[#EFE4D6]">
          <button
            onClick={() => onViewChange && onViewChange("daily")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              chartView === "daily"
                ? "bg-white text-[#bb0028] font-bold shadow-xs border border-[#E7BCBB]/50"
                : "text-[#7d7461] hover:text-[#1f1b18]"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => onViewChange && onViewChange("weekly")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              chartView === "weekly"
                ? "bg-white text-[#bb0028] font-bold shadow-xs border border-[#E7BCBB]/50"
                : "text-[#7d7461] hover:text-[#1f1b18]"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* SVG Responsive Area & Line Chart */}
      <div className="relative w-full h-64 mt-2">
        <svg
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 700 220"
        >
          <defs>
            <linearGradient id="chartGradientCrimson" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#bb0028" stopOpacity="0.22"></stop>
              <stop offset="100%" stopColor="#bb0028" stopOpacity="0.0"></stop>
            </linearGradient>
          </defs>

          {/* Horizontal Subtle Grid lines */}
          <line stroke="#f0e6e1" strokeDasharray="3 3" x1="0" x2="700" y1="35" y2="35"></line>
          <line stroke="#f0e6e1" strokeDasharray="3 3" x1="0" x2="700" y1="90" y2="90"></line>
          <line stroke="#f0e6e1" strokeDasharray="3 3" x1="0" x2="700" y1="140" y2="140"></line>
          <line stroke="#e7bcbb" strokeOpacity="0.5" x1="0" x2="700" y1="190" y2="190"></line>

          {/* Shaded Area Under Curve */}
          {fillPath && <path d={fillPath} fill="url(#chartGradientCrimson)"></path>}

          {/* Crimson Bezier Line */}
          {currentPath && (
            <path
              d={currentPath}
              fill="none"
              stroke="#bb0028"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.8"
            ></path>
          )}

          {/* Active Key Data Point Highlight */}
          {activePoint && (
            <g>
              <line
                stroke="#bb0028"
                strokeDasharray="2 2"
                strokeWidth="1.5"
                x1={activePoint.x}
                x2={activePoint.x}
                y1={activePoint.y}
                y2="190"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                fill="#ffffff"
                r="5.5"
                stroke="#bb0028"
                strokeWidth="3.5"
                className="cursor-pointer transition-all duration-150"
              ></circle>
            </g>
          )}

          {/* Hover hitboxes */}
          {points.map((p, idx) => (
            <rect
              key={idx}
              x={p.x - 15}
              y={0}
              width={30}
              height={220}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Floating Tooltip matching Stitch styling */}
        {activePoint && (
          <div
            className="absolute top-2 bg-[#1f1b18] text-white px-3 py-1.5 rounded-xl shadow-xl text-xs font-inter pointer-events-none flex flex-col items-center border border-white/10 transition-all duration-150"
            style={{
              left: `${Math.min(Math.max((activePoint.x / 700) * 100, 15), 85)}%`,
              transform: "translate(-50%, -10px)",
            }}
          >
            <span className="font-semibold text-[#F9DFB9]">
              {activePoint.formattedDate}: {activePoint.current || 0} Response{activePoint.current === 1 ? "" : "s"}
            </span>
            <span className="text-[10px] text-[#eae1db]">Live Ingestion Telemetry</span>
            <div className="w-2 h-2 bg-[#1f1b18] rotate-45 -mb-1 mt-0.5"></div>
          </div>
        )}
      </div>

      {/* Day Axis Labels */}
      <div className="flex justify-between text-xs font-inter text-[#7d7461] pt-3 border-t border-[#EFE4D6]/70 mt-2">
        {points
          .filter((_, idx) => {
            if (points.length <= 5) return true;
            const step = Math.ceil(points.length / 5);
            return idx % step === 0 || idx === points.length - 1;
          })
          .map((p, idx) => {
            const isLatest = idx === 4 || p.formattedDate.includes("Today") || idx === points.length - 1;
            return (
              <span
                key={idx}
                className={isLatest ? "font-semibold text-[#bb0028]" : "text-[#7d7461]"}
              >
                {p.formattedDate}
              </span>
            );
          })}
      </div>
    </div>
  );
}
