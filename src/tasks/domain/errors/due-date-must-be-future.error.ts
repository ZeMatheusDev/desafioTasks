export class DueDateMustBeFutureError extends Error {
  constructor() {
    super('Due date must be in the future');
    this.name = 'DueDateMustBeFutureError';
  }
}
