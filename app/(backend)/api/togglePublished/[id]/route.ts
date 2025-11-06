import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }   // <- params is a Promise
) {
  try {
    const { id: idParam } = await ctx.params; // <- await it
    const id = Number(idParam);

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid article id" }, { status: 400 });
    }

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        published: !article.published,
        // publishedAt: !article.published ? new Date() : article.publishedAt,
      },
      select: { id: true, published: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("togglePublished error:", err);
    return NextResponse.json(
      { error: "Failed to update published status" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
