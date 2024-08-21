const sqlite3 = require('sqlite3').verbose(); // Подключаем модуль SQLite3 и активируем режим подробных сообщений

require('dotenv').config(); // Загружаем переменные окружения из файла .env

const dbFile = process.env.DB_FILE; // Читаем путь к файлу базы данных из переменных окружения

if (!dbFile) { // Проверяем, был ли указан файл базы данных в переменных окружения
    console.error('No database file specified in .env file'); // Выводим сообщение об ошибке в консоль
    process.exit(1); // Завершаем выполнение процесса Node.js с кодом ошибки 1
}

const db = new sqlite3.Database(dbFile, (err) => { // Создаем новое подключение к базе данных SQLite
    if (err) { // Если произошла ошибка при подключении
        console.error('Could not connect to database', err); // Выводим сообщение об ошибке в консоль
    } else { // Если подключение успешно установлено
        console.log('Connected to database'); // Выводим сообщение об успешном подключении в консоль
    }
});

db.serialize(() => { // Выполняем серию операций базы данных
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)", (err) => { // Создаем таблицу пользователей, если она не существует
        if (err) { // Если произошла ошибка при создании таблицы
            console.error('Could not create table', err); // Выводим сообщение об ошибке в консоль
        } else { // Если таблица успешно создана или уже существует
            console.log('Table created or already exists'); // Выводим сообщение об успешном создании таблицы в консоль
        }
    });
});

module.exports = db; // Экспортируем объект подключения к базе данных для использования в других модулях
