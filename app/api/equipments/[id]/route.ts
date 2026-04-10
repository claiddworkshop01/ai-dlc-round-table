import { NextResponse } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { equipments, loans } from "@/src/schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { db } = await import("@/src/db");

  const [equipment] = await db
    .select()
    .from(equipments)
    .where(eq(equipments.id, parseInt(id, 10)));

  if (!equipment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [activeLoan] = await db
    .select()
    .from(loans)
    .where(
      and(eq(loans.equipmentId, equipment.id), isNull(loans.returnedAt))
    );

  return NextResponse.json({ equipment, activeLoan: activeLoan ?? null });
}
