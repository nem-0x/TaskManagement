# 8. ER図

### 8.1 テーブル一覧

| テーブル名 | 説明 |
|-----------|------|
| task_columns | カラム（ステータス列）を管理する |
| cards | カード（タスク）を管理する |

### 8.2 ER図

```
┌───────────────────────────┐       ┌──────────────────────────┐
│        task_columns       │       │          cards           │
├───────────────────────────┤       ├──────────────────────────┤
│ PK  id          INTEGER   │──┐    │ PK  id          INTEGER  │
│     title       VARCHAR   │  └──< │ FK  column_id   INTEGER  │
│     position    INTEGER   │       │     title       VARCHAR  │
│     is_default  BOOLEAN   │       │     priority    VARCHAR  │
│     created_at  DATETIME  │       │     due_date    DATE     │
│     updated_at  DATETIME  │       │     position    INTEGER  │
└───────────────────────────┘       │     created_at  DATETIME │
                                    │     updated_at  DATETIME │
                                    └──────────────────────────┘
```

### 8.3 テーブル定義

#### task_columns テーブル

| カラム名 | 型 | NOT NULL | 説明 |
|---------|-----|----------|------|
| id | INTEGER | ○ | 主キー（自動採番） |
| title | VARCHAR(100) | ○ | カラム名 |
| position | INTEGER | ○ | 表示順（左から何番目か） |
| is_default | BOOLEAN | ○ | デフォルトカラムフラグ（TRUE のカラムは削除不可） |
| created_at | DATETIME | ○ | 作成日時 |
| updated_at | DATETIME | ○ | 更新日時 |

#### cards テーブル

| カラム名 | 型 | NOT NULL | 説明 |
|---------|-----|----------|------|
| id | INTEGER | ○ | 主キー（自動採番） |
| column_id | INTEGER | ○ | 外部キー（task_columns.id） |
| title | VARCHAR(255) | ○ | カード（タスク）名 |
| priority | VARCHAR(10) | - | 優先度（'high' / 'medium' / 'low'）。未設定はNULL |
| due_date | DATE | - | 期限日。未設定はNULL |
| position | INTEGER | ○ | カラム内での表示順 |
| created_at | DATETIME | ○ | 作成日時 |
| updated_at | DATETIME | ○ | 更新日時 |

**制約:**
- `cards.column_id` は `task_columns.id` を参照（外部キー制約）
- カラム削除時、配下のカードはカスケード削除する
- `priority` は `'high'`・`'medium'`・`'low'`・`NULL` のいずれか（UI表示は 高 / 中 / 低 に変換）
- `is_default = TRUE` のカラム（初期 3 列: Todo / In Progress / Done）は削除不可
