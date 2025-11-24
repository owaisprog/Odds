// app/(frontend)/page.tsx
import HomeHero from "@/components/Home/HomeHero";
import UpcomingGames from "@/components/Home/UpcomingGames";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const LEAGUES = ["NFL", "NBA", "NCAAF", "NCAAB", "MLB", "MMA"] as const;

export default async function Home() {
  const now = new Date();

  const tStart = Date.now();

  // 🚀 Run Articles + Events Fetch in PARALLEL
  const [articles, eventsByLeague] = await Promise.all([
    // --------- ARTICLES QUERY ----------
    (async () => {
      const t0 = Date.now();
      const res = await prisma.article.findMany({
        where: { isFeatured: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          thumbnail: true,
          publishedAt: true,
          isFeatured: true,
          published: true,
          league: true,
        },
      });
      console.log("Time taken to fetch articles:", Date.now() - t0);
      return res;
    })(),

    // --------- EVENTS QUERY (league-wise) ----------
    (async () => {
      const t1 = Date.now();

      const perLeague = await Promise.all(
        LEAGUES.map((league) =>
          prisma.oddsEvent.findMany({
            where: {
              sportTitle: league,
              commenceTime: { gte: now },
            },
            orderBy: { commenceTime: "asc" },
            take: 6, // 6 upcoming events per league
            select: {
              id: true,
              sportKey: true,
              sportTitle: true,
              commenceTime: true,
              homeTeam: true,
              awayTeam: true,
              bookmakers: {
                take: 3,
                select: {
                  id: true,
                  key: true,
                  title: true,
                  lastUpdate: true,
                  markets: {
                    where: {
                      key: { in: ["h2h", "spreads", "totals"] }, // only needed markets
                    },
                    select: {
                      id: true,
                      key: true,
                      lastUpdate: true,
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

      console.log("Time taken to fetch events:", Date.now() - t1);
      return perLeague;
    })(),
  ]);

  // Shape articles for component
  const initialFeatured = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    description: a.description,
    thumbnail: a.thumbnail,
    publishedAt: a.publishedAt.toISOString(),
    isFeatured: !!a.isFeatured,
    published: !!a.published,
    league: a.league,
  }));

  // Flatten events (~36)
  const dbEvents = eventsByLeague.flat();

  // Shape events for UpcomingGames
  const events = dbEvents.map((e) => ({
    id: e.id,
    sportKey: e.sportKey,
    sportTitle: e.sportTitle,
    commenceTime: e.commenceTime.toISOString(),
    homeTeam: e.homeTeam,
    awayTeam: e.awayTeam,
    bookmakers: e.bookmakers.map((b) => ({
      id: b.id,
      key: b.key,
      title: b.title,
      lastUpdate: b.lastUpdate.toISOString(),
      markets: b.markets.map((m) => ({
        id: m.id,
        key: m.key,
        lastUpdate: m.lastUpdate.toISOString(),
        outcomes: m.outcomes.map((o) => ({
          id: o.id,
          name: o.name,
          price: o.price,
          point: o.point ?? null,
        })),
      })),
    })),
  }));

  console.log("Total events returned:", events.length);
  console.log("TOTAL server load time:", Date.now() - tStart);

  return (
    <main>
      <HomeHero initialFeatured={initialFeatured} />
      <UpcomingGames events={events} />
      <div className="h-20" />
    </main>
  );
}
