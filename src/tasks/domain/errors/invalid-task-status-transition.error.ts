import { TaskStatus } from '../enums/task-status.enum';

export class InvalidTaskStatusTransitionError extends Error {
  constructor(from: TaskStatus, to: TaskStatus) {
    super(`Cannot transition from ${from} to ${to}`);
    this.name = 'InvalidTaskStatusTransitionError';
  }
}
