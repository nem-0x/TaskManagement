ALTER TABLE task_columns ADD COLUMN is_default BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE task_columns SET is_default = TRUE WHERE position IN (1, 2, 3);
