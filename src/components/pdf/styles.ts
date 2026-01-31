import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Roboto",
    fontSize: 9,
    color: "#323232",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#646464",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 15,
    marginTop: 20,
  },
  sectionMainHeader: {
    fontSize: 18,
    fontWeight: 900,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20,
    width: "100%",
    textTransform: "uppercase",
  },
  // Summary section styles
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  summaryColumn: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  modelName: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 15,
    textAlign: "center",
  },
  gaugeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  gaugeScore: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 5,
  },
  gaugeSubtext: {
    fontSize: 8,
    color: "#505050",
  },
  metricsContainer: {
    width: "100%",
  },
  metricRow: {
    marginBottom: 8,
  },
  metricLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    marginBottom: 2,
  },
  metricLabelText: {
    fontWeight: 500,
  },
  metricScoreText: {
    fontWeight: 600,
    color: "#646464",
  },
  metricBarBackground: {
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
  },
  metricBarFill: {
    height: 4,
    borderRadius: 2,
  },
  // Table styles
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#DCDCDC",
    minHeight: 30,
    alignItems: "stretch", // Ensure cells stretch to fill row height
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#141414",
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    minHeight: 35,
  },
  tableSectionHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 0.5,
    borderBottomColor: "#DCDCDC",
    minHeight: 32,
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    color: "#323232",
    justifyContent: "flex-start",
    lineHeight: 1,
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 9,
    fontWeight: 700,
    color: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  tableSectionHeaderCell: {
    padding: 6,
    fontSize: 10,
    fontWeight: 700,
    color: "#323232",
    justifyContent: "center",
    alignItems: "center",
  },
  tableLabelCell: {
    fontWeight: 700,
    color: "#646464",
  },
  progressText: {
    marginBottom: 2,
  },
  progressBarContainer: {
    marginTop: 2,
  },
  bulletPointContainer: {
    flexDirection: "row",
    marginBottom: 2,
    width: "100%",
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
  },
});

export const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return "#22C55E"; // Green
  if (percentage >= 50) return "#EAB308"; // Yellow
  return "#EF4444"; // Red
};
