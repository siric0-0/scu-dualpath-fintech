import React, { useState } from 'react';
import { ShockEvent, StrategistOutput, ScoutStructuredData } from '../types/fintech';
import { AlertTriangle, Wrench, Stethoscope, Car, Zap, Sliders, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface ScenarioBuilderProps {
  currentShock: ShockEvent;
  onApplyShock: (shock: ShockEvent) => void;
  strategist: StrategistOutput | null;
  scout: ScoutStructuredData | null;
}

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({
  currentShock,
  onApplyShock,
  strategist,
  scout,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState(currentShock.name);
  const [customAmount, setCustomAmount] = useState(currentShock.amount);
  const [customMonth, setCustomMonth] = useState(currentShock.monthOccurred);

  const PRESET_SHOCKS: ShockEvent[] = [
    {
      id: 'SHOCK_CAR',
      name: 'Car Brake / Alternator',
      amount: 400,
      monthOccurred: 4,
      description: 'Vehicle emergency needed for work commute.',
      category: 'vehicle',
    },
    {
      id: 'SHOCK_MEDICAL',
      name: 'Urgent Dental / Medical Copay',
      amount: 850,
      monthOccurred: 5,
      description: 'Emergency root canal or urgent care bill.',
      category: 'medical',
    },
    {
      id: 'SHOCK_MAJOR_REPAIR',
      name: 'Major Transmission Failure',
      amount: 1400,
      monthOccurred: 6,
      description: 'Heavy mechanical repair required to keep vehicle running.',
      category: 'vehicle',
    },
    {
      id: 'SHOCK_INCOME_DIP',
      name: 'Gig Income Dip / Hours Reduction',
      amount: 500,
      monthOccurred: 2,
      description: 'Temporary 2-week cut in available contract shifts.',
      category: 'income_disruption',
    },
    {
      id: 'SHOCK_APPLIANCE',
      name: 'Water Heater / Home Appliance',
      amount: 750,
      monthOccurred: 3,
      description: 'Critical utility replacement during winter.',
      category: 'home_repair',
    },
  ];

  const handleSelectPreset = (preset: ShockEvent) => {
    setIsCustomMode(false);
    setCustomName(preset.name);
    setCustomAmount(preset.amount);
    setCustomMonth(preset.monthOccurred);
    onApplyShock(preset);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyShock({
      id: `SHOCK_CUSTOM_${Date.now()}`,
      name: customName || 'Custom Shock Event',
      amount: customAmount,
      monthOccurred: customMonth,
      description: `Custom emergency scenario of $${customAmount} at Month ${customMonth}.`,
      category: 'custom',
    });
  };

  const shieldPlan = strategist?.strategies?.dualpath_shield;
  const avalanchePlan = strategist?.strategies?.avalanche;

  return (
    <div className="bg-white border border-[#D5E3EC] rounded-2xl p-6 mb-6 shadow-xs">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0082CA] uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Interactive Financial Stress Testing</span>
          </div>
          <h3 className="text-xl font-black text-[#002D72]">
            Custom Emergency Scenario Builder
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Test how unexpected real-life shocks affect debt repayment and compare resilience between strategies.
          </p>
        </div>

        <button
          onClick={() => setIsCustomMode(!isCustomMode)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isCustomMode
              ? 'bg-[#002D72] text-white border-[#002D72]'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 inline mr-1.5" />
          {isCustomMode ? 'Use Preset Library' : 'Create Custom Scenario'}
        </button>
      </div>

      {/* Preset Buttons */}
      {!isCustomMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {PRESET_SHOCKS.map((preset) => {
            const isSelected = currentShock.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#0082CA] bg-[#0082CA]/5 ring-2 ring-[#0082CA]/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#0082CA] uppercase tracking-wide">
                    Month {preset.monthOccurred}
                  </span>
                  <span className="text-xs font-black text-rose-600">${preset.amount}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">{preset.name}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{preset.description}</div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Custom Shock Sliders */
        <form onSubmit={handleApplyCustom} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Event Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Broken Water Line"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0082CA]"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Dollar Amount</span>
                <span className="text-[#0082CA] font-black">${customAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full accent-[#0082CA] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$100</span>
                <span>$1,500</span>
                <span>$3,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Month Occurred</span>
                <span className="text-[#002D72] font-black">Month {customMonth}</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={customMonth}
                onChange={(e) => setCustomMonth(Number(e.target.value))}
                className="w-full accent-[#002D72] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Month 1</span>
                <span>Month 6</span>
                <span>Month 12</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#0082CA] hover:bg-[#0070AE] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
            >
              Simulate Custom Stress Scenario
            </button>
          </div>
        </form>
      )}

      {/* Live Shock Stress Evaluation Results */}
      {shieldPlan && avalanchePlan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DualPath Shield Outcome */}
          <div className={`p-4 rounded-xl border ${
            shieldPlan.shockResilience.absorbs400Shock
              ? 'bg-emerald-50/60 border-emerald-300'
              : 'bg-amber-50/60 border-amber-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-[#002D72]">SoundCU DualPath Shield</span>
              {shieldPlan.shockResilience.absorbs400Shock ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Absorbed 100% in Cash
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" /> Partial Buffer
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {shieldPlan.shockResilience.absorbs400Shock
                ? `At Month ${currentShock.monthOccurred}, your micro-shield has enough cash to pay the full $${currentShock.amount} shock without borrowing. Remaining savings: $${shieldPlan.shockResilience.netPostShockBalance.toFixed(0)}.`
                : `At Month ${currentShock.monthOccurred}, your micro-shield softens the blow, minimizing debt exposure.`}
            </p>
            <div className="mt-2 text-[11px] font-bold text-emerald-800">
              Resilience Score: {shieldPlan.resilienceScore.toFixed(1)} / 10.0
            </div>
          </div>

          {/* Avalanche Outcome */}
          <div className={`p-4 rounded-xl border ${
            avalanchePlan.shockResilience.absorbs400Shock
              ? 'bg-slate-50 border-slate-200'
              : 'bg-rose-50/60 border-rose-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-slate-800">Pure Avalanche (Zero Buffer)</span>
              {avalanchePlan.shockResilience.absorbs400Shock ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                  Absorbed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  <XCircle className="w-3.5 h-3.5" /> Relapse Into High-APR Debt
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {avalanchePlan.shockResilience.absorbs400Shock
                ? `Starting buffer handled this shock.`
                : `Because Avalanche leaves $0 in liquid savings, this $${currentShock.amount} emergency forces the member back into credit cards, adding ~$${avalanchePlan.shockResilience.relapseAdditionalInterest} in interest penalties and delaying payoff by ~${avalanchePlan.shockResilience.relapsePenaltyMonths} months.`}
            </p>
            <div className="mt-2 text-[11px] font-bold text-rose-800">
              Resilience Score: {avalanchePlan.resilienceScore.toFixed(1)} / 10.0
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
