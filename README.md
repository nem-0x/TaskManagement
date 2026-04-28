# TaskManagement

Trello 風のカンバンボードアプリ。カード（タスク）をカラム間でドラッグ&ドロップして進捗を視覚的に管理できる個人用タスク管理ツール。

---

## 主な機能

- カラム（ステータス列）の追加・削除
- カード（タスク）の追加・編集・削除
- カード間のドラッグ&ドロップ移動・並び替え
- 優先度（高 / 中 / 低）と期限日の設定
- 期限切れ・期限間近（3日以内）の視覚的警告
- カラム単位での優先度順・期限順ソート
- PostgreSQL によるデータ永続化

---

## 技術スタック

| レイヤー | 主な技術 |
|---------|---------|
| フロントエンド | React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 3 |
| バックエンド | Java 17 + Spring Boot 3.5 + Spring Data JPA + Flyway |
| データベース | PostgreSQL 15 |
| インフラ | Docker + Docker Compose |

詳細は [docs/02_tech_stack.md](docs/02_tech_stack.md) を参照。

---

## ディレクトリ構成

```
TaskManagement/
├── backend/                  # Spring Boot アプリケーション
│   ├── src/main/java/        # Java ソースコード
│   │   └── com/example/taskmanagement/
│   │       ├── controller/   # REST コントローラー
│   │       ├── service/      # ビジネスロジック
│   │       ├── repository/   # Spring Data JPA リポジトリ
│   │       ├── entity/       # JPA エンティティ
│   │       └── dto/          # リクエスト / レスポンス DTO
│   └── src/main/resources/
│       └── db/migration/     # Flyway マイグレーションスクリプト
├── frontend/                 # React アプリケーション
│   └── src/
│       ├── api/              # Axios クライアント設定
│       ├── components/       # UI コンポーネント（Board / Column / Card）
│       ├── hooks/            # TanStack Query カスタムフック
│       └── types/            # API レスポンス型定義
├── docs/                     # 設計ドキュメント
├── docker-compose.yml        # PostgreSQL + Backend + Frontend
└── CLAUDE.md                 # Claude Code 向けプロジェクト指示書
```

---

## ローカル開発環境のセットアップ

### 前提条件

- Java 17+
- Node.js 20+
- Docker Desktop

### 1. リポジトリをクローン

```bash
git clone https://github.com/nem-0x/TaskManagement.git
cd TaskManagement
```

### 2. 環境変数を設定

```bash
cp .env.example .env
# .env を編集して DB_NAME / DB_USER / DB_PASSWORD を設定
```

### 3. データベースを起動（Docker）

```bash
docker-compose up -d db
```

### 4. バックエンドを起動

```bash
cd backend
./gradlew bootRun
# → http://localhost:8080
```

### 5. フロントエンドを起動

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Docker Compose で全サービスを起動

```bash
docker-compose up -d
```

| サービス | URL |
|---------|-----|
| フロントエンド | http://localhost:3000 |
| バックエンド API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

ヘルスチェック:

```bash
curl -s http://localhost:8080/actuator/health
```

---

## API エンドポイント（実装済み）

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/columns` | 全カラム取得 |
| GET | `/api/columns/{id}` | カラム取得 |
| GET | `/api/cards` | 全カード取得 |
| GET | `/api/cards/{id}` | カード取得 |

---

## ドキュメント

| ファイル | 内容 |
|---------|------|
| [docs/01_overview.md](docs/01_overview.md) | プロジェクト概要・用語定義 |
| [docs/02_tech_stack.md](docs/02_tech_stack.md) | 技術スタック一覧（バージョン付き） |
| [docs/03_usecases.md](docs/03_usecases.md) | ユースケース定義 |
| [docs/04_functional.md](docs/04_functional.md) | 機能要件 |
| [docs/05_nonfunctional.md](docs/05_nonfunctional.md) | 非機能要件 |
| [docs/06_ui_design.md](docs/06_ui_design.md) | 画面設計 |
| [docs/07_er_diagram.md](docs/07_er_diagram.md) | ER図・テーブル定義 |
| [docs/08_constraints.md](docs/08_constraints.md) | 制約・前提条件 |
