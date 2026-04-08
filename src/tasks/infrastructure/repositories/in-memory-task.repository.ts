import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../application/repositories/task-repository';
import { Task } from '../../domain/entities/task.entity';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private readonly items = new Map<string, Task>();

  async create(task: Task): Promise<void> {
    this.items.set(task.id, task);
  }

  async findById(id: string): Promise<Task | null> {
    return this.items.get(id) ?? null;
  }

  async save(task: Task): Promise<void> {
    this.items.set(task.id, task);
  }
}
