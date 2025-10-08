import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import type { Filter } from './todo.model';
import type { Todo } from './todo.model';
import { TodosResponseDto } from './dto/todos-response.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all todos with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of todos',
    type: TodosResponseDto,
  })
  getAllTodos(@Query('filter') filter: Filter): TodosResponseDto {
    const todos = this.todosService.findAll(filter);
    return new TodosResponseDto(todos);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a todo by its ID' })
  @ApiResponse({
    status: 200,
    description: 'The found todo',
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  getTodoById(@Param('id') id: string): Todo {
    const todo = this.todosService.findById(id);
    return todo;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'The created todo',
  })
  createTodo(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todosService.createTodo(createTodoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing todo by its ID' })
  @ApiResponse({
    status: 200,
    description: 'The updated todo',
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Todo {
    return this.todosService.updateTodo(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by its ID' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been deleted',
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  deleteTodo(@Param('id') id: string): void {
    return this.todosService.deleteTodo(id);
  }
}
