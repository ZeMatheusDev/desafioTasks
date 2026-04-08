import { Module } from '@nestjs/common';
import {
  TASK_REPOSITORY,
  TaskRepository,
} from './application/repositories/task-repository';
import { ChangeTaskStatusUseCase } from './application/use-cases/change-task-status.use-case';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { InMemoryTaskRepository } from './infrastructure/repositories/in-memory-task.repository';
import { TasksController } from './presentation/tasks.controller';

@Module({
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    ChangeTaskStatusUseCase,
    InMemoryTaskRepository,
    {
      provide: TASK_REPOSITORY,
      useFactory: (repo: InMemoryTaskRepository): TaskRepository => repo,
      inject: [InMemoryTaskRepository],
    },
  ],
})
export class TasksModule {}
