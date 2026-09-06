import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Check } from "typeorm";
import { User } from "./User";

@Entity({ name: "todos" })
@Check(`"title" <> ''`)
@Check(`"status" IN ('active', 'completed')`)
export class Todo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: false })
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'text', nullable: false, default: 'active' })
    status!: 'active' | 'completed';

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @Column({ nullable: true })
    user_id!: number;

    @ManyToOne(() => User, (user) => user.todos, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;
}
