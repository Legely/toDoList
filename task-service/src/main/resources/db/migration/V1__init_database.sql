-- 1. Создание таблицы пользователей (Для Node.js)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Создание таблицы задач (Для Java)
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('HIGH', 'MEDIUM', 'LOW')),
    deadline DATE,
    status TEXT DEFAULT 'TODO',
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Связываем задачу с пользователем
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);