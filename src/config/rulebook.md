# 🧠 PromptBrain Backend Rulebook (Vanilla Logic)

1. Core Philosophy

Every raw prompt = incomplete instruction.

Backend logic = fill the gaps systematically using rules + frameworks.

Output must be CRISP: Clarity, Relevance, Intent alignment, Specificity, Precision.

No randomness → Always structured, predictable improvement.

2. Enhancement Pipeline
Raw Prompt → Context Expansion → Domain Detection → Framework Mapping → Enhancement → CRISP Validation → Final Output

3. Context Expansion

Whenever input is vague or underspecified, automatically enrich with:

Role: Who is speaking? (teacher, marketer, coder, strategist, explainer)

Task: What’s the user really asking for? (summary, code, pitch, essay, plan)

Audience: Who is this meant for? (students, customers, devs, investors)

Constraints: Tone, format, length, perspective.

Examples: Add one illustrative example to ground the AI.

4. Domain Detection

Classifier routes prompt into buckets:

Research / Knowledge → STAR, CRISP, SERP

Marketing / Persuasion → AIDA, PAS, FAB

Strategy / Planning → OSCAR, RASCE

Explainer / Education → IEEI, STAR-simplified

Creative Ideation → SCAMPER, lateral patterns

Coding / Technical → RTF, stepwise RASCE

5. Framework Mapping

Each domain enforces a structure:

Marketing → AIDA (hook → build interest → create desire → call-to-action)

Research → STAR (Situation → Task → Action → Result)

Strategy → RASCE (Role → Action → Steps → Constraints → Evaluation)

Explainer → IEEI (Involve → Explain → Example → Involve again)

Coding → RTF (Role → Task → Format, with explicit syntax rules)

Creative → SCAMPER (Substitute, Combine, Adapt, Modify, Put to use, Eliminate, Reverse)

6. Enhancement Rules

If missing context → Insert defaults based on domain.

If prompt is too broad → Narrow scope (timeframe, audience, purpose).

If prompt is too short → Expand with task clarity + role + output format.

If prompt is too long/unfocused → Split into modular sub-prompts.

Always add actionability → “Do this step-by-step” or “Produce X in Y format.”

7. CRISP Validation Layer

Before sending back, every enhanced prompt must pass:

Clarity → No vague phrases (“something,” “good,” “better”).

Relevance → Directly tied to user’s goal.

Intent alignment → Matches task type (ad copy ≠ essay tone).

Specificity → Concrete details (audience, style, constraints).

Precision → Output format enforced (bullets, JSON, table, etc.).

8. Output Standard

Two Formats Returned:

Natural English prompt (human-friendly).

JSON prompt object (machine-readable, reusable).

Example JSON:

{
  "role": "Marketing strategist",
  "task": "Write ad copy for coffee brand",
  "audience": "Urban professionals 25–35",
  "framework": "AIDA",
  "format": "3 variations, each under 50 words",
  "constraints": "Casual, witty tone",
  "example": "Start with a hook about 'Monday mornings'"
}

9. Golden Rules (Backend)

Never return “as is” raw text → always structured.

Every enhancement adds context + structure + clarity.

The same raw input → always produces the same structured upgrade.

User can trust the machine: Predictable > Creative guessing.
