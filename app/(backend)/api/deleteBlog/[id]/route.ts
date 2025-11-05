// app/api/deleteBlog/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 params is a Promise in Next 15/16
) {
  try {
    const { id } = await ctx.params;        // 👈 await the params
    const idNum = Number(id);

    if (!Number.isInteger(idNum)) {
      return NextResponse.json(
        { error: "Invalid id. Expected integer." },
        { status: 400 }
      );
    }

    const deleted = await prisma.article.delete({ where: { id: idNum } });
    return NextResponse.json({ success: true, id: deleted.id });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    console.error("DELETE /api/deleteBlog/[id] failed:", err);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
