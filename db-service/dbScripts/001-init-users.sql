-- Up
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
);

-- Админ аккаунт и тестовый пользователь
INSERT OR IGNORE INTO users (username, password) VALUES ('admin', '1122');
INSERT OR IGNORE INTO users (username, password) VALUES ('test', 'test');
INSERT OR IGNORE INTO users (username, password) VALUES ('1', '1');

-- Down
DROP TABLE IF EXISTS users;