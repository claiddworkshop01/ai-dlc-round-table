import Link from "next/link";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { equipments } from "@/src/schema";

export const dynamic = "force-dynamic";

async function getEquipments() {
  const { db } = await import("@/src/db");
  return db.select().from(equipments).orderBy(desc(equipments.createdAt));
}

export default async function EquipmentsPage() {
  const list = await getEquipments();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">備品一覧</h1>
        <Button asChild>
          <Link href="/equipments/new">+ 新規登録</Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="text-muted-foreground">備品が登録されていません。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((eq) => (
            <Card key={eq.id}>
              <CardHeader>
                <CardTitle className="text-lg">{eq.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {eq.description && (
                  <p className="text-sm text-muted-foreground">{eq.description}</p>
                )}
                <p className="text-sm">返却期限: {eq.defaultReturnDays}日</p>
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/equipments/${eq.id}/edit`}>編集</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/equipments/${eq.id}/qr`}>QRコード</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
