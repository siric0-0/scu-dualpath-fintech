import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileSelector } from './components/ProfileSelector';
import { ScoutPanel } from './components/ScoutPanel';
import { StrategistPanel } from './components/StrategistPanel';
import { CoachPanel } from './components/CoachPanel';
import { DisclosureFooter } from './components/DisclosureFooter';
import { AuditDrawer } from './components/AuditDrawer';
import { ConsolidationPanel } from './components/ConsolidationPanel';
import { ScenarioBuilder } from './components/ScenarioBuilder';
import { PayoffChart } from './components/PayoffChart';
import { PrintActionPlan } from './components/PrintActionPlan';
import {
  DEFAULT_SYNTHETIC_PROFILES,
  executeScoutAudit,
  executeStrategistSolver,
  generateCoachGuidance,
} from './utils/amortization';
import {
  MemberFinancialProfile,
  ScoutStructuredData,
  StrategistOutput,
  CoachEvaluation,
  ShockEvent,
} from './types/fintech';
import { ShieldCheck, Sparkles, ArrowRight, Shield, Zap, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'scout' | 'strategist' | 'coach' | 'shock'>('all');
  const [profileKey, setProfileKey] = useState<string>('college_grad');
  const [activeProfile, setActiveProfile] = useState<MemberFinancialProfile>(
    DEFAULT_SYNTHETIC_PROFILES.college_grad
  );

  // Optimization parameters
  const [splitPercent, setSplitPercent] = useState<number>(60); // 60% debt, 40% savings
  const [targetEmergency, setTargetEmergency] = useState<number>(500);
  const [aprStressDelta, setAprStressDelta] = useState<number>(0);

  // Active Shock Event
  const [currentShock, setCurrentShock] = useState<ShockEvent>({
    id: 'SHOCK_CAR',
    name: 'Car Brake / Alternator',
    amount: 400,
    monthOccurred: 4,
    description: 'Vehicle emergency needed for work commute.',
  });

  // Technical Audit Drawer
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [showRatesRibbon, setShowRatesRibbon] = useState(false);

  // State outputs
  const [scoutData, setScoutData] = useState<ScoutStructuredData | null>(null);
  const [strategistData, setStrategistData] = useState<StrategistOutput | null>(null);
  const [coachData, setCoachData] = useState<CoachEvaluation | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Compute or re-run pipeline whenever parameters or profile changes
  const runPipeline = (
    profile: MemberFinancialProfile,
    split: number,
    target: number,
    aprDelta: number,
    shock: ShockEvent
  ) => {
    setIsProcessing(true);

    // 1. Audit via SCOUT
    const scout = executeScoutAudit(profile);
    setScoutData(scout);

    // 2. Solve via STRATEGIST
    const strat = executeStrategistSolver(
      scout,
      split,
      target,
      aprDelta,
      shock,
      profile.isIncomeVariable,
      profile.incomeVariancePercent
    );
    setStrategistData(strat);

    // 3. Advise via COACH
    const coach = generateCoachGuidance(scout, strat, shock);
    setCoachData(coach);

    setIsProcessing(false);
  };

  useEffect(() => {
    runPipeline(activeProfile, splitPercent, targetEmergency, aprStressDelta, currentShock);
  }, [activeProfile, splitPercent, targetEmergency, aprStressDelta, currentShock]);

  const handleSelectProfile = (key: string, custom?: MemberFinancialProfile) => {
    setProfileKey(key);
    if (key === 'custom' && custom) {
      setActiveProfile(custom);
      setTargetEmergency(custom.targetEmergencyFund || 500);
    } else if (DEFAULT_SYNTHETIC_PROFILES[key]) {
      const p = DEFAULT_SYNTHETIC_PROFILES[key];
      setActiveProfile(p);
      setTargetEmergency(p.targetEmergencyFund || 500);
    }
  };

  const handleResetToPoC = () => {
    setProfileKey('college_grad');
    const defaultP = DEFAULT_SYNTHETIC_PROFILES.college_grad;
    setActiveProfile(defaultP);
    setSplitPercent(60);
    setTargetEmergency(500);
    setAprStressDelta(0);
    setCurrentShock({
      id: 'SHOCK_CAR',
      name: 'Car Brake / Alternator',
      amount: 400,
      monthOccurred: 4,
      description: 'Vehicle emergency needed for work commute.',
    });
  };

  const handleCustomShock = (shock: ShockEvent) => {
    setCurrentShock(shock);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#1A2E44] flex flex-col font-sans">
      {/* Top Bar following contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetToPoC={handleResetToPoC}
        onOpenAudit={() => setIsAuditDrawerOpen(true)}
        isProcessing={isProcessing}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Streamlined, Inviting Hero Banner */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-[#002D72] via-[#003882] to-[#005A9C] text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full text-xs font-semibold text-[#48C2E8]">
                <span>Sound Credit Union</span>
                <span>·</span>
                <span>DualPath Financial Shield</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif tracking-tight leading-snug">
                Break the Debt Spiral. Build Your Emergency Shield.
              </h1>

              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
                Traditional debt payoff plans push 100% of extra cash into debt, leaving you with $0 in savings. When a $400 car repair hits, you are forced back onto high-APR cards. DualPath pairs automated debt amortization with a micro-emergency buffer to keep you protected.
              </p>
            </div>

            {/* Quick 3-Step Guided Flow Preview */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FDB913] block">
                  How DualPath Works:
                </span>
                <div className="flex items-center gap-2 text-white">
                  <span className="w-5 h-5 rounded-full bg-[#0082CA] text-white flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Audit monthly cash flow</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="w-5 h-5 rounded-full bg-[#0082CA] text-white flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Split surplus into debt + micro-shield</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="w-5 h-5 rounded-full bg-[#0082CA] text-white flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Test resilience against life shocks</span>
                </div>
              </div>

              <button
                onClick={() => setShowRatesRibbon(!showRatesRibbon)}
                className="text-[11px] text-blue-200 hover:text-white flex items-center justify-end gap-1 font-medium cursor-pointer"
              >
                <span>{showRatesRibbon ? 'Hide' : 'View'} SoundCU Featured Rates</span>
                {showRatesRibbon ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Collapsible Featured Rates Strip */}
          {showRatesRibbon && (
            <div className="relative z-10 mt-5 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl">
                <span className="text-[11px] text-blue-200 block">Visa Balance Transfers</span>
                <span className="text-base font-bold font-mono text-[#FDB913] tabular-nums block mt-0.5">
                  1.99% Promo APR
                </span>
                <span className="text-[10px] text-blue-100 block">No transfer fee</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl">
                <span className="text-[11px] text-blue-200 block">New Auto Loans</span>
                <span className="text-base font-bold font-mono text-white tabular-nums block mt-0.5">
                  5.14% APR
                </span>
                <span className="text-[10px] text-blue-100 block">Flexible terms</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl">
                <span className="text-[11px] text-blue-200 block">11-Mo Certificate</span>
                <span className="text-base font-bold font-mono text-[#48C2E8] tabular-nums block mt-0.5">
                  3.95% APY
                </span>
                <span className="text-[10px] text-blue-100 block">$500 minimum</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl">
                <span className="text-[11px] text-blue-200 block">Save to Win</span>
                <span className="text-base font-bold font-mono text-[#94D2BD] tabular-nums block mt-0.5">
                  0.25% APY
                </span>
                <span className="text-[10px] text-blue-100 block">$0 opening deposit</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Switcher */}
        <ProfileSelector
          currentProfileKey={profileKey}
          onSelectProfile={handleSelectProfile}
          activeProfile={activeProfile}
          isProcessing={isProcessing}
        />

        {/* Persona Content Sections */}
        {scoutData && strategistData && coachData && (
          <div className="space-y-6">
            {/* UNIFIED VIEW: Guided Step-by-Step Flow */}
            {activeTab === 'all' && (
              <>
                <ScoutPanel
                  scoutData={scoutData}
                  onProceedToStrategist={() => setActiveTab('strategist')}
                />

                <PayoffChart
                  dualpath={strategistData.strategies.dualpath_shield}
                  avalanche={strategistData.strategies.avalanche}
                  snowball={strategistData.strategies.snowball}
                  targetEmergency={targetEmergency}
                />

                <StrategistPanel
                  strategistData={strategistData}
                  splitPercent={splitPercent}
                  onSplitChange={setSplitPercent}
                  targetEmergency={targetEmergency}
                  onTargetEmergencyChange={setTargetEmergency}
                  aprStressDelta={aprStressDelta}
                  onAprStressChange={setAprStressDelta}
                  onProceedToCoach={() => setActiveTab('coach')}
                />

                <ConsolidationPanel
                  consolidation={strategistData.consolidationAnalysis}
                  memberToken={scoutData.member_token}
                />

                <ScenarioBuilder
                  currentShock={currentShock}
                  onApplyShock={handleCustomShock}
                  strategist={strategistData}
                  scout={scoutData}
                />

                <CoachPanel
                  scoutData={scoutData}
                  strategistData={strategistData}
                  coachData={coachData}
                  onRunCustomShock={handleCustomShock}
                  currentShock={currentShock}
                />

                <PrintActionPlan
                  scout={scoutData}
                  strategist={strategistData}
                  coach={coachData}
                  shock={currentShock}
                />
              </>
            )}

            {/* TAB 1: 1. Financial Checkup */}
            {activeTab === 'scout' && (
              <ScoutPanel
                scoutData={scoutData}
                onProceedToStrategist={() => setActiveTab('strategist')}
              />
            )}

            {/* TAB 2: 2. Compare Payoff Plans */}
            {activeTab === 'strategist' && (
              <>
                <PayoffChart
                  dualpath={strategistData.strategies.dualpath_shield}
                  avalanche={strategistData.strategies.avalanche}
                  snowball={strategistData.strategies.snowball}
                  targetEmergency={targetEmergency}
                />
                <StrategistPanel
                  strategistData={strategistData}
                  splitPercent={splitPercent}
                  onSplitChange={setSplitPercent}
                  targetEmergency={targetEmergency}
                  onTargetEmergencyChange={setTargetEmergency}
                  aprStressDelta={aprStressDelta}
                  onAprStressChange={setAprStressDelta}
                  onProceedToCoach={() => setActiveTab('coach')}
                />
                <ConsolidationPanel
                  consolidation={strategistData.consolidationAnalysis}
                  memberToken={scoutData.member_token}
                />
                <PrintActionPlan
                  scout={scoutData}
                  strategist={strategistData}
                  coach={coachData}
                  shock={currentShock}
                />
              </>
            )}

            {/* TAB 3: Shock Lab Dedicated View */}
            {activeTab === 'shock' && (
              <>
                <ScenarioBuilder
                  currentShock={currentShock}
                  onApplyShock={handleCustomShock}
                  strategist={strategistData}
                  scout={scoutData}
                />
                <CoachPanel
                  scoutData={scoutData}
                  strategistData={strategistData}
                  coachData={coachData}
                  onRunCustomShock={handleCustomShock}
                  currentShock={currentShock}
                />
                <PrintActionPlan
                  scout={scoutData}
                  strategist={strategistData}
                  coach={coachData}
                  shock={currentShock}
                />
              </>
            )}

            {/* TAB 4: Ask AI Coach */}
            {activeTab === 'coach' && (
              <>
                <CoachPanel
                  scoutData={scoutData}
                  strategistData={strategistData}
                  coachData={coachData}
                  onRunCustomShock={handleCustomShock}
                  currentShock={currentShock}
                />
                <PrintActionPlan
                  scout={scoutData}
                  strategist={strategistData}
                  coach={coachData}
                  shock={currentShock}
                />
              </>
            )}
          </div>
        )}
      </main>

      {/* Compliance & Educational Disclosure Footer */}
      <DisclosureFooter />

      {/* Technical Audit Drawer for Regulators & Evaluators */}
      {scoutData && strategistData && (
        <AuditDrawer
          isOpen={isAuditDrawerOpen}
          onClose={() => setIsAuditDrawerOpen(false)}
          scoutData={scoutData}
          strategistData={strategistData}
        />
      )}
    </div>
  );
}
