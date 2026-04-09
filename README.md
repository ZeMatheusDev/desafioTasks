# Desafio Técnico - Backend Sênior

Módulo de gerenciamento de tarefas implementado com **NestJS + TypeScript + MySQL**, seguindo Clean Architecture e Domain-Driven Design.

## Stack

- **Runtime**: Node.js
- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de dados**: MySQL
- **ORM**: TypeORM
- **Testes**: Jest

## Arquitetura

O módulo de tasks está organizado em 4 camadas:

- **Domain** — entidade rica com regras de negócio, enums e erros de domínio
- **Application** — use cases e interface do repositório
- **Infrastructure** — entidade ORM, mapper e repositório TypeORM
- **Presentation** — controller, DTOs e validação de entrada

## Pré-requisitos

- Node.js 20+
- MySQL 8+ com banco `desafioBack` criado

## Configuração do banco

1. Crie o banco no MySQL:

```sql
CREATE DATABASE desafioBack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Execute o script de criação da tabela:

```bash
mysql -u root -p desafioBack < database/schema.sql
```

3. Configure as variáveis de ambiente copiando o `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=desafioBack
PORT=3000
```

## Instalação

```bash
npm install
```

## Rodando a API

```bash
# desenvolvimento (watch mode)
npm run start:dev

# produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000`.

## Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/docs
```

## Endpoints

Base URL: `/api/v1`

### POST /api/v1/tasks — Criar tarefa

Header obrigatório: `x-organization-id: <uuid-da-organizacao>`

> O sistema não possui módulo de autenticação ou cadastro de organizações. Passe qualquer UUID válido neste header — ele será salvo como `organizationId` da tarefa. Em produção, este valor viria do token JWT do usuário autenticado.
>
> Exemplo para testes: `61be1c89-f5db-472f-b245-e30f16283395`

```json
{
  "title": "Implementar módulo de relatórios",
  "description": "Criar relatórios mensais de vendas",
  "assigneeId": "6e026278-b5f7-406d-a570-ec86f6ebf2af",
  "priority": "HIGH",
  "dueDate": "2027-01-01T23:59:59Z"
}
```

### PATCH /api/v1/tasks/:id/status — Alterar status

```json
{
  "status": "IN_PROGRESS"
}
```

Transições válidas:
- `PENDING` → `IN_PROGRESS`, `CANCELLED`
- `IN_PROGRESS` → `COMPLETED`, `CANCELLED`
- `COMPLETED` e `CANCELLED` são estados finais

## Testes

```bash
# rodar testes unitários
npm run test

# rodar com cobertura
npm run test:cov
```

Arquivos de teste:

- `src/tasks/domain/entities/task.entity.spec.ts`
- `src/tasks/application/use-cases/change-task-status.use-case.spec.ts`
