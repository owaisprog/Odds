import React, { useMemo } from "react";
import {
  DetailOutcome,
  DetailPrediction,
  DetailEvent,
  DetailBookmaker,
  DetailMarket,
} from "@app/(frontend)/prediction/[eventId]/page";

type ArticleProps = {
  event: DetailEvent;
};

// --- Helper Types for the View ---
type NormalizedOdds = {
  bookmakerName: string;
  home: {
    name: string;
    spread?: { point: string; price: string };
    ml?: { price: string };
  };
  away: {
    name: string;
    spread?: { point: string; price: string };
    ml?: { price: string };
  };
  total?: {
    over?: { point: string; price: string };
    under?: { point: string; price: string };
  };
};

// --- Helper Function: Best Bookmaker Logic ---
const getBestOdds = (event: DetailEvent): NormalizedOdds | null => {
  if (!event.bookmakers || event.bookmakers.length === 0) return null;

  // 1. Prioritize bookmakers that have ALL three main markets (Spread, ML, Total)
  const requiredMarkets = ["spreads", "h2h", "totals"];

  // FIX: The error was caused because we were falling back to the *array* of bookmakers.
  // We must find a specific one, or fallback to the first *element*.
  const bestBookmaker: DetailBookmaker =
    event.bookmakers.find((book) => {
      const availableKeys = book.markets.map((m) => m.key);
      return requiredMarkets.every((k) => availableKeys.includes(k));
    }) || event.bookmakers[0]; // Fallback to index 0 if no perfect match found

  if (!bestBookmaker) return null;

  // 2. Extract Markets safely
  const spreadMarket = bestBookmaker.markets.find((m) => m.key === "spreads");
  const mlMarket = bestBookmaker.markets.find((m) => m.key === "h2h");
  const totalMarket = bestBookmaker.markets.find((m) => m.key === "totals");

  // 3. Helper to safely find outcomes within a market
  const getOutcome = (market: DetailMarket | undefined, name: string) =>
    market?.outcomes.find((o) => o.name === name || name.includes(o.name));

  const getTotal = (type: "Over" | "Under") =>
    totalMarket?.outcomes.find((o) => o.name.includes(type));

  // 4. Helper to format price (add + if positive)
  const fmtPrice = (price: number) => (price > 0 ? `+${price}` : `${price}`);

  // 5. Normalize Data Structure for UI
  return {
    bookmakerName: bestBookmaker.title,
    home: {
      name: event.homeTeam,
      spread: (() => {
        const o = getOutcome(spreadMarket, event.homeTeam);
        return o
          ? {
              point: o.point
                ? o.point > 0
                  ? `+${o.point}`
                  : `${o.point}`
                : "",
              price: fmtPrice(o.price),
            }
          : undefined;
      })(),
      ml: (() => {
        const o = getOutcome(mlMarket, event.homeTeam);
        return o ? { price: fmtPrice(o.price) } : undefined;
      })(),
    },
    away: {
      name: event.awayTeam,
      spread: (() => {
        const o = getOutcome(spreadMarket, event.awayTeam);
        return o
          ? {
              point: o.point
                ? o.point > 0
                  ? `+${o.point}`
                  : `${o.point}`
                : "",
              price: fmtPrice(o.price),
            }
          : undefined;
      })(),
      ml: (() => {
        const o = getOutcome(mlMarket, event.awayTeam);
        return o ? { price: fmtPrice(o.price) } : undefined;
      })(),
    },
    total: {
      over: (() => {
        const o = getTotal("Over");
        return o
          ? { point: `O ${o.point}`, price: fmtPrice(o.price) }
          : undefined;
      })(),
      under: (() => {
        const o = getTotal("Under");
        return o
          ? { point: `U ${o.point}`, price: fmtPrice(o.price) }
          : undefined;
      })(),
    },
  };
};

const Article = ({ event }: ArticleProps) => {
  // Format the kickoff time
  const kickoff = new Date(event.commenceTime);
  const kickoffLabel = kickoff.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  // Memoize odds calculation to avoid re-running on every render
  const odds = useMemo(() => getBestOdds(event), [event]);

  return (
    <article className="bg-white rounded-2xl shadow-[0px_4px_8px_rgba(0,0,0,0.08)] border-t-[3px] border-t-[#24257C] p-6 sm:p-8 max-w-none font-inter text-[#111827]">
      {/* --- Header --- */}
      <header className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">
          {event.awayTeam} vs {event.homeTeam} Prediction
        </h2>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#24257C]">
          <span>{kickoffLabel}</span>
        </div>
      </header>

      {/* --- GAME CARD (Action Network Style / DGen Theme) --- */}
      {odds ? (
        <div className="mb-10 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
          {/* Card Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Game Odds
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-[#24257C] bg-blue-50 px-2 py-1 rounded">
              Odds via {odds.bookmakerName}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-3 mb-2 px-1">
              <div className="col-span-6 sm:col-span-6 text-xs font-bold text-gray-400 uppercase">
                Team
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-xs font-bold text-gray-400 uppercase">
                Spread
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-xs font-bold text-gray-400 uppercase">
                Moneyline
              </div>
            </div>

            {/* Row 1: Away Team */}
            <div className="grid grid-cols-12 gap-3 mb-3 items-center">
              <div className="col-span-6 sm:col-span-6 font-bold text-sm sm:text-base text-[#111827] truncate pr-2">
                {odds.away.name}
              </div>

              {/* Spread Button */}
              <div className="col-span-3 sm:col-span-3">
                <div className="flex flex-col items-center justify-center py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-[#C83495] transition-all duration-200 group bg-white h-full min-h-[50px]">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C83495]">
                    {odds.away.spread?.point || "-"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {odds.away.spread?.price}
                  </span>
                </div>
              </div>

              {/* ML Button */}
              <div className="col-span-3 sm:col-span-3">
                <div className="flex flex-col items-center justify-center py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-[#C83495] transition-all duration-200 group bg-white h-full min-h-[50px]">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C83495]">
                    {odds.away.ml?.price || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Home Team */}
            <div className="grid grid-cols-12 gap-3 mb-6 items-center">
              <div className="col-span-6 sm:col-span-6 font-bold text-sm sm:text-base text-[#111827] truncate pr-2">
                {odds.home.name}
              </div>

              {/* Spread Button */}
              <div className="col-span-3 sm:col-span-3">
                <div className="flex flex-col items-center justify-center py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-[#C83495] transition-all duration-200 group bg-white h-full min-h-[50px]">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C83495]">
                    {odds.home.spread?.point || "-"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {odds.home.spread?.price}
                  </span>
                </div>
              </div>

              {/* ML Button */}
              <div className="col-span-3 sm:col-span-3">
                <div className="flex flex-col items-center justify-center py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-[#C83495] transition-all duration-200 group bg-white h-full min-h-[50px]">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C83495]">
                    {odds.home.ml?.price || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: Totals (Isolated Row as requested) */}
            {odds.total && (
              <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Total Score
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Over */}
                  <div className="flex flex-row items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#C83495] transition-all duration-200 group bg-white">
                    <span className="text-xs font-bold text-gray-500 uppercase group-hover:text-[#C83495]">
                      Over
                    </span>
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-sm font-bold text-[#111827]">
                        {odds.total.over?.point.replace("O ", "")}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        {odds.total.over?.price}
                      </span>
                    </div>
                  </div>

                  {/* Under */}
                  <div className="flex flex-row items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#C83495] transition-all duration-200 group bg-white">
                    <span className="text-xs font-bold text-gray-500 uppercase group-hover:text-[#C83495]">
                      Under
                    </span>
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-sm font-bold text-[#111827]">
                        {odds.total.under?.point.replace("U ", "")}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        {odds.total.under?.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-10 p-8 bg-gray-50 rounded-xl border border-gray-200 text-center">
          <p className="text-gray-500 font-medium text-sm">
            Real-time odds are currently unavailable for this matchup.
          </p>
        </div>
      )}

      {/* --- Event Predictions Content --- */}
      <div className="space-y-8 text-[15px] leading-relaxed text-[#111827]">
        <div className="flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Expert Analysis
          </span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {event.eventpredictions.map(
          (prediction: DetailPrediction, index: number) => (
            <div key={index} className="mb-6">
              <h4 className="text-xl font-bold text-[#24257C] mb-3 font-inter">
                {prediction.heading}
              </h4>
              <p className="text-gray-700 whitespace-pre-line">
                {prediction.description}
              </p>
            </div>
          )
        )}
      </div>
    </article>
  );
};

export default Article;
