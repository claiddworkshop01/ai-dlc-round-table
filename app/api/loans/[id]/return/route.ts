import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { loans } from "@/src/schema";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { db } = await import("@/src/db");

  await db
    .update(loans)
    .set({ returnedAt: new Date() })
    .where(eq(loans.id, parseInt(id, 10)));

  return NextResponse.json({ ok: true });
}
