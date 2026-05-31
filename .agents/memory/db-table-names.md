---
name: DB table names
description: How Drizzle table exports are named in this project
---

Drizzle tables are exported WITHOUT a `Table` suffix. Examples:
- `conversations` (not `conversationsTable`)
- `messages` (not `messagesTable`)
- `leads` (not `leadsTable`)
- `jobs` (not `jobsTable`)

**How to apply:** Before using a table in a route, grep `lib/db/src/schema/<name>.ts` for `export const` to get the exact exported name. Don't guess.
