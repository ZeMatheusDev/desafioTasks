import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/enums/task-status.enum';
import { InMemoryTaskRepository } from '../../infrastructure/repositories/in-memory-task.repository';
import { ChangeTaskStatusUseCase } from './change-task-status.use-case';

describe('ChangeTaskStatusUseCase', () => {
  let repository: InMemoryTaskRepository;
  let sut: ChangeTaskStatusUseCase;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    sut = new ChangeTaskStatusUseCase(repository);
  });

  it('should change status from PENDING to IN_PROGRESS', async () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const taskResult = Task.create({
      title: 'Task for status update',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate,
    });

    expect(taskResult.isRight).toBe(true);
    if (taskResult.isLeft) {
      return;
    }

    const task = taskResult.value;
    await repository.create(task);

    const result = await sut.execute({
      id: task.id,
      status: TaskStatus.IN_PROGRESS,
    });

    expect(result.isRight).toBe(true);
    if (result.isRight) {
      expect(result.value.task.id).toBe(task.id);
      expect(result.value.task.status).toBe(TaskStatus.IN_PROGRESS);
      expect(result.value.task.updatedAt).toBeInstanceOf(Date);
    }
  });

  it('should return left when task does not exist', async () => {
    const result = await sut.execute({
      id: '7fb7a7bb-f9f4-47f3-8d6d-4f6e7f0d1a31',
      status: TaskStatus.IN_PROGRESS,
    });

    expect(result.isLeft).toBe(true);
    if (result.isLeft) {
      expect(result.value.message).toContain('not found');
    }
  });

  it('should return left for invalid transition', async () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const taskResult = Task.create({
      title: 'Task final transition',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate,
    });

    expect(taskResult.isRight).toBe(true);
    if (taskResult.isLeft) {
      return;
    }

    const task = taskResult.value;
    task.changeStatus(TaskStatus.IN_PROGRESS);
    task.changeStatus(TaskStatus.COMPLETED);
    await repository.create(task);

    const result = await sut.execute({
      id: task.id,
      status: TaskStatus.CANCELLED,
    });

    expect(result.isLeft).toBe(true);
    if (result.isLeft) {
      expect(result.value.message).toBe('Cannot transition from COMPLETED to CANCELLED');
    }
  });

  it('should set completedAt when transitioning to COMPLETED', async () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const taskResult = Task.create({
      title: 'Task to complete',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate,
    });

    expect(taskResult.isRight).toBe(true);
    if (taskResult.isLeft) {
      return;
    }

    const task = taskResult.value;
    task.changeStatus(TaskStatus.IN_PROGRESS);
    await repository.create(task);

    const beforeComplete = new Date();

    const result = await sut.execute({
      id: task.id,
      status: TaskStatus.COMPLETED,
    });

    expect(result.isRight).toBe(true);
    if (result.isRight) {
      expect(result.value.task.status).toBe(TaskStatus.COMPLETED);
      expect(result.value.task.completedAt).toBeInstanceOf(Date);
      expect(result.value.task.completedAt!.getTime()).toBeGreaterThanOrEqual(
        beforeComplete.getTime(),
      );
    }
  });
});