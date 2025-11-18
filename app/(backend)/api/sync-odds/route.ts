// app/api/odds-sync/route.ts
import { NextResponse } from "next/server";

import { handleSyncOdds } from "@/utils/sync-odds";

// -----------------------------
// Route
// -----------------------------
export async function POST() {
  // prune: true => will delete events whose commenceTime is crossed
  const result = await handleSyncOdds({ prune: true });
  const status = result.success ? 200 : 500;
  return NextResponse.json(result, { status });
}
