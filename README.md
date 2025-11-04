# Quotero Core

Monorepo for the Quotero Core application.

## Database Setup

This project uses PostgreSQL with Drizzle ORM. To connect to your Vercel Postgres database:

1. **Vercel Postgres (Production)**
   - When you connect a Postgres database to your Vercel project, it automatically provides the `POSTGRES_URL` environment variable
   - The database client will automatically use this connection string

2. **Local Development**
   - Create a `.env.local` file in the root directory
   - Add your database connection string:
     ```env
     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quotero-core
     ```
   - Or use `POSTGRES_URL` if you have a local Vercel Postgres instance

3. **Environment Variables**
   - The database client supports multiple environment variable names (in order of priority):
     - `POSTGRES_URL` (Vercel Postgres)
     - `DATABASE_URL` (Standard PostgreSQL)
     - `POSTGRES_PRISMA_URL` (Prisma-formatted connection string)

## Database Migrations

Run database migrations using Drizzle Kit:

```bash
# Generate migrations from schema changes
pnpm --filter @workspace/database db:generate

# Push schema changes directly to database
pnpm --filter @workspace/database db:push

# Open Drizzle Studio to view/edit data
pnpm --filter @workspace/database db:studio
```

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```
