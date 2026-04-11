const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // Подключаем SQLite

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Инициализация базы данных (файл users.db создастся автоматически)
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) console.error('Ошибка подключения к БД:', err.message);
    else console.log('Успешное подключение к SQLite базе данных.');
});

// Создаем таблицу и тестового пользователя
db.serialize(() => {
    // Создаем таблицу, если ее нет
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Добавляем тестового админа (INSERT OR IGNORE значит, что если он уже есть, ошибки не будет)
    const stmt = db.prepare("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)");
    stmt.run("admin", "1122");
    stmt.finalize();
});

// Эндпоинт для входа (Авторизация)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Введите логин и пароль' });
    }

    // Ищем пользователя в базе
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";

    // ВАЖНО: В реальных проектах пароли хранятся в виде хешей (например, через bcrypt), 
    // но для тестов сейчас сравниваем обычный текст.
    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка сервера базы данных' });
        }

        if (row) {
            // Если row не пустой, значит пользователь найден и пароль совпал
            console.log(`Пользователь ${username} вошел в систему`);
            res.status(200).json({
                message: 'Вход выполнен успешно!',
                user: row.username
            });
        } else {
            // Если row пустой (undefined)
            res.status(401).json({ error: 'Неверный логин или пароль' });
        }
    });
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Введите логин и пароль' });
    }

    // Проверяем, существует ли уже пользователь с таким именем
    const query = "SELECT * FROM users WHERE username = ?";
    db.get(query, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка сервера базы данных' });
        }

        if (row) {
            // Если пользователь найден, возвращаем ошибку
            return res.status(409).json({ error: 'Пользователь с таким именем уже существует' });
        }

        // Если пользователя нет, добавляем его в базу
        const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt.run(username, password, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка сервера базы данных' });
            }

            console.log(`Пользователь ${username} зарегистрирован`);
            res.status(201).json({ message: 'Регистрация прошла успешно!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});