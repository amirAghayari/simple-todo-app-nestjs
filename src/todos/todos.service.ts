import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Filter } from './todo.model';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  async findAll(filter: Filter, user: User): Promise<Todo[]> {
    const where = { user: { id: user.id } };
    if (filter === 'active') {
      return this.todoRepo.find({ where: { completed: false } });
    } else if (filter === 'completed') {
      return this.todoRepo.find({ where: { completed: true } });
    }
    return this.todoRepo.find({ where });
  }

  async findById(id: string, user: User): Promise<Todo> {
    const todo = await this.todoRepo.findOne({
      where: { id: id, user: { id: user.id } },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    const todo = this.todoRepo.create({
      title: createTodoDto.title,
      user,
    });

    console.log(user);
    return this.todoRepo.save(todo);
  }

  async updateTodo(
    id: string,
    updateTodoDto: UpdateTodoDto,
    user: User,
  ): Promise<Todo> {
    const todo = await this.findById(id, user);
    const updated = Object.assign(todo, updateTodoDto);
    return this.todoRepo.save(updated);
  }

  async deleteTodo(id: string, user: User): Promise<void> {
    const result = await this.todoRepo.delete({
      id: id,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Todo not found');
    }
  }
}
