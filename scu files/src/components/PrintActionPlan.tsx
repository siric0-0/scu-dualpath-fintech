import React from 'react';
import { ScoutStructuredData, StrategistOutput, CoachEvaluation, ShockEvent } from '../types/fintech';
import { SoundCuLogo } from './SoundCuLogo';
import { Printer, Shield, CheckCircle2, Calendar, DollarSign, AlertCircle, FileText } from 'lucide-react';

interface PrintActionPlanProps {
  scout: ScoutStructuredData;
  strategist: StrategistOutput;
  coach: CoachEvaluation;
  shock: ShockEvent;
}

export const PrintActionPlan: React.FC<PrintActionPlanProps> = ({
  scout,
  strategist,
  coach,
  shock,
}) => {
  const shield = strategist.strategies.dualpath_shield;
  const avalanche = strategist.strategies.avalanche;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Screen Action Bar (hidden in print) */}
      <div className="no-print bg-gradient-to-r from-[#002D72] to-[#0082CA] text-white rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">Download / Print Member Action Plan</h3>
            <p className="text-xs text-white/80">
              Generate a formatted 1-page PDF or paper document formatted for your Sound CU branch visit.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#002D72] hover:bg-slate-50 font-bold text-sm shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Printer className="w-4 h-4 text-[#0082CA]" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Document Container (Styled for 8.5" x 11" Paper) */}
      <div className="print-only bg-white text-slate-900 p-8 max-w-4xl mx-auto font-sans">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-[#002D72] pb-6 mb-6">
          <div>
            <SoundCuLogo />
            <div className="text-xs font-semibold uppercase tracking-widest text-[#0082CA] mt-2">
              DualPath Financial Shield · Confidential Member Roadmap
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div><span className="font-bold text-slate-800">Member Token:</span> {scout.member_token}</div>
            <div><span className="font-bold text-slate-800">Date Generated:</span> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div><span className="font-bold text-slate-800">Plan Status:</span> <span className="text-emerald-700 font-bold">Recommended & Verified</span></div>
          </div>
        </div>

        {/* Diagnosis & Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
            <div className="text-[10px] font-bold uppercase text-slate-500">Monthly Net Income</div>
            <div className="text-lg font-black text-[#002D72]">${scout.monthly_net_income.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">{scout.income_type.replace('_', ' ')}</div>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
            <div className="text-[10px] font-bold uppercase text-slate-500">Total Debt Balance</div>
            <div className="text-lg font-black text-rose-700">${scout.total_debt_balance.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">{scout.liabilities.length} active liabilities</div>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
            <div className="text-[10px] font-bold uppercase text-slate-500">Free Cash Flow</div>
            <div className="text-lg font-black text-emerald-700">${scout.free_cash_flow.toLocaleString()}/mo</div>
            <div className="text-[10px] text-slate-500">Discretionary monthly surplus</div>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
            <div className="text-[10px] font-bold uppercase text-slate-500">Micro-Shield Target</div>
            <div className="text-lg font-black text-[#0082CA]">${scout.recommended_emergency_target.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">Starting: ${scout.starting_emergency_fund}</div>
          </div>
        </div>

        {/* The DualPath Shield Blueprint */}
        <div className="border-2 border-[#002D72] rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-[#0082CA]" />
            <h3 className="text-base font-black text-[#002D72] uppercase tracking-wide">
              Selected Strategy: SoundCU DualPath Shield
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
            <div className="bg-[#EBF5FB] p-3 rounded-lg border border-[#BCE1F5]">
              <div className="font-bold text-slate-600">Monthly Surplus Split</div>
              <div className="text-base font-black text-[#002D72] mt-1">
                ${shield.monthlyDebtExtra}/mo <span className="font-normal text-xs text-slate-600">to Debt</span>
              </div>
              <div className="text-base font-black text-[#0082CA]">
                ${shield.monthlyEmergencyAllocation}/mo <span className="font-normal text-xs text-slate-600">to Shield</span>
              </div>
            </div>

            <div className="bg-[#EBF5FB] p-3 rounded-lg border border-[#BCE1F5]">
              <div className="font-bold text-slate-600">Debt Freedom Horizon</div>
              <div className="text-base font-black text-[#002D72] mt-1">
                {shield.monthsToDebtFree} Months
              </div>
              <div className="text-[11px] text-slate-600">
                Saves ${shield.interestSavedVsMinimum ? shield.interestSavedVsMinimum.toLocaleString() : 'thousands'} vs. minimums
              </div>
            </div>

            <div className="bg-[#EBF5FB] p-3 rounded-lg border border-[#BCE1F5]">
              <div className="font-bold text-slate-600">Cash Emergency Buffer</div>
              <div className="text-base font-black text-emerald-700 mt-1">
                ${shield.emergencyFundAt6Months.toFixed(0)} at Month 6
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold">
                100% absorbs ${shock.amount} {shock.name}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed italic border-t border-slate-200 pt-3">
            "{coach.whyDualPathWins}"
          </p>
        </div>

        {/* Member Action Checklist */}
        <div className="mb-6">
          <h4 className="text-xs font-black text-[#002D72] uppercase tracking-wider mb-2">
            Recommended Action Steps For Member
          </h4>
          <div className="space-y-2">
            {coach.actionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#0082CA] shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sound CU Loan Consolidation Opportunity (if applicable) */}
        {strategist.consolidationAnalysis && strategist.consolidationAnalysis.eligibleDebtsTotal > 0 && (
          <div className="border border-[#0082CA] rounded-xl p-4 mb-6 bg-[#EBF5FB]/30">
            <h4 className="text-xs font-black text-[#002D72] uppercase tracking-wider mb-1">
              Sound CU Consolidation Loan Evaluation
            </h4>
            <p className="text-xs text-slate-700">
              Eligible to consolidate <strong>${strategist.consolidationAnalysis.eligibleDebtsTotal.toLocaleString()}</strong> of high-APR debt into a Sound CU Fixed Loan ({strategist.consolidationAnalysis.options[0]?.apr}% APR for {strategist.consolidationAnalysis.options[0]?.termMonths} mos).
              Estimated monthly payment is <strong>${strategist.consolidationAnalysis.options[0]?.estimatedMonthlyPayment}/mo</strong>, saving an estimated <strong>${strategist.consolidationAnalysis.options[0]?.totalInterestSavedVsCards.toLocaleString()}</strong> in interest with $0 lender fees.
            </p>
          </div>
        )}

        {/* Official Credit Union Footer Disclosures */}
        <div className="border-t border-slate-300 pt-4 mt-auto text-[10px] text-slate-500 leading-tight">
          <p className="font-semibold text-slate-600 mb-1">
            Sound Credit Union · Educational Financial Planning Document
          </p>
          <p>{coach.disclosure}</p>
          <div className="mt-2 flex justify-between items-center text-[9px] text-slate-400">
            <span>Federally insured by NCUA · Equal Housing Opportunity</span>
            <span>Document ID: {strategist.calculation_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
