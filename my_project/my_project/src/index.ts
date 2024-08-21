import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import { User } from "./entity/User";
import dotenv from 'dotenv';
import { config } from 'process';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

createConnection().then(connection => {
    const userRepository = connection.getRepository(User);

    // Получение всех пользователей
    app.get('/users', async (req: Request, res: Response) => {
        const users = await userRepository.find();
        res.json(users);
    });

    // Получение пользователя по ID
    app.get('/users/:id', async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id, 10); 
        const user =  await userRepository.findOne({ where: { id } }); ;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });

    // Создание нового пользователя
    app.post('/users', async (req: Request, res: Response) => {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const user = new User();
        user.name = name;
        user.email = email;
        await userRepository.save(user);
        res.status(201).json(user);
    });

    // Обновление пользователя по ID
app.put('/users/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10); // Преобразуем параметр id в число
    const { name, email } = req.body;

    try {
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Обновляем данные пользователя
        user.name = name || user.name; // Если name передан в body, обновляем, иначе оставляем без изменений
        user.email = email || user.email; // Аналогично с email

        await userRepository.save(user); // Сохраняем обновленного пользователя в базе данных
        res.json(user); // Отправляем обновленного пользователя в ответе
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Удаление пользователя по ID
app.delete('/users/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10); // Преобразуем параметр id в число

    try {
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await userRepository.remove(user); // Удаляем пользователя из базы данных
        res.status(204).end(); // Отправляем успешный статус без содержимого
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
