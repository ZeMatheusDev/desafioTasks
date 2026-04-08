export class InvalidTaskTitleError extends Error {
  constructor() {
    super('Task title is required and must have at most 200 characters');
    this.name = 'InvalidTaskTitleError';
  }
}
