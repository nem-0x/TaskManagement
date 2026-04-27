# 8. ER図

### 8.1 テーブル一覧

| テーブル名 | 説明 |
|-----------|------|
| columns | カラム（ステータス列）を管理する |
| cards | カード（タスク）を管理する |

### 8.2 ER図

```
┌─────────────────────────┐       ┌──────────────────────────┐
│         columns         │       │          cards           │
├─────────────────────────┤       ├──────────────────────────┤
│ PK  id          INTEGER │──┐    │ PK  id          INTEGER  │
│     title       VARCHAR │  └──< │ FK  column_id   INTEGER  │
│     position    INTEGER │       │     title       VARCHAR  │
│     created_at  DATETIME│       │     position    INTEGER  │
│     updated_at  DATETIME│       │     created_at  DATETIME │
└─────────────────────────┘       │     updated_at  DATETIME │
                                  └──────────────────────────┘
```

### 8.3 テーブル定義

#### columns テーブル

| カラム名 | 型 | NOT NULL | 説明 |
|---------|-----|----------|------|
| id | INTEGER | ○ | 主キー（自動採番） |
| title | VARCHAR(100) | ○ | カラム名 |
| position | INTEGER | ○ | 表示順（左から何番目か） |
| created_at | DATETIME | ○ | 作成日時 |
| updated_at | DATETIME | ○ | 更新日時 |

#### cards テーブル

| カラム名 | 型 | NOT NULL | 説明 |
|---------|-----|----------|------|
| id | INTEGER | ○ | 主キー（自動採番） |
| column_id | INTEGER | ○ | 外部キー（columns.id） |
| title | VARCHAR(255) | ○ | カード（タスク）名 |
| position | INTEGER | ○ | カラム内での表示順 |
| created_at | DATETIME | ○ | 作成日時 |
| updated_at | DATETIME | ○ | 更新日時 |

**制約:**
- `cards.column_id` は `columns.id` を参照（外部キー制約）
- カラム削除時、配下のカードはカスケード削除する
