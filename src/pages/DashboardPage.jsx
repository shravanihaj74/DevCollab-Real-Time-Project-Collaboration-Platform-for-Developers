import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const PROJECTS = [
  { name: "DevCollab Platform", desc: "Main product repo", members: 8, tasks: 24, done: 14, color: "from-indigo-500 to-violet-600", tag: "Active" },
  { name: "AI Code Reviewer", desc: "ML pipeline + API", members: 5, tasks: 18, done: 9, color: "from-cyan-500 to-blue-600", tag: "In Progress" },
  { name: "Mobile App", desc: "React Native client", members: 4, tasks: 31, done: 28, color: "from-emerald-500 to-teal-600", tag: "Review" },
  { name: "Design System", desc: "Component library", members: 3, tasks: 12, done: 12, color: "from-amber-500 to-orange-600", tag: "Done" },
  { name: "Analytics Dashboard", desc: "Data viz module", members: 6, tasks: 20, done: 5, color: "from-pink-500 to-rose-600", tag: "Active" },
  { name: "Docs Site", desc: "Public documentation", members: 2, tasks: 8, done: 6, color: "from-purple-500 to-indigo-600", tag: "Active" },
];

const STATS = [
  { label: "Total Projects", value: "6", sub: "+2 this month", icon: "📁", color: "bg-indigo-50 text-indigo-600" },
  { label: "Open Tasks", value: "47", sub: "12 due today", icon: "✅", color: "bg-amber-50 text-amber-600" },
  { label: "Team Members", value: "12", sub: "3 online now", icon: "👥", color: "bg-emerald-50 text-emerald-600" },
  { label: "AI Reviews", value: "89", sub: "this sprint", icon: "🤖", color: "bg-violet-50 text-violet-600" },
];

const ACTIVITY = [
  { user: "Riya", action: "moved", target: "Auth task → Done", time: "2m ago", avatar: "from-pink-400 to-rose-500" },
  { user: "Ankush", action: "commented on", target: "Kanban board design", time: "15m ago", avatar: "from-blue-400 to-indigo-500" },
  { user: "Sneha", action: "created", target: "New snippet: useDebounce", time: "1h ago", avatar: "from-emerald-400 to-teal-500" },
  { user: "Dev", action: "updated", target: "Wiki: API Reference", time: "2h ago", avatar: "from-amber-400 to-orange-500" },
];

function StatCard({ stat, i }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{stat.label}</p>
          <motion.p
            className="mt-1 text-3xl font-extrabold text-gray-900"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300 }}
          >
            {stat.value}
          </motion.p>
          <p className="mt-1 text-xs text-gray-400">{stat.sub}</p>
        </div>
        <span className={`rounded-xl p-2.5 text-xl ${stat.color}`}>{stat.icon}</span>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, i }) {
  const navigate = useNavigate();
  const pct = Math.round((project.done / project.tasks) * 100);
  const tagColors = {
    Active: "bg-green-100 text-green-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Review: "bg-amber-100 text-amber-700",
    Done: "bg-gray-100 text-gray-600",
  };

  return (
    <motion.div
      variants={fadeUp}
      className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all"
      whileHover={{ y: -5, boxShadow: "0 16px 48px rgba(79,70,229,0.12)" }}
      onClick={() => navigate("/kanban")}
    >
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
          {project.name[0]}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tagColors[project.tag]}`}>
          {project.tag}
        </span>
      </div>

      <h3 className="mt-3 font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
      <p className="mt-0.5 text-xs text-gray-400">{project.desc}</p>

      {/* Progress */}
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{project.done}/{project.tasks} tasks</span>
          <span className="font-semibold text-gray-600">{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${project.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.4 + i * 0.07, duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {Array.from({ length: Math.min(project.members, 4) }).map((_, j) => (
            <div
              key={j}
              className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-violet-500 text-[9px] font-bold text-white flex items-center justify-center"
            >
              {String.fromCharCode(65 + j)}
            </div>
          ))}
          {project.members > 4 && (
            <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 text-[9px] font-bold text-gray-500 flex items-center justify-center">
              +{project.members - 4}
            </div>
          )}
        </div>
        <motion.span
          className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
        >
          Open →
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <AppShell
      title="Dashboard"
      subtitle="DevFusion Team · 6 projects"
      actions={
        <div className="flex gap-2">
          <motion.button
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/workspace/settings")}
          >
            ⚙️ Settings
          </motion.button>
          <motion.button
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(79,70,229,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/new-project")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M7 1v12M1 7h12" />
            </svg>
            New Project
          </motion.button>
        </div>
      }
    >
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} i={i} />)}
        </div>

        {/* Projects grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Projects</h2>
            <div className="flex gap-2">
              {["All", "Active", "Done"].map((f) => (
                <motion.button
                  key={f}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${f === "All" ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {PROJECTS.map((p, i) => <ProjectCard key={p.name} project={p} i={i} />)}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Recent activity */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Recent Activity</h2>
              <motion.button
                className="text-xs font-medium text-indigo-600 hover:underline"
                onClick={() => navigate("/activity")}
                whileHover={{ x: 2 }}
              >
                View all →
              </motion.button>
            </div>
            <div className="space-y-3">
              {ACTIVITY.map((a, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <div className={`h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br ${a.avatar} flex items-center justify-center text-xs font-bold text-white`}>
                    {a.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{a.user}</span> {a.action}{" "}
                      <span className="font-medium text-indigo-600">{a.target}</span>
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-gray-400">{a.time}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold text-gray-900">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Open Kanban Board", path: "/kanban", icon: "📋", color: "hover:bg-indigo-50 hover:text-indigo-700" },
                { label: "Browse Snippets", path: "/snippets", icon: "💻", color: "hover:bg-cyan-50 hover:text-cyan-700" },
                { label: "Open Wiki", path: "/wiki", icon: "📄", color: "hover:bg-emerald-50 hover:text-emerald-700" },
                { label: "Ask AI Assistant", path: "/ai", icon: "🤖", color: "hover:bg-violet-50 hover:text-violet-700" },
                { label: "View Dev Pulse", path: "/pulse", icon: "📈", color: "hover:bg-amber-50 hover:text-amber-700" },
              ].map((action, i) => (
                <motion.button
                  key={action.label}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors ${action.color}`}
                  onClick={() => navigate(action.path)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.07 }}
                >
                  <span className="text-base">{action.icon}</span>
                  {action.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
