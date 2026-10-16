import React from 'react';
import { User, Phone, RefreshCw, Code, ShieldCheck } from 'lucide-react';
import { SoundCuLogo } from './SoundCuLogo';

interface HeaderProps {
  activeTab: 'all' | 'scout' | 'strategist' | 'coach' | 'shock';
  setActiveTab: (tab: 'all' | 'scout' | 'strategist' | 'coach' | 'shock') => void;
  onResetToPoC: () => void;
  onOpenAudit: () => void;
  isProcessing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetToPoC,
  onOpenAudit,
  isProcessing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D5E3EC] shadow-xs">
      {/* Top Utility Ribbon */}
      <div className="bg-[#002D72] text-white px-4 sm:px-8 py-1.5 text-xs flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-semibold tracking-wide">Washington's Favorite Credit Union</span>
          <span className="hidden sm:inline text-blue-200">·</span>
          <span className="hidden sm:inline text-blue-100">Since 1940 · Puget Sound, WA</span>
        </div>
        <div className="flex items-center gap-4 text-slate-200 text-[11px]">
          <a href="tel:8005628130" className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone className="w-3 h-3 text-[#48C2E8]" />
            <span className="font-mono">800.562.8130</span>
          </a>
          <span className="text-blue-300">|</span>
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1 text-[#48C2E8] hover:text-white font-semibold transition-colors cursor-pointer"
            title="Inspect tokenized JSON and ASCII audit tables"
          >
            <Code className="w-3 h-3" />
            <span>Developer / Audit Mode</span>
          </button>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6">
        {/* Zone 1: Authentic Sound Credit Union Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <SoundCuLogo withTagline={true} />
        </div>

        {/* Zone 2: Navigation Links in Member-Friendly Language */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F4F8FA] p-1 rounded-xl border border-[#D5E3EC]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#002D72] text-white shadow-sm'
                : 'text-[#002D72] hover:bg-white hover:text-[#0082CA]'
            }`}
          >
            Guided Plan
          </button>
          <button
            onClick={() => setActiveTab('scout')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'scout'
                ? 'bg-[#002D72] text-white shadow-sm'
                : 'text-[#002D72] hover:bg-white hover:text-[#0082CA]'
            }`}
          >
            1. Financial Checkup
          </button>
          <button
            onClick={() => setActiveTab('strategist')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'strategist'
                ? 'bg-[#002D72] text-white shadow-sm'
                : 'text-[#002D72] hover:bg-white hover:text-[#0082CA]'
            }`}
          >
            2. Compare Payoff Plans
          </button>
          <button
            onClick={() => setActiveTab('shock')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'shock'
                ? 'bg-[#FDB913] text-[#002D72] shadow-sm'
                : 'text-[#002D72] hover:bg-[#FFF8E7] hover:text-[#C58300]'
            }`}
          >
            3. Shock Simulator
          </button>
          <button
            onClick={() => setActiveTab('coach')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'coach'
                ? 'bg-[#002D72] text-white shadow-sm'
                : 'text-[#002D72] hover:bg-white hover:text-[#0082CA]'
            }`}
          >
            Ask AI Coach
          </button>
        </nav>

        {/* Zone 3: Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onResetToPoC}
            disabled={isProcessing}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#002D72] bg-white border border-[#B6CDDD] rounded-lg hover:bg-[#F4F8FA] transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            title="Reset to default synthetic test cases"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0082CA] ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Reset Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('shock')}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-[#002D72] text-white text-xs font-bold rounded-lg hover:bg-[#001F52] transition-colors shadow-sm"
          >
            <span>Test a Cash Shock</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Scroller */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 bg-[#F4F8FA] border-t border-[#E2E8F0] overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 font-medium ${
            activeTab === 'all' ? 'bg-[#002D72] text-white' : 'text-[#002D72]'
          }`}
        >
          Guided Plan
        </button>
        <button
          onClick={() => setActiveTab('scout')}
          className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 font-medium ${
            activeTab === 'scout' ? 'bg-[#002D72] text-white' : 'text-[#002D72]'
          }`}
        >
          1. Checkup
        </button>
        <button
          onClick={() => setActiveTab('strategist')}
          className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 font-medium ${
            activeTab === 'strategist' ? 'bg-[#002D72] text-white' : 'text-[#002D72]'
          }`}
        >
          2. Payoff Plans
        </button>
        <button
          onClick={() => setActiveTab('shock')}
          className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 font-bold ${
            activeTab === 'shock' ? 'bg-[#FDB913] text-[#002D72]' : 'text-[#002D72]'
          }`}
        >
          3. Shock Test
        </button>
        <button
          onClick={() => setActiveTab('coach')}
          className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 font-medium ${
            activeTab === 'coach' ? 'bg-[#002D72] text-white' : 'text-[#002D72]'
          }`}
        >
          Coach
        </button>
      </div>
    </header>
  );
};
