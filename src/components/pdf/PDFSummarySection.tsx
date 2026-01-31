import React from "react";
import { View, Text, Canvas } from "@react-pdf/renderer";
import type { Snapshot } from "@/lib/snapshot/types";
import { pdfStyles, getScoreColor } from "./styles";

interface SummaryData {
  model: string;
  overall: number;
  subtext: string;
  metrics: Array<{
    label: string;
    score: number;
    max: number;
  }>;
}

interface PDFSummarySectionProps {
  summaryData: SummaryData[];
}

export function PDFSummarySection({ summaryData }: PDFSummarySectionProps) {
  return (
    <View wrap={true}>
      <Text style={pdfStyles.sectionTitle}>Details</Text>
      <View
        style={pdfStyles.summaryGrid}
        wrap={true}
        break={true}>
        {summaryData.map((item, idx) => (
          <View
            key={idx}
            style={pdfStyles.summaryColumn}>
            {/* Model Name */}
            <Text style={pdfStyles.modelName}>{item.model}</Text>

            {/* Score Gauge */}
            <View style={pdfStyles.gaugeContainer}>
              <Canvas
                style={{ width: 80, height: 80, marginBottom: 5 }}
                paint={(painter, width, height) => {
                  const centerX = width / 2;
                  const centerY = height / 2;
                  const radius = 30;
                  const color = getScoreColor(item.overall);

                  // Background circle
                  painter
                    .strokeColor("#E5E5E5")
                    .lineWidth(8)
                    .circle(centerX, centerY, radius)
                    .stroke();

                  // Progress circle
                  const percentage = item.overall / 100;
                  const angle = percentage * 360;

                  painter.strokeColor(color).lineWidth(8);

                  if (percentage > 0) {
                    painter
                      .circle(centerX, centerY, radius)
                      .dash(
                        2 * Math.PI * radius * percentage,
                        2 * Math.PI * radius * (1 - percentage),
                      )
                      .stroke();
                  }

                  // Score text
                  painter
                    .fillColor(color)
                    .fontSize(24)
                    .text(String(item.overall), centerX - 15, centerY - 14);

                  return null;
                }}
              />
              <Text style={pdfStyles.gaugeSubtext}>{item.subtext}</Text>
            </View>

            {/* Metrics Bars */}
            <View style={pdfStyles.metricsContainer}>
              {item.metrics.map((metric, i) => {
                const percentage = Math.min(
                  100,
                  Math.max(0, (metric.score / metric.max) * 100),
                );
                const color = getScoreColor(percentage);

                return (
                  <View
                    key={i}
                    style={pdfStyles.metricRow}>
                    <View style={pdfStyles.metricLabel}>
                      <Text style={pdfStyles.metricLabelText}>
                        {metric.label}
                      </Text>
                      <Text style={pdfStyles.metricScoreText}>
                        {metric.score}/{metric.max}
                      </Text>
                    </View>
                    <View style={pdfStyles.metricBarBackground}>
                      <View
                        style={[
                          pdfStyles.metricBarFill,
                          { width: `${percentage}%`, backgroundColor: color },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function calculateSummaryData(snapshots: Snapshot[]): SummaryData[] {
  return snapshots.map((snap) => {
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

    const sum = brandRec + market + sentiment;
    const overall = Math.round((sum / 30) * 100);

    let subtext = "Needs Optimization";
    if (overall >= 80) subtext = "This score is great";
    else if (overall >= 50) subtext = "You're on the right track";

    const metrics = [
      { label: "Brand Recognition", score: brandRec, max: 10 },
      { label: "Market Score", score: market, max: 10 },
      { label: "Brand Sentiment", score: sentiment, max: 10 },
    ];

    return {
      model: snap.model,
      overall,
      subtext,
      metrics,
    };
  });
}
