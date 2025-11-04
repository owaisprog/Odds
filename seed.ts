// scripts/seed-articles.ts
// Run with: npx ts-node --swc scripts/seed-articles.ts
// Requires Node 18+ for global fetch.

import { blogArticles } from "./dummyData"; // <— adjust this

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

type ApiPayload = {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  publishDate: string;           // API expects "publishDate"
  metaTags: string[];
  categories: { name: string; slug: string }[];
  content: { type: "heading" | "subheading" | "text" | "image"; content: string; description?: string | null }[];
  published: boolean;
  isFeatured?: boolean;
};

async function seedOne(a: (typeof blogArticles)[number]) {
  const payload: ApiPayload = {
    title: a.title,
    slug: a.slug,
    description: a.description,
    thumbnail: a.thumbnail,
    publishDate: a.publishedAt,                       // map publishedAt -> publishDate
    metaTags: a.categories.map((c) => c.slug),        // simple derived tags
    categories: a.categories,
    content: a.content.map((b) => ({
      type: b.type,
      content: b.content,
      description: b.description ?? null,
    })),
    published: a.published,
    isFeatured: a.isFeatured ?? false,
  };

  const res = await fetch(`${BASE_URL}/api/addBlog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${a.slug}] ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

async function run() {
  console.log(`Seeding ${blogArticles.length} articles to ${BASE_URL} ...`);
  let ok = 0, fail = 0;

  // You can run in parallel if you like; serial is simpler when debugging:
  for (const a of blogArticles) {
    try {
      await seedOne(a);
      ok++;
      console.log(`✓ ${a.slug}`);
    } catch (err) {
      fail++;
      console.error(`✗ ${a.slug}`, err);
    }
  }

  console.log(`Done. Success: ${ok}, Failed: ${fail}`);
  if (fail > 0) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
