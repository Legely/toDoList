-- Up
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
);

-- Админ аккаунт и тестовый пользователь
INSERT OR IGNORE INTO users (username, password) VALUES ('admin', '1122');
INSERT OR IGNORE INTO users (username, password) VALUES ('test', 'test');

-- Down
DROP TABLE IF EXISTS users;