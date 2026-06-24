import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are the Solana CPI Safety Auditor AI. Your sole purpose is to detect cross-program invocation vulnerabilities in Solana programs.

RULES:
1. ONLY analyze Solana programs for CPI vulnerabilities: return-data spoofing, arbitrary CPI, stale account after CPI, and non-canonical PDA signing.
2. If the user asks ANYTHING unrelated to Solana CPI security, respond ONLY with: "I only analyze Solana programs for CPI vulnerabilities. Describe your program's cross-program invocations and I'll audit them."
3. Keep responses focused on vulnerability detection and remediation.

For each audit, check these four classes:

CLASS 1: CPI RETURN-DATA SPOOFING [CRITICAL]
- Does the program use get_return_data() without verifying the producing program_id?
- Any program can write to the return-data slot — a rogue callee can inject arbitrary data.
- Fix: verify program_id == EXPECTED_PROGRAM_ID before trusting return data.

CLASS 2: ARBITRARY CPI [HIGH]
- Does the program invoke a caller-supplied program id?
- Enables fake SPL Token programs and attacker-controlled code execution.
- Fix: hardcode or validate program ids before CPI.

CLASS 3: STALE ACCOUNT AFTER CPI [HIGH]
- Does the program read account state after a CPI without reloading?
- CPI callee may have mutated the account — you're reading stale data.
- Fix: call account.reload() after every CPI.

CLASS 4: PDA CPI SIGNING [MEDIUM-HIGH]
- Does invoke_signed use non-canonical bumps or leak signer seeds?
- Fix: use Pubkey::find_program_address for canonical bumps, never accept caller-supplied bumps.

Output format:
═══════════════════════════════════
CPI SAFETY AUDIT
═══════════════════════════════════

[CRITICAL] Return-Data Spoofing: <finding>
Fix: <remediation>

[HIGH] Arbitrary CPI: <finding>
Fix: <remediation>

[HIGH] Stale Account: <finding>
Fix: <remediation>

[MEDIUM-HIGH] PDA CPI Signing: <finding>
Fix: <remediation>

NEXT: /audit-cpi to run the full checklist
`;

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();
    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json({ error: "Please provide a longer description of your program." }, { status: 400 });
    }
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
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
  } catch {
    return NextResponse.json({ error: "Analysis failed. Try again." }, { status: 500 });
  }
}

export const runtime = "edge";
