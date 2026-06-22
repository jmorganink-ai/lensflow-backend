import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "./logger";

const connectors = new ReplitConnectors();

interface UserInfo {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

export async function syncUserToHubSpot(user: UserInfo): Promise<void> {
  if (!user.email) return;

  try {
    // Check if contact already exists
    const searchRes = await connectors.proxy("hubspot", "/crm/v3/objects/contacts/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: user.email }] }],
        properties: ["email", "hs_lead_status"],
      }),
    });

    const searchData = (await searchRes.json()) as { total: number; results?: Array<{ id: string }> };

    if (searchData.total > 0 && searchData.results?.[0]) {
      // Update existing contact to mark as a pipeline user
      const contactId = searchData.results[0].id;
      await connectors.proxy("hubspot", `/crm/v3/objects/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: {
            hs_lead_status: "IN_PROGRESS",
            lifecyclestage: "customer",
          },
        }),
      });
      logger.info({ email: user.email, contactId }, "HubSpot contact updated on login");
    } else {
      // Create new contact
      await connectors.proxy("hubspot", "/crm/v3/objects/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: {
            email: user.email,
            firstname: user.firstName ?? "",
            lastname: user.lastName ?? "",
            hs_lead_status: "NEW",
            lifecyclestage: "customer",
            lead_source: "LensFlow AI Pipeline",
          },
        }),
      });
      logger.info({ email: user.email }, "HubSpot contact created on signup");
    }
  } catch (err) {
    // Non-blocking — never fail login because of HubSpot
    logger.warn({ err, email: user.email }, "HubSpot contact sync failed (non-fatal)");
  }
}
