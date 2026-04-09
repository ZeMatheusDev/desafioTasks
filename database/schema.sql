-- Criação da tabela de tarefas

CREATE TABLE IF NOT EXISTS `tasks` (
  `id`              VARCHAR(36)   NOT NULL,
  `title`           VARCHAR(200)  NOT NULL,
  `description`     TEXT          NULL,
  `status`          ENUM('PENDING','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `priority`        ENUM('LOW','MEDIUM','HIGH','URGENT') NOT NULL DEFAULT 'MEDIUM',
  `assignee_id`     VARCHAR(36)   NOT NULL,
  `organization_id` VARCHAR(36)   NOT NULL,
  `due_date`        DATETIME      NOT NULL,
  `completed_at`    DATETIME      NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_tasks_status`          (`status`),
  INDEX `idx_tasks_assignee`        (`assignee_id`),
  INDEX `idx_tasks_organization`    (`organization_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
