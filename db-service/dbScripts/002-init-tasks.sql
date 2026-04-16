-- Таблица задач (для Java/Spring Boot сервиса)
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('HIGH', 'MEDIUM', 'LOW')), -- Ограничиваем выбор приоритетов
    status TEXT DEFAULT 'TODO',
    user_id INTEGER, -- Закладка на будущее, чтобы привязывать задачу к конкретному пользователю
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);