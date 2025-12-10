// components/Home/FetchUpcomingGames.tsx
import UpcomingGames from "./UpcomingGames";
import { prisma } from "@/lib/prisma";

const LEAGUES = ["NFL", "NBA", "NCAAF", "NCAAB", "MLB", "MMA"] as const;

export default async function FetchUpcomingGamesSection() {
  const now = new Date();
  const t1 = Date.now();

  // Fetch events per league directly without flattening
  const perLeague = await Promise.all(
    LEAGUES.map((league) =>
      prisma.oddsEvent.findMany({
        where: {
          sportTitle: league,
          commenceTime: { gte: now },
        },
        orderBy: { commenceTime: "asc" },
        take: 6, // Limit to 6 events per league
        select: {
          id: true,
          sportKey: true,
          sportTitle: true,
          commenceTime: true, // Keep as Date
          homeTeam: true,
          awayTeam: true,
          bookmakers: {
            take: 3,
            select: {
              id: true,
              key: true,
              title: true,
              lastUpdate: true, // Keep as Date
              markets: {
                where: {
                  key: { in: ["h2h", "spreads", "totals"] }, // Only needed markets
                },
                select: {
                  id: true,
                  key: true,
                  lastUpdate: true, // Keep as Date
                  outcomes: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                      point: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
    )
  );

  // Flatten perLeague array properly and ensure it's a DbOddsEvent[]
  const dbEvents = perLeague.flat();
  // Pass dbEvents directly to UpcomingGames without flattening or re-shaping
  return <UpcomingGames events={dbEvents} />;
}
