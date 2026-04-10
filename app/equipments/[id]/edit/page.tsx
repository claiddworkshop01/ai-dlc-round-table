import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { equipments } from "@/src/schema";

export const dynamic = "force-dynamic";

export default async function EditEquipmentPage({
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

  async function update(formData: FormData) {
    "use server";
    const { db } = await import("@/src/db");
    const name = formData.get("name");
    const description = formData.get("description");
    const defaultReturnDays = formData.get("defaultReturnDays");

    if (typeof name !== "string" || name.trim() === "") return;

    await db
      .update(equipments)
      .set({
        name: name.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        defaultReturnDays: defaultReturnDays
          ? parseInt(String(defaultReturnDays), 10)
          : 7,
      })
      .where(eq(equipments.id, parseInt(id, 10)));

    redirect("/equipments");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>備品の編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={update} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">備品名 *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={equipment.name}
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Input
                id="description"
                name="description"
                type="text"
                defaultValue={equipment.description ?? ""}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultReturnDays">デフォルト返却期限（日数）</Label>
              <Input
                id="defaultReturnDays"
                name="defaultReturnDays"
                type="number"
                min={1}
                defaultValue={equipment.defaultReturnDays}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">保存する</Button>
              <Link
                href="/equipments"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
              >
                キャンセル
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
