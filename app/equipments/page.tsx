import Link from "next/link";
import { desc } from "drizzle-orm";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
        <Link href="/equipments/new" className={cn(buttonVariants())}>
          + 新規登録
        </Link>
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
                  <Link
                    href={`/equipments/${eq.id}/edit`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    編集
                  </Link>
                  <Link
                    href={`/equipments/${eq.id}/qr`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    QRコード
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
