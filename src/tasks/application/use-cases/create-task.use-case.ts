import { Inject, Injectable } from '@nestjs/common';
import { Either } from '../../../core/either';
import { Task } from '../../domain/entities/task.entity';
import { DueDateMustBeFutureError } from '../../domain/errors/due-date-must-be-future.error';
import { InvalidTaskTitleError } from '../../domain/errors/invalid-task-title.error';
import { TaskPriority } from '../../domain/enums/task-priority.enum';
import { TASK_REPOSITORY } from '../repositories/task-repository';
import type { TaskRepository } from '../repositories/task-repository';

type CreateTaskUseCaseInput = {
  title: string;
  description?: string;
  assigneeId: string;
  organizationId: string;
  dueDate: Date;
  priority?: TaskPriority;
};

type CreateTaskUseCaseOutput = {
  task: Task;
};

type CreateTaskUseCaseError = InvalidTaskTitleError | DueDateMustBeFutureError;

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    input: CreateTaskUseCaseInput,
  ): Promise<Either<CreateTaskUseCaseError, CreateTaskUseCaseOutput>> {
    const taskOrError = Task.create({
      title: input.title,
      description: input.description,
      assigneeId: input.assigneeId,
      organizationId: input.organizationId,
      dueDate: input.dueDate,
      priority: input.priority,
    });

    if (taskOrError.isLeft) {
      return taskOrError;
    }

    const task = taskOrError.value;
    await this.taskRepository.create(task);

    return {
      isLeft: false,
      isRight: true,
      value: {
        task,
      },
    };
  }
}
