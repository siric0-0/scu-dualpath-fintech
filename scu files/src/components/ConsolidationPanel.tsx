import React, { useState } from 'react';
import { ConsolidationAnalysis, SoundCUConsolidationOption } from '../types/fintech';
import { Landmark, ArrowRight, CheckCircle2, TrendingDown, DollarSign, ShieldAlert, Sparkles, Clock } from 'lucide-react';

interface ConsolidationPanelProps {
  consolidation: ConsolidationAnalysis | undefined;
  memberToken: string;
}

export const ConsolidationPanel: React.FC<ConsolidationPanelProps> = ({
  consolidation,
  memberToken,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    consolidation?.recommendedOptionId || 'SCU_FIXED_LOAN_T1'
  );

  if (!consolidation || consolidation.eligibleDebtsTotal <= 0) {
    return (
      <div className="bg-white border border-[#D5E3EC] rounded-2xl p-6 mb-6 shadow-xs">
        <div className="flex items-center gap-3 text-[#002D72]">
          <Landmark className="w-6 h-6 text-[#0082CA]" />
          <h3 className="font-bold text-lg">Sound CU Loan Consolidation Engine</h3>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          No high-APR credit card or retail debts detected for Member <span className="font-mono font-semibold">{memberToken}</span>.
          Current liabilities are already at low fixed rates.
        </p>
      </div>
    );
  }

  const activeOption =
    consolidation.options.find((opt) => opt.productId === selectedOptionId) ||
    consolidation.options[0];

  return (
    <div className="bg-white border-2 border-[#0082CA]/30 rounded-2xl p-6 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0082CA] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Sound CU Member Advantage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#002D72]">
            Debt Consolidation & Rate Refinancing
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Roll high-APR credit cards into a Sound Credit Union fixed loan or promotional balance transfer.
          </p>
        </div>

        <div className="bg-[#EBF5FB] border border-[#BCE1F5] rounded-xl px-4 py-2.5 flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Eligible Debt Balance</div>
            <div className="text-lg font-black text-[#002D72]">
              ${consolidation.eligibleDebtsTotal.toLocaleString()}
            </div>
          </div>
          <div className="h-8 w-px bg-[#BCE1F5]" />
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Current Avg APR</div>
            <div className="text-lg font-black text-rose-600">
              {consolidation.eligibleDebtsWeightedApr}%
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        {consolidation.options.map((option) => {
          const isSelected = option.productId === selectedOptionId;
          return (
            <button
              key={option.productId}
              onClick={() => setSelectedOptionId(option.productId)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#0082CA] bg-[#0082CA]/5 shadow-xs ring-2 ring-[#0082CA]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF5FB] text-[#0082CA]">
                  {option.tierLabel}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0082CA]" />}
              </div>
              <div className="font-bold text-slate-900 text-sm mb-1">{option.name}</div>
              <div className="text-2xl font-black text-[#002D72] mb-1">
                {option.apr}% <span className="text-xs font-normal text-slate-500">APR</span>
              </div>
              <div className="text-xs text-slate-600">
                Est. ${option.estimatedMonthlyPayment}/mo for {option.termMonths} mos
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Option Comparison Card */}
      {activeOption && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Monthly Cash Flow Freed</span>
              </div>
              <div className="text-2xl font-black text-emerald-600">
                +${Math.max(0, activeOption.monthlyCashFlowFreed).toFixed(0)}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Current min payment: ${consolidation.currentCombinedMinPayment}/mo vs new: ${activeOption.estimatedMonthlyPayment}/mo
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>Estimated Interest Saved</span>
              </div>
              <div className="text-2xl font-black text-[#002D72]">
                ${activeOption.totalInterestSavedVsCards.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Compared to continuous minimum card payments
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Payoff Horizon</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {activeOption.termMonths} <span className="text-xs font-normal text-slate-500">Months Fixed</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Guaranteed zero balance at end of term
              </p>
            </div>
          </div>

          {/* Member Requirements & Perks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sound Credit Union Terms & Perks</span>
              </div>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>$0 Origination Fee & $0 Prepayment Penalties</li>
                <li>Fixed predictable monthly payments</li>
                <li>Direct payoff to high-rate creditors available upon request</li>
              </ul>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Membership & Approval Guidelines</span>
              </div>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                {activeOption.eligibilityRequirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
