import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../application/repositories/task-repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskMapper } from '../mappers/task.mapper';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<void> {
    const data = TaskMapper.toPrisma(task);
    await this.prisma.task.create({ data });
  }

  async findById(id: string): Promise<Task | null> {
    const row = await this.prisma.task.findUnique({ where: { id } });
    if (!row) return null;
    return TaskMapper.toDomain(row);
  }

  async save(task: Task): Promise<void> {
    const data = TaskMapper.toPrisma(task);
    await this.prisma.task.update({ where: { id: data.id }, data });
  }
}
