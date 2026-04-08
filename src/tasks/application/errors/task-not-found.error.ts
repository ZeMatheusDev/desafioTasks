export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Task with ID ${id} not found`);
    this.name = 'TaskNotFoundError';
  }
}
