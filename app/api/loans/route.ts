import { NextResponse } from "next/server";
import { loans } from "@/src/schema";

export async function POST(req: Request) {
  const { db } = await import("@/src/db");
  const body = await req.json();
  const { equipmentId, borrowerName, defaultReturnDays } = body;

  if (!equipmentId || !borrowerName) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const borrowedAt = new Date();
  const dueDate = new Date(borrowedAt);
  dueDate.setDate(dueDate.getDate() + (defaultReturnDays ?? 7));

  await db.insert(loans).values({
    equipmentId,
    borrowerName,
    borrowedAt,
    dueDate,
  });

  return NextResponse.json({ ok: true });
}
