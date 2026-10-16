import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  executeScoutAudit,
  executeStrategistSolver,
  generateCoachGuidance,
  OFFICIAL_SOUNDCU_DISCLOSURE,
} from './src/utils/amortization';
import { MemberFinancialProfile, ShockEvent } from './src/types/fintech';

dotenv.config({ path: ['.env.local', '.env'] });

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Production Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Initialize Gemini client on server if key is present
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const llmProvider = process.env.LLM_PROVIDER || 'gemini';

const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    institution: 'Sound Credit Union',
    engine: 'DualPath Fintech Engine',
    hasGeminiKey: Boolean(geminiApiKey),
    provider: llmProvider,
    model: geminiModel,
  });
});

// Step 1 & 2 & 3 & 4 full execution pipeline
app.post('/api/run-pipeline', async (req, res) => {
  try {
    const { profile, customSplitPercent = 60, targetEmergency, aprStressDelta = 0, shockEvent } = req.body as {
      profile: MemberFinancialProfile;
      customSplitPercent?: number;
      targetEmergency?: number;
      aprStressDelta?: number;
      shockEvent?: ShockEvent;
    };

    if (!profile || typeof profile.monthlyNetIncome !== 'number' || profile.monthlyNetIncome <= 0) {
      return res.status(400).json({ error: 'Valid member financial profile with monthlyNetIncome > 0 is required' });
    }

    if (!Array.isArray(profile.liabilities)) {
      return res.status(400).json({ error: 'Member liabilities must be an array' });
    }

    // Step 1: SCOUT Audit & Tokenization
    const scoutOutput = executeScoutAudit(profile);

    // Step 2 & 3: STRATEGIST Solver & ASCII Matrix
    const strategistOutput = executeStrategistSolver(
       scoutOutput,
       customSplitPercent,
       targetEmergency,
       aprStressDelta,
       shockEvent,
       profile.isIncomeVariable,
       profile.incomeVariancePercent
     );

    // Step 4: COACH Guidance (Base algorithmic)
    const baseCoach = generateCoachGuidance(scoutOutput, strategistOutput, shockEvent);

    // If Gemini is available, enhance with personalized coach commentary
    let personalizedCoachText: string | null = null;
    if (ai) {
      try {
        const consolidationInfo =
          strategistOutput.consolidationAnalysis &&
          strategistOutput.consolidationAnalysis.eligibleDebtsTotal > 0
            ? `\nSOUND CU CONSOLIDATION OPPORTUNITY:
- Eligible High-APR Debt to Consolidate: $${strategistOutput.consolidationAnalysis.eligibleDebtsTotal} (avg ${strategistOutput.consolidationAnalysis.eligibleDebtsWeightedApr}% APR).
- Sound CU Personal Loan Option: $${strategistOutput.consolidationAnalysis.options[0]?.estimatedMonthlyPayment}/mo at ${strategistOutput.consolidationAnalysis.options[0]?.apr}% APR (Estimated interest saved: $${strategistOutput.consolidationAnalysis.options[0]?.totalInterestSavedVsCards}).`
            : '';

        const coachPrompt = `You are the Sound Credit Union [COACH], an empathetic, non-judgmental credit union financial coach in the Pacific Northwest.
Member Token: ${scoutOutput.member_token}
Monthly Net Income: $${scoutOutput.monthly_net_income}
Income Type: ${scoutOutput.income_type}
Free Cash Flow: $${scoutOutput.free_cash_flow}/mo
Debts: ${scoutOutput.liabilities.map((l) => `${l.tokenized_name} ($${l.balance} at ${l.apr}% APR)`).join(', ')}
${consolidationInfo}

STRATEGY COMPARISON:
- Pure Avalanche: ${strategistOutput.strategies.avalanche.monthsToDebtFree} months to debt free, $${strategistOutput.strategies.avalanche.totalInterestPaid} total interest, $${strategistOutput.strategies.avalanche.emergencyFundAt6Months} buffer at Month 6.
- SoundCU DualPath Shield: ${strategistOutput.strategies.dualpath_shield.monthsToDebtFree} months to debt free, $${strategistOutput.strategies.dualpath_shield.totalInterestPaid} total interest, $${strategistOutput.strategies.dualpath_shield.emergencyFundAt6Months} buffer at Month 6.
- Snowball: ${strategistOutput.strategies.snowball.monthsToDebtFree} months to debt free, $${strategistOutput.strategies.snowball.totalInterestPaid} total interest.

SHOCK TEST: A $${shockEvent?.amount || 400} emergency (${shockEvent?.name || 'unexpected car repair'}).
Avalanche absorbs? ${strategistOutput.strategies.avalanche.shockResilience.absorbs400Shock ? 'Yes' : 'NO - forces member back into high-APR credit card debt!'}
DualPath absorbs? ${strategistOutput.strategies.dualpath_shield.shockResilience.absorbs400Shock ? 'YES - absorbed 100% in cash from micro-shield!' : 'Partial buffer'}

Write a 2-3 paragraph supportive SoundCU Coach message to this member.
Paragraph 1: Warm SoundCU cooperative welcome acknowledging their hard work and validating their current debt stress.
Paragraph 2: Explain why DualPath Shield is superior in REAL LIFE compared to the paper Avalanche method, specifically walking through the $${shockEvent?.amount || 400} emergency scenario and how having this micro-fund prevents relapsing into predatory credit cards. Mention Sound CU consolidation if applicable.
Paragraph 3: Give them one concrete encouraging next step for this week.
Keep it grounded, warm, conversational, and cite the exact numbers above. Do not use generic buzzwords.`;

        const geminiRes = await ai.models.generateContent({
          model: geminiModel,
          contents: coachPrompt,
        });

        if (geminiRes.text) {
          personalizedCoachText = geminiRes.text;
        }
      } catch (geminiError) {
        console.warn('Gemini AI generation error (falling back to deterministic coach):', geminiError);
      }
    }

    res.json({
      scout: scoutOutput,
      strategist: strategistOutput,
      coach: {
        ...baseCoach,
        aiPersonalizedNote: personalizedCoachText,
      },
      disclosure: OFFICIAL_SOUNDCU_DISCLOSURE,
    });
  } catch (error) {
    console.error('Pipeline error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Interactive Coach Conversation endpoint
app.post('/api/coach-chat', async (req, res) => {
  try {
    const { message, scout, strategist, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'User message is required' });
    }

    if (ai) {
      try {
        const shield = strategist?.strategies?.dualpath_shield;
        const avalanche = strategist?.strategies?.avalanche;

        const systemPrompt = `You are the Sound Credit Union [COACH], a caring, knowledgeable credit union financial educator.
You are helping Member ${scout?.member_token || 'SCU_MEMBER'}.
Financial Context:
- Net Income: $${scout?.monthly_net_income || 3000}/mo
- Free Cash Flow: $${scout?.free_cash_flow || 300}/mo
- DualPath Micro-Emergency Shield Target: $${scout?.recommended_emergency_target || 500}
- Current Split: $${shield?.monthlyDebtExtra || 200}/mo to debt, $${shield?.monthlyEmergencyAllocation || 100}/mo to micro-savings
- Avalanche: ${avalanche?.monthsToDebtFree || 24} mos, $${avalanche?.totalInterestPaid || 1500} interest
- DualPath: ${shield?.monthsToDebtFree || 26} mos, $${shield?.totalInterestPaid || 1650} interest, $${shield?.emergencyFundAt6Months || 600} emergency fund buffer

Rules:
1. Speak in a warm, encouraging, Sound Credit Union member-first cooperative voice.
2. Emphasize that "math on paper" fails when real-life emergencies happen ($300-$500 shocks).
3. DualPath protects the member's psychological stamina and prevents the credit card relapse spiral.
4. Keep answers concise, actionable, and mathematically accurate based on their profile.
5. Educational purposes only.`;

        const prompt = `${systemPrompt}\n\nUser Question: ${message}`;
        const response = await ai.models.generateContent({
          model: geminiModel,
          contents: prompt,
        });

        return res.json({
          reply: response.text || 'As your SoundCU Coach, I am here to help you stay protected and debt-free.',
          source: 'gemini',
        });
      } catch (err) {
        console.warn('Gemini chat error, using fallback:', err);
      }
    }

    // High quality deterministic SoundCU Coach reply
    const lower = (message as string).toLowerCase();
    let reply = `That is a thoughtful question! At Sound Credit Union, we know that the biggest obstacle to getting out of debt isn't the interest rate—it's the unexpected emergencies that derail your progress.`;

    if (lower.includes('avalanche') || lower.includes('interest') || lower.includes('faster')) {
      reply = `Mathematically, the Avalanche plan pays the least interest if everything goes perfectly. But our SoundCU member data shows life rarely goes perfectly! If a $350 car alternator breaks in month 3 and you have $0 in savings, you have to swipe your high-APR card again. That breaks your momentum. DualPath Shield only adds a couple of weeks to your timeline, but gives you an ironclad emergency shield so you never borrow again.`;
    } else if (lower.includes('snowball') || lower.includes('lowest balance')) {
      reply = `The Snowball method is great for psychological motivation by knocking out smaller balances first. However, like Avalanche, it leaves you with $0 in liquid cash. DualPath Shield takes the best of both worlds: we target your highest-rate debt while simultaneously building your $500–$1,000 micro-emergency fund.`;
    } else if (lower.includes('shock') || lower.includes('emergency') || lower.includes('car') || lower.includes('medical')) {
      reply = `When a financial shock hits, it can feel like taking two steps forward and three steps back. With DualPath, by Month 4 you have accumulated real cash reserves. You write a check or transfer from your SoundCU micro-savings account, pay the bill, and your debt payoff plan continues unbroken.`;
    } else if (lower.includes('how much') || lower.includes('split') || lower.includes('change')) {
      reply = `You can easily adjust the allocation slider right in the dashboard! A 60% debt / 40% micro-savings split is our standard recommendation, but you can tailor it to fit your comfort level. Once your micro-savings hits your milestone, our system automatically routes 90% straight to your remaining loans.`;
    }

    res.json({
      reply,
      source: 'soundcu_coach_engine',
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sound Credit Union DualPath Fintech Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
