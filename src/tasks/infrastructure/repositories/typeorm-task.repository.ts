import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from '../../application/repositories/task-repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskOrmEntity } from '../entities/task.orm-entity';
import { TaskMapper } from '../mappers/task.mapper';

@Injectable()
export class TypeOrmTaskRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly ormRepository: Repository<TaskOrmEntity>,
  ) {}

  async create(task: Task): Promise<void> {
    const orm = TaskMapper.toOrm(task);
    await this.ormRepository.save(orm);
  }

  async findById(id: string): Promise<Task | null> {
    const orm = await this.ormRepository.findOneBy({ id });
    if (!orm) return null;
    return TaskMapper.toDomain(orm);
  }

  async save(task: Task): Promise<void> {
    const orm = TaskMapper.toOrm(task);
    await this.ormRepository.save(orm);
  }
}
