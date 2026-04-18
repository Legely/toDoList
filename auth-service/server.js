const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db;
async function initDB() {
    try {
        // 1. Открываем соединение с ОБЩЕЙ базой данных, которой управляет Java
        // Путь указывает на папку task-service (на уровень выше и в соседнюю папку)
        db = await open({
            filename: '../task-service/app.db',
            driver: sqlite3.Database
        });
        console.log('Node.js: Успешное подключение к SQLite базе данных.');



        return db;
    } catch (error) {
        console.error('Ошибка при инициализации БД:', error.message);
    }
}

// Сначала инициализируем БД, а затем запускаем сервер
initDB().then(() => {
    if (db) {
        app.listen(PORT, () => {
            console.log(`Сервер авторизации запущен на http://localhost:${PORT}`);
        });
    }
});

// Авторизация
app.post('/api/login', async(req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Введите логин и пароль' });
        }

        // Ищем пользователя в базе
        const user = await db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);

        if (user) {
            res.json({
                success: true,
                message: "Успешный вход!"
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Неверный логин или пароль"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

// Регистрация
app.post('/api/register', async(req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Введите логин и пароль'
            });
        }

        const existingUser = await db.get("SELECT * FROM users WHERE username = ?", [username]);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Пользователь с таким именем уже существует'
            });
        }

        await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
        console.log(`Пользователь ${username} зарегистрирован`);

        res.status(201).json({
            success: true,
            message: 'Регистрация прошла успешно!'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});