"use client";

import { useState } from "react";
import { allSections } from "@/lib/sections";

import { z } from "zod";

interface SnapshotFormProps {
  onSubmit: (brandName: string, models: string[], sections: string[]) => void;
  loading: boolean;
}

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  models: z.array(z.string()).min(1, "Select at least one model"),
  sections: z.array(z.string()).min(1, "Select at least one section"),
});

export function SnapshotForm({ onSubmit, loading }: SnapshotFormProps) {
  const [brandName, setBrandName] = useState("");
  const [models, setModels] = useState<string[]>(["gpt-4o-mini"]);
  const [enabledSections, setEnabledSections] = useState<string[]>(
    allSections.map((s) => s.id),
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function toggleSection(id: string) {
    setEnabledSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = formSchema.safeParse({
      brandName: brandName.trim(),
      models,
      sections: enabledSections,
    });

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      const zodError = result.error;
      zodError.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(brandName.trim(), models, enabledSections);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label
          htmlFor="brandName"
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          Brand Name
        </label>
        <input
          id="brandName"
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="e.g. Martus Solutions"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: "var(--card)",
            border: `1px solid ${errors.brandName ? "var(--error)" : "var(--border)"}`,
            borderRadius: "8px",
            color: "var(--fg)",
            fontSize: "1rem",
          }}
        />
        {errors.brandName && (
          <span
            style={{
              color: "var(--error)",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
              display: "block",
            }}>
            {errors.brandName}
          </span>
        )}
      </div>

      <div>
        <label
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          Models
        </label>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {[
            { id: "gpt-4o-mini", name: "GPT-4o Mini (OpenAI)" },
            { id: "claude-haiku-4.5", name: "Claude Haiku 4.5 (Anthropic)" },
            { id: "sonar", name: "Sonar (Perplexity)" },
            { id: "gemini-3-flash", name: "Gemini 3 Flash (Google)" },
          ].map((m) => (
            <label
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                background: "var(--card)",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid var(--border)",
              }}>
              <input
                type="checkbox"
                checked={models.includes(m.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setModels((prev) => [...prev, m.id]);
                  } else {
                    setModels((prev) => prev.filter((id) => id !== m.id));
                  }
                }}
              />
              {m.name}
            </label>
          ))}
        </div>
        {errors.models && (
          <span
            style={{
              color: "var(--error)",
              fontSize: "0.85rem",
              marginTop: "0.25rem",
              display: "block",
            }}>
            {errors.models}
          </span>
        )}
      </div>

      <fieldset
        style={{
          border: `1px solid ${errors.sections ? "var(--error)" : "var(--border)"}`,
          borderRadius: "8px",
          padding: "1rem",
        }}>
        <legend style={{ fontWeight: 600, padding: "0 0.5rem" }}>
          Sections
        </legend>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
          }}>
          {allSections.map((section) => (
            <label
              key={section.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}>
              <input
                type="checkbox"
                checked={enabledSections.includes(section.id)}
                onChange={() => toggleSection(section.id)}
              />
              {section.title}
            </label>
          ))}
        </div>
      </fieldset>
      {errors.sections && (
        <span
          style={{
            color: "var(--error)",
            fontSize: "0.85rem",
            marginTop: "0.25rem",
            display: "block",
          }}>
          {errors.sections}
        </span>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          background: loading ? "var(--muted)" : "var(--accent)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
        }}>
        {loading ? "Generating..." : "Generate Snapshot"}
      </button>
    </form>
  );
}
