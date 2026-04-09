import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '../../domain/enums/task-priority.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar módulo de relatórios', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Criar relatórios mensais de vendas' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '6e026278-b5f7-406d-a570-ec86f6ebf2af', format: 'uuid' })
  @IsUUID()
  assigneeId!: string;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ example: '2027-01-01T23:59:59Z', format: 'date-time' })
  @IsDateString()
  dueDate!: string;
}
