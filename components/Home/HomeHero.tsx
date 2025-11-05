"use client";

import { useEffect, useMemo, useState } from "react";

type CategoryChip = { name: string; slug: string };
type FeaturedArticle = {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  categories: CategoryChip[];
  publishedAt: string; // ISO
  isFeatured: boolean;
  published: boolean;
};

export default function Hero() {
  const [featured, setFeatured] = useState<FeaturedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch featured from API
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/getFeaturedBlogs", { cache: "no-store" });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || "Failed to load featured blogs");
        }
        const data: FeaturedArticle[] = await res.json();
        if (isMounted) {
          setFeatured(Array.isArray(data) ? data : []);
          setCurrentIndex(0);
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load featured blogs");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-rotate every 7s
  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const handleDotClick = (index: number) => setCurrentIndex(index);

  // Nothing to show
  if (loading || error || featured.length === 0) return null;

  const currentArticle = featured[currentIndex];

  return (
    <section className="w-full bg-white">
      <div className="relative w-full h-[500px] md:h-[600px]">
        {/* Background Image */}
        <img
          src={currentArticle.thumbnail || "/placeholder.svg"}
          alt={currentArticle.title}
          className="w-full h-full object-cover"
        />

        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Label inside the image */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <span className="inline-block px-4 py-2 rounded font-inter font-semibold tracking-wide uppercase text-xs md:text-sm bg-[#24257C] text-white">
            Analysis of the Day
          </span>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
          <div className="max-w-4xl">
            {/* League Tag */}
            <span className="inline-block px-3 py-1 bg-white/90 text-[#111827] text-sm font-semibold font-inter rounded mb-4">
              {currentArticle.categories.find((c) =>
                ["nfl", "nba", "mlb", "ufc", "ncaaf", "ncaab"].includes(
                  c.slug.toLowerCase()
                )
              )?.name ||
                currentArticle.categories[0]?.name ||
                "SPORTS"}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair text-white mb-8 leading-tight">
              {currentArticle.title}
            </h1>

            {/* CTA (optional: link to article) */}
            {/* <Link href={`/article/${currentArticle.slug}`}> */}
            <button className="inline-block px-6 py-3 bg-[#24257C] hover:bg-[#C83495] text-white font-inter font-medium rounded transition-colors duration-300">
              Read Analysis
            </button>
            {/* </Link> */}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {featured.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "bg-[#24257C] w-10 h-3"
                  : "bg-white/60 w-3 h-3 hover:bg-white/90"
              }`}
              aria-label={`Go to article ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
