# Supabase Project Commands

This file documents important and potentially destructive commands for managing the Supabase project.

## `supabase db reset --linked`

This is a **DANGEROUS and IRREVERSIBLE** command that resets both your **local** and **remote** (linked) databases.

### What It Does

1.  **Resets Remote Database:** It first connects to your linked Supabase project in the cloud and completely wipes it. This is the equivalent of going to your project dashboard (`Settings` > `Database`) and clicking "Reset database".
    *   **ALL DATA IS PERMANENTLY DELETED.**
    *   All tables, functions, and views are dropped.
    *   All objects in Supabase Storage are permanently deleted.

2.  **Resets Local Database:** After resetting the remote database, it proceeds to reset your local development database (the one running in Docker). It drops the local database and recreates it from scratch by applying all the migration files in your `supabase/migrations` folder.

### When to Use It

You should only use this command in the very early stages of development when you want to completely start over from a clean slate on both your local and remote environments.

**DO NOT** run this command if you have any valuable data, files, or schema in your remote database that you want to keep. There is no "undo" button.

## `supabase gen types`

This command generates TypeScript definitions from your database schema, which is essential for type-safe database queries in your application.

### Generating Types from Local Database

Use this command when you are developing locally and want to generate types from your local Supabase instance (running in Docker).

**Command:**
```bash
supabase gen types typescript --local > src/types/database.ts
```

**Prerequisites:**
*   Docker Desktop must be running.
*   Your local Supabase instance must be started (e.g., via `supabase start`).

### Generating Types from Remote (Linked) Database

Use this command to generate types from your live, remote Supabase project. This is useful when you need to ensure your application's types are in sync with the production database schema.

**Command:**
```bash
supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
```

**How to find your `project-id`:**
*   You can find it in your Supabase project's URL: `https://supabase.com/dashboard/project/<your-project-id>`
*   It is also stored in the `supabase/.temp/project-ref` file after you've linked your project.

