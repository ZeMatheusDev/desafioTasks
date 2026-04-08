import { randomUUID } from 'crypto';
import { Either, left, right } from '../../../core/either';
import { DueDateMustBeFutureError } from '../errors/due-date-must-be-future.error';
import { InvalidTaskStatusTransitionError } from '../errors/invalid-task-status-transition.error';
import { InvalidTaskTitleError } from '../errors/invalid-task-title.error';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

type TaskCreateProps = {
  title: string;
  description?: string;
  assigneeId: string;
  organizationId: string;
  dueDate: Date;
  priority?: TaskPriority;
};

type TaskRestoreProps = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  organizationId: string;
  dueDate: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Task {
  private constructor(
    public readonly id: string,
    private _title: string,
    private _description: string | undefined,
    private _status: TaskStatus,
    private _priority: TaskPriority,
    private _assigneeId: string,
    private _organizationId: string,
    private _dueDate: Date,
    private _completedAt: Date | null,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(
    props: TaskCreateProps,
  ): Either<InvalidTaskTitleError | DueDateMustBeFutureError, Task> {
    if (!props.title || props.title.trim().length === 0 || props.title.length > 200) {
      return left(new InvalidTaskTitleError());
    }

    if (props.dueDate.getTime() <= Date.now()) {
      return left(new DueDateMustBeFutureError());
    }

    const now = new Date();

    return right(
      new Task(
        randomUUID(),
        props.title.trim(),
        props.description,
        TaskStatus.PENDING,
        props.priority ?? TaskPriority.MEDIUM,
        props.assigneeId,
        props.organizationId,
        props.dueDate,
        null,
        now,
        now,
      ),
    );
  }

  static restore(props: TaskRestoreProps): Task {
    return new Task(
      props.id,
      props.title,
      props.description,
      props.status,
      props.priority,
      props.assigneeId,
      props.organizationId,
      props.dueDate,
      props.completedAt,
      props.createdAt,
      props.updatedAt,
    );
  }

  changeStatus(status: TaskStatus): Either<InvalidTaskStatusTransitionError, Task> {
    if (this._status === TaskStatus.COMPLETED || this._status === TaskStatus.CANCELLED) {
      return left(new InvalidTaskStatusTransitionError(this._status, status));
    }

    if (this._status === TaskStatus.PENDING) {
      if (status !== TaskStatus.IN_PROGRESS && status !== TaskStatus.CANCELLED) {
        return left(new InvalidTaskStatusTransitionError(this._status, status));
      }
    }

    if (this._status === TaskStatus.IN_PROGRESS) {
      if (status !== TaskStatus.COMPLETED && status !== TaskStatus.CANCELLED) {
        return left(new InvalidTaskStatusTransitionError(this._status, status));
      }
    }

    this._status = status;
    this._updatedAt = new Date();
    this._completedAt = status === TaskStatus.COMPLETED ? new Date() : null;

    return right(this);
  }

  get title(): string {
    return this._title;
  }

  get description(): string | undefined {
    return this._description;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get priority(): TaskPriority {
    return this._priority;
  }

  get assigneeId(): string {
    return this._assigneeId;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assigneeId: this.assigneeId,
      organizationId: this.organizationId,
      dueDate: this.dueDate,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
