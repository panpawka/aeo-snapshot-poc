import { NextRequest, NextResponse } from "next/server";
import { generateSnapshot } from "@/lib/snapshot/orchestrator";
import type { SnapshotRequest } from "@/lib/snapshot/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SnapshotRequest>;

    if (!body.brandName || typeof body.brandName !== "string") {
      return NextResponse.json(
        { error: "brandName is required and must be a string" },
        { status: 400 }
      );
    }

    const snapshot = await generateSnapshot({
      brandName: body.brandName.trim(),
      enabledSections: body.enabledSections,
      model: body.model,
    });

    return NextResponse.json(snapshot);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[api/snapshot]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
