// Импортируем необходимые декораторы и типы из библиотеки TypeORM
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Аннотация @Entity делает этот класс сущностью, которая будет управляться TypeORM
@Entity()
export class User {
    // Аннотация @PrimaryGeneratedColumn указывает, что это свойство будет первичным ключом
    // и значение для него будет генерироваться автоматически
    @PrimaryGeneratedColumn()
    id!: number;

    // Аннотация @Column указывает, что это свойство будет обычным столбцом в таблице
    @Column()
    name!: string;

    // Аннотация @Column указывает, что это свойство будет обычным столбцом в таблице
    @Column()
    email!: string;
}
