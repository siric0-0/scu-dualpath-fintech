import React, { useState } from 'react';
import { StrategistOutput, StrategyPlanResult } from '../types/fintech';
import {
  TrendingDown,
  ShieldCheck,
  Zap,
  Sliders,
  Copy,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StrategistPanelProps {
  strategistData: StrategistOutput;
  splitPercent: number;
  onSplitChange: (newSplit: number) => void;
  targetEmergency: number;
  onTargetEmergencyChange: (newTarget: number) => void;
  aprStressDelta: number;
  onAprStressChange: (newDelta: number) => void;
  onProceedToCoach?: () => void;
}

export const StrategistPanel: React.FC<StrategistPanelProps> = ({
  strategistData,
  splitPercent,
  onSplitChange,
  targetEmergency,
  onTargetEmergencyChange,
  aprStressDelta,
  onAprStressChange,
  onProceedToCoach,
}) => {
  const [showChart, setShowChart] = useState(false);
  const [showTechnicalData, setShowTechnicalData] = useState(false);
  const [copiedAscii, setCopiedAscii] = useState(false);
  const [showStressTest, setShowStressTest] = useState(aprStressDelta > 0);

  const { avalanche, dualpath_shield: shield, snowball } = strategistData.strategies;

  const triggerMilestoneCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#002D72', '#0082CA', '#FDB913'],
    });
  };

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(strategistData.ascii_comparison_table);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const extraCash = strategistData.free_cash_flow_allocated;
  const debtDollar = Math.round(extraCash * (splitPercent / 100));
  const savingsDollar = extraCash - debtDollar;

  return (
    <div className="bg-white border border-[#D5E3EC] rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDF3F7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0082CA] tracking-wider uppercase">
              Step 2 · Payoff & Savings Strategy
            </span>
            <span className="text-xs text-[#B6CDDD]">·</span>
            <span className="text-xs text-[#6A7E8F]">Amortization Optimization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#002D72] mt-0.5">
            Compare Your Payoff Plans
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5D6E] mt-0.5">
            See how allocating a portion of your extra cash into an emergency micro-shield protects your debt freedom.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChart(!showChart)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              showChart
                ? 'bg-[#002D72] text-white border-[#002D72]'
                : 'bg-[#F4F8FA] text-[#002D72] border-[#D5E3EC] hover:bg-[#EAF2F7]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{showChart ? 'Hide Trajectory Chart' : 'Show Trajectory Chart'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar: Friendly Visual Split & Milestone Presets */}
      <div className="mt-5 p-5 bg-[#F4F8FA] border border-[#D5E3EC] rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0082CA]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#002D72]">
              Customize Your Monthly Extra Cash Split (${extraCash}/month total)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSplitChange(60);
                triggerMilestoneCelebration();
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors ${
                splitPercent === 60
                  ? 'bg-[#002D72] text-white border-[#002D72]'
                  : 'bg-white text-[#002D72] border-[#D5E3EC] hover:bg-[#EAF2F7]'
              }`}
            >
              Balanced 60/40 (Recommended)
            </button>
            <button
              onClick={() => onSplitChange(80)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors ${
                splitPercent === 80
                  ? 'bg-[#002D72] text-white border-[#002D72]'
                  : 'bg-white text-[#002D72] border-[#D5E3EC] hover:bg-[#EAF2F7]'
              }`}
            >
              Fast Debt 80/20
            </button>
            <button
              onClick={() => onSplitChange(50)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors ${
                splitPercent === 50
                  ? 'bg-[#002D72] text-white border-[#002D72]'
                  : 'bg-white text-[#002D72] border-[#D5E3EC] hover:bg-[#EAF2F7]'
              }`}
            >
              Max Safety 50/50
            </button>
          </div>
        </div>

        {/* Visual Dual-Colored Split Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-[#002D72] font-mono">
              Extra Debt Paydown: <strong>${debtDollar}/mo</strong> ({splitPercent}%)
            </span>
            <span className="text-[#137333] font-mono">
              Micro-Savings Shield: <strong>${savingsDollar}/mo</strong> ({100 - splitPercent}%)
            </span>
          </div>

          {/* Dual bar preview */}
          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${splitPercent}%` }}
              className="bg-[#002D72] transition-all duration-300"
              title={`Extra Debt: ${splitPercent}%`}
            />
            <div
              style={{ width: `${100 - splitPercent}%` }}
              className="bg-[#FDB913] transition-all duration-300"
              title={`Savings Shield: ${100 - splitPercent}%`}
            />
          </div>

          <input
            type="range"
            min={30}
            max={90}
            step={5}
            value={splitPercent}
            onChange={(e) => onSplitChange(Number(e.target.value))}
            className="w-full accent-[#002D72] bg-transparent mt-2 h-2 cursor-pointer"
          />
        </div>

        {/* Milestone Goal & Optional Stress Test Row */}
        <div className="pt-3 border-t border-[#D5E3EC] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#334D63]">Emergency Shield Goal:</span>
            {[250, 500, 750, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  onTargetEmergencyChange(amt);
                  triggerMilestoneCelebration();
                }}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-colors ${
                  targetEmergency === amt
                    ? 'bg-[#FDB913] text-[#002D72] border-[#E5A700] shadow-xs'
                    : 'bg-white text-[#002D72] border-[#D5E3EC] hover:border-[#0082CA]'
                }`}
              >
                ${amt}
              </button>
            ))}
            <span className="text-[11px] text-[#6A7E8F] ml-1">
              (Once saved, 90% shifts automatically to remaining debt!)
            </span>
          </div>

          <div>
            <button
              onClick={() => setShowStressTest(!showStressTest)}
              className="text-[11px] font-semibold text-[#0082CA] hover:text-[#002D72] underline cursor-pointer"
            >
              {showStressTest ? 'Hide APR Stress Test' : 'Simulate +2% to +5% Interest Rate Rise'}
            </button>
          </div>
        </div>

        {showStressTest && (
          <div className="mt-3 p-3 bg-white border border-[#D5E3EC] rounded-xl text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-[#002D72]">APR Stress Test (Simulate Fed Rate Increase)</span>
              <span className="font-mono text-rose-600 font-bold">+{aprStressDelta}% APR</span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={aprStressDelta}
              onChange={(e) => onAprStressChange(Number(e.target.value))}
              className="w-full accent-rose-600 bg-[#D5E3EC] h-2 rounded cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Trajectory Chart if Toggled */}
      {showChart && (
        <div className="mt-5 p-5 bg-[#FAFDFE] border border-[#D5E3EC] rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-sm font-bold font-serif text-[#002D72]">
                Month-by-Month Paydown Curve vs Micro-Shield Accumulation
              </h3>
              <p className="text-xs text-[#6A7E8F]">
                Watch your debt decline while your emergency buffer rises to meet your ${targetEmergency} safety target.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-[#002D72] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#002D72]" /> DualPath Debt
              </span>
              <span className="flex items-center gap-1 text-[#B8860B] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FDB913]" /> Micro-Shield
              </span>
            </div>
          </div>
          <AmortizationChart
            avalancheCurve={avalanche.amortizationCurve}
            shieldCurve={shield.amortizationCurve}
            targetEmergency={targetEmergency}
          />
        </div>
      )}

      {/* The 3 Comparison Cards (Highlighting DualPath Shield) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Pure Avalanche */}
        <StrategyCard
          result={avalanche}
          isRecommended={false}
          icon={<Zap className="w-4 h-4 text-[#D97706]" />}
          badge="Theoretical Math Winner"
          badgeColor="text-[#D97706]"
          verdict="Fastest on paper, but leaves $0 in reserves. A single unexpected $400 bill breaks the plan."
        />

        {/* Card 2: SoundCU DualPath Shield (RECOMMENDED) */}
        <StrategyCard
          result={shield}
          isRecommended={true}
          icon={<ShieldCheck className="w-5 h-5 text-white" />}
          badge="SoundCU Recommended"
          badgeColor="text-[#0082CA]"
          verdict="Clears debt almost as fast, but arms you with cash reserves so you never borrow again."
        />

        {/* Card 3: Snowball */}
        <StrategyCard
          result={snowball}
          isRecommended={false}
          icon={<TrendingDown className="w-4 h-4 text-[#0082CA]" />}
          badge="Psychological Momentum"
          badgeColor="text-[#0082CA]"
          verdict="Knocks out smallest balances first, but also leaves zero emergency cash protection."
        />
      </div>

      {/* Summary Strip & Next Step CTA */}
      <div className="mt-5 p-4 bg-[#F4F8FA] border border-[#D5E3EC] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-[#002D72]">
          <span className="text-[#6A7E8F]">Baseline (Minimum payments only): </span>
          <strong className="font-mono">{strategistData.baseline_minimum_only.months_to_debt_free} months</strong>
          <span className="text-[#6A7E8F]"> (${strategistData.baseline_minimum_only.total_interest_paid.toLocaleString()} interest). </span>
          <span>DualPath saves </span>
          <strong className="font-mono text-[#137333]">
            ${Math.max(0, strategistData.baseline_minimum_only.total_interest_paid - shield.totalInterestPaid).toLocaleString()}
          </strong>
          <span> while safeguarding your peace of mind!</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTechnicalData(!showTechnicalData)}
            className="text-xs font-semibold text-[#0082CA] hover:text-[#002D72] flex items-center gap-1 shrink-0"
          >
            <span>{showTechnicalData ? 'Hide' : 'View'} ASCII Table</span>
            {showTechnicalData ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onProceedToCoach && (
            <button
              onClick={onProceedToCoach}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#002D72] hover:bg-[#001F52] rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <span>Test Life's Unexpected Shocks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible ASCII Table for Step 3 Verification */}
      {showTechnicalData && (
        <div className="mt-4 p-4 bg-[#061524] rounded-xl border border-[#002D72]">
          <div className="flex items-center justify-between text-xs text-[#6A7E8F] mb-2 font-mono">
            <span className="text-[#48C2E8]">Step 3 Emitted Split-Screen Comparison Table</span>
            <button
              onClick={handleCopyAscii}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-white bg-slate-800 hover:bg-slate-700 rounded"
            >
              {copiedAscii ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#48C2E8]" />}
              <span>{copiedAscii ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-[#48C2E8] leading-relaxed overflow-x-auto select-all">
            {strategistData.ascii_comparison_table}
          </pre>
        </div>
      )}
    </div>
  );
};

interface StrategyCardProps {
  result: StrategyPlanResult;
  isRecommended: boolean;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  verdict: string;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  result,
  isRecommended,
  icon,
  badge,
  badgeColor,
  verdict,
}) => {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
        isRecommended
          ? 'bg-gradient-to-b from-[#F0F7FB] to-white border-2 border-[#0082CA] shadow-md ring-2 ring-[#0082CA]/15'
          : 'bg-[#FAFDFE] border border-[#D5E3EC]'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-xl ${
                isRecommended ? 'bg-[#002D72] text-white shadow-xs' : 'bg-[#EAF2F7] text-[#002D72]'
              }`}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#002D72]">{result.title}</h3>
              <span className={`text-[11px] font-bold ${badgeColor}`}>{badge}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#334D63] mb-4 leading-relaxed font-medium">
          {verdict}
        </p>

        {/* Core Metrics Grid */}
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between py-1 border-b border-[#EDF3F7]">
            <span className="text-[#6A7E8F] font-sans">Time to Debt Freedom</span>
            <span className="text-[#002D72] font-bold tabular-nums">
              {result.monthsToDebtFree} Months ({(result.monthsToDebtFree / 12).toFixed(1)} yrs)
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#EDF3F7]">
            <span className="text-[#6A7E8F] font-sans">Total Interest Paid</span>
            <span className="text-[#D97706] font-bold tabular-nums">
              ${result.totalInterestPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#EDF3F7]">
            <span className="text-[#6A7E8F] font-sans">Emergency Cash at Mo. 6</span>
            <span
              className={
                result.emergencyFundAt6Months >= 400
                  ? 'text-[#137333] font-bold tabular-nums'
                  : 'text-[#D97706] tabular-nums'
              }
            >
              ${result.emergencyFundAt6Months.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between py-1 items-center">
            <span className="text-[#6A7E8F] font-sans">Relapse Resilience</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold tabular-nums ${
                  result.resilienceScore >= 8 ? 'text-[#137333]' : 'text-rose-600'
                }`}
              >
                {result.resilienceScore.toFixed(1)} / 10
              </span>
              <span className="text-[11px] font-sans text-[#6A7E8F]">
                {result.resilienceScore >= 8 ? '(Shielded)' : '(Vulnerable)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shock Resilience Tag */}
      <div
        className={`mt-4 p-3 rounded-xl text-xs ${
          result.shockResilience.absorbs400Shock
            ? 'bg-[#E6F4EA] border border-[#C4E1CC] text-[#137333]'
            : 'bg-[#FCE8E6] border border-[#F5C2C7] text-rose-800'
        }`}
      >
        <span className="font-bold block">
          $400 Emergency Shock Test:{' '}
          {result.shockResilience.absorbs400Shock ? 'ABSORBED IN CASH' : 'RELAPSE WARNING'}
        </span>
        <span className="text-[11px] block mt-0.5 opacity-90">
          {result.shockResilience.absorbs400Shock
            ? 'Paid 100% in cash from micro-shield without new credit card debt.'
            : `Deficit forces $${Math.abs(result.shockResilience.netPostShockBalance).toFixed(0)} back onto high-APR card.`}
        </span>
      </div>
    </div>
  );
};

interface AmortizationChartProps {
  avalancheCurve: Array<{ month: number; totalBalanceRemaining: number; emergencyFundBalance: number }>;
  shieldCurve: Array<{ month: number; totalBalanceRemaining: number; emergencyFundBalance: number }>;
  targetEmergency: number;
}

const AmortizationChart: React.FC<AmortizationChartProps> = ({
  avalancheCurve,
  shieldCurve,
  targetEmergency,
}) => {
  const maxMonth = Math.max(avalancheCurve.length, shieldCurve.length);
  const maxDebt = Math.max(
    avalancheCurve[0]?.totalBalanceRemaining || 20000,
    shieldCurve[0]?.totalBalanceRemaining || 20000
  );

  const step = Math.max(1, Math.floor(maxMonth / 20));
  const points = [];
  for (let m = 0; m <= maxMonth; m += step) {
    const ava = avalancheCurve[Math.min(m, avalancheCurve.length - 1)];
    const shld = shieldCurve[Math.min(m, shieldCurve.length - 1)];
    points.push({
      month: m,
      avaDebt: ava ? ava.totalBalanceRemaining : 0,
      shldDebt: shld ? shld.totalBalanceRemaining : 0,
      shldSavings: shld ? shld.emergencyFundBalance : 0,
    });
  }

  const lastAva = avalancheCurve[avalancheCurve.length - 1];
  const lastShld = shieldCurve[shieldCurve.length - 1];
  points.push({
    month: maxMonth,
    avaDebt: lastAva ? lastAva.totalBalanceRemaining : 0,
    shldDebt: lastShld ? lastShld.totalBalanceRemaining : 0,
    shldSavings: lastShld ? lastShld.emergencyFundBalance : targetEmergency,
  });

  const width = 800;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 60 };

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const getX = (m: number) => padding.left + (m / maxMonth) * innerW;
  const getYDebt = (val: number) => padding.top + innerH - (val / maxDebt) * innerH;
  const getYSavings = (val: number) => padding.top + innerH - (val / (targetEmergency * 1.5)) * (innerH * 0.4);

  const shldDebtPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.month)} ${getYDebt(p.shldDebt)}`)
    .join(' ');

  const shldSavingsPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.month)} ${getYSavings(p.shldSavings)}`)
    .join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[600px] h-auto select-none">
        {[0, 0.5, 1].map((pct) => {
          const y = padding.top + innerH * (1 - pct);
          const val = Math.round(maxDebt * pct);
          return (
            <g key={pct}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-[#6A7E8F] font-mono"
              >
                ${val.toLocaleString()}
              </text>
            </g>
          );
        })}

        {[0, Math.floor(maxMonth / 2), maxMonth].map((m) => {
          const x = getX(m);
          return (
            <text
              key={m}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-[10px] fill-[#6A7E8F] font-mono font-medium"
            >
              Month {m}
            </text>
          );
        })}

        {/* DualPath Debt line */}
        <path d={shldDebtPath} fill="none" stroke="#002D72" strokeWidth="2.5" />

        {/* Micro-Savings line */}
        <path d={shldSavingsPath} fill="none" stroke="#FDB913" strokeWidth="3" />
      </svg>
    </div>
  );
};
