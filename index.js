const express = require('express'); // Подключаем модуль Express.js для создания веб-сервера
const bodyParser = require('body-parser'); // Подключаем модуль body-parser для обработки тела запросов
const db = require('./database'); // Импортируем модуль базы данных, который создали в database.js
const dotenv = require('dotenv'); // Подключаем dotenv для работы с .env файлом

dotenv.config(); // Загружаем переменные окружения из .env файла

const app = express(); // Создаем экземпляр приложения Express
const PORT = process.env.PORT || 3000; // Устанавливаем порт, на котором будет работать сервер, используя переменную окружения или значение по умолчанию

app.use(bodyParser.json()); // Используем парсер JSON для обработки тела запросов

// Обработчики маршрутов для CRUD операций с пользователями

// Получение всех пользователей
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => { // Выполняем запрос к базе данных для получения всех пользователей
        if (err) {
            console.error('Error retrieving users', err); // Если произошла ошибка, выводим сообщение в консоль
            return res.status(500).json({ error: err.message }); // Возвращаем ошибку сервера с сообщением об ошибке
        }
        res.json(rows); // Возвращаем найденных пользователей в формате JSON
    });
});

// Получение пользователя по ID
app.get('/users/:id', (req, res) => {
    const id = req.params.id; // Получаем ID пользователя из параметра запроса
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => { // Выполняем запрос к базе данных для получения пользователя по ID
        if (err) {
            console.error('Error retrieving user by ID', err); // Если произошла ошибка, выводим сообщение в консоль
            return res.status(500).json({ error: err.message }); // Возвращаем ошибку сервера с сообщением об ошибке
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' }); // Если пользователь не найден, возвращаем ошибку 404
        }
        res.json(row); // Возвращаем найденного пользователя в формате JSON
    });
});

// Создание нового пользователя
app.post('/users', (req, res) => {
    const { name, email } = req.body; // Извлекаем имя и email пользователя из тела запроса
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' }); // Если имя или email не указаны, возвращаем ошибку 400
    }
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function(err) { // Выполняем запрос к базе данных для создания нового пользователя
        if (err) {
            console.error('Error creating user', err); // Если произошла ошибка, выводим сообщение в консоль
            return res.status(500).json({ error: err.message }); // Возвращаем ошибку сервера с сообщением об ошибке
        }
        res.status(201).json({ id: this.lastID, name, email }); // Возвращаем успешно созданного пользователя в формате JSON с кодом 201
    });
});

// Обновление пользователя по ID
app.put('/users/:id', (req, res) => {
    const id = req.params.id; // Получаем ID пользователя из параметра запроса
    const { name, email } = req.body; // Извлекаем новые данные пользователя из тела запроса
    db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], function(err) { // Выполняем запрос к базе данных для обновления данных пользователя
        if (err) {
            console.error('Error updating user', err); // Если произошла ошибка, выводим сообщение в консоль
            return res.status(500).json({ error: err.message }); // Возвращаем ошибку сервера с сообщением об ошибке
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' }); // Если пользователь не найден, возвращаем ошибку 404
        }
        res.json({ id, name, email }); // Возвращаем обновленные данные пользователя в формате JSON
    });
});

// Удаление пользователя по ID
app.delete('/users/:id', (req, res) => {
    const id = req.params.id; // Получаем ID пользователя из параметра запроса
    db.run("DELETE FROM users WHERE id = ?", [id], function(err) { // Выполняем запрос к базе данных для удаления пользователя
        if (err) {
            console.error('Error deleting user', err); // Если произошла ошибка, выводим сообщение в консоль
            return res.status(500).json({ error: err.message }); // Возвращаем ошибку сервера с сообщением об ошибке
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' }); // Если пользователь не найден, возвращаем ошибку 404
        }
        res.status(204).end(); // Возвращаем успешный статус без содержимого (204 No Content)
    });
});

// Запуск сервера на заданном порту
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Выводим сообщение в консоль при успешном запуске сервера
});
