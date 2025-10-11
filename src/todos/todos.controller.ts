import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import type { Filter } from './todo.model';
import { TodosResponseDto } from './dto/todos-response.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Todo } from './todo.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('todos')
@ApiBearerAuth('jwt')
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({
    summary:
      'Retrieve all todos for the authenticated user with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of todos for the authenticated user',
    type: TodosResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllTodos(
    @Query('filter') filter: Filter,
    @Request() req,
  ): Promise<TodosResponseDto> {
    const todos = await this.todosService.findAll(filter, req.user);
    return new TodosResponseDto(todos);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a todo by its ID for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'The found todo',
    type: Todo,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async getTodoById(@Param('id') id: string, @Request() req): Promise<Todo> {
    return await this.todosService.findById(id, req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo for the authenticated user' })
  @ApiResponse({
    status: 201,
    description: 'The created todo',
    type: Todo,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return await this.todosService.createTodo(createTodoDto, req.user);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing todo by its ID for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated todo',
    type: Todo,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return await this.todosService.updateTodo(id, updateTodoDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a todo by its ID for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'The todo has been deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async deleteTodo(@Param('id') id: string, @Request() req): Promise<void> {
    return await this.todosService.deleteTodo(id, req.user);
  }
}
