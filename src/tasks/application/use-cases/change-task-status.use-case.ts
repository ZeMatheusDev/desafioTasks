import { Inject, Injectable } from '@nestjs/common';
import { Either, right } from '../../../core/either';
import { Task } from '../../domain/entities/task.entity';
import { InvalidTaskStatusTransitionError } from '../../domain/errors/invalid-task-status-transition.error';
import { TaskStatus } from '../../domain/enums/task-status.enum';
import { TaskNotFoundError } from '../errors/task-not-found.error';
import { TASK_REPOSITORY } from '../repositories/task-repository';
import type { TaskRepository } from '../repositories/task-repository';

type ChangeTaskStatusInput = {
  id: string;
  status: TaskStatus;
};

type ChangeTaskStatusOutput = {
  task: Task;
};

type ChangeTaskStatusError = TaskNotFoundError | InvalidTaskStatusTransitionError;

@Injectable()
export class ChangeTaskStatusUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    input: ChangeTaskStatusInput,
  ): Promise<Either<ChangeTaskStatusError, ChangeTaskStatusOutput>> {
    const task = await this.taskRepository.findById(input.id);

    if (!task) {
      return {
        isLeft: true,
        isRight: false,
        value: new TaskNotFoundError(input.id),
      };
    }

    const transition = task.changeStatus(input.status);

    if (transition.isLeft) {
      return transition;
    }

    await this.taskRepository.save(task);

    return right({
      task,
    });
  }
}
