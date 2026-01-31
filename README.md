# AEO Snapshot Scorer + Explorer

A Proof of Concept (PoC) tool to evaluate a brand's positioning in the age of "Answer Engine Optimization" (AEO). This utility generates AI-driven reports similar to traditional SEO audits but tailored for LLM-based answer engines (e.g., ChatGPT, Perplexity, Gemini).

## Objective

Build a tool that takes a brand name, supports querying multiple LLMs via a unified gateway, and produces a structured "AEO Snapshot" covering:

- **Brand Recognition**
- **Market Competition**
- **Sentiment Analysis**
- **Strengths, Weaknesses, Opportunities, & Threats (SWOT)**

The goal was to demonstrate how to translate an ambiguous brief into a functioning, modular, and resilient application using modern AI engineering practices.

## Architecture & Implementation

### 1. Modular "Section" Design

The core logic is built around the concept of independent **Sections** (`src/lib/sections`).

- Each section (e.g., `sentiment`, `brand_recognition`) is a self-contained module exporting:
  - A unique `id` and `title`.
  - A `prompt(brandName)` function to generate the specific LLM prompt.
  - A `Zod` schema to strictly validate the structured output.
- **Why?** This allows sections to be added, removed, or modified without touching the core orchestration logic. It effectively decouples the "content" of the report from the "engine."

### 2. Resilient Orchestration

The **Orchestrator** (`src/lib/snapshot/orchestrator.ts`) manages the data fetching process:

- **Parallel Execution**: All selected sections run concurrently using `Promise.all` to minimize latency. This design allows future extensions such as per-section retries, rate-limit backoff, or model-specific routing without refactoring the pipeline.
- **Failure Isolation**: Each section execution is wrapped in a try-catch block. If one section fails (e.g., strict schema validation fails or API timeout), it returns an error state _only for that section_, allowing the rest of the report to succeed.

### 3. AI Gateway Pattern

The AI interaction is abstracted through a **Gateway** (`src/lib/ai/gateway.ts`) using the Vercel AI SDK:

- It unifies different providers (OpenAI, Anthropic, Google, Perplexity) under a single interface (`generateStructured`).
- It enforces strict JSON output using the Zod schemas defined in the sections, ensuring the frontend never crashes due to malformed LLM responses.

### 4. Client-Side PDF Generation

PDF generation is included as a lightweight presentation layer to mirror how AEO reports are commonly consumed, but it is intentionally decoupled from the core snapshot engine. PDF reports are generated entirely client-side using `@react-pdf/renderer`:

- **Dynamic Layout**: The PDF adapts its orientation (Portrait vs. Landscape) based on the number of models being compared to optimize readability.
- **Preview & Download**: Users can preview the PDF in real-time within the app before downloading.

## Design Decisions & Trade-offs

- **Strict Schema Validation vs. Flexibility**:
  - _Decision_: Enforced strict Zod validation for all LLM outputs.
  - _Trade-off_: Occasional generation failures if the LLM "hallucinates" the wrong format.
  - _Mitigation_: The Orchestrator treats these as isolated section errors rather than crashing the whole request.

- **Client-Side vs. Server-Side Execution**:
  - _Decision_: Kept the orchestration stateless. State is managed in the client (`page.tsx`), and the API is a simple pass-through for the AI calls.
  - _Reasoning_: Simplicity and scalability for a PoC. No database was required for this MVP, but one could easily be added to persist snapshots.

## Future Improvements

1. **Retry Logic**: Implement automatic retries for failed sections, perhaps with a "healing" prompt that feeds the validation error back to the LLM.
2. **Streaming UI**: Currently, the UI waits for section completion. Streaming distinct parts of the JSON response could make the tool feel faster.
3. **Caching**: Cache results for frequent brand queries to save on token costs and improve speed.
4. **Visualizations**: Use a charting library (like Recharts) for more dynamic rendering of the numerical scores in the "Detailed" view.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **AI Integration**: Vercel AI SDK + Zod
- **PDF Generation**: @react-pdf/renderer
- **Styling**: Inline styles / CSS Variables (kept simple for portability)

## API Integration

The system exposes a RESTful endpoint designed for seamless integration with automation platforms like **Zapier**, **n8n**, or **Make.com**. The API surface is intentionally minimal, designed to demonstrate how the
snapshot engine could be embedded into larger automation workflows.

- **Endpoint**: `POST /api/snapshot`
- **Payload**:
  ```json
  {
    "brandName": "BrandName",
    "models": ["openai/gpt-4o-mini", "google/gemini-3-flash"],
    "enabledSections": ["brand_recognition", "market_competition"]
  }
  ```
- **Response**: Returns a structured JSON object containing the snapshot data for all requested models.

## Quality Attributes

### Maintainability

- **Clear separation of concerns**: Logic is split into modular sections, orchestration, and presentation layers.
- **No hard-coded report structure**: The report composition is dynamic based on enabled sections.
- **Extensibility**:
  - **New sections require**:
    - One new file in `src/lib/sections/`.
    - **No changes** to orchestration logic.

### Explainability

- **Prompts are explicit**: Each section has its own dedicated prompt generator.
- **Outputs are structured**: Enforced via Zod schemas.
- **Scores are justified in text**: The AI is instructed to provide reasoning alongside numerical scores.

## Non-Goals

This PoC intentionally does NOT:

- Attempt to provide objectively accurate AEO scores
- Perform real web crawling or data aggregation
- Replace commercial AEO or SEO tooling

All scores and insights are LLM-synthesized and intended to model how
answer engines might reason about brand positioning.
