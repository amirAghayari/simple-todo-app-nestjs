import { Injectable, NotFoundException } from '@nestjs/common';
import { Filter, Todo } from './todo.model';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  findAll(filter: Filter): Todo[] {
    let items = this.todos;
    if (filter === 'active') {
      items = items.filter((todo) => !todo.completed);
    } else if (filter === 'completed') {
      items = items.filter((todo) => todo.completed);
    }
    return items;
  }

  findById(id: string): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  createTodo(createTodoDto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: createTodoDto.title,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  updateTodo(id: string, UpdateTodoDto: UpdateTodoDto): Todo {
    let found = false;
    let updatedTodo: Todo = {
      id: '',
      title: '',
      completed: false,
      createdAt: new Date(),
    };
    this.todos = this.todos.map((t) => {
      if (t.id !== id) return t;
      found = true;
      updatedTodo = { ...t, ...UpdateTodoDto };
      return updatedTodo;
    });
    if (!found) {
      throw new NotFoundException('Todo not found');
    }
    return updatedTodo;
  }

  deleteTodo(id: string): void {
    this.todos = this.todos.filter((t) => t.id !== id);
  }
}
