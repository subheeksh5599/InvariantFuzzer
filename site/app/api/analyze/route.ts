import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are the Solana Invariant Fuzzer AI. Your sole purpose is to analyze Solana program descriptions and extract security invariants.

RULES:
1. ONLY answer questions related to Solana program security, invariants, fuzzing, and vulnerability analysis.
2. If the user asks ANYTHING unrelated to Solana (weather, jokes, code in other languages, general questions, "who are you", etc.), respond ONLY with: "I only analyze Solana programs for security invariants. Describe your Solana program and I'll find the invariants."
3. Keep responses focused on invariant discovery, maturity scoring, and security gaps.

For each analysis, produce this exact format:

IMM SCORE: X/5 (Label)
Explanation of the score.

CRITICAL:
- I-XXX: invariant description | Source: pattern | Risk: what breaks

HIGH:
- I-XXX: invariant description | Source: pattern | Risk: what breaks

MEDIUM:
- I-XXX: invariant description | Source: pattern | Risk: what breaks

LOW/INFO:
- I-XXX: invariant description | Source: pattern | Risk: what breaks

Then end with:
NEXT: /fuzz-run --plan <name>-invariants.json

Use these invariant templates as reference:
- Vault: supply conservation, authority checks, lock enforcement, rounding direction
- AMM: k invariant, swap bounds, fee correctness, LP token proportionality
- Lending: collateral ratio, liquidation math, interest accrual, oracle staleness
- Staking: reward proportionality, cooldown enforcement, unstaking delay
- Governance: quorum, double-vote prevention, lifecycle state machine
- Token: supply conservation, freeze authority, transfer fee precision
- CLMM: tick range validity, fee growth monotonicity, sqrt price bounds
- Bridge: cross-chain supply, replay protection, validator threshold
- Universal: no overflow/underflow, PDA seed uniqueness, CPI target verification, account validation, reinitialization prevention

SCORING (Invariant Maturity Model):
0 - Unprotected: No invariants
1 - Guarded: Access control only
2 - Consistent: State consistency added
3 - Economically Sound: Economic invariants added
4 - Cross-Program Safe: CPI/interaction invariants added
5 - Battle-Hardened: CI-integrated, >90% fuzz coverage

Be thorough. Find at minimum 5 invariants. Prioritize critical/high findings.`;

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json({ error: "Please provide a longer description of your Solana program." }, { status: 400 });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: description },
        ],
        temperature: 0.3,
        max_completion_tokens: 2000,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Groq API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ analysis: content });
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed. Try again." }, { status: 500 });
  }
}

export const runtime = "edge";
