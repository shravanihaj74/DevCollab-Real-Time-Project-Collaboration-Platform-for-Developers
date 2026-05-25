import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

const ALL_ACTIVITY = [
  { id: 1, user: "Riya", avatar: "from-blue-400 to-indigo-500", action: "moved", target: "Auth module", detail: "In Progress → Done", project: "DevCollab Platform", time: "2 min ago", type: "task", icon: "✅" },
  { id: 2, user: "Ankush", avatar: "from-pink-400 to-rose-500", action: "commented on", target: "Kanban board design", detail: "@Sneha can you update the card layout?", project: "DevCollab Platform", time: "15 min ago", type: "comment", icon: "💬" },
  { id: 3, user: "Sneha", avatar: "from-emerald-400 to-teal-500", action: "created snippet", target: "useDebounce Hook", detail: "JavaScript · hooks, performance", project: "DevCollab Platform", time: "1 hour ago", type: "snippet", icon: "💻" },
  { id: 4, user: "Dev", avatar: "from-amber-400 to-orange-500", action: "updated wiki", target: "API Reference", detail: "Added authentication section", project: "DevCollab Platform", time: "2 hours ago", type: "wiki", icon: "📄" },
  { id: 5, user: "Riya", avatar: "from-blue-400 to-indigo-500", action: "created task", target: "AI code review endpoint", detail: "Priority: P1 · Assigned to Riya", project: "AI Code Reviewer", time: "3 hours ago", type: "task", icon: "📋" },
  { id: 6, user: "Ankush", avatar: "from-pink-400 to-rose-500", action: "joined project", target: "Mobile App", detail: "Role: Member", project: "Mobile App", time: "5 hours ago", type: "member", icon: "👋" },
  { id: 7, user: "Sneha", avatar: "from-emerald-400 to-teal-500", action: "completed task", target: "Figma design system", detail: "Closed after 3 days", project: "Design System", time: "6 hours ago", type: "task", icon: "✅" },
  { id: 8, user: "Dev", avatar: "from-amber-400 to-orange-500", action: "pushed code", target: "feat/socket-integration", detail: "3 files changed, +142 lines", project: "DevCollab Platform", time: "8 hours ago", type: "code", icon: "🔀" },
  { id: 9, user: "Riya", avatar: "from-blue-400 to-indigo-500", action: "ran AI review on", target: "JWT middleware", detail: "Score: 8.5/10 · 2 suggestions", project: "DevCollab Platform", time: "10 hours ago", type: "ai", icon: "🤖" },
  { id: 10, user: "Ankush", avatar: "from-pink-400 to-rose-500", action: "moved", target: "Responsive navbar", detail: "To Do → In Progress", project: "DevCollab Platform", time: "1 day ago", type: "task", icon: "📋" },
  { id: 11, user: "Sneha", avatar: "from-emerald-400 to-teal-500", action: "updated wiki", target: "Getting Started", detail: "Added installation steps", project: "DevCollab Platform", time: "1 day ago", type: "wiki", icon: "📄" },
  { id: 12, user: "Dev", avatar: "from-amber-400 to-orange-500", action: "created project", target: "Analytics Dashboard", detail: "6 members invited", project: "Analytics Dashboard", time: "2 days ago", type: "member", icon: "🎉" },
];

const TYPE_COLORS = {
  task: "bg-green-100 text-green-700",
  comment: "bg-blue-100 text-blue-700",
  snippet: "bg-indigo-100 text-indigo-700",
  wiki: "bg-teal-100 text-teal-700",
  member: "bg-pink-100 text-pink-700",
  code: "bg-amber-100 text-amber-700",
  ai: "bg-violet-100 text-violet-700",
};

const PROJECTS = ["All Projects", "DevCollab Platform", "AI Code Reviewer", "Mobile App", "Design System", "Analytics Dashboard"];
const MEMBERS_FILTER = ["All Members", "Ankush", "Riya", "Sneha", "Dev"];

export default function ActivityPage() {
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [memberFilter, setMemberFilter] = useState("All Members");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = ALL_ACTIVITY.filter((a) => {
    const matchProject = projectFilter === "All Projects" || a.project === projectFilter;
    const matchMember = memberFilter === "All Members" || a.user === memberFilter;
    const matchType = typeFilter === "all" || a.type === typeFilter;
    return matchProject && matchMember && matchType;
  });

  return (
    <AppShell
      title="Activity Feed"
      subtitle="All workspace actions · Live"
      actions={
        <div className="flex items-center gap-2">
          <motion.div
            className="h-2 w-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
          <span className="text-xs text-gray-500 font-medium">Live</span>
        </div>
      }
    >
      <div className="flex gap-5">
        {/* Filters sidebar */}
        <div className="w-52 flex-shrink-0 space-y-4">
          {/* Project filter */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Project</p>
            <div className="space-y-0.5">
              {PROJECTS.map((p) => (
                <motion.button
                  key={p}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                    projectFilter === p ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  whileHover={{ x: projectFilter === p ? 0 : 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setProjectFilter(p)}
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Member filter */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Member</p>
            <div className="space-y-0.5">
              {MEMBERS_FILTER.map((m) => (
                <motion.button
                  key={m}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                    memberFilter === m ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  whileHover={{ x: memberFilter === m ? 0 : 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMemberFilter(m)}
                >
                  {m}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</p>
            <div className="space-y-0.5">
              {[["all", "All Types"], ["task", "Tasks"], ["comment", "Comments"], ["snippet", "Snippets"], ["wiki", "Wiki"], ["ai", "AI Actions"]].map(([val, label]) => (
                <motion.button
                  key={val}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                    typeFilter === val ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  whileHover={{ x: typeFilter === val ? 0 : 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTypeFilter(val)}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">{filtered.length} events</p>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                layout
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 3, boxShadow: "0 6px 24px rgba(79,70,229,0.08)" }}
              >
                {/* Avatar */}
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${event.avatar} text-xs font-bold text-white shadow-md`}>
                  {event.user[0]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-gray-900">{event.user}</span>{" "}
                      {event.action}{" "}
                      <span className="font-semibold text-indigo-600">{event.target}</span>
                    </p>
                    <span className="flex-shrink-0 text-xs text-gray-400">{event.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">{event.detail}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[event.type] || "bg-gray-100 text-gray-500"}`}>
                      {event.icon} {event.type}
                    </span>
                    <span className="text-[10px] text-gray-400">in {event.project}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No activity matches your filters
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
