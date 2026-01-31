import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { Snapshot } from "@/lib/snapshot/types";
import { PDFSummarySection, calculateSummaryData } from "./PDFSummarySection";
import { PDFDataTable } from "./PDFDataTable";
import { pdfStyles } from "./styles";
import { allSections } from "@/lib/sections";
import "./fonts"; // Import to register fonts

interface SnapshotPDFDocumentProps {
  snapshots: Snapshot[];
}

export function SnapshotPDFDocument({ snapshots }: SnapshotPDFDocumentProps) {
  const brandName = snapshots[0]?.brand || "Brand";
  const date = new Date().toLocaleDateString();

  // Dynamic orientation: portrait for ≤3 models, landscape for 4+
  const orientation = snapshots.length > 3 ? "landscape" : "portrait";

  const summaryData = calculateSummaryData(snapshots);

  const availableSections = allSections.filter((section) =>
    snapshots.some((s) => s.sections[section.id]?.status === "success"),
  );

  return (
    <Document>
      {/* Page 1: Summary Section */}
      <Page
        size="A4"
        orientation={orientation}
        style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>AEO Snapshot: {brandName}</Text>
          <Text style={pdfStyles.subtitle}>Generated on {date}</Text>
        </View>

        <PDFSummarySection summaryData={summaryData} />
      </Page>

      {/* Subsequent Pages: One page per section */}
      {availableSections.map((section) => (
        <Page
          key={section.id}
          size="A4"
          orientation={orientation}
          style={pdfStyles.page}>
          <View style={pdfStyles.header}>
            <Text style={pdfStyles.title}>AEO Snapshot: {brandName}</Text>
            <Text style={pdfStyles.subtitle}>Generated on {date}</Text>
          </View>

          <PDFDataTable
            snapshots={snapshots}
            section={section}
          />
        </Page>
      ))}
    </Document>
  );
}
