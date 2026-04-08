import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../domain/enums/task-status.enum';

export class ChangeTaskStatusDto {
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
