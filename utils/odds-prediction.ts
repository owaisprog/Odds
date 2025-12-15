import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { encode } from "@toon-format/toon";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OddsArticleResponse {
  success: boolean;
  heading: string;
  article1Heading: string;
  article1Content: string;
  article2Heading: string;
  article2Content: string;
  article3Heading: string;
  article3Content: string;
}

// -----------------------------
// Helpers
// -----------------------------
function firstNonEmptyLine(input: string): string {
  return (
    input
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)[0] ?? ""
  );
}

function clampMaxLines(input: string, maxLines: number): string {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.slice(0, maxLines).join("\n");
}

// -----------------------------
// Route
// -----------------------------
const todayDaysFromNow = new Date();
todayDaysFromNow.setDate(todayDaysFromNow.getDate() + 2);

export async function handleOddsPrediction() {
  try {
    const events = await prisma.oddsEvent.findMany({
      where: {
        commenceTime: {
          gte: new Date(),
          lte: todayDaysFromNow,
        },
      },
      include: {
        bookmakers: {
          include: {
            markets: {
              include: { outcomes: true },
            },
          },
        },
      },
      orderBy: { commenceTime: "asc" },
    });

    if (!events.length) {
      return NextResponse.json(
        { success: false, error: "No odds event found" },
        { status: 404 }
      );
    }

    for (const event of events) {
      const existing = await prisma.eventprediction.findFirst({
        where: { oddsEventId: event.id },
        select: { id: true },
      });

      const oddsData = encode(event);

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a seasoned, sharp, slightly degenerate sports bettor — a mix of film junkie, data nerd, and Vegas insider. You talk in confident sportsbook language. You never mention being an AI. Base reasoning ONLY on the provided odds data.
`.trim(),
          },
          {
            role: "user",
            content: `
Write a prediction article using this structure:

1. Game Overview — 1–2 sentences.
2. Team A Season Snapshot — record, ATS/O-U, identity, trends.
3. Team B Season Snapshot — same but contrasting.
4. Matchup Breakdown — who has the edge and why.
5. Predictions:
   - Spread Pick
   - Over/Under Pick
   - Player Prop Pick

LENGTH RULES:
- game-overview-content MUST be AT LEAST 400 words.
- team-a-season-content MUST be AT LEAST 400 words.
- team-b-season-content MUST be AT LEAST 400 words.
- matchup-breakdown-content MUST be AT LEAST 400 words.
- spread-pick-content MUST be MAX 3 lines (newline-separated).
- over-under-pick-content MUST be MAX 3 lines (newline-separated).
- player-prop-pick-content MUST be MAX 3 lines (newline-separated).
- spread-pick-final-pick MUST be EXACTLY 1 line (just the pick, no label).
- over-under-final-pick MUST be EXACTLY 1 line (just the pick, no label).
- player-prop-final-pick MUST be EXACTLY 1 line (just the pick, no label).

OUTPUT FORMAT (NO MARKDOWN, FOLLOW EXACTLY):

article-title: <title>

game-overview-heading: <heading>
game-overview-content: <content>

team-a-season-heading: <heading>
team-a-season-content: <content>

team-b-season-heading: <heading>
team-b-season-content: <content>

matchup-breakdown-heading: <heading>
matchup-breakdown-content: <content>

spread-pick-heading: <heading>
spread-pick-final-pick: <one line pick>
spread-pick-content: <max 3 lines>

over-under-pick-heading: <heading>
over-under-final-pick: <one line pick>
over-under-pick-content: <max 3 lines>

player-prop-pick-heading: <heading>
player-prop-final-pick: <one line pick>
player-prop-pick-content: <max 3 lines>

DATA:
${oddsData}
`.trim(),
          },
        ],
      });

      const content = completion.choices[0].message.content ?? "";

      // Helper function: extracts value between keys
      const extract = (label: string, nextLabel?: string) => {
        const start = content.indexOf(label);
        if (start === -1) return "";

        const begin = start + label.length;

        if (!nextLabel) return content.slice(begin).trim();

        const end = content.indexOf(nextLabel, begin);
        if (end === -1) return content.slice(begin).trim();

        return content.slice(begin, end).trim();
      };

      // Robust fallback extractors (in case older format is returned)
      const extractSpreadFinalFallback = () => {
        const v = extract(
          "spread-pick-final-pick:",
          "spread-pick-content:"
        ).trim();
        if (v) return v;
        // fallback: first line of spread-pick-content
        return firstNonEmptyLine(
          extract("spread-pick-content:", "over-under-pick-heading:")
        );
      };

      const extractOverUnderFinalFallback = () => {
        const v = extract(
          "over-under-final-pick:",
          "over-under-pick-content:"
        ).trim();
        if (v) return v;
        return firstNonEmptyLine(
          extract("over-under-pick-content:", "player-prop-pick-heading:")
        );
      };

      const extractPlayerPropFinalFallback = () => {
        const v = extract(
          "player-prop-final-pick:",
          "player-prop-pick-content:"
        ).trim();
        if (v) return v;
        return firstNonEmptyLine(extract("player-prop-pick-content:"));
      };

      // Parse output
      const spreadPickHeading = (() => {
        const h = extract("spread-pick-heading:", "spread-pick-final-pick:");
        if (h) return h;
        // fallback to older format (no final-pick label)
        return extract("spread-pick-heading:", "spread-pick-content:");
      })();

      const overUnderPickHeading = (() => {
        const h = extract("over-under-pick-heading:", "over-under-final-pick:");
        if (h) return h;
        return extract("over-under-pick-heading:", "over-under-pick-content:");
      })();

      const playerPropPickHeading = (() => {
        const h = extract(
          "player-prop-pick-heading:",
          "player-prop-final-pick:"
        );
        if (h) return h;
        return extract(
          "player-prop-pick-heading:",
          "player-prop-pick-content:"
        );
      })();

      const spreadPickDescriptionRaw = (() => {
        const v = extract("spread-pick-content:", "over-under-pick-heading:");
        return v;
      })();

      const overUnderPickDescriptionRaw = (() => {
        const v = extract(
          "over-under-pick-content:",
          "player-prop-pick-heading:"
        );
        return v;
      })();

      const playerPropPickDescriptionRaw = extract("player-prop-pick-content:");

      const article = {
        articleTitle: extract("article-title:", "game-overview-heading:"),

        gameOverviewHeading: extract(
          "game-overview-heading:",
          "game-overview-content:"
        ),
        gameOverviewDescription: extract(
          "game-overview-content:",
          "team-a-season-heading:"
        ),

        teamASeasonHeading: extract(
          "team-a-season-heading:",
          "team-a-season-content:"
        ),
        teamASeasonDescription: extract(
          "team-a-season-content:",
          "team-b-season-heading:"
        ),

        teamBSeasonHeading: extract(
          "team-b-season-heading:",
          "team-b-season-content:"
        ),
        teamBSeasonDescription: extract(
          "team-b-season-content:",
          "matchup-breakdown-heading:"
        ),

        matchupBreakdownHeading: extract(
          "matchup-breakdown-heading:",
          "matchup-breakdown-content:"
        ),
        matchupBreakdownDescription: extract(
          "matchup-breakdown-content:",
          "spread-pick-heading:"
        ),

        spreadPickHeading,
        spreadFinalPick: firstNonEmptyLine(extractSpreadFinalFallback()),
        spreadPickDescription: clampMaxLines(spreadPickDescriptionRaw, 3),

        overUnderPickHeading,
        overUnderFinalPick: firstNonEmptyLine(extractOverUnderFinalFallback()),
        overUnderPickDescription: clampMaxLines(overUnderPickDescriptionRaw, 3),

        playerPropPickHeading,
        playerPropFinalPick: firstNonEmptyLine(
          extractPlayerPropFinalFallback()
        ),
        playerPropPickDescription: clampMaxLines(
          playerPropPickDescriptionRaw,
          3
        ),
      };

      // Create or Update
      if (existing) {
        await prisma.eventprediction.update({
          where: { id: existing.id },
          data: article,
        });
      } else {
        await prisma.eventprediction.create({
          data: { ...article, oddsEventId: event.id },
        });
      }
    }

    return NextResponse.json(
      { success: true, message: "Predictions processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in MakeOddsPrediction:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
