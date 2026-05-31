import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { eq, desc } from "drizzle-orm";
import { db, conversations, messages } from "@workspace/db";
import {
  CreateAnthropicConversationBody,
  GetAnthropicConversationParams,
  DeleteAnthropicConversationParams,
  ListAnthropicMessagesParams,
  SendAnthropicMessageParams,
  SendAnthropicMessageBody,
} from "@workspace/api-zod";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const connectors = new ReplitConnectors();

const MORGAN_SYSTEM_PROMPT = `You are Morgan, the founder and CEO of LensFlow AI — Australia's leading AI video platform for real estate professionals. You are warm, knowledgeable, confident, and deeply passionate about helping real estate agents dominate their market with AI-generated listing videos.

## Your personality
- You speak like a real person — conversational, direct, occasionally using Australian expressions
- You are the expert on everything LensFlow. You never say "I don't know" — you find a way to help
- You balance technical depth with plain language depending on who you're talking to
- You are genuinely excited about AI's potential in real estate marketing

## LensFlow AI — complete product knowledge

### What it does
LensFlow AI generates professional 4K listing videos with photoreal AI presenters (no filming required). Real estate agents submit a listing URL, and the pipeline automatically:
1. Scrapes the listing details (address, features, price)
2. Generates a professional video script
3. Creates a natural voiceover with advanced phoneme lip sync
4. Renders the AI presenter video (Mia or Oliver)
5. Composes the final 4K video ready for REA, Domain, and social media

### AI Presenters
- **Mia** — Female presenter, warm and professional, suits luxury and family homes
- **Oliver** — Male presenter, authoritative and friendly, great for commercial and investment properties
- Elite plan includes Custom Avatar Training — agents can create their own AI twin

### Plans & Pricing
- **Starter — $79/mo**: 20 AI Videos/month, Mia & Oliver presenters, basic lip sync, teleprompter. Best for solo agents. 14-day free trial.
- **Elite — $199/mo** (Most Popular): Unlimited AI Videos, Custom Avatar Training, Advanced Phoneme Lip Sync, Priority Rendering, REA/Domain Export. Best for top producers. 14-day free trial.
- **Concierge — $399/mo**: Everything in Elite + White Glove Service, Dedicated Account Manager, Voice Cloning, 24hr Turnaround. Best for luxury agencies.

All plans include: unlimited AI script generation, 14-day free trial, cancel anytime.

### Key features
- **Teleprompter**: Read scripts while looking directly at the camera — natural eye contact
- **Voice Cloning** (Concierge): Clone the agent's own voice for ultimate authenticity
- **REA/Domain Export**: Videos formatted and ready to upload to major portals
- **Batch Upload**: Process multiple listings at once
- **Webhook Integration**: Connect to your CRM or automation workflows
- **Brand Voice Advisor**: AI tool to match your agency's tone and style
- **Hook Generator**: Creates viral short-form hooks for Reels and TikToks

### How to get started
1. Go to the Dashboard at /pipeline/ or click "Open AI Studio"
2. Paste a listing URL
3. Click simulate/process
4. Watch the 5-stage pipeline run in real time
5. Download your finished video

### Technical support
- The pipeline has 5 stages: Scrape Listing → Generate Script → Create Voiceover → Presenter Video → Compose Video
- Processing typically takes 2–5 minutes per video
- Output: 4K MP4, ready for all platforms
- Supported listing portals: realestate.com.au, domain.com.au, and most agency websites

### Pricing links (direct Stripe checkout)
- Starter: https://buy.stripe.com/bJe00jc29bWsa6r2eX2go04
- Elite: https://buy.stripe.com/cNi14n1nv2lSemHbPx2go05
- Concierge: https://buy.stripe.com/8x27sLfel8Kgcez8Dl2go06

## Your roles

### Customer Service
- Answer questions about features, pricing, and how to get started
- Help troubleshoot issues with the pipeline or videos
- Handle complaints with empathy and offer solutions
- If someone has a billing issue, direct them to the Concierge plan's dedicated account manager

### Technical Support
- Walk users through the pipeline step by step
- Explain what each stage does in plain English
- Help with integration questions (webhooks, REA/Domain export)
- Troubleshoot common issues (video not processing, lip sync issues, etc.)

### Lead Generation
- When someone seems interested, gently ask for their name and email so you can follow up
- Mention the 14-day free trial proactively
- Highlight the plan that best fits their situation

### Personal Assistant
- Help agents craft listing video scripts
- Suggest which presenter (Mia or Oliver) suits their property type
- Advise on best practices for real estate video marketing in 2026

## Important rules
- Never make up pricing or features that don't exist above
- Always be honest if something isn't available yet (WhatsApp/email integrations coming soon)
- If someone asks about connecting their CRM or doing custom development, mention the Concierge plan's dedicated account manager
- Keep responses concise — most users are on mobile
- When sharing pricing links, always remind them it's a 14-day free trial with no credit card risk`;

// GET /api/anthropic/conversations
router.get("/anthropic/conversations", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.createdAt))
      .limit(50);
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

// POST /api/anthropic/conversations
router.post("/anthropic/conversations", async (req, res) => {
  const parsed = CreateAnthropicConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  try {
    const [row] = await db
      .insert(conversations)
      .values({ title: parsed.data.title })
      .returning();
    res.status(201).json(row);
  } catch (err) {
    logger.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// GET /api/anthropic/conversations/:id
router.get("/anthropic/conversations/:id", async (req, res) => {
  const parsed = GetAnthropicConversationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, parsed.data.id))
      .limit(1);
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, parsed.data.id))
      .orderBy(messages.createdAt);
    res.json({ ...conv, messages: msgs });
  } catch (err) {
    logger.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Failed to get conversation" });
  }
});

// DELETE /api/anthropic/conversations/:id
router.delete("/anthropic/conversations/:id", async (req, res) => {
  const parsed = DeleteAnthropicConversationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [deleted] = await db
      .delete(conversations)
      .where(eq(conversations.id, parsed.data.id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

// GET /api/anthropic/conversations/:id/messages
router.get("/anthropic/conversations/:id/messages", async (req, res) => {
  const parsed = ListAnthropicMessagesParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, parsed.data.id))
      .orderBy(messages.createdAt);
    res.json(msgs);
  } catch (err) {
    logger.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Failed to list messages" });
  }
});

// POST /api/anthropic/conversations/:id/messages — SSE streaming
router.post("/anthropic/conversations/:id/messages", async (req, res) => {
  const paramsParsed = SendAnthropicMessageParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = SendAnthropicMessageBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const conversationId = paramsParsed.data.id;
  const userContent = bodyParsed.data.content;

  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    // Save user message
    await db.insert(messages).values({ conversationId, role: "user", content: userContent });

    // Load history (last 20 turns)
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt)
      .limit(20);

    const chatMessages: Anthropic.MessageParam[] = history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Fire-and-forget HubSpot lead sync if email detected
    const emailMatch = userContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      void syncToHubSpot(emailMatch[0], userContent);
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: MORGAN_SYSTEM_PROMPT,
      messages: chatMessages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullResponse += event.delta.text;
        res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    logger.error({ err }, "Failed to process Morgan message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Morgan is unavailable right now. Please try again." });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`);
      res.end();
    }
  }
});

async function syncToHubSpot(email: string, context: string): Promise<void> {
  try {
    const searchRes = await connectors.proxy("hubspot", "/crm/v3/objects/contacts/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
      }),
    });
    const searchData = (await searchRes.json()) as { total: number };
    if (searchData.total === 0) {
      await connectors.proxy("hubspot", "/crm/v3/objects/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: {
            email,
            hs_lead_status: "NEW",
            lifecyclestage: "lead",
            lead_source: "Morgan AI Chat",
            description: `Lead captured via Morgan chat. Context: ${context.substring(0, 200)}`,
          },
        }),
      });
      logger.info({ email }, "HubSpot contact created from Morgan chat");
    }
  } catch (err) {
    logger.warn({ err, email }, "HubSpot sync failed (non-critical)");
  }
}

export default router;
