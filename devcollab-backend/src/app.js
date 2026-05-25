import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT ?? 4000;

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  methods: ["GET", "POST"],
}));
app.use(express.json({ limit: "1mb" }));

// ── Routes ──────────────────────────────────────────────
app.use("/api/ai", aiRoutes);

// ── Health check ────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "devcollab-backend" });
});

// ── Global error handler (must be last) ─────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ DevCollab backend running on http://localhost:${PORT}`);
});
