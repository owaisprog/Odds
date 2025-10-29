"use client";

import { useMemo, useState } from "react";
import BlogCard, { type BlogCardPost } from "@/components/article/BlogCard";
import type { BlogArticle } from "@/dummyData";
import { blogArticles } from "@/dummyData";

type SortKey = "Newest" | "Oldest";

const LatestCardSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortKey>("Newest");

  // Build category list from dummy data
  const categories = useMemo<string[]>(() => {
    const set = new Set<string>();
    blogArticles.forEach((p) => p.categories.forEach((c) => set.add(c.name)));
    return ["All", ...Array.from(set).sort()];
  }, []);

  // Filter by selected category
  const filtered: BlogArticle[] =
    activeCategory === "All"
      ? blogArticles
      : blogArticles.filter((post) =>
          post.categories.some((c) => c.name === activeCategory)
        );

  // Sort by publishedAt (since that's the field you have)
  const sorted: BlogArticle[] = useMemo(() => {
    const copy = [...filtered];
    switch (sortBy) {
      case "Newest":
        copy.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
        break;
      case "Oldest":
        copy.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
        );
        break;
    }
    return copy;
  }, [filtered, sortBy]);

  // Map to the BlogCard props shape
  const cardPosts: BlogCardPost[] = useMemo(
    () =>
      sorted.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt:
          post.description.length > 100
            ? `${post.description.substring(0, 100)}...`
            : post.description,
        imageUrl: post.thumbnail,
        category: post.categories[0]?.name ?? "General",
        date: new Date(post.publishedAt).toLocaleDateString(),
      })),
    [sorted]
  );

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Latest
            </p>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-orbitron">
              Latest Blogs
            </h1>
            <div className="w-16 h-0.5 bg-gray-200 mx-auto sm:mx-0" />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                      active
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="px-3 py-1.5 rounded-md border border-gray-200 text-sm"
              >
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cardPosts.map((post) => (
            <BlogCard key={`${post.slug}-${post.date}`} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestCardSection;
