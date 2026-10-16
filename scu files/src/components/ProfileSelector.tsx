import React, { useState } from 'react';
import { MemberFinancialProfile } from '../types/fintech';
import { GraduationCap, Briefcase, DollarSign, SlidersHorizontal, Plus, Check, ChevronRight, Edit3 } from 'lucide-react';

interface ProfileSelectorProps {
  currentProfileKey: string;
  onSelectProfile: (key: string, custom?: MemberFinancialProfile) => void;
  activeProfile: MemberFinancialProfile;
  isProcessing: boolean;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  currentProfileKey,
  onSelectProfile,
  activeProfile,
  isProcessing,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customIncome, setCustomIncome] = useState(3000);
  const [customExpenses, setCustomExpenses] = useState(2200);
  const [customSavings, setCustomSavings] = useState(100);
  const [customTarget, setCustomTarget] = useState(500);
  const [customCcBalance, setCustomCcBalance] = useState(4000);
  const [customCcApr, setCustomCcApr] = useState(25.99);
  const [customCcMin, setCustomCcMin] = useState(110);
  const [customLoanBalance, setCustomLoanBalance] = useState(8000);
  const [customLoanApr, setCustomLoanApr] = useState(7.5);
  const [customLoanMin, setCustomLoanMin] = useState(120);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const customProf: MemberFinancialProfile = {
      rawName: 'Custom Scenario',
      memberToken: `SCU_MEMBER_${Math.floor(1000 + Math.random() * 9000)}`,
      monthlyNetIncome: customIncome,
      livingExpenses: customExpenses,
      startingEmergencyFund: customSavings,
      targetEmergencyFund: customTarget,
      liabilities: [
        {
          id: 'LIAB_CUSTOM_CC',
          name: 'Primary Credit Card',
          balance: customCcBalance,
          apr: customCcApr,
          minimumPayment: customCcMin,
          accountNumberMasked: '••••7701',
          category: 'credit_card',
        },
        {
          id: 'LIAB_CUSTOM_LOAN',
          name: 'Installment Loan',
          balance: customLoanBalance,
          apr: customLoanApr,
          minimumPayment: customLoanMin,
          accountNumberMasked: '••••3319',
          category: 'personal_loan',
        },
      ],
    };
    onSelectProfile('custom', customProf);
    setShowCustomModal(false);
  };

  const profiles = [
    {
      key: 'college_grad',
      label: 'College Graduate',
      member: 'Alex (SCU_MEMBER_9821)',
      icon: GraduationCap,
      summary: '$3.2k Income · $21.4k Debt · $80 Buffer',
      badge: 'High Student Debt + Card',
    },
    {
      key: 'gig_worker',
      label: 'Gig / Variable Worker',
      member: 'Jordan (SCU_MEMBER_5419)',
      icon: Briefcase,
      summary: '$2.8k Income (±20%) · $6k High APR · $0 Buffer',
      badge: 'Extreme Relapse Risk',
    },
    {
      key: 'wage_earner',
      label: 'Wage Earner',
      member: 'Marcus (SCU_MEMBER_3180)',
      icon: DollarSign,
      summary: '$3.5k Income · $13.7k Debt · $120 Buffer',
      badge: 'Multiple High-Rate Cards',
    },
  ];

  return (
    <div className="bg-white border border-[#D5E3EC] rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0082CA]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#002D72]">
            Select Member Profile Scenario
          </span>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1 text-xs font-bold text-[#0082CA] hover:text-[#002D72] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Enter Custom Numbers</span>
        </button>
      </div>

      {/* Segmented 1-Click Profile Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {profiles.map((p) => {
          const Icon = p.icon;
          const isSelected = currentProfileKey === p.key;
          return (
            <button
              key={p.key}
              onClick={() => onSelectProfile(p.key)}
              disabled={isProcessing}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#F0F7FB] border-[#0082CA] ring-2 ring-[#0082CA]/20 shadow-xs'
                  : 'bg-white border-[#D5E3EC] hover:bg-[#F9FCFE] hover:border-[#B6CDDD]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#002D72] text-white' : 'bg-[#EAF2F7] text-[#0082CA]'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#002D72] leading-tight">
                    {p.label}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#0082CA] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <div className="text-[11px] text-[#4A5D6E] space-y-0.5 mt-1 font-mono">
                <p className="tabular-nums font-semibold text-[#002D72]">{p.summary}</p>
                <p className="text-[10px] text-[#0082CA] font-sans font-medium">{p.badge}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Member Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-[#002D72]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#B6CDDD] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EDF3F7]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0082CA] block">
                  SoundCU Member Tool
                </span>
                <h3 className="text-lg font-bold font-serif text-[#002D72]">
                  Custom Member Financial Profile
                </h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 rounded-full bg-[#F4F8FA] hover:bg-[#EAF2F7] text-[#002D72] flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyCustom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#002D72] mb-1">Monthly Net Income ($)</label>
                  <input
                    type="number"
                    value={customIncome}
                    onChange={(e) => setCustomIncome(Number(e.target.value))}
                    className="w-full bg-[#F4F8FA] border border-[#B6CDDD] rounded-lg px-3 py-2 text-sm font-mono text-[#002D72] tabular-nums focus:bg-white focus:border-[#0082CA] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#002D72] mb-1">Living Expenses ($)</label>
                  <input
                    type="number"
                    value={customExpenses}
                    onChange={(e) => setCustomExpenses(Number(e.target.value))}
                    className="w-full bg-[#F4F8FA] border border-[#B6CDDD] rounded-lg px-3 py-2 text-sm font-mono text-[#002D72] tabular-nums focus:bg-white focus:border-[#0082CA] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#002D72] mb-1">Starting Emergency Cash ($)</label>
                  <input
                    type="number"
                    value={customSavings}
                    onChange={(e) => setCustomSavings(Number(e.target.value))}
                    className="w-full bg-[#F4F8FA] border border-[#B6CDDD] rounded-lg px-3 py-2 text-sm font-mono text-[#002D72] tabular-nums focus:bg-white focus:border-[#0082CA] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#002D72] mb-1">Target Micro-Shield ($)</label>
                  <input
                    type="number"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(Number(e.target.value))}
                    className="w-full bg-[#F4F8FA] border border-[#B6CDDD] rounded-lg px-3 py-2 text-sm font-mono text-[#002D72] tabular-nums focus:bg-white focus:border-[#0082CA] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="bg-[#F4F8FA] p-3 rounded-xl border border-[#D5E3EC]">
                <span className="text-xs font-bold text-[#002D72] block">Liability 1 (High-APR Revolving Card)</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <label className="block text-[11px] text-[#6A7E8F]">Balance ($)</label>
                    <input
                      type="number"
                      value={customCcBalance}
                      onChange={(e) => setCustomCcBalance(Number(e.target.value))}
                      className="w-full bg-white border border-[#B6CDDD] rounded px-2.5 py-1.5 text-xs font-mono text-[#002D72] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6A7E8F]">APR (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={customCcApr}
                      onChange={(e) => setCustomCcApr(Number(e.target.value))}
                      className="w-full bg-white border border-[#B6CDDD] rounded px-2.5 py-1.5 text-xs font-mono text-[#002D72] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6A7E8F]">Min Payment ($)</label>
                    <input
                      type="number"
                      value={customCcMin}
                      onChange={(e) => setCustomCcMin(Number(e.target.value))}
                      className="w-full bg-white border border-[#B6CDDD] rounded px-2.5 py-1.5 text-xs font-mono text-[#002D72] tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#F4F8FA] p-3 rounded-xl border border-[#D5E3EC]">
                <span className="text-xs font-bold text-[#002D72] block">Liability 2 (Installment / Secondary Loan)</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <label className="block text-[11px] text-[#6A7E8F]">Balance ($)</label>
                    <input
                      type="number"
                      value={customLoanBalance}
                      onChange={(e) => setCustomLoanBalance(Number(e.target.value))}
                      className="w-full bg-white border border-[#B6CDDD] rounded px-2.5 py-1.5 text-xs font-mono text-[#002D72] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6A7E8F]">APR (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={customLoanApr}
                      onChange={(e) => setCustomLoanApr(Number(e.target.value))}
                      className="w-full bg-white border border-[#B6CDDD] rounded px-2.5 py-1.5 text-xs font-mono text-[#002D72] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6A7E8F]">Min Payment ($)</label>
                    <input
                      type="number"
                      value={customLoanMin}
                      onChange={(e) => setCustomLoanMin(Number(e.target.value))}
                      className="w-full bg-white border border-[#B6CDDD] rounded px-2.5 py-1.5 text-xs font-mono text-[#002D72] tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#EDF3F7]">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#4A5D6E] hover:text-[#002D72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#002D72] hover:bg-[#001F52] rounded-xl transition-colors shadow-sm"
                >
                  Apply & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
