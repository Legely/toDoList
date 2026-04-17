-- Up
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,      -- Уникальный номер задачи
    title TEXT NOT NULL,                       -- Название (обязательное)
    description TEXT NOT NULL,                 -- Описание (обязательное, так как в HTML стоит required)
    priority TEXT CHECK(priority IN ('HIGH', 'MEDIUM', 'LOW')), -- Приоритет (только три варианта)
    deadline DATE,                             -- Дедлайн (может быть пустым/NULL, если галочка не стоит)
    status TEXT DEFAULT 'TODO',                -- Статус (по умолчанию падает в колонку "К выполнению")
    user_id INTEGER,                           -- ID создателя (для будущей связи с регистрацией Node.js)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Дата и время создания карточки
);