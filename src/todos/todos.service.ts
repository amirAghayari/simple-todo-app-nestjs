import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Filter } from './todo.model';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  async findAll(filter: Filter): Promise<Todo[]> {
    if (filter === 'active') {
      return this.todoRepo.find({ where: { completed: false } });
    } else if (filter === 'completed') {
      return this.todoRepo.find({ where: { completed: true } });
    }
    return this.todoRepo.find();
  }

  async findById(id: string): Promise<Todo> {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepo.create({
      title: createTodoDto.title,
    });
    return this.todoRepo.save(todo);
  }

  async updateTodo(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findById(id);
    const updated = Object.assign(todo, updateTodoDto);
    return this.todoRepo.save(updated);
  }

  async deleteTodo(id: string): Promise<void> {
    const result = await this.todoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Todo not found');
    }
  }
}
