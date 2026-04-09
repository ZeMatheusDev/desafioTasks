import { Task as PrismaTask } from '@prisma/client';
import { Task } from '../../domain/entities/task.entity';
import { TaskPriority } from '../../domain/enums/task-priority.enum';
import { TaskStatus } from '../../domain/enums/task-status.enum';

export class TaskMapper {
  static toDomain(row: PrismaTask): Task {
    return Task.restore({
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status as unknown as TaskStatus,
      priority: row.priority as unknown as TaskPriority,
      assigneeId: row.assigneeId,
      organizationId: row.organizationId,
      dueDate: row.dueDate,
      completedAt: row.completedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPrisma(task: Task): PrismaTask {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      status: task.status as unknown as PrismaTask['status'],
      priority: task.priority as unknown as PrismaTask['priority'],
      assigneeId: task.assigneeId,
      organizationId: task.organizationId,
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
