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
        // 1. Открываем соединение с базой данных
        db = await open({
            filename: './db-service/db/users.db',
            driver: sqlite3.Database
        });
        console.log('Успешное подключение к SQLite базе данных.');

        // 2. Запускаем систему миграций
        await db.migrate({
            migrationsPath: './db-service/dbScripts'
        });

        console.log('Миграции успешно проверены/применены.');

        return db; // Возвращаем объект db для дальнейшей работы в приложении
    } catch (error) {
        console.error('Ошибка при инициализации БД или миграциях:', error.message);
    }
}

// Сначала инициализируем БД, а затем запускаем сервер
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
});



//  Авторизация
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
        res.status(500).json({
            success: false,
            message: "Ошибка сервера"
        });
    }
});

// Регистрация
app.post('/api/register', async(req, res) => {
    try {
        const { username, password } = req.body;

        // Проверка на пустые поля
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Введите логин и пароль' // Заменил 'error' на 'message' для единообразия на фронтенде
            });
        }

        // Проверяем, существует ли уже пользователь с таким именем
        const existingUser = await db.get("SELECT * FROM users WHERE username = ?", [username]);

        if (existingUser) {
            // Если пользователь найден, возвращаем ошибку
            return res.status(409).json({
                success: false,
                message: 'Пользователь с таким именем уже существует'
            });
        }

        // Если пользователя нет, добавляем его в базу
        await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);

        console.log(`Пользователь ${username} зарегистрирован`);

        // Успешный ответ
        res.status(201).json({
            success: true,
            message: 'Регистрация прошла успешно!'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Ошибка сервера"
        });
    }
});