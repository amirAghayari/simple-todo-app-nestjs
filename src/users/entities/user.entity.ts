import { Todo } from 'src/todos/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
