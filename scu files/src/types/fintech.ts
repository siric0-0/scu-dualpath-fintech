export interface Liability {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minimumPayment: number;
  accountNumberMasked?: string;
  category?: 'credit_card' | 'student_loan' | 'personal_loan' | 'auto_loan' | 'other';
}

export interface MemberFinancialProfile {
  rawName?: string;
  memberToken: string;
  monthlyNetIncome: number;
  isIncomeVariable?: boolean;
  incomeVariancePercent?: number;
  livingExpenses: number;
  startingEmergencyFund: number;
  liabilities: Liability[];
  targetEmergencyFund?: number;
}

export interface ScoutStructuredData {
  member_token: string;
  audit_timestamp: string;
  monthly_net_income: number;
  income_type: 'STABLE_W2' | 'VARIABLE_GIG' | 'EARLY_CAREER';
  living_expenses: number;
  total_debt_balance: number;
  total_minimum_payments: number;
  free_cash_flow: number;
  solvency_status: 'HEALTHY_SURPLUS' | 'TIGHT_MARGIN' | 'CASH_DEFICIT';
  starting_emergency_fund: number;
  recommended_emergency_target: number;
  liabilities: Array<{
    id: string;
    tokenized_name: string;
    balance: number;
    apr: number;
    minimum_payment: number;
    monthly_interest_cost: number;
    category: string;
  }>;
  compliance_flags: {
    pii_tokenized: boolean;
    educational_disclosure_required: boolean;
    usury_apr_warning: boolean;
  };
}

export interface MonthlySimulationStep {
  month: number;
  totalBalanceRemaining: number;
  totalInterestPaidToDate: number;
  monthlyInterestPaid: number;
  emergencyFundBalance: number;
  debtsRemaining: { [id: string]: number };
}

export interface StrategyPlanResult {
  strategyId: 'avalanche' | 'dualpath_shield' | 'snowball';
  title: string;
  tagline: string;
  monthlyDebtExtra: number;
  monthlyEmergencyAllocation: number;
  totalInterestPaid: number;
  interestSavedVsMinimum: number;
  monthsToDebtFree: number;
  emergencyFundAt6Months: number;
  resilienceScore: number; // 1.0 to 10.0
  amortizationCurve: MonthlySimulationStep[];
  milestoneReachedMonth?: number;
  shockResilience: {
    absorbs400Shock: boolean;
    netPostShockBalance: number;
    relapsePenaltyMonths: number;
    relapseAdditionalInterest: number;
  };
}

export interface StrategistOutput {
  calculation_id: string;
  calculation_timestamp: string;
  recommended_strategy: 'dualpath_shield';
  free_cash_flow_allocated: number;
  split_ratio: {
    debt_percent: number;
    savings_percent: number;
  };
  baseline_minimum_only: {
    months_to_debt_free: number;
    total_interest_paid: number;
  };
  strategies: {
    avalanche: StrategyPlanResult;
    dualpath_shield: StrategyPlanResult;
    snowball: StrategyPlanResult;
  };
  ascii_comparison_table: string;
}

export interface CoachEvaluation {
  greeting: string;
  whyDualPathWins: string;
  keyTradeoffAnalysis: string;
  shockScenarioProposal: {
    shockTitle: string;
    shockAmount: number;
    avalancheRelapseOutcome: string;
    dualPathShieldOutcome: string;
  };
  actionSteps: string[];
  tone: 'EMPATHETIC_SOUNDCU_COOPERATIVE';
  disclosure: string;
}

export interface ShockEvent {
  id: string;
  name: string;
  amount: number;
  monthOccurred: number; // e.g. Month 4
  description: string;
  category?: 'vehicle' | 'medical' | 'income_disruption' | 'home_repair' | 'custom';
}

export interface SoundCUConsolidationOption {
  productId: string;
  name: string;
  type: 'personal_loan' | 'balance_transfer_card';
  tierLabel: string;
  apr: number;
  termMonths: number;
  originationFee: number; // $0 for Sound CU
  balanceTransferFee: number; // $0 for Sound CU
  estimatedMonthlyPayment: number;
  totalInterestPaid: number;
  monthlyCashFlowFreed: number;
  totalInterestSavedVsCards: number;
  monthsAccelerated: number;
  consolidatedDebtAmount: number;
  qualifyingLiabilities: string[];
  eligibilityRequirements: string[];
}

export interface ConsolidationAnalysis {
  eligibleDebtsTotal: number;
  eligibleDebtsWeightedApr: number;
  currentCombinedMinPayment: number;
  options: SoundCUConsolidationOption[];
  recommendedOptionId: string;
}

export interface StrategistOutput {
  calculation_id: string;
  calculation_timestamp: string;
  recommended_strategy: 'dualpath_shield';
  free_cash_flow_allocated: number;
  split_ratio: {
    debt_percent: number;
    savings_percent: number;
  };
  baseline_minimum_only: {
    months_to_debt_free: number;
    total_interest_paid: number;
  };
  strategies: {
    avalanche: StrategyPlanResult;
    dualpath_shield: StrategyPlanResult;
    snowball: StrategyPlanResult;
  };
  ascii_comparison_table: string;
  activeShock?: ShockEvent;
  consolidationAnalysis?: ConsolidationAnalysis;
}
