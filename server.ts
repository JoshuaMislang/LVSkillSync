import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import authRoutes from "./server/routes/authRoutes";
import { getDb, getDatabasePath } from "./server/db/database";
import { getSessionSecret } from "./server/security/auth";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize SQLite Database and run schema migrations
  try {
    getDb();
    console.log("[Server] SQL Database and schema migrations initialized.");
  } catch (dbErr) {
    console.error("[Server] Database initialization failed:", dbErr);
  }

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser(getSessionSecret()));

  // Health check routes for Cloud Run and dev proxies
  app.get("/api/health", (_req, res) => {
    try {
      const db = getDb();
      const tables = (db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[]).map(t => t.name);
      res.json({
        status: "ok",
        database: "connected",
        engine: "sqlite-wal",
        database_path: getDatabasePath(),
        tables,
        schema_ready: tables.includes("users") && tables.includes("user_sessions") && tables.includes("user_profiles"),
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Authentication and Account API Routes
  app.use("/api/auth", authRoutes);

  // Vite middleware for development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static file serving for production deployment
    const distPath = fs.existsSync(path.join(process.cwd(), "dist"))
      ? path.join(process.cwd(), "dist")
      : __dirname;

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
