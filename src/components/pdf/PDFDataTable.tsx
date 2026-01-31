import React from "react";
import { View, Text } from "@react-pdf/renderer";
import type { Snapshot } from "@/lib/snapshot/types";
import { allSections } from "@/lib/sections";
import { SECTION_CONFIG } from "@/lib/snapshot/config";
import { pdfStyles, getScoreColor } from "./styles";

interface PDFDataTableProps {
  snapshots: Snapshot[];
  section: (typeof allSections)[number];
}

export function PDFDataTable({ snapshots, section }: PDFDataTableProps) {
  // Calculate column widths
  const labelColumnWidth = 25;
  const dataColumnWidth = (100 - labelColumnWidth) / snapshots.length;

  const config = SECTION_CONFIG[section.id];
  if (!config) return null;

  return (
    <View style={pdfStyles.table}>
      {/* Section Header Title */}
      <Text style={pdfStyles.sectionMainHeader}>{config.label}</Text>

      {/* Table Header for this section */}
      <View style={pdfStyles.tableHeaderRow}>
        <View
          style={[
            pdfStyles.tableHeaderCell,
            { width: `${labelColumnWidth}%` },
          ]}>
          <Text>Dimension</Text>
        </View>
        {snapshots.map((s, idx) => (
          <View
            key={idx}
            style={[
              pdfStyles.tableHeaderCell,
              { width: `${dataColumnWidth}%` },
            ]}>
            <Text>{s.model}</Text>
          </View>
        ))}
      </View>

      {/* Section Fields */}
      {Object.entries(config.fields).map(([key, fieldConfig]) => (
        <View
          key={key}
          style={pdfStyles.tableRow}
          wrap={true}>
          {/* Label Column */}
          <View
            style={[
              pdfStyles.tableCell,
              pdfStyles.tableLabelCell,
              { width: `${labelColumnWidth}%` },
            ]}>
            <Text>{fieldConfig.label}</Text>
          </View>

          {/* Data Columns */}
          {snapshots.map((snapshot, idx) => {
            const sectionResult = snapshot.sections[section.id];
            let cellContent: React.ReactNode = <Text>-</Text>;

            if (sectionResult?.status === "success" && sectionResult.data) {
              const rawVal = (sectionResult.data as any)[key];

              if (rawVal !== undefined && rawVal !== null) {
                if (fieldConfig.type === "progress") {
                  const score = typeof rawVal === "number" ? rawVal : 0;
                  const max = fieldConfig.max || 10;
                  const percentage = Math.min(
                    100,
                    Math.max(0, (score / max) * 100),
                  );
                  const color = getScoreColor(percentage);

                  cellContent = (
                    <View style={{ width: "100%" }}>
                      <Text style={pdfStyles.progressText}>
                        {score}/{max}
                      </Text>
                      <View style={pdfStyles.progressBarContainer}>
                        <View style={pdfStyles.metricBarBackground}>
                          <View
                            style={[
                              pdfStyles.metricBarFill,
                              {
                                width: `${percentage}%`,
                                backgroundColor: color,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  );
                } else if (fieldConfig.type === "list") {
                  if (Array.isArray(rawVal)) {
                    cellContent = (
                      <View style={{ width: "100%" }}>
                        {rawVal.map((item, i) => (
                          <View
                            key={i}
                            style={pdfStyles.bulletPointContainer}>
                            <Text style={pdfStyles.bulletPoint}>•</Text>
                            <Text style={pdfStyles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    );
                  }
                } else if (fieldConfig.type === "complex_list") {
                  if (Array.isArray(rawVal)) {
                    cellContent = (
                      <View style={{ width: "100%" }}>
                        {rawVal.map((item: any, i) => (
                          <View
                            key={i}
                            style={{ marginBottom: 4 }}>
                            {item.point && (
                              <View style={pdfStyles.bulletPointContainer}>
                                <Text style={pdfStyles.bulletPoint}>•</Text>
                                <Text
                                  style={[
                                    pdfStyles.bulletText,
                                    { fontWeight: 700 },
                                  ]}>
                                  {item.point}
                                </Text>
                              </View>
                            )}
                            {item.explanation && (
                              <Text style={{ marginLeft: 10, fontSize: 8 }}>
                                {item.explanation}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    );
                  }
                } else {
                  let displayVal = String(rawVal);
                  if (displayVal.length < 20 && !displayVal.includes(" ")) {
                    displayVal =
                      displayVal.charAt(0).toUpperCase() + displayVal.slice(1);
                  }
                  cellContent = <Text>{displayVal}</Text>;
                }
              }
            } else if (sectionResult?.status === "error") {
              cellContent = <Text style={{ color: "#C83228" }}>Error</Text>;
            } else {
              cellContent = <Text style={{ color: "#C83228" }}>N/A</Text>;
            }

            return (
              <View
                key={idx}
                style={[pdfStyles.tableCell, { width: `${dataColumnWidth}%` }]}>
                {cellContent}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
