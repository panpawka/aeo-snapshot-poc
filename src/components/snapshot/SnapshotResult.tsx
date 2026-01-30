"use client";

import type { Snapshot } from "@/lib/snapshot/types";
import type { SectionResult } from "@/lib/sections/types";
import { allSections } from "@/lib/sections";

interface SnapshotResultProps {
  snapshot: Snapshot;
}

function SectionCard({ id, result }: { id: string; result: SectionResult }) {
  const section = allSections.find((s) => s.id === id);
  const title = section?.title ?? id;

  return (
    <div
      style={{
        background: "var(--card)",
        border: `1px solid ${result.status === "error" ? "var(--error)" : "var(--border)"}`,
        borderRadius: "8px",
        padding: "1.25rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{title}</h3>
        <span
          style={{
            fontSize: "0.75rem",
            padding: "0.2rem 0.6rem",
            borderRadius: "4px",
            background: result.status === "success" ? "var(--success)" : "var(--error)",
            color: "#fff",
          }}
        >
          {result.status}
        </span>
      </div>

      {result.status === "error" ? (
        <p style={{ color: "var(--error)" }}>{result.error}</p>
      ) : (
        <pre
          style={{
            background: "var(--bg)",
            padding: "1rem",
            borderRadius: "6px",
            overflow: "auto",
            fontSize: "0.85rem",
            lineHeight: 1.5,
          }}
        >
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export function SnapshotResult({ snapshot }: SnapshotResultProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "1.25rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Snapshot: {snapshot.brand}
        </h2>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem", color: "var(--muted)" }}>
          <span>Model: {snapshot.model}</span>
          <span>Generated: {new Date(snapshot.generatedAt).toLocaleString()}</span>
        </div>
      </div>

      {Object.entries(snapshot.sections).map(([id, result]) => (
        <SectionCard key={id} id={id} result={result} />
      ))}
    </div>
  );
}
