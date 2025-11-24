export default function Loading() {
  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen animate-pulse">
      <section className="w-full py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT SIDE SKELETON */}
            <div className="lg:col-span-8 space-y-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-10 bg-gray-300 rounded"></div>
                <div className="text-gray-400">/</div>
                <div className="h-4 w-14 bg-gray-300 rounded"></div>
                <div className="text-gray-400">/</div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>

              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-20 bg-gray-300 rounded"></div>
                  <div className="h-4 w-28 bg-gray-300 rounded"></div>
                </div>

                <div className="h-7 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-7 w-1/2 bg-gray-300 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
              </div>

              {/* Odds Card (simplified) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
                {/* Logos row */}
                <div className="flex justify-between items-center bg-[#FAFAFA] p-4 rounded-lg border border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>

                  <div className="text-center flex flex-col items-center">
                    <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-14 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>

                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Spread / ML / Total grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((n) => (
                    <div key={n} className="space-y-4">
                      <div className="flex justify-between">
                        <div className="h-3 w-12 bg-gray-300 rounded"></div>
                        <div className="h-3 w-10 bg-gray-300 rounded"></div>
                        <div className="h-3 w-14 bg-gray-300 rounded"></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="h-5 w-10 bg-gray-300 rounded"></div>
                        <div className="h-5 w-10 bg-gray-300 rounded"></div>
                        <div className="h-5 w-10 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-3 w-40 mx-auto bg-gray-300 rounded"></div>
              </div>

              {/* Predictions */}
              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 w-40 bg-gray-300 rounded"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                      <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-20">
                {/* Header */}
                <div className="bg-[#24257C] px-4 py-3">
                  <div className="h-4 w-40 bg-gray-300 rounded"></div>
                </div>

                {/* **** ONE RELATED ARTICLE SKELETON (as requested) **** */}
                <div className="p-4 flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-200 rounded-md"></div>

                  {/* Text block */}
                  <div className="flex-1 space-y-2">
                    {/* League */}
                    <div className="h-3 w-12 bg-gray-300 rounded"></div>

                    {/* Title (2 lines) */}
                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-300 rounded"></div>

                    {/* Date */}
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Optional: divider below the card */}
                <div className="border-t border-gray-100"></div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
