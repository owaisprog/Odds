// app/(backend)/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // or "edge" if you prefer

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    // TODO: Send email, write to DB, etc.
    // e.g., await prisma.contact.create({ data: { name, email, message } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
