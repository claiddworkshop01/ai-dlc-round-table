# INT-000 Units Plan

## 概要

備品貸出管理アプリ（INT-000）のユーザーストーリーを3つのUnitに分割する。
各Unitは独立して開発・完結できる単位とする。

---

## Unit一覧

| Unit ID | Unit名 | 対象US | 説明 |
|---|---|---|---|
| UNIT-001 | 備品マスタ管理 | US-001, US-002 | 備品の登録・編集・QRコード生成 |
| UNIT-002 | QRスキャン貸出・返却 | US-003 | スキャン画面・貸出・返却処理 |
| UNIT-003 | 貸出状況・履歴表示 | US-004, US-005 | ダッシュボード・アラート・履歴 |

---

## UNIT-001: 備品マスタ管理

### 目的

管理者が備品情報を登録・編集し、QRコードを発行できる基盤を作る。

### 含むもの

- DBスキーマ: `equipments` テーブル
- 備品一覧ページ (`/equipments`)
- 備品登録フォーム (`/equipments/new`)
- 備品編集フォーム (`/equipments/[id]/edit`)
- QRコード表示・印刷機能 (`/equipments/[id]`)
- API: GET/POST/PUT `/api/equipments`

### 依存関係

- 他Unitの前提となる（UNIT-002, UNIT-003はこのUnitのDBスキーマに依存）

### 対象User Stories

- [x] US-001: 備品マスタ登録・編集
- [x] US-002: QRコード生成・表示・印刷

---

## UNIT-002: QRスキャン貸出・返却

### 目的

スマホブラウザでQRコードをスキャンし、貸出・返却をその場で完結させる。

### 含むもの

- DBスキーマ: `loans` テーブル
- QRスキャンページ (`/scan`)
- カメラ起動・QR読み取り機能
- 貸出フォーム・返却ボタン
- API: GET/POST `/api/loans`、PATCH `/api/loans/[id]/return`

### 依存関係

- UNIT-001の `equipments` テーブルが必要

### 対象User Stories

- [x] US-003: QRスキャンによる貸出・返却

---

## UNIT-003: 貸出状況・履歴表示

### 目的

管理者が貸出状況を一覧で把握し、期限アラートと履歴を確認できる。

### 含むもの

- ダッシュボード (`/` または `/dashboard`)
- 貸出状況一覧・期限アラート表示
- 全履歴一覧 (`/history`)
- 備品別履歴 (`/equipments/[id]/history`)
- API: GET `/api/loans/active`、GET `/api/loans/history`

### 依存関係

- UNIT-001の `equipments` テーブル
- UNIT-002の `loans` テーブルが必要

### 対象User Stories

- [x] US-004: 貸出状況ダッシュボード・アラート
- [x] US-005: 貸出・返却履歴閲覧

---

## 並行開発の可否

- UNIT-001は独立して開始可能（他Unitの基盤）
- UNIT-002はUNIT-001のスキーマ確定後に開始可能
- UNIT-003はUNIT-001・UNIT-002のスキーマ確定後に開始可能
- スキーマ先行確定後、UI実装は並行で進められる

## 開発推奨順序

1. UNIT-001（備品マスタ・QRコード）
2. UNIT-002（スキャン・貸出・返却）
3. UNIT-003（ダッシュボード・履歴）

---

## 日付

- 作成日: 2026-04-10
- Intent ID: INT-000
