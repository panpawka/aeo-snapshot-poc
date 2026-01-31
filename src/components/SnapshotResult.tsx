"use client";

import { useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import type { Snapshot } from "@/lib/snapshot/types";
import type { SectionResult, Section } from "@/lib/sections/types";
import { allSections } from "@/lib/sections";
import { SnapshotPDFDocument } from "./pdf/SnapshotPDFDocument";

interface SnapshotResultProps {
  snapshots: Snapshot[];
}

function SectionCard({ id, result }: { id: string; result: SectionResult }) {
  const [view, setView] = useState<"preview" | "json">("preview");
  const section = allSections.find((s) => s.id === id);
  const title = section?.title ?? id;

  return (
    <div
      style={{
        background: "var(--card)",
        border: `1px solid ${result.status === "error" ? "var(--error)" : "var(--border)"}`,
        borderRadius: "8px",
        padding: "1.25rem",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              display: "flex",
              background: "var(--bg)",
              borderRadius: "6px",
              padding: "2px",
              border: "1px solid var(--border)",
            }}>
            <button
              onClick={() => setView("preview")}
              style={{
                border: "none",
                background:
                  view === "preview" ? "var(--accent)" : "transparent",
                color: view === "preview" ? "#fff" : "var(--muted)",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}>
              Preview
            </button>
            <button
              onClick={() => setView("json")}
              style={{
                border: "none",
                background: view === "json" ? "var(--accent)" : "transparent",
                color: view === "json" ? "#fff" : "var(--muted)",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}>
              JSON
            </button>
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              background:
                result.status === "success" ? "var(--success)" : "var(--error)",
              color: "#fff",
            }}>
            {result.status}
          </span>
        </div>
      </div>

      {result.status === "error" ? (
        <p style={{ color: "var(--error)" }}>{result.error}</p>
      ) : (
        <>
          {view === "json" ? (
            <pre
              style={{
                background: "var(--bg)",
                padding: "1rem",
                borderRadius: "6px",
                overflow: "auto",
                fontSize: "0.85rem",
                lineHeight: 1.5,
              }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          ) : (
            <div style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
              {/* Generic renderer for structured data if we don't have specialized components yet */}
              {typeof result.data === "object" && result.data !== null ? (
                <ValueRenderer value={result.data} />
              ) : (
                String(result.data)
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ValueRenderer({ value }: { value: any }) {
  if (Array.isArray(value)) {
    return (
      <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0" }}>
        {value.map((item, i) => (
          <li
            key={i}
            style={{ marginBottom: "0.5rem" }}>
            <ValueRenderer value={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <strong style={{ textTransform: "capitalize" }}>{k}:</strong>{" "}
            <ValueRenderer value={v} />
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value)}</span>;
}

function ScoreGauge({
  score,
  label,
  subtext,
}: {
  score: number;
  label?: string;
  subtext?: string;
}) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color logic: <50 red, 50-79 yellow, >=80 green (adjust as needed)
  const color =
    score >= 80 ? "var(--success)" : score >= 50 ? "#eab308" : "var(--error)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}>
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="var(--border)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: color,
          }}>
          {score}
        </div>
      </div>
      {(label || subtext) && (
        <div style={{ textAlign: "center" }}>
          {label && (
            <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
              {label}
            </div>
          )}
          {subtext && (
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {subtext}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreBar({
  label,
  score,
  max = 10,
}: {
  label: string;
  score: number;
  max?: number;
}) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const color =
    pct >= 80 ? "var(--success)" : pct >= 50 ? "#eab308" : "var(--error)";

  return (
    <div style={{ marginBottom: "1rem", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          marginBottom: "0.25rem",
        }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 600, color: "var(--muted)" }}>
          {score}/{max}
        </span>
      </div>
      <div
        style={{
          height: "8px",
          background: "var(--border)",
          borderRadius: "4px",
          overflow: "hidden",
        }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "4px",
            transition: "width 0.5s ease-out",
          }}
        />
      </div>
    </div>
  );
}

function SnapshotSummary({ snapshots }: { snapshots: Snapshot[] }) {
  // Compute metrics for each snapshot
  const summaryData = snapshots.map((snap) => {
    const getScore = (id: string) => {
      const res = snap.sections[id];
      if (
        res?.status === "success" &&
        res.data &&
        typeof res.data === "object" &&
        "score" in res.data
      ) {
        return (res.data as any).score as number;
      }
      return 0;
    };

    const brandRec = getScore("brand_recognition");
    const market = getScore("market_competition");
    const sentiment = getScore("sentiment");

    // We compute an overall score.
    // Data range: 3 sections * 10 max = 30 max points.
    // Calculate percentage: (sum / 30) * 100
    // If some sections are missing/zeros, this might be skewed, but consistent.
    const sum = brandRec + market + sentiment;
    const overall = Math.round((sum / 30) * 100);

    let subtext = "Needs Optimization";
    if (overall >= 80) subtext = "This score is great";
    else if (overall >= 50) subtext = "You're on the right track";

    return {
      model: snap.model,
      overall,
      subtext,
      metrics: [
        { label: "Brand Recognition", score: brandRec, max: 10 },
        { label: "Market Score", score: market, max: 10 },
        { label: "Brand Sentiment", score: sentiment, max: 10 },
        // Placeholder for missing metrics if needed,
        // but it's better to show real data.
      ],
    };
  });

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.75rem",
          fontWeight: 700,
          margin: "2rem 0",
          fontFamily: "serif", // Matching the 'Details' serif font in image if possible
        }}>
        Details
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${snapshots.length}, 1fr)`,
          gap: "2rem",
          justifyContent: "center",
        }}>
        {summaryData.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              alignItems: "center",
            }}>
            {/* Header: Model Name */}
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                {item.model}
              </h3>
              {/* Optional subtitle/logo placeholder */}
            </div>

            {/* Overall Score */}
            <ScoreGauge
              score={item.overall}
              subtext={item.subtext}
            />

            {/* Metrics Bars */}
            <div style={{ width: "100%", maxWidth: "280px" }}>
              {item.metrics.map((m, i) => (
                <ScoreBar
                  key={i}
                  {...m}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SnapshotResult({ snapshots }: SnapshotResultProps) {
  const [viewMode, setViewMode] = useState<"detailed" | "pdf">("detailed");
  const [sectionView, setSectionView] = useState<"preview" | "json">("preview");

  if (!snapshots || snapshots.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Main tabs for view mode */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid var(--border)",
          paddingBottom: "0.5rem",
        }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setViewMode("detailed")}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              color: viewMode === "detailed" ? "var(--accent)" : "var(--muted)",
              border: "none",
              borderBottom: `3px solid ${viewMode === "detailed" ? "var(--accent)" : "transparent"}`,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
            }}>
            Detailed
          </button>
          <button
            onClick={() => setViewMode("pdf")}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              color: viewMode === "pdf" ? "var(--accent)" : "var(--muted)",
              border: "none",
              borderBottom: `3px solid ${viewMode === "pdf" ? "var(--accent)" : "transparent"}`,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
            }}>
            PDF Preview
          </button>
        </div>

        <PDFDownloadLink
          document={<SnapshotPDFDocument snapshots={snapshots} />}
          fileName={`${snapshots[0]?.brand || "Brand"}_aeo_snapshot.pdf`}
          style={{
            padding: "0.5rem 1rem",
            background: "var(--fg)",
            color: "var(--bg)",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}>
          {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </div>

      {/* Detailed View */}
      {viewMode === "detailed" && (
        <>
          {/* Summary section showing all models side-by-side */}
          <SnapshotSummary snapshots={snapshots} />

          {/* Section data for all models in columns */}
          <div style={{ marginTop: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                Section Details
              </h2>
              <div
                style={{
                  display: "flex",
                  background: "var(--bg)",
                  borderRadius: "6px",
                  padding: "2px",
                  border: "1px solid var(--border)",
                }}>
                <button
                  onClick={() => setSectionView("preview")}
                  style={{
                    border: "none",
                    background:
                      sectionView === "preview"
                        ? "var(--accent)"
                        : "transparent",
                    color: sectionView === "preview" ? "#fff" : "var(--muted)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}>
                  Preview
                </button>
                <button
                  onClick={() => setSectionView("json")}
                  style={{
                    border: "none",
                    background:
                      sectionView === "json" ? "var(--accent)" : "transparent",
                    color: sectionView === "json" ? "#fff" : "var(--muted)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}>
                  JSON
                </button>
              </div>
            </div>

            {/* Get all unique section IDs from all snapshots */}
            {(() => {
              const allSectionIds = Array.from(
                new Set(
                  snapshots.flatMap((snap) => Object.keys(snap.sections)),
                ),
              );

              return allSectionIds.map((sectionId) => {
                const section = allSections.find((s) => s.id === sectionId);
                const title = section?.title ?? sectionId;

                return (
                  <div
                    key={sectionId}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "1.25rem",
                      marginBottom: "1.5rem",
                    }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        marginBottom: "1rem",
                      }}>
                      {title}
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${snapshots.length}, 1fr)`,
                        gap: "1.5rem",
                      }}>
                      {snapshots.map((snap, idx) => {
                        const result = snap.sections[sectionId];
                        if (!result) return null;

                        return (
                          <div
                            key={`${snap.model}-${idx}`}
                            style={{
                              background: "var(--bg)",
                              border: `1px solid ${
                                result.status === "error"
                                  ? "var(--error)"
                                  : "var(--border)"
                              }`,
                              borderRadius: "6px",
                              padding: "1rem",
                            }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "0.75rem",
                              }}>
                              <strong style={{ fontSize: "0.9rem" }}>
                                {snap.model}
                              </strong>
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "4px",
                                  background:
                                    result.status === "success"
                                      ? "var(--success)"
                                      : "var(--error)",
                                  color: "#fff",
                                }}>
                                {result.status}
                              </span>
                            </div>

                            {result.status === "error" ? (
                              <p
                                style={{
                                  color: "var(--error)",
                                  fontSize: "0.85rem",
                                }}>
                                {result.error}
                              </p>
                            ) : (
                              <>
                                {sectionView === "json" ? (
                                  <pre
                                    style={{
                                      background: "var(--card)",
                                      padding: "0.75rem",
                                      borderRadius: "4px",
                                      overflow: "auto",
                                      fontSize: "0.75rem",
                                      lineHeight: 1.4,
                                      maxHeight: "400px",
                                    }}>
                                    {JSON.stringify(result.data, null, 2)}
                                  </pre>
                                ) : (
                                  <div
                                    style={{
                                      fontSize: "0.85rem",
                                      lineHeight: 1.5,
                                    }}>
                                    {typeof result.data === "object" &&
                                    result.data !== null ? (
                                      <ValueRenderer value={result.data} />
                                    ) : (
                                      String(result.data)
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </>
      )}

      {/* PDF Preview View */}
      {viewMode === "pdf" && (
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "8px",
            overflow: "hidden",
            background: "var(--card)",
          }}>
          <div
            style={{
              padding: "1rem",
              background: "var(--bg)",
              borderBottom: "1px solid var(--border)",
              fontWeight: 600,
            }}>
            PDF Preview
          </div>
          <div style={{ height: "80vh" }}>
            <PDFViewer
              width="100%"
              height="100%"
              showToolbar={true}
              style={{ border: "none" }}>
              <SnapshotPDFDocument snapshots={snapshots} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
}
