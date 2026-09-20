import React, { useState, useMemo } from "react";

export default function AnalyticsResponseChart({ responseVolume = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Fallback or empty guard
  const hasData = responseVolume && responseVolume.length > 0;

  // Chart coordinate calculations
  const { currentPath, prevPath, fillPath, points, maxVal, stepX } = useMemo(() => {
    if (!hasData) {
      return { currentPath: "", prevPath: "", fillPath: "", points: [], maxVal: 10, stepX: 100 };
    }

    const width = 900;
    const height = 200;
    const topPadding = 20;
    const bottomPadding = 40;
    const effectiveHeight = height - topPadding - bottomPadding;

    // Calculate max values for dynamic y-scaling
    const allVals = responseVolume.flatMap((d) => [d.current || 0, d.previous || 0]);
    const maxCalculated = Math.max(...allVals, 5);
    // Round up max to nice ceiling
    const roundedMax = Math.ceil(maxCalculated / 5) * 5 || 10;

    const n = responseVolume.length;
    const xStep = n > 1 ? (width - 100) / (n - 1) : width / 2;

    const getY = (val) => {
      const normalized = Math.min(val / roundedMax, 1);
      return height - bottomPadding - normalized * effectiveHeight;
    };

    const calculatedPoints = responseVolume.map((item, idx) => {
      const x = 50 + idx * xStep;
      const yCur = getY(item.current || 0);
      const yPrev = getY(item.previous || 0);
      return {
        ...item,
        x,
        yCur,
        yPrev,
        formattedDate: item.date
          ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : `Day ${idx + 1}`,
      };
    });

    // Build SVG paths
    if (calculatedPoints.length === 1) {
      const p = calculatedPoints[0];
      return {
        currentPath: `M ${p.x - 20} ${p.yCur} L ${p.x + 20} ${p.yCur}`,
        prevPath: `M ${p.x - 20} ${p.yPrev} L ${p.x + 20} ${p.yPrev}`,
        fillPath: `M ${p.x - 20} ${p.yCur} L ${p.x + 20} ${p.yCur} L ${p.x + 20} 160 L ${p.x - 20} 160 Z`,
        points: calculatedPoints,
        maxVal: roundedMax,
        stepX: xStep,
      };
    }

    // Smooth Bezier Curve generator
    let curD = `M ${calculatedPoints[0].x} ${calculatedPoints[0].yCur}`;
    let prevD = `M ${calculatedPoints[0].x} ${calculatedPoints[0].yPrev}`;

    for (let i = 0; i < calculatedPoints.length - 1; i++) {
      const p0 = calculatedPoints[i];
      const p1 = calculatedPoints[i + 1];
      const cx = (p0.x + p1.x) / 2;

      curD += ` C ${cx} ${p0.yCur}, ${cx} ${p1.yCur}, ${p1.x} ${p1.yCur}`;
      prevD += ` C ${cx} ${p0.yPrev}, ${cx} ${p1.yPrev}, ${p1.x} ${p1.yPrev}`;
    }

    const fillD = `${curD} L ${calculatedPoints[calculatedPoints.length - 1].x} 160 L ${calculatedPoints[0].x} 160 Z`;

    return {
      currentPath: curD,
      prevPath: prevD,
      fillPath: fillD,
      points: calculatedPoints,
      maxVal: roundedMax,
      stepX: xStep,
    };
  }, [responseVolume, hasData]);

  // Set default active tooltip to latest point if none hovered
  const activeTooltip = hoveredPoint || (points.length > 0 ? points[points.length - 1] : null);

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-xs relative flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18]">Response volume</h2>
          <p className="text-xs sm:text-sm text-[#6e5c3e] font-inter">
            Feedback responses over selected period vs previous baseline
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bb0028] inline-block"></span>
            <span className="text-xs font-inter text-[#6e5c3e]">Completed Surveys</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dbc39f] inline-block"></span>
            <span className="text-xs font-inter text-[#6e5c3e]">Prior Period Baseline</span>
          </div>
        </div>
      </div>

      {/* SVG Responsive Line Chart */}
      <div className="relative w-full h-72 pt-4">
        <svg
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 900 240"
        >
          <defs>
            <linearGradient id="analyticsChartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#bb0028" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#bb0028" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          <g className="text-[#6e5c3e] opacity-40 font-mono text-[10px]">
            <line stroke="#EFE4D6" strokeDasharray="3 3" x1="40" x2="880" y1="20" y2="20" />
            <text fill="currentColor" x="12" y="24">
              {maxVal}
            </text>

            <line stroke="#EFE4D6" strokeDasharray="3 3" x1="40" x2="880" y1="70" y2="70" />
            <text fill="currentColor" x="12" y="74">
              {Math.round(maxVal * 0.66)}
            </text>

            <line stroke="#EFE4D6" strokeDasharray="3 3" x1="40" x2="880" y1="120" y2="120" />
            <text fill="currentColor" x="12" y="124">
              {Math.round(maxVal * 0.33)}
            </text>

            <line stroke="#EFE4D6" strokeWidth="1" x1="40" x2="880" y1="160" y2="160" />
            <text fill="currentColor" x="24" y="164">
              0
            </text>
          </g>

          {/* Prior Period Dashed Curve */}
          {prevPath && (
            <path
              d={prevPath}
              fill="none"
              stroke="#dbc39f"
              strokeDasharray="4 4"
              strokeWidth="2"
            />
          )}

          {/* Area Fill Gradient */}
          {fillPath && <path d={fillPath} fill="url(#analyticsChartGradient)" />}

          {/* Smooth Crimson Line */}
          {currentPath && (
            <path
              d={currentPath}
              fill="none"
              stroke="#bb0028"
              strokeLinecap="round"
              strokeWidth="3"
            />
          )}

          {/* Interactive Tooltip Vertical Line and Hover Circles */}
          {activeTooltip && (
            <g>
              <line
                stroke="#bb0028"
                strokeDasharray="2 2"
                strokeWidth="1.5"
                x1={activeTooltip.x}
                x2={activeTooltip.x}
                y1={activeTooltip.yCur}
                y2="160"
              />
              <circle
                cx={activeTooltip.x}
                cy={activeTooltip.yCur}
                fill="#bb0028"
                r="5"
                stroke="#ffffff"
                strokeWidth="3"
              />
            </g>
          )}

          {/* Interactive Invisible Overlay for Mouse Events */}
          {points.map((p, idx) => (
            <rect
              key={idx}
              x={p.x - 15}
              y={0}
              width={30}
              height={200}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* X-Axis Labels (Interval Spaced) */}
          <g className="text-[#6e5c3e] font-inter text-[11px]" fill="#6e5c3e">
            {points
              .filter((_, idx) => {
                if (points.length <= 8) return true;
                const step = Math.ceil(points.length / 7);
                return idx % step === 0 || idx === points.length - 1;
              })
              .map((p, idx) => (
                <text
                  key={idx}
                  textAnchor="middle"
                  x={p.x}
                  y="190"
                  fill={activeTooltip?.date === p.date ? "#1f1b18" : "#6e5c3e"}
                  fontWeight={activeTooltip?.date === p.date ? "600" : "400"}
                >
                  {p.formattedDate}
                </text>
              ))}
          </g>
        </svg>

        {/* Floating Active Tooltip */}
        {activeTooltip && (
          <div
            className="absolute top-2 bg-[#1f1b18] text-white px-3 py-1.5 rounded-lg shadow-lg border border-white/10 flex items-center gap-2 pointer-events-none transition-all duration-150 text-xs"
            style={{
              left: `${Math.min(Math.max((activeTooltip.x / 900) * 100, 10), 85)}%`,
              transform: "translate(-50%, -10px)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#bb0028] inline-block shrink-0"></span>
            <span className="font-semibold">{activeTooltip.formattedDate}:</span>
            <span className="text-[#F9DFB9] font-medium">
              {activeTooltip.current || 0} responses
            </span>
            {activeTooltip.previous != null && (
              <span className="text-neutral-400 text-[10px]">
                (prev: {activeTooltip.previous})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
