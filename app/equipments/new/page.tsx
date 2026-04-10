import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { equipments } from "@/src/schema";

export default function NewEquipmentPage() {
  async function create(formData: FormData) {
    "use server";
    const { db } = await import("@/src/db");
    const name = formData.get("name");
    const description = formData.get("description");
    const defaultReturnDays = formData.get("defaultReturnDays");

    if (typeof name !== "string" || name.trim() === "") return;

    await db.insert(equipments).values({
      name: name.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      defaultReturnDays: defaultReturnDays
        ? parseInt(String(defaultReturnDays), 10)
        : 7,
    });

    redirect("/equipments");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>備品の新規登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={create} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">備品名 *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="例: MacBook Pro 2023"
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
                placeholder="例: M3チップ搭載モデル"
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
                defaultValue={7}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">登録する</Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => {}}>
                <a href="/equipments">キャンセル</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
