"use client";

import { useState } from "react";
import { SnapshotForm } from "@/components/snapshot/SnapshotForm";
import { SnapshotResult } from "@/components/snapshot/SnapshotResult";
import type { Snapshot } from "@/lib/snapshot/types";

export default function Home() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    brandName: string,
    model: string,
    sections: string[]
  ) {
    setLoading(true);
    setError(null);
    setSnapshot(null);

    try {
      const res = await fetch("/api/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          model,
          enabledSections: sections,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data: Snapshot = await res.json();
      setSnapshot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          AEO Snapshot Scorer
        </h1>
        <p style={{ color: "var(--muted)" }}>
          AI-driven brand positioning analysis — modular, explainable, vendor-agnostic.
        </p>
      </header>

      <SnapshotForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "var(--card)",
            border: "1px solid var(--error)",
            borderRadius: "8px",
            color: "var(--error)",
          }}
        >
          {error}
        </div>
      )}

      {snapshot && (
        <div style={{ marginTop: "2rem" }}>
          <SnapshotResult snapshot={snapshot} />
        </div>
      )}
    </main>
  );
}
