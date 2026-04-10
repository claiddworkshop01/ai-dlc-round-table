import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode } from "@/components/QrCode";
import { equipments } from "@/src/schema";

export const dynamic = "force-dynamic";

export default async function QrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { db } = await import("@/src/db");
  const [equipment] = await db
    .select()
    .from(equipments)
    .where(eq(equipments.id, parseInt(id, 10)));

  if (!equipment) notFound();

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const scanUrl = `${protocol}://${host}/scan?equipmentId=${equipment.id}`;

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{equipment.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <QrCode value={scanUrl} size={240} />
          <p className="text-center text-xs text-muted-foreground break-all">{scanUrl}</p>
          <p className="text-sm text-muted-foreground">
            このQRコードをスマホで読み取って貸出・返却
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
