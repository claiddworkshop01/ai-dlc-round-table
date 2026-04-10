"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrScanner } from "@/components/QrScanner";

type Equipment = {
  id: number;
  name: string;
  description: string | null;
  defaultReturnDays: number;
};

type ActiveLoan = {
  id: number;
  borrowerName: string;
  borrowedAt: string;
  dueDate: string;
};

type PageState = "scan" | "confirm";

function extractEquipmentId(text: string): number | null {
  try {
    const url = new URL(text);
    const id = url.searchParams.get("equipmentId");
    return id ? parseInt(id, 10) : null;
  } catch {
    return null;
  }
}

function ScanContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<PageState>("scan");
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [activeLoan, setActiveLoan] = useState<ActiveLoan | null>(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEquipmentId = useCallback(async (equipmentId: number) => {
    setLoading(true);
    const res = await fetch(`/api/equipments/${equipmentId}`);
    if (!res.ok) {
      setMessage("備品が見つかりませんでした");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setEquipment(data.equipment);
    setActiveLoan(data.activeLoan);
    setState("confirm");
    setLoading(false);
  }, []);

  const handleScan = useCallback(
    (text: string) => {
      const id = extractEquipmentId(text);
      if (id) {
        handleEquipmentId(id);
      } else {
        setMessage("無効なQRコードです");
      }
    },
    [handleEquipmentId]
  );

  useEffect(() => {
    const equipmentId = searchParams.get("equipmentId");
    if (equipmentId) {
      handleEquipmentId(parseInt(equipmentId, 10));
    }
  }, [searchParams, handleEquipmentId]);

  async function handleBorrow() {
    if (!equipment || !borrowerName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        equipmentId: equipment.id,
        borrowerName: borrowerName.trim(),
        defaultReturnDays: equipment.defaultReturnDays,
      }),
    });
    if (res.ok) {
      setMessage(`「${equipment.name}」を ${borrowerName} さんに貸出しました`);
      setEquipment(null);
      setActiveLoan(null);
      setBorrowerName("");
      setState("scan");
    } else {
      setMessage("貸出に失敗しました");
    }
    setLoading(false);
  }

  async function handleReturn() {
    if (!activeLoan) return;
    setLoading(true);
    const res = await fetch(`/api/loans/${activeLoan.id}/return`, {
      method: "POST",
    });
    if (res.ok) {
      setMessage(`「${equipment?.name}」が返却されました`);
      setEquipment(null);
      setActiveLoan(null);
      setState("scan");
    } else {
      setMessage("返却に失敗しました");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold text-center">QRスキャン</h1>

      {message && (
        <div className="rounded-lg bg-muted px-4 py-3 text-sm text-center">
          {message}
          <Button
            variant="link"
            size="sm"
            className="ml-2"
            onClick={() => setMessage(null)}
          >
            閉じる
          </Button>
        </div>
      )}

      {state === "scan" && (
        <Card>
          <CardHeader>
            <CardTitle>QRコードを読み取ってください</CardTitle>
          </CardHeader>
          <CardContent>
            <QrScanner onScan={handleScan} />
          </CardContent>
        </Card>
      )}

      {state === "confirm" && equipment && (
        <Card>
          <CardHeader>
            <CardTitle>{equipment.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipment.description && (
              <p className="text-sm text-muted-foreground">{equipment.description}</p>
            )}

            {activeLoan ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm">
                  <p className="font-medium">現在貸出中</p>
                  <p>借用者: {activeLoan.borrowerName}</p>
                  <p>返却期限: {new Date(activeLoan.dueDate).toLocaleDateString("ja-JP")}</p>
                </div>
                <Button
                  className="w-full"
                  onClick={handleReturn}
                  disabled={loading}
                >
                  返却する
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="borrowerName">お名前 *</Label>
                  <Input
                    id="borrowerName"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    placeholder="例: 山田 太郎"
                    autoComplete="off"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleBorrow}
                  disabled={loading || !borrowerName.trim()}
                >
                  貸出する
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setState("scan");
                setEquipment(null);
                setActiveLoan(null);
              }}
            >
              戻る
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-muted-foreground">読み込み中...</div>}>
      <ScanContent />
    </Suspense>
  );
}
