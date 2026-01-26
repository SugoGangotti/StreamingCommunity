import Fastify from "fastify";
import { orchestrator } from "./orchestrator.js";
import { stateManager } from "./state.js";
import { searchContent } from "../core/search.js";

const fastify = Fastify({
  logger: true,
});

// GET /search?q=... - Import and execute search functions from core scripts
fastify.get("/search", async (request, reply) => {
  try {
    const { q } = request.query as { q?: string };

    if (!q) {
      return reply
        .status(400)
        .send({ error: 'Query parameter "q" is required' });
    }

    // Import and execute search functions from core scripts
    const searchResults = await searchContent(q);

    return {
      query: q,
      results: searchResults,
      count: searchResults.length,
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Internal server error" });
  }
});

// POST /download - Receive JSON object with URL and method, pass to orchestrator
fastify.post("/download", async (request, reply) => {
  try {
    const { url, method } = request.body as { url?: string; method?: string };

    if (!url || !method) {
      return reply.status(400).send({
        error: "URL and method are required in request body",
      });
    }

    const downloadId = await orchestrator.startDownload({ url, method });

    return {
      message: "Download started",
      downloadId,
      url,
      method,
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Internal server error" });
  }
});

// GET /status - Return status of active downloads from memory (RAM)
fastify.get("/status", async (_, reply) => {
  try {
    const activeDownloads = stateManager.getActiveDownloads();
    const allDownloads = stateManager.getAllDownloads();

    return {
      activeDownloads: activeDownloads.length,
      totalDownloads: allDownloads.length,
      downloads: allDownloads,
      active: activeDownloads,
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Internal server error" });
  }
});

// Health check endpoint
fastify.get("/health", async () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
});

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  fastify.log.info("Shutting down gracefully...");
  await fastify.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  fastify.log.info("Shutting down gracefully...");
  await fastify.close();
  process.exit(0);
});

// Start the server
start();
