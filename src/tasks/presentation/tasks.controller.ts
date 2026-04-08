import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
} from '@nestjs/common';
import { TaskNotFoundError } from '../application/errors/task-not-found.error';
import { ChangeTaskStatusUseCase } from '../application/use-cases/change-task-status.use-case';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case';
import { InvalidTaskStatusTransitionError } from '../domain/errors/invalid-task-status-transition.error';
import { ChangeTaskStatusDto } from './dto/change-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly changeTaskStatusUseCase: ChangeTaskStatusUseCase,
  ) {}

  @Post()
  async create(
    @Body() body: CreateTaskDto,
    @Headers('x-organization-id') organizationId?: string,
  ) {
    if (!organizationId) {
      throw new BadRequestException('organizationId is required in x-organization-id header');
    }

    const result = await this.createTaskUseCase.execute({
      title: body.title,
      description: body.description,
      assigneeId: body.assigneeId,
      organizationId,
      dueDate: new Date(body.dueDate),
      priority: body.priority,
    });

    if (result.isLeft) {
      throw new BadRequestException(result.value.message);
    }

    return result.value.task.toJSON();
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ChangeTaskStatusDto,
  ) {
    const result = await this.changeTaskStatusUseCase.execute({
      id,
      status: body.status,
    });

    if (result.isLeft) {
      if (result.value instanceof TaskNotFoundError) {
        throw new NotFoundException(result.value.message);
      }

      if (result.value instanceof InvalidTaskStatusTransitionError) {
        throw new BadRequestException(result.value.message);
      }

      throw new BadRequestException(result.value.message);
    }

    return {
      id: result.value.task.id,
      status: result.value.task.status,
      updatedAt: result.value.task.updatedAt,
    };
  }
}
