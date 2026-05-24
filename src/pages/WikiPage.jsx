import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

const PAGES = [
  {
    id: 1, title: "Getting Started", icon: "🚀", updated: "2h ago",
    content: [
      { type: "h1", text: "Getting Started with DevCollab" },
      { type: "p", text: "Welcome to DevCollab — the unified workspace for engineering teams. This guide will help you set up your first workspace and project." },
      { type: "h2", text: "1. Create a Workspace" },
      { type: "p", text: "A workspace is your team's home. Think of it like a GitHub organisation. Click New Workspace from the dashboard and give it a name." },
      { type: "h2", text: "2. Invite Members" },
      { type: "p", text: "Go to Settings → Members and send invite links via email. You can assign roles: Owner, Admin, Member, or Viewer." },
      { type: "code", text: "npm install devcollab-cli\ndevcollab init my-workspace" },
      { type: "h2", text: "3. Create Your First Project" },
      { type: "p", text: "Inside your workspace, click New Project. Each project gets its own Kanban board, wiki, snippets, and AI assistant." },
    ],
  },
  {
    id: 2, title: "API Reference", icon: "📡", updated: "1d ago",
    content: [
      { type: "h1", text: "API Reference" },
      { type: "p", text: "DevCollab exposes a REST API and WebSocket interface for real-time collaboration." },
      { type: "h2", text: "Authentication" },
      { type: "p", text: "All API requests require a Bearer token in the Authorization header." },
      { type: "code", text: "Authorization: Bearer <your_jwt_token>" },
      { type: "h2", text: "Projects Endpoint" },
      { type: "p", text: "GET /api/projects — Returns all projects in the workspace." },
      { type: "code", text: 'curl -H "Authorization: Bearer TOKEN" \\\n  https://api.devcollab.io/projects' },
    ],
  },
  {
    id: 3, title: "Architecture", icon: "🏗️", updated: "3d ago",
    content: [
      { type: "h1", text: "System Architecture" },
      { type: "p", text: "DevCollab is built on a microservices architecture with real-time capabilities powered by Socket.IO." },
      { type: "h2", text: "Tech Stack" },
      { type: "p", text: "Frontend: React + Vite + Framer Motion + Tailwind CSS" },
      { type: "p", text: "Backend: Node.js + Express + Socket.IO + PostgreSQL" },
      { type: "p", text: "AI: OpenAI GPT-4 + LangChain for project assistant features" },
      { type: "code", text: "Client → Nginx → API Gateway\n       ↓\n  Socket.IO Server\n       ↓\n  PostgreSQL + Redis" },
    ],
  },
  {
    id: 4, title: "Kanban Guide", icon: "📋", updated: "5d ago",
    content: [
      { type: "h1", text: "Using the Kanban Board" },
      { type: "p", text: "The Kanban board is the heart of task management in DevCollab. Tasks flow through four stages." },
      { type: "h2", text: "Columns" },
      { type: "p", text: "To Do → In Progress → In Review → Done" },
      { type: "h2", text: "Task Properties" },
      { type: "p", text: "Each task has: title, description, assignee, priority (P0/P1/P2), due date, labels, and attachments." },
      { type: "h2", text: "Real-time Updates" },
      { type: "p", text: "When a teammate moves a task, you'll see it animate to the new column instantly via WebSocket." },
    ],
  },
];

function ContentBlock({ block, i }) {
  const base = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { delay: i * 0.05 } } };
  if (block.type === "h1") return (
    <motion.h1 variants={base} className="text-2xl font-extrabold text-gray-900 mt-2 mb-3">{block.text}</motion.h1>
  );
  if (block.type === "h2") return (
    <motion.h2 variants={base} className="text-lg font-bold text-gray-800 mt-5 mb-2 flex items-center gap-2">
      <span className="h-1 w-4 rounded-full bg-indigo-500 inline-block" />
      {block.text}
    </motion.h2>
  );
  if (block.type === "code") return (
    <motion.pre
      variants={base}
      className="my-3 overflow-auto rounded-xl p-4 font-mono text-sm text-green-300 leading-relaxed"
      style={{ background: "#0f172a" }}
    >
      {block.text}
    </motion.pre>
  );
  return (
    <motion.p variants={base} className="text-gray-600 leading-relaxed mb-2">{block.text}</motion.p>
  );
}

export default function WikiPage() {
  const [activePage, setActivePage] = useState(PAGES[0]);
  const [editing, setEditing] = useState(false);

  return (
    <AppShell
      title="Wiki"
      subtitle="Project documentation · 4 pages"
      actions={
        <div className="flex gap-2">
          <motion.button
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${editing ? "bg-green-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditing((e) => !e)}
          >
            {editing ? "✓ Save" : "✏️ Edit"}
          </motion.button>
          <motion.button
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + New Page
          </motion.button>
        </div>
      }
    >
      <div className="flex gap-5 h-full">
        {/* Sidebar pages list */}
        <div className="w-56 flex-shrink-0 space-y-1">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Pages</p>
          {PAGES.map((page) => (
            <motion.button
              key={page.id}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                activePage.id === page.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              whileHover={{ x: activePage.id === page.id ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActivePage(page)}
            >
              <span className="text-base">{page.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{page.title}</p>
                <p className={`text-[10px] ${activePage.id === page.id ? "text-indigo-200" : "text-gray-400"}`}>
                  {page.updated}
                </p>
              </div>
            </motion.button>
          ))}

          {/* Version history */}
          <div className="mt-4 rounded-xl border border-gray-100 bg-white p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Version History</p>
            {["v3 — Today", "v2 — Yesterday", "v1 — May 20"].map((v, i) => (
              <motion.div
                key={v}
                className="flex items-center gap-2 py-1.5 cursor-pointer group"
                whileHover={{ x: 2 }}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-indigo-500" : "bg-gray-300"}`} />
                <span className={`text-xs ${i === 0 ? "font-semibold text-indigo-600" : "text-gray-500 group-hover:text-gray-700"}`}>{v}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage.id}
            className="flex-1 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {editing ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700 font-medium">
                  ✏️ Editing mode — Rich text editor active
                </div>
                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-gray-50 p-2">
                  {["B", "I", "U", "H1", "H2", "• List", "{ } Code", "🔗 Link", "📷 Image"].map((tool) => (
                    <motion.button
                      key={tool}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      {tool}
                    </motion.button>
                  ))}
                </div>
                <textarea
                  className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  rows={20}
                  defaultValue={activePage.content.map((b) => b.text).join("\n\n")}
                />
              </div>
            ) : (
              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="show"
                className="prose max-w-none"
              >
                {activePage.content.map((block, i) => (
                  <ContentBlock key={i} block={block} i={i} />
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
