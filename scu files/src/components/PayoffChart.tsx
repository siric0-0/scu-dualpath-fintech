import React, { useState } from 'react';
import { StrategyPlanResult } from '../types/fintech';
import { TrendingDown, Shield, Info } from 'lucide-react';

interface PayoffChartProps {
  dualpath: StrategyPlanResult;
  avalanche: StrategyPlanResult;
  snowball: StrategyPlanResult;
  targetEmergency: number;
}

export const PayoffChart: React.FC<PayoffChartProps> = ({
  dualpath,
  avalanche,
  snowball,
  targetEmergency,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Maximum months across plans for X-axis
  const maxMonths = Math.max(
    dualpath.monthsToDebtFree,
    avalanche.monthsToDebtFree,
    snowball.monthsToDebtFree,
    12
  );

  // Maximum balance for Y-axis
  const initialBalance = dualpath.amortizationCurve[0]?.totalBalanceRemaining || 10000;
  const maxY = Math.max(initialBalance * 1.05, 5000);

  // Chart dimensions
  const width = 760;
  const height = 300;
  const padLeft = 65;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 40;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const scaleX = (m: number) => padLeft + (m / maxMonths) * chartW;
  const scaleY = (val: number) => padTop + chartH - (val / maxY) * chartH;

  // Build SVG path string from amortization curve
  const generateDebtPath = (curve: StrategyPlanResult['amortizationCurve']) => {
    if (!curve || curve.length === 0) return '';
    return curve
      .map((step, idx) => {
        const x = scaleX(step.month);
        const y = scaleY(step.totalBalanceRemaining);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Build SVG savings area for DualPath Shield
  const generateSavingsPath = (curve: StrategyPlanResult['amortizationCurve']) => {
    if (!curve || curve.length === 0) return '';
    const points = curve.map((step) => ({
      x: scaleX(step.month),
      y: scaleY(step.emergencyFundBalance),
    }));
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const zeroY = scaleY(0);
    return `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${zeroY.toFixed(1)} L ${points[0].x.toFixed(1)} ${zeroY.toFixed(1)} Z`;
  };

  const dualpathDebtPath = generateDebtPath(dualpath.amortizationCurve);
  const avalancheDebtPath = generateDebtPath(avalanche.amortizationCurve);
  const snowballDebtPath = generateDebtPath(snowball.amortizationCurve);
  const dualpathSavingsArea = generateSavingsPath(dualpath.amortizationCurve);

  // Find step data for hovered month
  const activeHoverStep =
    hoveredMonth !== null
      ? dualpath.amortizationCurve.find((s) => s.month === hoveredMonth) || null
      : null;
  const activeAvalancheStep =
    hoveredMonth !== null
      ? avalanche.amortizationCurve.find((s) => s.month === hoveredMonth) || null
      : null;

  return (
    <div className="bg-white border border-[#D5E3EC] rounded-2xl p-6 mb-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0082CA] uppercase tracking-wider mb-1">
            <TrendingDown className="w-4 h-4" />
            <span>Mathematical Projection Visualization</span>
          </div>
          <h3 className="text-xl font-black text-[#002D72]">
            Debt Payoff & Emergency Buffer Trajectory
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Visualize the balance decline alongside the DualPath micro-emergency cash shield.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#0082CA] rounded-full" />
            <span className="font-bold text-[#002D72]">DualPath Debt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-2 bg-emerald-500/30 border border-emerald-500 rounded-sm" />
            <span className="font-bold text-emerald-700">Cash Shield</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-rose-500 border-dashed rounded-full" />
            <span className="font-bold text-rose-600">Pure Avalanche</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-amber-500 rounded-full" />
            <span className="font-bold text-amber-700">Snowball</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none min-w-[620px]"
          onMouseLeave={() => setHoveredMonth(null)}
        >
          <defs>
            <linearGradient id="shieldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = scaleY(maxY * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  ${Math.round(maxY * ratio).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* X Axis Months */}
          {[0, 6, 12, 18, 24, 36, 48, 60]
            .filter((m) => m <= maxMonths)
            .map((m) => {
              const x = scaleX(m);
              return (
                <g key={m}>
                  <line x1={x} y1={padTop} x2={x} y2={height - padBottom} stroke="#F1F5F9" />
                  <text
                    x={x}
                    y={height - padBottom + 16}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    Mo {m}
                  </text>
                </g>
              );
            })}

          {/* DualPath Savings Area */}
          <path d={dualpathSavingsArea} fill="url(#shieldGradient)" />

          {/* Snowball Path */}
          <path
            d={snowballDebtPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeOpacity="0.7"
          />

          {/* Avalanche Path */}
          <path
            d={avalancheDebtPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* DualPath Shield Debt Path */}
          <path
            d={dualpathDebtPath}
            fill="none"
            stroke="#0082CA"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Milestone Point: Emergency Fund Reached */}
          {dualpath.milestoneReachedMonth && (
            <g transform={`translate(${scaleX(dualpath.milestoneReachedMonth)}, ${scaleY(targetEmergency)})`}>
              <circle r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <text
                x="0"
                y="-10"
                textAnchor="middle"
                className="text-[9px] fill-emerald-800 font-bold"
              >
                Shield Unlocked (Mo {dualpath.milestoneReachedMonth})
              </text>
            </g>
          )}

          {/* Interactive Hover Vertical Scrubber */}
          {hoveredMonth !== null && (
            <line
              x1={scaleX(hoveredMonth)}
              y1={padTop}
              x2={scaleX(hoveredMonth)}
              y2={height - padBottom}
              stroke="#002D72"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}

          {/* Hover trigger zones */}
          {dualpath.amortizationCurve.map((step) => (
            <rect
              key={step.month}
              x={scaleX(step.month) - 8}
              y={padTop}
              width="16"
              height={chartH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredMonth(step.month)}
            />
          ))}
        </svg>

        {/* Hover Tooltip Card */}
        {activeHoverStep && (
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="font-bold text-[#002D72]">
              Month {activeHoverStep.month} Snapshot:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">DualPath Remaining Debt:</span>
              <span className="font-black text-[#002D72]">
                ${activeHoverStep.totalBalanceRemaining.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Emergency Fund Buffer:</span>
              <span className="font-black text-emerald-600">
                ${activeHoverStep.emergencyFundBalance.toLocaleString()}
              </span>
            </div>
            {activeAvalancheStep && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Avalanche Remaining Debt:</span>
                <span className="font-black text-rose-600">
                  ${activeAvalancheStep.totalBalanceRemaining.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">($0 buffer)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
