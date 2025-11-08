import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminJWT, getAdminCookieName } from "@/lib/auth";

/** Basic email sanity check (kept lightweight on purpose) */
function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * POST /api/contact
 * Public endpoint used by your footer form. Saves a contact message.
 * Body: { name: string, email: string, message: string }
 */
export async function POST(req: Request) {
  try {
    console.log("POST /api/contact reeahced");
    const body = await req.json().catch(() => null) as
      | { name?: string; email?: string; message?: string }
      | null;

    const name = body?.name?.trim() || "";
    const email = body?.email?.trim() || "";
    const message = body?.message?.trim() || "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please provide name, email, and message." },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 413 }
      );
    }

    const saved = await prisma.contactMessage.create({
      data: { name, email, message },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json(
      { ok: true, id: saved.id, createdAt: saved.createdAt },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/contact failed:", err);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Admin-only list endpoint with pagination.
 * Query: ?page=1&limit=20
 */
export async function GET(req: Request) {
  try {
    // Require admin session
    const store = await cookies();
    const token = store.get(getAdminCookieName())?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      verifyAdminJWT(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limitRaw = Number(url.searchParams.get("limit") || 20);
    const limit = Math.min(Math.max(1, limitRaw), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          message: true,
          createdAt: true,
          read: true,
        },
      }),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      hasMore: skip + items.length < total,
      items,
    });
  } catch (err) {
    console.error("GET /api/contact failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch contact messages." },
      { status: 500 }
    );
  }
}
