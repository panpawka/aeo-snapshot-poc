# Product Requirements Document (PRD)

## AEO Snapshot Scorer & Explorer (Proof of Concept)

**Version:** v0.1 (Interview Prototype)
**Owner:** You
**Status:** Proposed

---

## 1. Overview

### Problem Statement

As AI answer engines increasingly replace traditional search, brands need lightweight ways to understand how they are perceived and surfaced by AI systems. Existing AEO reports are opaque, monolithic, and expensive.

This project explores a modular, AI-driven AEO snapshot tool that generates a structured, explainable overview of a brand's perceived positioning across multiple dimensions.

### Goal

Build a minimal, extensible proof of concept that:

- Accepts a brand name
- Generates an AEO-style snapshot using LLM reasoning
- Uses independent AI passes per section
- Supports multiple LLM providers via Vercel AI Gateway
- Prioritizes clarity, modularity, and explainability over accuracy

---

## 2. Non-Goals (Explicit)

This prototype will **not**:

- Perform real web crawling or scraping
- Provide statistically accurate scores
- Compete with commercial AEO tools
- Include authentication, persistence, or dashboards

The system intentionally uses LLM-simulated reasoning to model how AI answer engines might evaluate brands.

---

## 3. Target Users

- Internal engineering / product teams
- Interview reviewers evaluating system design and AI usage
- Future AEO tooling exploration

---

## 4. Functional Requirements

### 4.1 Input

- **Required:**
  - `brandName`: string
- **Optional (CLI / config):**
  - `enabledSections?`: string[]
  - `model?`: string (via Vercel AI Gateway)

### 4.2 Output

The tool must generate a structured snapshot containing:

- **Metadata:**
  - Brand name
  - Model used
  - Generation timestamp
- **Dynamic section outputs** (keyed by section ID)

Example (conceptual):

```json
{
  "brand": "Martus Solutions",
  "model": "gpt-4o",
  "generatedAt": "2026-01-29T10:15:00Z",
  "sections": {
    "brand_recognition": { ... },
    "sentiment": { ... },
    "market_competition": { ... }
  }
}
```

---

## 5. Section System (Core Concept)

### 5.1 Section Modularity

Each report section must be:

- Independently definable
- Independently executable
- Addable / removable without modifying core logic

### 5.2 Section Interface

Each section must define:

- `id`: unique identifier
- `title`: display name
- `prompt(brandName)`: generates a self-contained prompt
- `parse(response)`: transforms raw LLM output into structured data

Sections must **not** share conversational context.

---

## 6. Required Sections (v0.1)

| Section ID              | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `brand_recognition`     | AI-perceived visibility and recognition          |
| `market_competition`    | Competitive positioning and share-of-voice       |
| `sentiment`             | Overall sentiment and key drivers                |
| `strengths_weaknesses`  | Perceived pros and cons                          |
| `opportunities_threats` | Forward-looking SWOT-style analysis              |

Sections may return different schemas.

---

## 7. AI & Model Requirements

### 7.1 AI Gateway

- All LLM calls must go through Vercel AI Gateway
- The system must:
  - Accept a model identifier as a string
  - Use a single unified `generateText()` method
  - Remain agnostic to underlying model providers

### 7.2 Model Configuration

The system must support:

- Default model (e.g. `gpt-4o`)
- Override via CLI or config
- Future per-section model assignment (out of scope for v0.1)

---

## 8. AI Execution Strategy

### Design Principle

> One AI call per section, no shared context.

### Rationale

- Prevents prompt bloat
- Improves determinism
- Enables caching and retries
- Mirrors real-world LLM pipelines
- Makes long reports feasible

---

## 9. Snapshot Assembly Flow

1. User provides brand name
2. Enabled sections are resolved
3. Each section:
   - Generates its prompt
   - Calls `generateText()` via AI Gateway
   - Parses its response
4. Results are aggregated into a final snapshot object
5. Snapshot is rendered (CLI / JSON / markdown)

---

## 10. Configuration

### Section Configuration

- Sections should be selectable via:
  - Code config
  - CLI flags (future)

### Model Configuration

- Global model selection via:
  - Environment variable
  - CLI argument

---

## 11. Error Handling

- If a section fails:
  - Failure should be isolated
  - Snapshot generation should continue
- Errors should be:
  - Logged
  - Reflected in output as section-level errors

---

## 12. Quality Attributes

### Maintainability

- Clear separation of concerns
- No hard-coded report structure

### Extensibility

- New sections require:
  - One new file
  - No changes to orchestration logic

### Explainability

- Prompts are explicit
- Outputs are structured
- Scores are justified in text

---

## 13. Example Success Criteria

The prototype is considered successful if:

- A developer can add a new section in <10 minutes
- The tool runs end-to-end with multiple sections
- The output resembles an AEO report structurally
- The reasoning and design can be clearly explained in an interview

---

## 14. Future Enhancements (Out of Scope)

- Multi-engine comparison (ChatGPT vs Gemini)
- Historical snapshots
- Real data grounding
- Visualization layer
- Prompt versioning
- Caching layer

---

## 15. Summary

This project demonstrates:

- Translating an ambiguous problem into a composable system
- Using LLMs as reasoning engines, not data sources
- Designing AI-first pipelines with modularity and scale in mind
- Making practical engineering tradeoffs under time constraints
