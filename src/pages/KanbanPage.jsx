import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-gray-400", light: "bg-gray-50 border-gray-200" },
  { id: "inprogress", label: "In Progress", color: "bg-blue-500", light: "bg-blue-50 border-blue-200" },
  { id: "review", label: "In Review", color: "bg-amber-500", light: "bg-amber-50 border-amber-200" },
  { id: "done", label: "Done", color: "bg-green-500", light: "bg-green-50 border-green-200" },
];

const INIT_TASKS = {
  todo: [
    { id: "t1", title: "Set up CI/CD pipeline", priority: "P1", assignee: "A", label: "DevOps", due: "Jun 2" },
    { id: "t2", title: "Design onboarding flow", priority: "P2", assignee: "R", label: "Design", due: "Jun 5" },
    { id: "t3", title: "Write API documentation", priority: "P2", assignee: "S", label: "Docs", due: "Jun 8" },
  ],
  inprogress: [
    { id: "t4", title: "Build Kanban drag & drop", priority: "P0", assignee: "A", label: "Frontend", due: "May 30" },
    { id: "t5", title: "Integrate Socket.IO", priority: "P0", assignee: "D", label: "Backend", due: "May 28" },
    { id: "t6", title: "AI code review endpoint", priority: "P1", assignee: "R", label: "AI", due: "Jun 1" },
  ],
  review: [
    { id: "t7", title: "Auth module (JWT)", priority: "P0", assignee: "S", label: "Backend", due: "May 25" },
    { id: "t8", title: "Responsive navbar", priority: "P2", assignee: "A", label: "Frontend", due: "May 26" },
  ],
  done: [
    { id: "t9", title: "Project scaffolding", priority: "P0", assignee: "D", label: "Setup", due: "May 20" },
    { id: "t10", title: "Database schema design", priority: "P1", assignee: "R", label: "Backend", due: "May 22" },
    { id: "t11", title: "Figma design system", priority: "P1", assignee: "S", label: "Design", due: "May 23" },
  ],
};

const PRIORITY_COLORS = {
  P0: "bg-red-100 text-red-600",
  P1: "bg-amber-100 text-amber-600",
  P2: "bg-gray-100 text-gray-500",
};

const LABEL_COLORS = {
  Frontend: "bg-indigo-100 text-indigo-700",
  Backend: "bg-blue-100 text-blue-700",
  AI: "bg-violet-100 text-violet-700",
  Design: "bg-pink-100 text-pink-700",
  DevOps: "bg-orange-100 text-orange-700",
  Docs: "bg-teal-100 text-teal-700",
  Setup: "bg-gray-100 text-gray-600",
};

const AVATAR_COLORS = {
  A: "from-pink-400 to-rose-500",
  R: "from-blue-400 to-indigo-500",
  S: "from-emerald-400 to-teal-500",
  D: "from-amber-400 to-orange-500",
};

const ONLINE = ["A", "R", "S"];

function TaskCard({ task, colId, onMove }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      layoutId={task.id}
      className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm"
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(79,70,229,0.1)" }}
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Priority + label */}
      <div className="mb-2 flex items-center gap-1.5 flex-wrap">
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${LABEL_COLORS[task.label] || "bg-gray-100 text-gray-500"}`}>
          {task.label}
        </span>
      </div>

      <p className="text-sm font-semibold text-gray-800 leading-snug">{task.title}</p>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-xs text-gray-400">Click a column button below to move this task.</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {COLUMNS.filter((c) => c.id !== colId).map((c) => (
                <motion.button
                  key={c.id}
                  className="rounded-lg bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onMove(task.id, colId, c.id); setExpanded(false); }}
                >
                  → {c.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[task.assignee] || "from-gray-300 to-gray-400"} text-[10px] font-bold text-white`}>
          {task.assignee}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="1" y="1.5" width="8" height="7.5" rx="1" />
            <path d="M3 1v1M7 1v1M1 4h8" />
          </svg>
          {task.due}
        </div>
      </div>
    </motion.div>
  );
}

function Column({ col, tasks, onMove, onAdd }) {
  return (
    <motion.div
      className="flex w-72 flex-shrink-0 flex-col rounded-2xl border border-gray-100 bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
          <span className="text-sm font-bold text-gray-700">{col.label}</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">
            {tasks.length}
          </span>
        </div>
        <motion.button
          className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-indigo-600 transition-colors"
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAdd(col.id)}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 1v10M1 6h10" />
          </svg>
        </motion.button>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3" style={{ maxHeight: "calc(100vh - 220px)" }}>
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} colId={col.id} onMove={onMove} />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <motion.div
            className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Drop tasks here
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [addingTo, setAddingTo] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const moveTask = (taskId, fromCol, toCol) => {
    setTasks((prev) => {
      const task = prev[fromCol].find((t) => t.id === taskId);
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter((t) => t.id !== taskId),
        [toCol]: [task, ...prev[toCol]],
      };
    });
  };

  const addTask = (colId) => {
    if (!newTitle.trim()) return;
    const task = {
      id: `t${Date.now()}`,
      title: newTitle.trim(),
      priority: "P2",
      assignee: "A",
      label: "Frontend",
      due: "TBD",
    };
    setTasks((prev) => ({ ...prev, [colId]: [task, ...prev[colId]] }));
    setNewTitle("");
    setAddingTo(null);
  };

  return (
    <AppShell
      title="Kanban Board"
      subtitle="DevCollab Platform · Sprint 3"
      actions={
        <div className="flex items-center gap-3">
          {/* Online presence */}
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {ONLINE.map((u) => (
                <motion.div
                  key={u}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${AVATAR_COLORS[u]} text-[10px] font-bold text-white`}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                >
                  {u}
                </motion.div>
              ))}
            </div>
            <motion.div
              className="h-2 w-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            <span className="text-xs text-gray-500">3 online</span>
          </div>
          <motion.button
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAddingTo("todo")}
          >
            + Add Task
          </motion.button>
        </div>
      }
    >
      {/* Add task modal */}
      <AnimatePresence>
        {addingTo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddingTo(null)}
          >
            <motion.div
              className="w-96 rounded-2xl bg-white p-6 shadow-2xl"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-base font-bold text-gray-900">Add New Task</h3>
              <input
                autoFocus
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Task title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask(addingTo)}
              />
              <div className="mt-4 flex gap-2">
                <motion.button
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addTask(addingTo)}
                >
                  Add Task
                </motion.button>
                <motion.button
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAddingTo(null)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            col={col}
            tasks={tasks[col.id]}
            onMove={moveTask}
            onAdd={setAddingTo}
          />
        ))}
      </div>
    </AppShell>
  );
}
