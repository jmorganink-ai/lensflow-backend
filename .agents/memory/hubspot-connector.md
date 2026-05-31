---
name: HubSpot connector pattern
description: How to call HubSpot via ReplitConnectors proxy in this project
---

Connection id: `conn_hubspot_01KSYB2VWDD2DRFF5DDN92TJ1X`

**Pattern:**
```ts
import { ReplitConnectors } from "@replit/connectors-sdk";
const connectors = new ReplitConnectors();
await connectors.proxy("hubspot", "/crm/v3/objects/contacts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ properties: { email, ... } }),
});
```

**Search before create** to avoid duplicates: POST to `/crm/v3/objects/contacts/search` with `filterGroups`, check `total === 0` before inserting.

**Why:** Direct HubSpot API calls fail without auth; the connector proxy injects credentials automatically.
