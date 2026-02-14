# CRM/SFA Verification App

Next.js (App Router) + Azure SQL Database による最小構成の CRM 検証アプリ。

## ディレクトリ構成

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # メインページ (顧客一覧 + 追加フォーム)
│   └── api/
│       └── leads/
│           └── route.ts    # GET/POST API Route Handler
├── lib/
│   └── db.ts               # Azure SQL 接続 (connection pool)
├── types/
│   └── lead.ts             # 型定義
├── sql/
│   └── init.sql            # テーブル作成SQL
├── .env.local.example       # 環境変数テンプレート
├── next.config.ts
├── tsconfig.json
└── package.json
```

## セットアップ

### 1. 依存関係インストール

```bash
npm install
```

### 2. 環境変数設定

`.env.local.example` をコピーして `.env.local` を作成し、Azure SQL の接続情報を設定する。

```bash
cp .env.local.example .env.local
```

### 3. Azure SQL テーブル作成

Azure Portal の Query Editor または SSMS で `sql/init.sql` を実行する。

```sql
CREATE TABLE leads (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);
```

### 4. 起動

```bash
npm run dev
```

## 環境変数一覧

| 変数名 | 説明 | 例 |
|---|---|---|
| `DB_SERVER` | Azure SQL サーバー名 | `your-server.database.windows.net` |
| `DB_NAME` | データベース名 | `your-database` |
| `DB_USER` | DB ユーザー名 | `your-username` |
| `DB_PASSWORD` | DB パスワード | `your-password` |
| `DB_PORT` | ポート番号 | `1433` |

Vercel にデプロイする場合は、Vercel の Environment Variables に上記を設定する。

## API

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/leads` | リード一覧取得 (created_at 降順) |
| POST | `/api/leads` | リード追加 (body: `{ "name": "顧客名" }`) |

## デプロイ

Vercel にリポジトリを接続し、環境変数を設定してデプロイする。
Framework Preset は `Next.js` が自動検出される。
