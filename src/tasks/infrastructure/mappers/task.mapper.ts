import { Task } from '../../domain/entities/task.entity';
import { TaskOrmEntity } from '../entities/task.orm-entity';

export class TaskMapper {
  static toDomain(orm: TaskOrmEntity): Task {
    return Task.restore({
      id: orm.id,
      title: orm.title,
      description: orm.description ?? undefined,
      status: orm.status,
      priority: orm.priority,
      assigneeId: orm.assigneeId,
      organizationId: orm.organizationId,
      dueDate: orm.dueDate,
      completedAt: orm.completedAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(task: Task): TaskOrmEntity {
    const orm = new TaskOrmEntity();
    orm.id = task.id;
    orm.title = task.title;
    orm.description = task.description ?? null;
    orm.status = task.status;
    orm.priority = task.priority;
    orm.assigneeId = task.assigneeId;
    orm.organizationId = task.organizationId;
    orm.dueDate = task.dueDate;
    orm.completedAt = task.completedAt;
    orm.createdAt = task.createdAt;
    orm.updatedAt = task.updatedAt;
    return orm;
  }
}
