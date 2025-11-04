// app/api/v1/blog/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // always fresh for admin

export async function GET() {
  try {
    const rows = await prisma.article.findMany({
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      include: {
        categories: { select: { name: true, slug: true } },
      },
    });

    const payload = rows.map((r) => ({
      _id: String(r.id),                     // frontend expects string
      slug: r.slug,
      title: r.title,
      description: r.description,
      thumbnail: r.thumbnail,
      categories: r.categories,              // already [{ name, slug }]
      isFeatured: Boolean(r.isFeatured),
      published: r.published,
      publishedAt: r.publishedAt.toISOString(),
    }));

    return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
