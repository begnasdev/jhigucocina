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
