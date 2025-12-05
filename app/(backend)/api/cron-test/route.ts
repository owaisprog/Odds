// app/api/cron-test/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // This is what you'll look for in the Vercel function logs
  console.log(
    "[CRON TEST] Cron test endpoint was called at",
    new Date().toISOString()
  );

  return NextResponse.json({
    message: "Cron test endpoint ran successfully.",
    timestamp: new Date().toISOString(),
  });
}
