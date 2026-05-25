import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import { getProjectHealth } from "../services/ai.service.js";
import { AVATAR_COLORS } from "./KanbanPage.jsx";

/* ── Kanban task data (same as KanbanPage INIT) ── */
const KANBAN_TASKS = {
  todo: [
    { id:"t1", title:"Set up CI/CD pipeline",   priority:"P1", assignee:"Dev",    label:"DevOps",   due:"2026-06-02" },
    { id:"t2", title:"Design onboarding flow",  priority:"P2", assignee:"Sneha",  label:"Design",   due:"2026-06-05" },
    { id:"t3", title:"Write API documentation", priority:"P2", assignee:"Riya",   label:"Docs",     due:"2026-06-08" },
  ],
  inprogress: [
    { id:"t4", title:"Build Kanban drag & drop",priority:"P0", assignee:"Ankush", label:"Frontend", due:"2026-05-30" },
    { id:"t5", title:"Integrate Socket.IO",     priority:"P0", assignee:"Dev",    label:"Backend",  due:"2026-05-28" },
    { id:"t6", title:"AI code review endpoint", priority:"P1", assignee:"Riya",   label:"AI",       due:"2026-06-01" },
  ],
  review: [
    { id:"t7", title:"Auth module (JWT)",       priority:"P0", assignee:"Sneha",  label:"Backend",  due:"2026-05-25" },
    { id:"t8", title:"Responsive navbar",       priority:"P2", assignee:"Ankush", label:"Frontend", due:"2026-05-26" },
  ],
  done: [
    { id:"t9",  title:"Project scaffolding",    priority:"P0", assignee:"Dev",    label:"Setup",    due:"2026-05-20" },
    { id:"t10", title:"Database schema design", priority:"P1", assignee:"Riya",   label:"Backend",  due:"2026-05-22" },
    { id:"t11", title:"Figma design system",    priority:"P1", assignee:"Sneha",  label:"Design",   due:"2026-05-23" },
  ],
};

/* ── Mini bar chart (pure SVG, no library needed) ── */
function VelocityChart({ data }) {
  const max = Math.max(...data.map(d => d.tasks), 1);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <motion.div
            className="w-full rounded-t-md bg-indigo-500"
            style={{ height: `${(d.tasks / max) * 64}px` }}
            initial={{ height: 0 }}
            animate={{ height: `${(d.tasks / max) * 64}px` }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
          />
          <span className="text-[9px] text-gray-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Health score ring ── */
function HealthRing({ score, status }) {
  const color = status === "Healthy" ? "#22c55e" : status === "At Risk" ? "#f59e0b" : "#ef4444";
  const offset = 100 - score;
  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <motion.circle
          cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray="100" strokeLinecap="round"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-gray-900">{score}</span>
        <span className="text-[10px] font-semibold text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

/* ── Metric card ── */
function MetricCard({ label, value, sub, color = "text-gray-900" }) {
  return (
    <motion.div
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </motion.div>
  );
}

export default function ProjectHealthPage() {
  const [loading, setLoading]   = useState(false);
  const [health, setHealth]     = useState(null);
  const [error, setError]       = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectHealth(KANBAN_TASKS, ["Ankush", "Riya", "Sneha", "Dev"]);
      setHealth(data);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load on mount
  useEffect(() => { fetchHealth(); }, []);

  const statusColors = {
    Healthy:  "bg-green-100 text-green-700 border-green-200",
    "At Risk":"bg-amber-100 text-amber-700 border-amber-200",
    Critical: "bg-red-100 text-red-700 border-red-200",
  };

  const insightColors = {
    positive: "border-green-200 bg-green-50",
    warning:  "border-amber-200 bg-amber-50",
    critical: "border-red-200 bg-red-50",
  };
  const insightIcons = { positive: "✅", warning: "⚠️", critical: "🚨" };

  return (
    <AppShell
      title="Project Health"
      subtitle="Live analytics · AI-powered insights"
      actions={
        <motion.button
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={fetchHealth}
          disabled={loading}
        >
          {loading ? (
            <>
              <motion.div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
              Refreshing...
            </>
          ) : "↻ Refresh"}
        </motion.button>
      }
    >
      {/* Error */}
      {error && (
        <motion.div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ⚠️ {error}
        </motion.div>
      )}

      {/* Loading skeleton */}
      {loading && !health && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      <AnimatePresence>
        {health && (
          <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Top row: health score + metrics */}
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-4 items-stretch">

              {/* Health score ring */}
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <HealthRing score={health.healthScore} status={health.status} />
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[health.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {health.status}
                </span>
                {lastRefresh && <p className="text-[10px] text-gray-400">Updated {lastRefresh}</p>}
              </div>

              <MetricCard
                label="Completion"
                value={`${health.metrics.completionRate}%`}
                sub={`${health.metrics.done} of ${health.metrics.total} tasks done`}
                color="text-indigo-600"
              />
              <MetricCard
                label="In Progress"
                value={health.metrics.inProgress}
                sub={`${health.metrics.inReview} in review`}
                color="text-blue-600"
              />
              <MetricCard
                label="Overdue"
                value={health.metrics.overdue}
                sub="tasks past due date"
                color={health.metrics.overdue > 0 ? "text-red-600" : "text-green-600"}
              />
              <MetricCard
                label="P0 Blocked"
                value={health.metrics.p0Blocked}
                sub="critical tasks in To Do"
                color={health.metrics.p0Blocked > 0 ? "text-amber-600" : "text-green-600"}
              />
            </div>

            {/* Middle row: velocity chart + AI insights */}
            <div className="grid grid-cols-2 gap-4">

              {/* Velocity chart */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Task Velocity — Last 7 Days
                </p>
                <VelocityChart data={health.velocity} />
                <p className="mt-3 text-xs text-gray-400">
                  Avg {(health.velocity.reduce((s, d) => s + d.tasks, 0) / 7).toFixed(1)} tasks/day
                </p>
              </div>

              {/* AI Insights */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                  AI Insights
                </p>
                <div className="space-y-2.5">
                  {health.insights?.map((insight, i) => (
                    <motion.div
                      key={i}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 ${insightColors[insight.type] ?? "border-gray-200 bg-gray-50"}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-sm">{insightIcons[insight.type] ?? "💡"}</span>
                      <p className="text-xs text-gray-700 leading-relaxed">{insight.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom row: member contribution */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                Member Contribution
              </p>
              <div className="grid grid-cols-4 gap-4">
                {health.memberStats?.map((member, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[member.name] ?? "from-gray-300 to-gray-400"} text-sm font-bold text-white shadow-sm`}>
                      {member.name[0]}
                    </div>
                    <p className="text-sm font-bold text-gray-800">{member.name}</p>
                    <div className="w-full">
                      {/* Progress bar */}
                      <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <motion.div
                          className="h-1.5 rounded-full bg-indigo-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${member.completion}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                        <span>{member.done}/{member.total} done</span>
                        <span>{member.completion}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
