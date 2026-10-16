import React, { useState } from 'react';
import { CoachEvaluation, ScoutStructuredData, StrategistOutput, ShockEvent } from '../types/fintech';
import {
  HeartHandshake,
  ShieldAlert,
  Send,
  Sparkles,
  Car,
  Stethoscope,
  Clock,
  Wrench,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoachPanelProps {
  scoutData: ScoutStructuredData;
  strategistData: StrategistOutput;
  coachData: CoachEvaluation;
  onRunCustomShock: (shock: ShockEvent) => void;
  currentShock: ShockEvent;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({
  scoutData,
  strategistData,
  coachData,
  onRunCustomShock,
  currentShock,
}) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'coach'; text: string }>>([
    {
      sender: 'coach',
      text: `${coachData.greeting} As your Sound Credit Union Coach, I want to make sure your financial plan survives real life—not just a spreadsheet! Ask me any questions or test unexpected cash shocks below.`,
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [customShockAmount, setCustomShockAmount] = useState<number>(500);

  // Preset Shocks
  const presetShocks: ShockEvent[] = [
    {
      id: 'SHOCK_CAR',
      name: 'Car Brake / Alternator',
      amount: 400,
      monthOccurred: 4,
      description: 'Vehicle emergency needed for work commute.',
    },
    {
      id: 'SHOCK_MEDICAL',
      name: 'Urgent Care / Dental',
      amount: 300,
      monthOccurred: 3,
      description: 'Emergency root canal or medical copay.',
    },
    {
      id: 'SHOCK_GIG_SLOW',
      name: 'Slow Gig / Shift Cut',
      amount: 450,
      monthOccurred: 5,
      description: 'Temporary 20% dip in earnings or seasonal slowdown.',
    },
    {
      id: 'SHOCK_APPLIANCE',
      name: 'Broken Phone / Work Tool',
      amount: 250,
      monthOccurred: 2,
      description: 'Essential device needed for daily work.',
    },
  ];

  const handleSelectShock = (shock: ShockEvent) => {
    onRunCustomShock(shock);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FDB913', '#002D72', '#0082CA'],
    });
  };

  const handleApplyCustomShock = (e: React.FormEvent) => {
    e.preventDefault();
    if (customShockAmount <= 0) return;
    const customShock: ShockEvent = {
      id: `SHOCK_CUSTOM_${Date.now()}`,
      name: `Custom $${customShockAmount} Expense`,
      amount: customShockAmount,
      monthOccurred: 4,
      description: 'Custom financial emergency entered by member.',
    };
    handleSelectShock(customShock);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim() || isTyping) return;

    const newHistory = [...chatMessages, { sender: 'user' as const, text }];
    setChatMessages(newHistory);
    setUserInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          scout: scoutData,
          strategist: strategistData,
        }),
      });

      if (!response.ok) throw new Error('Failed to get coach response');
      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: data.reply || 'I am here with you. Together we can manage every financial hurdle.',
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: `At Sound Credit Union, our cooperative philosophy puts your security first. By keeping a small micro-shield active, you ensure life's surprises never push you backwards into high-interest debt!`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const shield = strategistData.strategies.dualpath_shield;
  const avalanche = strategistData.strategies.avalanche;

  return (
    <div className="bg-white border border-[#D5E3EC] rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDF3F7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0082CA] tracking-wider uppercase">
              Step 3 & Step 4 · Resilience Testing & AI Coach
            </span>
            <span className="text-xs text-[#B6CDDD]">·</span>
            <span className="text-xs text-[#6A7E8F]">Credit Union Advisory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#002D72] mt-0.5">
            Test Your Plan Against Life’s Cash Shocks
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5D6E] mt-0.5">
            Real life rarely goes in a straight line. Click an emergency below to see how DualPath Shield absorbs the blow in cash.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#E1F0F8] border border-[#B6CDDD] rounded-xl text-xs font-bold text-[#002D72] flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-[#0082CA]" />
            <span>SoundCU Empathetic Tone</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Left Column: Shock Simulator & Tradeoff Explanations (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Shock Simulator Card */}
          <div className="p-5 bg-[#FAFDFE] border border-[#D5E3EC] rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#002D72]">
                  Select an Emergency Cash Shock to Simulate (Month 4)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#D97706] tabular-nums">
                Testing: ${currentShock.amount}
              </span>
            </div>

            {/* Shock Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {presetShocks.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectShock(s)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentShock.id === s.id
                      ? 'bg-[#FFF8E7] border-[#FDB913] ring-2 ring-[#FDB913]/30 shadow-xs'
                      : 'bg-white border-[#D5E3EC] hover:border-[#0082CA]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#002D72]">${s.amount}</span>
                    {s.id === 'SHOCK_CAR' && <Car className="w-3.5 h-3.5 text-[#D97706]" />}
                    {s.id === 'SHOCK_MEDICAL' && <Stethoscope className="w-3.5 h-3.5 text-rose-600" />}
                    {s.id === 'SHOCK_GIG_SLOW' && <Clock className="w-3.5 h-3.5 text-[#0082CA]" />}
                    {s.id === 'SHOCK_APPLIANCE' && <Wrench className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[11px] font-semibold text-[#002D72] block leading-tight">
                    {s.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Shock Input Row */}
            <form onSubmit={handleApplyCustomShock} className="flex items-center gap-2 mb-4">
              <span className="text-[11px] text-[#6A7E8F] shrink-0 font-medium">Or custom amount:</span>
              <div className="relative flex-1 max-w-[140px]">
                <span className="absolute left-2.5 top-1.5 text-xs text-[#6A7E8F] font-mono">$</span>
                <input
                  type="number"
                  value={customShockAmount}
                  onChange={(e) => setCustomShockAmount(Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-1 text-xs font-mono font-bold text-[#002D72] bg-white border border-[#D5E3EC] rounded-lg focus:border-[#0082CA] focus:outline-none"
                  min={50}
                  max={5000}
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-bold text-[#002D72] bg-[#EAF2F7] hover:bg-[#D5E3EC] border border-[#B6CDDD] rounded-lg transition-colors cursor-pointer"
              >
                Test Custom
              </button>
            </form>

            {/* Instant Visual Shock Comparison Result */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Avalanche Outcome */}
              <div className="p-4 bg-[#FCE8E6] border border-[#F5C2C7] rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-1">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Without DualPath (Avalanche)</span>
                  </div>
                  <p className="text-xs font-bold text-rose-700 leading-snug mt-1">
                    RELAPSE INTO HIGH-APR DEBT
                  </p>
                  <p className="text-xs text-[#334D63] mt-1 leading-relaxed">
                    With only ${scoutData.starting_emergency_fund} in savings, member is forced to put{' '}
                    <strong className="text-rose-700 font-mono">${Math.max(0, currentShock.amount - scoutData.starting_emergency_fund)}</strong>{' '}
                    back on a 24.99%+ credit card.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-rose-200/80 text-[11px] text-rose-800 font-medium">
                  Adds ~${(currentShock.amount * 0.22).toFixed(0)} new interest & pushes debt freedom back by 2+ months.
                </div>
              </div>

              {/* DualPath Shield Outcome */}
              <div className="p-4 bg-[#E6F4EA] border border-[#C4E1CC] rounded-xl flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#137333] mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                    <span>With SoundCU DualPath Shield</span>
                  </div>
                  <p className="text-xs font-bold text-[#137333] leading-snug mt-1">
                    PAID 100% IN CASH FROM SHIELD
                  </p>
                  <p className="text-xs text-[#334D63] mt-1 leading-relaxed">
                    By Month 4, your micro-savings buffer has grown to{' '}
                    <strong className="text-[#137333] font-mono">${shield.emergencyFundAt6Months.toFixed(0)}</strong>.
                    You pay the entire ${currentShock.amount} bill immediately in cash!
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#C4E1CC] text-[11px] text-[#137333] font-bold">
                  Zero new credit card debt · Zero interest penalty · Payoff timeline stays 100% on track!
                </div>
              </div>
            </div>
          </div>

          {/* Why DualPath Wins Card */}
          <div className="p-5 bg-gradient-to-r from-[#F0F7FB] via-white to-[#FAFDFE] border border-[#B6CDDD] rounded-2xl">
            <h3 className="text-sm font-bold font-serif text-[#002D72] flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#0082CA]" />
              The Credit Union Philosophy: Why Liquidity is Armor
            </h3>
            <p className="text-xs sm:text-sm text-[#334D63] leading-relaxed">
              {coachData.whyDualPathWins}
            </p>
          </div>
        </div>

        {/* Right Column: Friendly Coach Chat Assistant (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[520px] bg-white border border-[#D5E3EC] rounded-2xl overflow-hidden shadow-xs">
          {/* Chat Header */}
          <div className="p-3.5 bg-[#002D72] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <HeartHandshake className="w-4 h-4 text-[#48C2E8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">SoundCU Financial Coach</h4>
                <span className="text-[11px] text-[#48C2E8] font-medium">Empathetic Member Guidance</span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-blue-200">{scoutData.member_token}</span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-3.5 bg-[#F4F8FA] overflow-y-auto space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#002D72] text-white font-medium rounded-br-none shadow-xs'
                      : 'bg-white text-[#1A2E44] border border-[#D5E3EC] rounded-bl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#6A7E8F] mt-1 px-1">
                  {msg.sender === 'user' ? 'You' : 'SoundCU Coach'}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-[#D5E3EC] w-20 shadow-xs">
                <div className="w-1.5 h-1.5 bg-[#0082CA] rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-[#0082CA] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-[#0082CA] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Quick Questions Suggestions */}
          <div className="px-3 py-2 bg-white border-t border-[#EDF3F7] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSendMessage('Why not put 100% of my extra cash into the 24.99% card?')}
              className="px-2.5 py-1 bg-[#F4F8FA] text-[#002D72] hover:bg-[#EAF2F7] rounded-lg border border-[#D5E3EC] whitespace-nowrap shrink-0 transition-colors font-medium"
            >
              Why not 100% to card?
            </button>
            <button
              onClick={() => handleSendMessage('What happens when I hit my $500 micro-savings goal?')}
              className="px-2.5 py-1 bg-[#F4F8FA] text-[#002D72] hover:bg-[#EAF2F7] rounded-lg border border-[#D5E3EC] whitespace-nowrap shrink-0 transition-colors font-medium"
            >
              What happens at $500?
            </button>
            <button
              onClick={() => handleSendMessage('Can I do an 80/20 split instead?')}
              className="px-2.5 py-1 bg-[#F4F8FA] text-[#002D72] hover:bg-[#EAF2F7] rounded-lg border border-[#D5E3EC] whitespace-nowrap shrink-0 transition-colors font-medium"
            >
              Can I do 80/20 split?
            </button>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#D5E3EC]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask your SoundCU Coach anything..."
                disabled={isTyping}
                className="flex-1 bg-[#F4F8FA] border border-[#B6CDDD] rounded-xl px-3 py-2 text-xs text-[#002D72] placeholder-[#6A7E8F] focus:outline-none focus:bg-white focus:border-[#0082CA]"
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className="p-2 bg-[#002D72] hover:bg-[#001F52] text-white rounded-xl transition-colors disabled:opacity-40 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
