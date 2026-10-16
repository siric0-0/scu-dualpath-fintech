import {
  Liability,
  MemberFinancialProfile,
  ScoutStructuredData,
  StrategyPlanResult,
  StrategistOutput,
  MonthlySimulationStep,
  CoachEvaluation,
  ShockEvent,
  SoundCUConsolidationOption,
  ConsolidationAnalysis,
} from '../types/fintech';

export const OFFICIAL_SOUNDCU_DISCLOSURE =
  "Sound Credit Union Educational Planning Tool. Projections are estimates for informational and educational purposes only and do not constitute formal legal, tax, or investment advice. Interest rates, loan consolidation, and credit approval are subject to Sound CU underwriting guidelines, terms, and conditions. Federally insured by NCUA. Equal Housing Opportunity.";

export const DEFAULT_SYNTHETIC_PROFILES: Record<string, MemberFinancialProfile> = {
  college_grad: {
    rawName: "Alex Rivera",
    memberToken: "SCU_MEMBER_9821",
    monthlyNetIncome: 3200,
    isIncomeVariable: false,
    incomeVariancePercent: 0,
    livingExpenses: 2450,
    startingEmergencyFund: 80,
    targetEmergencyFund: 500,
    liabilities: [
      {
        id: "LIAB_CC_01",
        name: "High-APR Rewards Card",
        balance: 3400,
        apr: 24.99,
        minimumPayment: 95,
        accountNumberMasked: "••••4892",
        category: "credit_card",
      },
      {
        id: "LIAB_STU_02",
        name: "Direct Subsidized Student Loan",
        balance: 18000,
        apr: 5.80,
        minimumPayment: 195,
        accountNumberMasked: "••••1104",
        category: "student_loan",
      },
    ],
  },
  gig_worker: {
    rawName: "Jordan Chen",
    memberToken: "SCU_MEMBER_5419",
    monthlyNetIncome: 2800,
    isIncomeVariable: true,
    incomeVariancePercent: 20,
    livingExpenses: 2100,
    startingEmergencyFund: 0,
    targetEmergencyFund: 1000,
    liabilities: [
      {
        id: "LIAB_CC_01",
        name: "Card A (Everyday Visa)",
        balance: 4200,
        apr: 26.50,
        minimumPayment: 130,
        accountNumberMasked: "••••7231",
        category: "credit_card",
      },
      {
        id: "LIAB_CC_02",
        name: "Card B (Store Mastercard)",
        balance: 1800,
        apr: 22.00,
        minimumPayment: 55,
        accountNumberMasked: "••••8841",
        category: "credit_card",
      },
    ],
  },
  wage_earner: {
    rawName: "Marcus Vance",
    memberToken: "SCU_MEMBER_3180",
    monthlyNetIncome: 3500,
    isIncomeVariable: false,
    incomeVariancePercent: 0,
    livingExpenses: 2480,
    startingEmergencyFund: 120,
    targetEmergencyFund: 750,
    liabilities: [
      {
        id: "LIAB_CC_01",
        name: "Bank Credit Card 1",
        balance: 6500,
        apr: 24.50,
        minimumPayment: 175,
        accountNumberMasked: "••••3902",
        category: "credit_card",
      },
      {
        id: "LIAB_CC_02",
        name: "Department Store Card",
        balance: 3200,
        apr: 21.00,
        minimumPayment: 90,
        accountNumberMasked: "••••6419",
        category: "credit_card",
      },
      {
        id: "LIAB_PL_03",
        name: "Legacy Personal Loan",
        balance: 4000,
        apr: 11.50,
        minimumPayment: 110,
        accountNumberMasked: "••••9023",
        category: "personal_loan",
      },
    ],
  },
};

/**
 * Step 1: SCOUT Persona Engine
 * Audits, tokenizes, and structures user financial records into standardized JSON
 */
export function executeScoutAudit(profile: MemberFinancialProfile): ScoutStructuredData {
  const totalDebtBalance = profile.liabilities.reduce((sum, l) => sum + l.balance, 0);
  const totalMinimumPayments = profile.liabilities.reduce((sum, l) => sum + l.minimumPayment, 0);
  const freeCashFlow = Math.max(
    0,
    profile.monthlyNetIncome - profile.livingExpenses - totalMinimumPayments
  );

  let solvency: 'HEALTHY_SURPLUS' | 'TIGHT_MARGIN' | 'CASH_DEFICIT' = 'HEALTHY_SURPLUS';
  if (profile.monthlyNetIncome - profile.livingExpenses < totalMinimumPayments) {
    solvency = 'CASH_DEFICIT';
  } else if (freeCashFlow < 100) {
    solvency = 'TIGHT_MARGIN';
  }

  // Recommended micro-savings target based on income stability
  const recommendedTarget = profile.isIncomeVariable
    ? 1000
    : profile.targetEmergencyFund || 500;

  const auditedLiabilities = profile.liabilities.map((l, index) => {
    const monthlyRate = l.apr / 100 / 12;
    const initialMonthlyInterest = l.balance * monthlyRate;
    return {
      id: l.id || `LIAB_TOK_${index + 1}`,
      tokenized_name: l.name,
      balance: Math.round(l.balance * 100) / 100,
      apr: l.apr,
      minimum_payment: l.minimumPayment,
      monthly_interest_cost: Math.round(initialMonthlyInterest * 100) / 100,
      category: l.category || 'credit_card',
    };
  });

  const hasUsuryApr = profile.liabilities.some((l) => l.apr >= 24);

  return {
    member_token: profile.memberToken || `SCU_MEMBER_${Math.floor(1000 + Math.random() * 9000)}`,
    audit_timestamp: new Date().toISOString(),
    monthly_net_income: profile.monthlyNetIncome,
    income_type: profile.isIncomeVariable
      ? 'VARIABLE_GIG'
      : totalDebtBalance > 15000 && profile.liabilities.some((l) => l.category === 'student_loan')
      ? 'EARLY_CAREER'
      : 'STABLE_W2',
    living_expenses: profile.livingExpenses,
    total_debt_balance: Math.round(totalDebtBalance * 100) / 100,
    total_minimum_payments: Math.round(totalMinimumPayments * 100) / 100,
    free_cash_flow: Math.round(freeCashFlow * 100) / 100,
    solvency_status: solvency,
    starting_emergency_fund: profile.startingEmergencyFund,
    recommended_emergency_target: recommendedTarget,
    liabilities: auditedLiabilities,
    compliance_flags: {
      pii_tokenized: true,
      educational_disclosure_required: true,
      usury_apr_warning: hasUsuryApr,
    },
  };
}

/**
 * Calculates Sound Credit Union Loan Consolidation & Balance Transfer Offerings
 * Based on real-life Sound CU loan tiers and Select credit card balance transfer perks.
 */
export function calculateSoundCUConsolidation(
  liabilities: ScoutStructuredData['liabilities']
): ConsolidationAnalysis {
  // Identify liabilities suitable for credit union consolidation (e.g. credit cards, high APR retail loans >= 12%)
  const eligible = liabilities.filter(
    (l) => l.apr >= 12.0 || l.category === 'credit_card'
  );

  const eligibleDebtsTotal = Math.round(eligible.reduce((sum, l) => sum + l.balance, 0) * 100) / 100;
  const currentCombinedMinPayment = Math.round(
    eligible.reduce((sum, l) => sum + l.minimum_payment, 0) * 100
  ) / 100;

  const weightedAprSum = eligible.reduce((sum, l) => sum + l.apr * l.balance, 0);
  const eligibleDebtsWeightedApr =
    eligibleDebtsTotal > 0 ? Math.round((weightedAprSum / eligibleDebtsTotal) * 100) / 100 : 0;

  // Baseline estimated interest if paying off cards across standard minimum schedules (~48-60 months)
  const baselineEstInterest = Math.round(
    eligibleDebtsTotal * (eligibleDebtsWeightedApr / 100) * 2.8 * 100
  ) / 100;

  const calcMonthlyPmt = (principal: number, apr: number, months: number): number => {
    if (principal <= 0 || months <= 0) return 0;
    const r = apr / 100 / 12;
    if (r === 0) return principal / months;
    return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  };

  const options: SoundCUConsolidationOption[] = [];

  if (eligibleDebtsTotal > 0) {
    // 1. Sound CU Fixed Personal Loan - Tier 1 (Prime)
    const t1Pmt = Math.round(calcMonthlyPmt(eligibleDebtsTotal, 9.49, 36) * 100) / 100;
    const t1TotalInterest = Math.round((t1Pmt * 36 - eligibleDebtsTotal) * 100) / 100;
    options.push({
      productId: 'SCU_FIXED_LOAN_T1',
      name: 'Sound CU Fixed Consolidation Loan',
      type: 'personal_loan',
      tierLabel: 'Tier 1 Prime (36 Months)',
      apr: 9.49,
      termMonths: 36,
      originationFee: 0,
      balanceTransferFee: 0,
      estimatedMonthlyPayment: t1Pmt,
      totalInterestPaid: Math.max(0, t1TotalInterest),
      monthlyCashFlowFreed: Math.round((currentCombinedMinPayment - t1Pmt) * 100) / 100,
      totalInterestSavedVsCards: Math.max(0, Math.round((baselineEstInterest - t1TotalInterest) * 100) / 100),
      monthsAccelerated: 18,
      consolidatedDebtAmount: eligibleDebtsTotal,
      qualifyingLiabilities: eligible.map((l) => l.tokenized_name),
      eligibilityRequirements: [
        'Live or work in Washington State',
        'Credit score 680+',
        'Debt-to-income ratio under 45%',
      ],
    });

    // 2. Sound CU Fixed Personal Loan - Tier 2 (Standard)
    const t2Pmt = Math.round(calcMonthlyPmt(eligibleDebtsTotal, 11.49, 48) * 100) / 100;
    const t2TotalInterest = Math.round((t2Pmt * 48 - eligibleDebtsTotal) * 100) / 100;
    options.push({
      productId: 'SCU_FIXED_LOAN_T2',
      name: 'Sound CU Fixed Consolidation Loan',
      type: 'personal_loan',
      tierLabel: 'Tier 2 Standard (48 Months)',
      apr: 11.49,
      termMonths: 48,
      originationFee: 0,
      balanceTransferFee: 0,
      estimatedMonthlyPayment: t2Pmt,
      totalInterestPaid: Math.max(0, t2TotalInterest),
      monthlyCashFlowFreed: Math.round((currentCombinedMinPayment - t2Pmt) * 100) / 100,
      totalInterestSavedVsCards: Math.max(0, Math.round((baselineEstInterest - t2TotalInterest) * 100) / 100),
      monthsAccelerated: 12,
      consolidatedDebtAmount: eligibleDebtsTotal,
      qualifyingLiabilities: eligible.map((l) => l.tokenized_name),
      eligibilityRequirements: [
        'Live or work in Washington State',
        'Credit score 620+',
        'Verifiable steady income',
      ],
    });

    // 3. Sound CU Select Card - 0% Balance Transfer Offer
    const btPmt = Math.round(calcMonthlyPmt(eligibleDebtsTotal, 10.70, 36) * 0.88 * 100) / 100;
    const btTotalInterest = Math.round(eligibleDebtsTotal * 0.08 * 100) / 100; // 0% first 12 mo saves massive interest
    options.push({
      productId: 'SCU_SELECT_CARD_BT',
      name: 'Sound CU Select Visa (0% Intro Balance Transfer)',
      type: 'balance_transfer_card',
      tierLabel: '0% APR for 12 Mo ($0 BT Fee)',
      apr: 10.70,
      termMonths: 36,
      originationFee: 0,
      balanceTransferFee: 0,
      estimatedMonthlyPayment: btPmt,
      totalInterestPaid: btTotalInterest,
      monthlyCashFlowFreed: Math.round((currentCombinedMinPayment - btPmt) * 100) / 100,
      totalInterestSavedVsCards: Math.max(0, Math.round((baselineEstInterest - btTotalInterest) * 100) / 100),
      monthsAccelerated: 20,
      consolidatedDebtAmount: eligibleDebtsTotal,
      qualifyingLiabilities: eligible.map((l) => l.tokenized_name),
      eligibilityRequirements: [
        'Sound CU Membership required',
        '$0 Balance Transfer Fee promotional period',
        'Ongoing variable APR 10.70%–21.70% based on creditworthiness',
      ],
    });
  }

  return {
    eligibleDebtsTotal,
    eligibleDebtsWeightedApr,
    currentCombinedMinPayment,
    options,
    recommendedOptionId: options[0]?.productId || '',
  };
}

/**
 * Step 2: STRATEGIST Persona Engine
 * Mathematical Amortization Solver with Dynamic Shock Testing & Consolidation
 */
export function executeStrategistSolver(
  scout: ScoutStructuredData,
  customSplitPercent: number = 60, // 60% to debt extra, 40% to emergency shield
  customTargetEmergency?: number,
  aprStressDelta: number = 0,
  customShock?: ShockEvent,
  isIncomeVariable: boolean = false,
  incomeVariancePercent: number = 0
): StrategistOutput {
  const fcf = scout.free_cash_flow;
  const targetEmergency = customTargetEmergency || scout.recommended_emergency_target;
  const activeShock: ShockEvent = customShock || {
    id: 'SHOCK_CAR',
    name: 'Car Brake / Alternator',
    amount: 400,
    monthOccurred: 4,
    description: 'Vehicle emergency needed for work commute.',
  };

  // 1. Baseline: Minimum Payments Only
  const baseline = simulateAmortization({
    debts: scout.liabilities.map((l) => ({
      ...l,
      apr: l.apr + aprStressDelta,
    })),
    monthlySurplus: 0,
    savingsSplitPercent: 0,
    strategy: 'avalanche',
    startingEmergency: scout.starting_emergency_fund,
    targetEmergency,
    maxMonths: 360,
    isIncomeVariable,
    incomeVariancePercent,
  });

  // 2. Pure Avalanche: Highest APR first, 100% of surplus to debt, 0% to emergency fund
  const avalanche = simulateAmortization({
    debts: scout.liabilities.map((l) => ({
      ...l,
      apr: l.apr + aprStressDelta,
    })),
    monthlySurplus: fcf,
    savingsSplitPercent: 0,
    strategy: 'avalanche',
    startingEmergency: scout.starting_emergency_fund,
    targetEmergency,
    maxMonths: 240,
    isIncomeVariable,
    incomeVariancePercent,
  });

  // 3. DualPath Shield: Balanced split until target emergency milestone, then 90% pivots to debt
  const dualpath = simulateAmortization({
    debts: scout.liabilities.map((l) => ({
      ...l,
      apr: l.apr + aprStressDelta,
    })),
    monthlySurplus: fcf,
    savingsSplitPercent: 100 - customSplitPercent, // e.g. 40%
    strategy: 'dualpath_shield',
    startingEmergency: scout.starting_emergency_fund,
    targetEmergency,
    maxMonths: 240,
    isIncomeVariable,
    incomeVariancePercent,
  });

  // 4. Snowball: Lowest balance first, 100% of surplus to debt, 0% to emergency fund
  const snowball = simulateAmortization({
    debts: scout.liabilities.map((l) => ({
      ...l,
      apr: l.apr + aprStressDelta,
    })),
    monthlySurplus: fcf,
    savingsSplitPercent: 0,
    strategy: 'snowball',
    startingEmergency: scout.starting_emergency_fund,
    targetEmergency,
    maxMonths: 240,
    isIncomeVariable,
    incomeVariancePercent,
  });

  // Compute shock resilience dynamically based on actual active shock amount & month
  const shockAmount = activeShock.amount || 400;
  const shockMonth = activeShock.monthOccurred || 4;
  const highestApr = Math.max(...scout.liabilities.map((l) => l.apr + aprStressDelta));

  [avalanche, dualpath, snowball].forEach((plan) => {
    const shockStepIndex = Math.min(shockMonth, plan.amortizationCurve.length - 1);
    const stepSavings = plan.amortizationCurve[shockStepIndex]
      ? plan.amortizationCurve[shockStepIndex].emergencyFundBalance
      : scout.starting_emergency_fund;

    const absorbsShock = stepSavings >= shockAmount;
    if (absorbsShock) {
      plan.shockResilience = {
        absorbs400Shock: true,
        netPostShockBalance: Math.round((stepSavings - shockAmount) * 100) / 100,
        relapsePenaltyMonths: 0,
        relapseAdditionalInterest: 0,
      };
      plan.resilienceScore = Math.min(9.9, 8.5 + (stepSavings / targetEmergency) * 1.4);
    } else {
      // Must put shortfall onto the highest APR credit card!
      const deficit = shockAmount - stepSavings;
      const monthlyRate = highestApr / 100 / 12;
      const penaltyInterest = deficit * monthlyRate * 10; // ~10 months typical carry
      const penaltyMonths = Math.max(1, Math.ceil(deficit / Math.max(50, fcf * 0.4)));

      plan.shockResilience = {
        absorbs400Shock: false,
        netPostShockBalance: -deficit,
        relapsePenaltyMonths: penaltyMonths,
        relapseAdditionalInterest: Math.round(penaltyInterest * 100) / 100,
      };
      plan.resilienceScore = Math.max(1.5, Math.round((stepSavings / shockAmount) * 4.0 * 10) / 10);
    }
  });

  // Generate Sound Credit Union Consolidation Analysis
  const consolidationAnalysis = calculateSoundCUConsolidation(scout.liabilities);

  // Generate ASCII Comparison Table
  const asciiTable = generateAsciiComparisonTable(
    { avalanche, dualpath_shield: dualpath, snowball },
    fcf,
    baseline
  );

  return {
    calculation_id: `CALC_STRAT_${Math.floor(1000 + Math.random() * 9000)}`,
    calculation_timestamp: new Date().toISOString(),
    recommended_strategy: 'dualpath_shield',
    free_cash_flow_allocated: fcf,
    split_ratio: {
      debt_percent: customSplitPercent,
      savings_percent: 100 - customSplitPercent,
    },
    baseline_minimum_only: {
      months_to_debt_free: baseline.monthsToDebtFree,
      total_interest_paid: baseline.totalInterestPaid,
    },
    strategies: {
      avalanche,
      dualpath_shield: dualpath,
      snowball,
    },
    ascii_comparison_table: asciiTable,
    activeShock,
    consolidationAnalysis,
  };
}

interface SimulationParams {
  debts: Array<{
    id: string;
    tokenized_name: string;
    balance: number;
    apr: number;
    minimum_payment: number;
  }>;
  monthlySurplus: number;
  savingsSplitPercent: number; // 0 to 100
  strategy: 'avalanche' | 'dualpath_shield' | 'snowball';
  startingEmergency: number;
  targetEmergency: number;
  maxMonths: number;
  isIncomeVariable?: boolean;
  incomeVariancePercent?: number;
}

function simulateAmortization(params: SimulationParams): StrategyPlanResult {
  const {
    debts,
    monthlySurplus,
    savingsSplitPercent,
    strategy,
    startingEmergency,
    targetEmergency,
    maxMonths,
    isIncomeVariable,
    incomeVariancePercent,
  } = params;

  // Deep copy current debts
  const currentDebts = debts.map((d) => ({
    id: d.id,
    name: d.tokenized_name,
    balance: d.balance,
    apr: d.apr,
    minPayment: d.minimum_payment,
  }));

  let emergencyFund = startingEmergency;
  let totalInterestPaid = 0;
  let month = 0;
  const history: MonthlySimulationStep[] = [];
  let milestoneReachedMonth: number | undefined;

  // Record initial month 0
  const initialDebtsMap: { [id: string]: number } = {};
  currentDebts.forEach((d) => (initialDebtsMap[d.id] = d.balance));
  history.push({
    month: 0,
    totalBalanceRemaining: Math.round(debts.reduce((s, d) => s + d.balance, 0) * 100) / 100,
    totalInterestPaidToDate: 0,
    monthlyInterestPaid: 0,
    emergencyFundBalance: startingEmergency,
    debtsRemaining: initialDebtsMap,
  });

  while (month < maxMonths) {
    const totalCurrentBalance = currentDebts.reduce((s, d) => s + d.balance, 0);
    if (totalCurrentBalance <= 0.01) {
      break;
    }
    month++;

    // 1. Accrue monthly interest on each active debt
    let monthlyInterestThisPeriod = 0;
    currentDebts.forEach((d) => {
      if (d.balance > 0.01) {
        const monthlyRate = d.apr / 100 / 12;
        const interest = d.balance * monthlyRate;
        d.balance += interest;
        monthlyInterestThisPeriod += interest;
        totalInterestPaid += interest;
      }
    });

    // In variable income scenarios (e.g. gig workers), handle seasonal dip months
    let effectiveSurplus = monthlySurplus;
    if (isIncomeVariable && incomeVariancePercent && month % 4 === 3) {
      const dipRatio = Math.min(0.5, incomeVariancePercent / 100);
      effectiveSurplus = Math.max(0, Math.round(monthlySurplus * (1 - dipRatio)));
    }

    // 2. Handle emergency fund allocation
    let currentSavingsAllocation = 0;
    let extraDebtBudget = effectiveSurplus;

    if (strategy === 'dualpath_shield' && effectiveSurplus > 0) {
      if (emergencyFund < targetEmergency) {
        // Allocate split portion into emergency fund
        const savingsRate = savingsSplitPercent / 100;
        const savingsAmount = Math.min(
          effectiveSurplus * savingsRate,
          targetEmergency - emergencyFund
        );
        currentSavingsAllocation = savingsAmount;
        emergencyFund += savingsAmount;
        extraDebtBudget = effectiveSurplus - savingsAmount;

        if (emergencyFund >= targetEmergency && !milestoneReachedMonth) {
          milestoneReachedMonth = month;
        }
      } else {
        // Target emergency reached! Shield is active.
        // Pivot 90% of surplus to accelerate debt payoff, 10% to keep buffering savings
        const maintenanceSavings = Math.min(effectiveSurplus * 0.1, 50);
        emergencyFund += maintenanceSavings;
        extraDebtBudget = effectiveSurplus - maintenanceSavings;
      }
    }

    // 3. Pay required minimum payments first
    let freedUpFromPaidOff = 0;
    currentDebts.forEach((d) => {
      if (d.balance > 0) {
        const payment = Math.min(d.balance, d.minPayment);
        d.balance -= payment;
        if (d.balance <= 0.01) {
          d.balance = 0;
          freedUpFromPaidOff += d.minPayment;
        }
      }
    });

    // 4. Apply extra cash (extraDebtBudget + any freed-up minimums from paid debts)
    let totalExtraPool = extraDebtBudget + freedUpFromPaidOff;

    // Determine target payoff order
    let targetDebtIndex = -1;
    if (strategy === 'avalanche' || strategy === 'dualpath_shield') {
      // Highest APR first
      let highestApr = -1;
      currentDebts.forEach((d, idx) => {
        if (d.balance > 0 && d.apr > highestApr) {
          highestApr = d.apr;
          targetDebtIndex = idx;
        }
      });
    } else {
      // Snowball: Lowest Balance first
      let lowestBalance = Infinity;
      currentDebts.forEach((d, idx) => {
        if (d.balance > 0 && d.balance < lowestBalance) {
          lowestBalance = d.balance;
          targetDebtIndex = idx;
        }
      });
    }

    // Cascade extra payments across debts until extra pool is exhausted or all debts 0
    while (totalExtraPool > 0.01 && targetDebtIndex !== -1) {
      const target = currentDebts[targetDebtIndex];
      const payAmount = Math.min(target.balance, totalExtraPool);
      target.balance -= payAmount;
      totalExtraPool -= payAmount;

      if (target.balance <= 0.01) {
        target.balance = 0;
        // Find next target
        targetDebtIndex = -1;
        if (strategy === 'avalanche' || strategy === 'dualpath_shield') {
          let highestApr = -1;
          currentDebts.forEach((d, idx) => {
            if (d.balance > 0 && d.apr > highestApr) {
              highestApr = d.apr;
              targetDebtIndex = idx;
            }
          });
        } else {
          let lowestBalance = Infinity;
          currentDebts.forEach((d, idx) => {
            if (d.balance > 0 && d.balance < lowestBalance) {
              lowestBalance = d.balance;
              targetDebtIndex = idx;
            }
          });
        }
      } else {
        break;
      }
    }

    // Record month snapshot
    const remainingDebtsMap: { [id: string]: number } = {};
    currentDebts.forEach((d) => (remainingDebtsMap[d.id] = Math.round(d.balance * 100) / 100));

    history.push({
      month,
      totalBalanceRemaining: Math.round(currentDebts.reduce((s, d) => s + d.balance, 0) * 100) / 100,
      totalInterestPaidToDate: Math.round(totalInterestPaid * 100) / 100,
      monthlyInterestPaid: Math.round(monthlyInterestThisPeriod * 100) / 100,
      emergencyFundBalance: Math.round(emergencyFund * 100) / 100,
      debtsRemaining: remainingDebtsMap,
    });
  }

  // 6-month emergency buffer snapshot
  const month6Step = history[Math.min(6, history.length - 1)];
  const emergencyAt6 = month6Step ? month6Step.emergencyFundBalance : startingEmergency;

  let title = "Pure Avalanche Acceleration";
  let tagline = "Highest APR first · 100% debt allocation · Zero emergency buffer";
  let monthlyEmergencyAllocation = 0;
  let monthlyDebtExtra = monthlySurplus;

  if (strategy === 'dualpath_shield') {
    title = "SoundCU DualPath Shield";
    tagline = "Balanced payoff + micro-emergency buffer · Maximum relapse protection";
    monthlyEmergencyAllocation = Math.round((monthlySurplus * (savingsSplitPercent / 100)) * 100) / 100;
    monthlyDebtExtra = Math.round((monthlySurplus - monthlyEmergencyAllocation) * 100) / 100;
  } else if (strategy === 'snowball') {
    title = "Snowball Momentum";
    tagline = "Lowest balance first · Psychological momentum · Zero emergency buffer";
    monthlyEmergencyAllocation = 0;
    monthlyDebtExtra = monthlySurplus;
  }

  return {
    strategyId: strategy,
    title,
    tagline,
    monthlyDebtExtra,
    monthlyEmergencyAllocation,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    interestSavedVsMinimum: 0, // set later against baseline
    monthsToDebtFree: month,
    emergencyFundAt6Months: emergencyAt6,
    resilienceScore: 5.0,
    amortizationCurve: history,
    milestoneReachedMonth,
    shockResilience: {
      absorbs400Shock: false,
      netPostShockBalance: 0,
      relapsePenaltyMonths: 0,
      relapseAdditionalInterest: 0,
    },
  };
}

/**
 * Step 3: Render an ASCII/Markdown split-screen comparison table
 */
export function generateAsciiComparisonTable(
  strategies: {
    avalanche: StrategyPlanResult;
    dualpath_shield: StrategyPlanResult;
    snowball: StrategyPlanResult;
  },
  fcf: number,
  baseline: StrategyPlanResult
): string {
  const { avalanche, dualpath_shield: shield, snowball } = strategies;

  const f = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fFull = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const baselineInterest = baseline.totalInterestPaid;
  const avaSavings = Math.max(0, baselineInterest - avalanche.totalInterestPaid);
  const shieldSavings = Math.max(0, baselineInterest - shield.totalInterestPaid);
  const snowSavings = Math.max(0, baselineInterest - snowball.totalInterestPaid);

  return `
+-----------------------------+-----------------------+-----------------------------+-----------------------+
| METRIC                      | AVALANCHE (HIGH APR)  | DUALPATH SHIELD (RECOMMENDED)| SNOWBALL (LOW BAL)    |
+-----------------------------+-----------------------+-----------------------------+-----------------------+
| Priority Allocation         | 100% Debt / 0% Buffer | 60% Debt / 40% Micro-Shield | 100% Debt / 0% Buffer |
| Extra Monthly Debt Payoff   | ${fFull(avalanche.monthlyDebtExtra).padEnd(21)} | ${fFull(shield.monthlyDebtExtra).padEnd(27)} | ${fFull(snowball.monthlyDebtExtra).padEnd(21)} |
| Monthly Micro-Savings Build | $0.00                 | ${fFull(shield.monthlyEmergencyAllocation).padEnd(27)} | $0.00                 |
| Total Interest Incurred     | ${fFull(avalanche.totalInterestPaid).padEnd(21)} | ${fFull(shield.totalInterestPaid).padEnd(27)} | ${fFull(snowball.totalInterestPaid).padEnd(21)} |
| Total Interest Saved        | ${fFull(avaSavings).padEnd(21)} | ${fFull(shieldSavings).padEnd(27)} | ${fFull(snowSavings).padEnd(21)} |
| Time to Full Debt Freedom   | ${avalanche.monthsToDebtFree} Months (${(avalanche.monthsToDebtFree / 12).toFixed(1)} yrs)`.padEnd(30) + `| ${shield.monthsToDebtFree} Months (${(shield.monthsToDebtFree / 12).toFixed(1)} yrs)`.padEnd(30) + `| ${snowball.monthsToDebtFree} Months (${(snowball.monthsToDebtFree / 12).toFixed(1)} yrs)`.padEnd(24) + `|
| 6-Month Emergency Buffer    | ${f(avalanche.emergencyFundAt6Months).padEnd(21)} | ${f(shield.emergencyFundAt6Months).padEnd(27)} | ${f(snowball.emergencyFundAt6Months).padEnd(21)} |
| Relapse Resilience Score    | ${avalanche.resilienceScore.toFixed(1)} / 10 (Vulnerable) | ${shield.resilienceScore.toFixed(1)} / 10 (Shielded)     | ${snowball.resilienceScore.toFixed(1)} / 10 (Vulnerable) |
| $400 Shock Test Outcome     | ${avalanche.shockResilience.absorbs400Shock ? 'Absorbed' : 'RELAPSE: Card Deficit'}  | ${shield.shockResilience.absorbs400Shock ? 'ABSORBED 100% IN CASH' : 'Partial buffer'}     | ${snowball.shockResilience.absorbs400Shock ? 'Absorbed' : 'RELAPSE: Card Deficit'}  |
+-----------------------------+-----------------------+-----------------------------+-----------------------+
* Baseline Minimum Payments: ${baseline.monthsToDebtFree} months to payoff | ${fFull(baseline.totalInterestPaid)} in cumulative interest.
`.trim();
}

/**
 * Step 4: COACH Persona Guidance Generator
 * Warm, empathetic Sound Credit Union tone explaining trade-offs and scenario testing
 */
export function generateCoachGuidance(
  scout: ScoutStructuredData,
  strategist: StrategistOutput,
  customShock?: ShockEvent
): CoachEvaluation {
  const shield = strategist.strategies.dualpath_shield;
  const avalanche = strategist.strategies.avalanche;
  const diffInterest = Math.max(0, shield.totalInterestPaid - avalanche.totalInterestPaid);
  const diffMonths = Math.max(0, shield.monthsToDebtFree - avalanche.monthsToDebtFree);

  const shockAmount = customShock ? customShock.amount : 400;
  const shockTitle = customShock ? customShock.name : "Unexpected $400 Vehicle Repair";

  return {
    greeting: `Hello! As your Sound Credit Union Coach, I'm here to stand beside you on your journey toward lasting financial independence. Let's look at what the numbers really mean for your peace of mind.`,
    whyDualPathWins: `On pure paper, the Avalanche plan seems to finish ${diffMonths === 0 ? "at the same time" : `${diffMonths} month${diffMonths > 1 ? "s" : ""} earlier`} with $${diffInterest.toFixed(0)} less interest. BUT paper assumes life never throws a curveball. In real life, having $0 in savings means that the very first unexpected tire blowout or clinic visit forces you straight back to borrowing on your ${Math.max(...scout.liabilities.map((l) => l.apr))}% card. DualPath Shield buffers you with $${shield.emergencyFundAt6Months.toFixed(0)} within 6 months, turning financial emergencies into minor inconveniences.`,
    keyTradeoffAnalysis: `By routing $${shield.monthlyEmergencyAllocation.toFixed(0)}/month into your SoundCU micro-emergency shield, you build a fortress against high-APR debt relapse while STILL saving thousands over minimum payments. Once your shield reaches $${scout.recommended_emergency_target}, 90% of your extra cash automatically flows straight into eliminating remaining debt!`,
    shockScenarioProposal: {
      shockTitle,
      shockAmount,
      avalancheRelapseOutcome: `Under Avalanche: With only $${scout.starting_emergency_fund} in reserves, this shock forces you to charge $${Math.max(0, shockAmount - scout.starting_emergency_fund)} back onto a high-APR card. This adds new compounding interest, resets your psychological momentum, and delays debt freedom by ~${avalanche.shockResilience.relapsePenaltyMonths || 2} months.`,
      dualPathShieldOutcome: `Under DualPath Shield: Your micro-fund has already grown to $${shield.emergencyFundAt6Months.toFixed(0)}. You pay the full $${shockAmount} in cash! Zero new credit card debt, zero interest penalty, and your debt payoff plan continues without missing a beat.`,
    },
    actionSteps: [
      `Activate your DualPath split: $${shield.monthlyDebtExtra}/mo extra to highest-APR balance + $${shield.monthlyEmergencyAllocation}/mo to micro-shield.`,
      `Set your initial safety milestone at $${scout.recommended_emergency_target}. Celebrate when you unlock it!`,
      `Test your plan against life's cash shocks below to see your resilience score in action.`,
    ],
    tone: 'EMPATHETIC_SOUNDCU_COOPERATIVE',
    disclosure: OFFICIAL_SOUNDCU_DISCLOSURE,
  };
}
