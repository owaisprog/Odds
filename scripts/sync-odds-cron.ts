// scripts/sync-odds-cron.ts
import cron from "node-cron";
// NOTE: include the .ts extension so ts-node can resolve the TypeScript module
import { handleSyncOdds } from "../utils/sync-odds";
import { handleOddsPrediction } from "@/utils/odds-prediction";

async function main() {
  console.log("[CRON] Starting sync-odds cron worker...");

  const oddsTask = cron.schedule(
    "0 * * * *",
    async () => {
      try {
        console.log("[CRON] Hourly job triggered at", new Date().toISOString());
        await handleSyncOdds({ prune: true });
        console.log("[CRON] Hourly job finished at", new Date().toISOString());
      } catch (err) {
        console.error("[CRON] Error in hourly job:", err);
      }
    },
    {
      timezone: "Asia/Karachi",
    }
  );

  const predictionTask = cron.schedule(
    "30 0 * * *",
    async () => {
      try {
        console.log(
          "[CRON] Daily job triggered at 12:30 AM",
          new Date().toISOString()
        );
        await handleOddsPrediction();
        console.log("[CRON] Daily job finished at", new Date().toISOString());
      } catch (err) {
        console.error("[CRON] Error in Daily job at 12:30 AM:", err);
      }
    },
    {
      timezone: "Asia/Karachi",
    }
  );

  // Start cron jobs
  oddsTask.start();
  predictionTask.start();
  console.log("[CRON] Cron scheduler started");
}

main().catch((err) => {
  console.error("[CRON] Fatal error starting cron:", err);
  process.exit(1);
});
