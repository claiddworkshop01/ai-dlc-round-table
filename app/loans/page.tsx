import { eq, isNull } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { equipments, loans } from "@/src/schema";

export const dynamic = "force-dynamic";

async function getActiveLoans() {
  const { db } = await import("@/src/db");
  return db
    .select({
      loanId: loans.id,
      borrowerName: loans.borrowerName,
      borrowedAt: loans.borrowedAt,
      dueDate: loans.dueDate,
      equipmentName: equipments.name,
      equipmentId: equipments.id,
    })
    .from(loans)
    .innerJoin(equipments, eq(loans.equipmentId, equipments.id))
    .where(isNull(loans.returnedAt))
    .orderBy(loans.dueDate);
}

export default async function LoansPage() {
  const activeLoans = await getActiveLoans();
  const now = new Date();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">貸出状況</h1>

      {activeLoans.length === 0 ? (
        <p className="text-muted-foreground">現在貸出中の備品はありません。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {activeLoans.map((loan) => {
            const isOverdue = loan.dueDate < now;
            return (
              <Card
                key={loan.loanId}
                className={isOverdue ? "border-red-400" : ""}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{loan.equipmentName}</span>
                    {isOverdue && (
                      <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                        期限超過
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>借用者: <span className="font-medium">{loan.borrowerName}</span></p>
                  <p>
                    貸出日:{" "}
                    {loan.borrowedAt.toLocaleDateString("ja-JP")}
                  </p>
                  <p className={isOverdue ? "text-red-500 font-medium" : ""}>
                    返却期限: {loan.dueDate.toLocaleDateString("ja-JP")}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
