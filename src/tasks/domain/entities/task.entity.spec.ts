import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { Task } from './task.entity';

describe('Task Entity', () => {
  it('should create a task with default status and priority', () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = Task.create({
      title: 'Implement reports module',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate,
    });

    expect(result.isRight).toBe(true);
    if (result.isRight) {
      expect(result.value.status).toBe(TaskStatus.PENDING);
      expect(result.value.priority).toBe(TaskPriority.MEDIUM);
      expect(result.value.completedAt).toBeNull();
      expect(result.value.title).toBe('Implement reports module');
    }
  });

  it('should return left when title is empty', () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = Task.create({
      title: '   ',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate,
    });

    expect(result.isLeft).toBe(true);
    if (result.isLeft) {
      expect(result.value.message).toContain('Task title is required');
    }
  });

  it('should return left when due date is not in the future', () => {
    const pastDueDate = new Date(Date.now() - 1000);

    const result = Task.create({
      title: 'Task title',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate: pastDueDate,
    });

    expect(result.isLeft).toBe(true);
    if (result.isLeft) {
      expect(result.value.message).toBe('Due date must be in the future');
    }
  });

  it('should allow transition from PENDING to IN_PROGRESS', () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const createResult = Task.create({
      title: 'Task A',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate,
    });

    expect(createResult.isRight).toBe(true);
    if (createResult.isRight) {
      const task = createResult.value;
      const transition = task.changeStatus(TaskStatus.IN_PROGRESS);

      expect(transition.isRight).toBe(true);
      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
      expect(task.completedAt).toBeNull();
    }
  });

  it('should set completedAt when transitioning to COMPLETED', () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const createResult = Task.create({
      title: 'Task B',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate,
    });

    expect(createResult.isRight).toBe(true);
    if (createResult.isRight) {
      const task = createResult.value;

      task.changeStatus(TaskStatus.IN_PROGRESS);
      const transition = task.changeStatus(TaskStatus.COMPLETED);

      expect(transition.isRight).toBe(true);
      expect(task.status).toBe(TaskStatus.COMPLETED);
      expect(task.completedAt).toBeInstanceOf(Date);
    }
  });

  it('should return left for invalid final-state transition', () => {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const createResult = Task.create({
      title: 'Task C',
      assigneeId: '6e026278-b5f7-406d-a570-ec86f6ebf2af',
      organizationId: '61be1c89-f5db-472f-b245-e30f16283395',
      dueDate,
      priority: TaskPriority.HIGH,
    });

    expect(createResult.isRight).toBe(true);
    if (createResult.isRight) {
      const task = createResult.value;

      task.changeStatus(TaskStatus.IN_PROGRESS);
      task.changeStatus(TaskStatus.COMPLETED);

      const invalid = task.changeStatus(TaskStatus.CANCELLED);
      expect(invalid.isLeft).toBe(true);
      if (invalid.isLeft) {
        expect(invalid.value.message).toBe('Cannot transition from COMPLETED to CANCELLED');
      }
    }
  });
});