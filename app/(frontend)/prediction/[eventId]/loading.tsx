import React from "react";

export default function Loading() {
  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen">
      <section className="w-full py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* --- Header Skeleton --- */}
          <div className="bg-gray-200 h-64 w-full mb-8 rounded-2xl animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            <div className="p-8 sm:p-12 h-full flex flex-col justify-center gap-4">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-10 w-3/4 bg-gray-300 rounded" />
              <div className="h-6 w-1/2 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* --- Game Card Skeleton --- */}
            <div className="mb-12 border-2 border-gray-100 rounded-2xl overflow-hidden bg-white h-64 animate-pulse">
              <div className="bg-gray-100 h-12 w-full border-b border-gray-200" />
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 w-1/3 bg-gray-200 rounded" />
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-6 w-1/3 bg-gray-200 rounded" />
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* --- Content Skeleton --- */}
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border-l-4 border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm animate-pulse"
                >
                  <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
