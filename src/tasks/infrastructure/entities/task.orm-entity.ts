import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskPriority } from '../../domain/enums/task-priority.enum';
import { TaskStatus } from '../../domain/enums/task-status.enum';

@Entity('tasks')
export class TaskOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'enum', enum: TaskStatus })
  status!: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority })
  priority!: TaskPriority;

  @Column({ type: 'varchar', length: 36, name: 'assignee_id' })
  assigneeId!: string;

  @Column({ type: 'varchar', length: 36, name: 'organization_id' })
  organizationId!: string;

  @Column({ type: 'datetime', name: 'due_date' })
  dueDate!: Date;

  @Column({ type: 'datetime', nullable: true, name: 'completed_at' })
  completedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
