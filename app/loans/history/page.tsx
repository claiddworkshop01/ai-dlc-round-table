import { eq, isNotNull, desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { equipments, loans } from "@/src/schema";

export const dynamic = "force-dynamic";

async function getLoanHistory() {
  const { db } = await import("@/src/db");
  return db
    .select({
      loanId: loans.id,
      borrowerName: loans.borrowerName,
      borrowedAt: loans.borrowedAt,
      dueDate: loans.dueDate,
      returnedAt: loans.returnedAt,
      equipmentName: equipments.name,
    })
    .from(loans)
    .innerJoin(equipments, eq(loans.equipmentId, equipments.id))
    .where(isNotNull(loans.returnedAt))
    .orderBy(desc(loans.returnedAt));
}

export default async function HistoryPage() {
  const history = await getLoanHistory();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">返却済み履歴</h1>

      {history.length === 0 ? (
        <p className="text-muted-foreground">返却済みの記録はありません。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {history.map((loan) => (
            <Card key={loan.loanId}>
              <CardHeader>
                <CardTitle className="text-base">{loan.equipmentName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>借用者: <span className="font-medium">{loan.borrowerName}</span></p>
                <p>貸出日: {loan.borrowedAt.toLocaleDateString("ja-JP")}</p>
                <p>
                  返却日:{" "}
                  <span className="text-green-600 font-medium">
                    {loan.returnedAt!.toLocaleDateString("ja-JP")}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
