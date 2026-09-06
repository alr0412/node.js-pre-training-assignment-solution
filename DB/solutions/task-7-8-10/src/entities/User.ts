import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Todo } from "./Todo";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: false })
    name!: string;

    @Column({ type: 'text', nullable: false, unique: true })
    email!: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @OneToMany(() => Todo, (todo) => todo.user, { cascade: true })
    todos!: Todo[];
}
