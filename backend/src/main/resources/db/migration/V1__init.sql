CREATE TABLE task_columns (
    id         BIGSERIAL    PRIMARY KEY,
    title      VARCHAR(100) NOT NULL,
    position   INTEGER      NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE cards (
    id         BIGSERIAL    PRIMARY KEY,
    column_id  BIGINT       NOT NULL REFERENCES task_columns(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    priority   VARCHAR(10),
    due_date   DATE,
    position   INTEGER      NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO task_columns (title, position) VALUES
    ('Todo',        1),
    ('In Progress', 2),
    ('Done',        3);
