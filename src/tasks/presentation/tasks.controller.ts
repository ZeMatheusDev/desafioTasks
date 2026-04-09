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
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { TaskNotFoundError } from '../application/errors/task-not-found.error';
import { ChangeTaskStatusUseCase } from '../application/use-cases/change-task-status.use-case';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case';
import { InvalidTaskStatusTransitionError } from '../domain/errors/invalid-task-status-transition.error';
import { ChangeTaskStatusDto } from './dto/change-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@ApiTags('Tasks')
@ApiSecurity('x-organization-id')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly changeTaskStatusUseCase: ChangeTaskStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar tarefa' })
  @ApiHeader({ name: 'x-organization-id', required: true, description: 'UUID da organização' })
  @ApiCreatedResponse({ description: 'Tarefa criada com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou regra de negócio violada' })
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
  @ApiOperation({ summary: 'Alterar status da tarefa' })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', format: 'uuid' })
  @ApiOkResponse({ description: 'Status alterado com sucesso' })
  @ApiBadRequestResponse({ description: 'Transição de status inválida' })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
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

      throw new BadRequestException((result.value as Error).message);
    }

    return {
      id: result.value.task.id,
      status: result.value.task.status,
      updatedAt: result.value.task.updatedAt,
    };
  }
}
