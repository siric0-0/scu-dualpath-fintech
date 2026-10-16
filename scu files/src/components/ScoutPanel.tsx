import React, { useState } from 'react';
import { ScoutStructuredData } from '../types/fintech';
import { ShieldCheck, Copy, Check, Lock, AlertTriangle, ArrowRight, Wallet, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

interface ScoutPanelProps {
  scoutData: ScoutStructuredData;
  onProceedToStrategist?: () => void;
}

export const ScoutPanel: React.FC<ScoutPanelProps> = ({ scoutData, onProceedToStrategist }) => {
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(scoutData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#D5E3EC] rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDF3F7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0082CA] tracking-wider uppercase">
              Step 1 · Monthly Cash Flow Checkup
            </span>
            <span className="text-xs text-[#B6CDDD]">·</span>
            <span className="text-xs text-[#6A7E8F] flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#0082CA]" /> Privacy Tokenized
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#002D72] mt-0.5">
            Your Financial Starting Point
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5D6E] mt-0.5">
            We audited your monthly income, living expenses, and current debts to calculate your surplus cash.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 bg-[#F0F7FB] border border-[#D5E3EC] rounded-xl text-xs font-mono text-[#002D72] flex items-center gap-1.5">
            <span className="text-[#6A7E8F]">Member Token:</span>
            <strong className="text-[#0082CA]">{scoutData.member_token}</strong>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {/* Hero Cash Flow Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-[#F4F8FA] border border-[#D5E3EC] rounded-xl">
            <span className="text-xs font-semibold text-[#6A7E8F] block">Take-Home Income</span>
            <span className="text-xl font-bold font-mono text-[#002D72] tabular-nums mt-0.5 block">
              ${scoutData.monthly_net_income.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#0082CA] block mt-1 font-medium">
              {scoutData.income_type.replace('_', ' ')}
            </span>
          </div>

          <div className="p-4 bg-[#F4F8FA] border border-[#D5E3EC] rounded-xl">
            <span className="text-xs font-semibold text-[#6A7E8F] block">Living Essentials</span>
            <span className="text-xl font-bold font-mono text-[#334D63] tabular-nums mt-0.5 block">
              ${scoutData.living_expenses.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#6A7E8F] block mt-1">Rent, food, utilities</span>
          </div>

          <div className="p-4 bg-[#F4F8FA] border border-[#D5E3EC] rounded-xl">
            <span className="text-xs font-semibold text-[#6A7E8F] block">Total Min. Debt Due</span>
            <span className="text-xl font-bold font-mono text-[#D97706] tabular-nums mt-0.5 block">
              ${scoutData.total_minimum_payments.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#6A7E8F] block mt-1">Across {scoutData.liabilities.length} accounts</span>
          </div>

          {/* Highlighted Free Cash Flow Tile */}
          <div className="p-4 bg-gradient-to-br from-[#E6F4EA] to-[#D5EED9] border border-[#B7E1C0] rounded-xl shadow-xs">
            <span className="text-xs font-bold text-[#137333] uppercase tracking-wide block">
              Surplus Extra Cash (FCF)
            </span>
            <span className="text-2xl font-bold font-mono text-[#137333] tabular-nums mt-0.5 block">
              ${scoutData.free_cash_flow.toLocaleString()}/mo
            </span>
            <span className="text-[11px] text-[#137333] block mt-1 font-medium">
              Available to split into debt + savings
            </span>
          </div>
        </div>

        {/* Current Debts List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#002D72]">
              Current Obligations ({scoutData.liabilities.length} Accounts)
            </h3>
            <span className="text-xs font-mono font-bold text-[#002D72] tabular-nums">
              Total Debt Balance: ${scoutData.total_debt_balance.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#D5E3EC]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#EAF2F7] text-[#002D72] border-b border-[#D5E3EC]">
                  <th className="py-2.5 px-3.5 font-bold">Account Name</th>
                  <th className="py-2.5 px-3.5 font-bold text-right">Balance</th>
                  <th className="py-2.5 px-3.5 font-bold text-right">Interest Rate (APR)</th>
                  <th className="py-2.5 px-3.5 font-bold text-right">Minimum Due</th>
                  <th className="py-2.5 px-3.5 font-bold text-right">Monthly Interest Drag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF3F7] bg-white font-mono">
                {scoutData.liabilities.map((item) => {
                  const isHighRate = item.apr >= 20;
                  return (
                    <tr key={item.id} className="hover:bg-[#F9FCFE] transition-colors">
                      <td className="py-2.5 px-3.5 font-sans font-semibold text-[#002D72]">
                        <div className="flex items-center gap-2">
                          <span>{item.tokenized_name}</span>
                          <span className="text-[11px] font-mono text-[#6A7E8F] font-normal">
                            ({item.id})
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-[#334D63] tabular-nums font-semibold">
                        ${item.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3.5 text-right tabular-nums">
                        <span className={isHighRate ? 'text-rose-600 font-bold' : 'text-[#334D63]'}>
                          {item.apr.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-[#334D63] tabular-nums">
                        ${item.minimum_payment.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-[#D97706] tabular-nums font-semibold">
                        ${item.monthly_interest_cost.toFixed(2)}/mo
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Emergency Buffer Bar + Next Step Action */}
        <div className="p-4 bg-[#F4F8FA] border border-[#D5E3EC] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-[#6A7E8F]">Current Emergency Savings: </span>
            <span className="font-mono text-[#D97706] font-bold text-sm tabular-nums">
              ${scoutData.starting_emergency_fund.toFixed(2)}
            </span>
            <span className="text-[#6A7E8F] ml-2 block sm:inline mt-1 sm:mt-0">
              (Target safety shield: <strong className="text-[#0082CA]">${scoutData.recommended_emergency_target}</strong>)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-xs font-semibold text-[#0082CA] hover:text-[#002D72] flex items-center gap-1"
            >
              <span>{showRawJson ? 'Hide' : 'View'} [SCOUT] JSON</span>
              {showRawJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {onProceedToStrategist && (
              <button
                onClick={onProceedToStrategist}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#002D72] hover:bg-[#001F52] rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <span>Compare Payoff Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Raw JSON Block */}
        {showRawJson && (
          <div className="mt-3 p-4 bg-[#061524] rounded-xl border border-[#002D72]">
            <div className="flex items-center justify-between text-xs text-[#6A7E8F] mb-2 font-mono">
              <span className="text-[#48C2E8]">Emitted [SCOUT] Data Block (JSON)</span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-white bg-slate-800 hover:bg-slate-700 rounded"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#48C2E8]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-[#48C2E8] leading-relaxed overflow-x-auto max-h-64 select-all">
              {JSON.stringify(scoutData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
