import { NextRequest, NextResponse } from "next/server";
import { generateSnapshot } from "@/lib/snapshot/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.brandName || typeof body.brandName !== "string") {
      return NextResponse.json(
        { error: "brandName is required and must be a string" },
        { status: 400 },
      );
    }

    const brandName = body.brandName.trim();
    const enabledSections = body.enabledSections;

    const models: string[] = body.models;

    if (!models || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json(
        { error: "At least one model must be selected" },
        { status: 400 },
      );
    }

    // Run parallel snapshots for each model
    const snapshotPromises = models.map((modelId) =>
      generateSnapshot({
        brandName,
        enabledSections,
        model: modelId,
      }),
    );

    const snapshots = await Promise.all(snapshotPromises);

    return NextResponse.json({ snapshots });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[api/snapshot]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
