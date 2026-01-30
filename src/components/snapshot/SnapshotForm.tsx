"use client";

import { useState } from "react";
import { allSections } from "@/lib/sections";

interface SnapshotFormProps {
  onSubmit: (brandName: string, model: string, sections: string[]) => void;
  loading: boolean;
}

export function SnapshotForm({ onSubmit, loading }: SnapshotFormProps) {
  const [brandName, setBrandName] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [enabledSections, setEnabledSections] = useState<string[]>(
    allSections.map((s) => s.id),
  );

  function toggleSection(id: string) {
    setEnabledSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brandName.trim()) return;
    onSubmit(brandName.trim(), model, enabledSections);
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
          required
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--fg)",
            fontSize: "1rem",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="model"
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          Model
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--fg)",
            fontSize: "1rem",
          }}>
          <option value="gpt-4o">GPT-4o (OpenAI)</option>
          <option value="gpt-4o-mini">GPT-4o Mini (OpenAI)</option>
          <option value="claude-sonnet-4">Claude Sonnet 4 (Anthropic)</option>
          <option value="claude-haiku-4">Claude Haiku 4 (Anthropic)</option>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash (Google)</option>
        </select>
      </div>

      <fieldset
        style={{
          border: "1px solid var(--border)",
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

      <button
        type="submit"
        disabled={loading || !brandName.trim() || enabledSections.length === 0}
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
