import React from "react";

export default function Loading() {
  return (
    <main className="w-full bg-white min-h-screen">
      {/* =========================================
          1. Hero Section Skeleton
          Matches: height-[500px] md:h-[600px]
      ========================================= */}
      <section className="relative w-full h-[500px] md:h-[600px] bg-gray-200 animate-pulse overflow-hidden">
        {/* Optional: Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />

        {/* Content Overlay (Bottom Left) matching HomeHero layout */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
          <div className="max-w-4xl ml-2 space-y-6">
            {/* "Analysis of the Day" Badge */}
            <div className="h-8 w-32 bg-gray-300 rounded" />

            {/* Title Lines */}
            <div className="space-y-3">
              <div className="h-10 md:h-14 w-3/4 bg-gray-300 rounded" />
              <div className="h-10 md:h-14 w-1/2 bg-gray-300 rounded" />
            </div>

            {/* CTA Button */}
            <div className="h-12 w-40 bg-gray-300 rounded mt-4" />
          </div>
        </div>
      </section>

      {/* =========================================
          2. Upcoming Games Skeleton
          Matches: py-16 sm:py-20
      ========================================= */}
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* --- Header Row (Title + Search + Button) --- */}
          <div className="mb-8 sm:mb-12 grid gap-4 sm:gap-6 md:grid-cols-[1fr_auto_auto] md:items-end animate-pulse">
            <div>
              {/* Title */}
              <div className="h-10 sm:h-12 w-64 bg-gray-200 rounded mb-3" />
              {/* Subtitle */}
              <div className="h-6 w-48 bg-gray-100 rounded" />
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-72 h-11 bg-gray-100 rounded-lg order-last md:order-0" />

            {/* View All Button (Desktop) */}
            <div className="hidden md:block w-24 h-10 bg-gray-200 rounded-lg" />
          </div>

          {/* --- Dropdown Row --- */}
          <div className="mb-8 sm:mb-10 animate-pulse">
            <div className="w-full md:w-94 h-[52px] bg-gray-100 border-2 border-gray-200 rounded-lg" />
            {/* Mobile View All Button */}
            <div className="md:hidden w-full h-11 bg-gray-200 rounded-lg mt-4" />
          </div>

          {/* --- Games Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {/* Render 6 skeleton cards to fill the view */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-pulse"
              >
                {/* Card Top Bar: League + Date */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                </div>

                {/* Teams Section */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  {/* Away Team */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-11 h-11 rounded-md bg-gray-200 shrink-0" />
                    <div className="space-y-2 w-full">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                      <div className="h-3 w-10 bg-gray-100 rounded" />
                    </div>
                  </div>

                  {/* VS */}
                  <div className="h-4 w-4 bg-gray-100 rounded-full" />

                  {/* Home Team */}
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <div className="space-y-2 w-full flex flex-col items-end">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                      <div className="h-3 w-10 bg-gray-100 rounded" />
                    </div>
                    <div className="w-11 h-11 rounded-md bg-gray-200 shrink-0" />
                  </div>
                </div>

                {/* Odds Grid Skeleton */}
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-3">
                  {/* Headers */}
                  <div className="flex justify-between">
                    <div className="h-3 w-8 bg-gray-200 rounded" />
                    <div className="h-3 w-8 bg-gray-200 rounded" />
                    <div className="h-3 w-8 bg-gray-200 rounded" />
                  </div>
                  {/* Row 1 */}
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </div>
                  {/* Row 2 */}
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </div>
                </div>

                {/* Card Button */}
                <div className="mt-4 h-10 w-full bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-20" />
    </main>
  );
}
