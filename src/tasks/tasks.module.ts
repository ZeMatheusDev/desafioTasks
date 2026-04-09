import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TASK_REPOSITORY } from './application/repositories/task-repository';
import { ChangeTaskStatusUseCase } from './application/use-cases/change-task-status.use-case';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository';
import { TasksController } from './presentation/tasks.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    ChangeTaskStatusUseCase,
    PrismaTaskRepository,
    {
      provide: TASK_REPOSITORY,
      useExisting: PrismaTaskRepository,
    },
  ],
})
export class TasksModule {}
