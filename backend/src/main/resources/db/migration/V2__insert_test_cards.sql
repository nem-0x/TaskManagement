INSERT INTO cards (column_id, title, priority, due_date, position) VALUES
    ((SELECT id FROM task_columns WHERE title = 'Todo'),        'Set up project repository',  'high',   '2026-05-01', 1),
    ((SELECT id FROM task_columns WHERE title = 'Todo'),        'Write API specification',    'medium', '2026-05-03', 2),
    ((SELECT id FROM task_columns WHERE title = 'Todo'),        'Review pull requests',       'low',    NULL,         3),
    ((SELECT id FROM task_columns WHERE title = 'In Progress'), 'Implement GET /api/columns', 'high',   '2026-04-30', 1),
    ((SELECT id FROM task_columns WHERE title = 'In Progress'), 'Write unit tests',           'medium', '2026-05-05', 2),
    ((SELECT id FROM task_columns WHERE title = 'Done'),        'Design database schema',     'high',   '2026-04-20', 1),
    ((SELECT id FROM task_columns WHERE title = 'Done'),        'Configure Flyway migration', 'medium', '2026-04-22', 2);
