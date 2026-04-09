import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TASK_REPOSITORY } from './application/repositories/task-repository';
import { ChangeTaskStatusUseCase } from './application/use-cases/change-task-status.use-case';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { TaskOrmEntity } from './infrastructure/entities/task.orm-entity';
import { TypeOrmTaskRepository } from './infrastructure/repositories/typeorm-task.repository';
import { TasksController } from './presentation/tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity])],
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    ChangeTaskStatusUseCase,
    TypeOrmTaskRepository,
    {
      provide: TASK_REPOSITORY,
      useExisting: TypeOrmTaskRepository,
    },
  ],
})
export class TasksModule {}
