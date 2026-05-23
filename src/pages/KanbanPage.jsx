import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import TaskModal from "../components/TaskModal";
import PresenceBar from "../components/PresenceBar";
import { useRealtime } from "../context/RealtimeContext";

/* ── Column config ── */
const COLUMNS = [
  { id: "todo",       label: "To Do",       color: "bg-gray-400",  ring: "border-gray-200"   },
  { id: "inprogress", label: "In Progress", color: "bg-blue-500",  ring: "border-blue-200"   },
  { id: "review",     label: "In Review",   color: "bg-amber-500", ring: "border-amber-200"  },
  { id: "done",       label: "Done",        color: "bg-green-500", ring: "border-green-200"  },
];

export const PRIORITY_COLORS = {
  P0: "bg-red-100 text-red-600",
  P1: "bg-amber-100 text-amber-600",
  P2: "bg-gray-100 text-gray-500",
};

export const LABEL_COLORS = {
  Frontend: "bg-indigo-100 text-indigo-700",
  Backend:  "bg-blue-100 text-blue-700",
  AI:       "bg-violet-100 text-violet-700",
  Design:   "bg-pink-100 text-pink-700",
  DevOps:   "bg-orange-100 text-orange-700",
  Docs:     "bg-teal-100 text-teal-700",
  Setup:    "bg-gray-100 text-gray-600",
};

export const AVATAR_COLORS = {
  Ankush: "from-pink-400 to-rose-500",
  Riya:   "from-blue-400 to-indigo-500",
  Sneha:  "from-emerald-400 to-teal-500",
  Dev:    "from-amber-400 to-orange-500",
};

export const ALL_MEMBERS = ["Ankush", "Riya", "Sneha", "Dev"];
export const ALL_LABELS  = ["Frontend","Backend","AI","Design","DevOps","Docs","Setup"];

/* ── Initial task data ── */
const INIT = {
  todo: [
    { id:"t1", title:"Set up CI/CD pipeline",   desc:"Configure GitHub Actions for auto-deploy to staging and prod.", priority:"P1", assignee:"Dev",    label:"DevOps",   due:"2026-06-02", attachments:[], comments:[] },
    { id:"t2", title:"Design onboarding flow",  desc:"Create Figma mockups for the 3-step onboarding wizard.",       priority:"P2", assignee:"Sneha",  label:"Design",   due:"2026-06-05", attachments:[], comments:[] },
    { id:"t3", title:"Write API documentation", desc:"Document all REST endpoints using OpenAPI 3.0 spec.",          priority:"P2", assignee:"Riya",   label:"Docs",     due:"2026-06-08", attachments:[], comments:[] },
  ],
  inprogress: [
    { id:"t4", title:"Build Kanban drag & drop",desc:"Implement HTML5 drag-and-drop for task cards across columns.",  priority:"P0", assignee:"Ankush", label:"Frontend", due:"2026-05-30", attachments:["wireframe.png"], comments:[{ id:"c1", author:"Riya",   text:"@Ankush can we use framer-motion Reorder?", time:"2h ago" }] },
    { id:"t5", title:"Integrate Socket.IO",     desc:"Set up real-time events for task moves and presence.",          priority:"P0", assignee:"Dev",    label:"Backend",  due:"2026-05-28", attachments:[], comments:[] },
    { id:"t6", title:"AI code review endpoint", desc:"POST /ai/review — accepts code string, returns score + issues.",priority:"P1", assignee:"Riya",   label:"AI",       due:"2026-06-01", attachments:[], comments:[{ id:"c2", author:"Ankush", text:"@Riya check the OpenAI rate limits", time:"5h ago" }] },
  ],
  review: [
    { id:"t7", title:"Auth module (JWT)",       desc:"JWT login, register, refresh token, protected routes.",         priority:"P0", assignee:"Sneha",  label:"Backend",  due:"2026-05-25", attachments:["auth-flow.pdf"], comments:[{ id:"c3", author:"Dev", text:"Looks good! @Sneha just fix the token expiry", time:"1d ago" }] },
    { id:"t8", title:"Responsive navbar",       desc:"Make the top navbar fully responsive for mobile screens.",      priority:"P2", assignee:"Ankush", label:"Frontend", due:"2026-05-26", attachments:[], comments:[] },
  ],
  done: [
    { id:"t9",  title:"Project scaffolding",    desc:"Vite + React + Tailwind + Framer Motion setup.",                priority:"P0", assignee:"Dev",    label:"Setup",    due:"2026-05-20", attachments:[], comments:[] },
    { id:"t10", title:"Database schema design", desc:"PostgreSQL schema for users, workspaces, projects, tasks.",     priority:"P1", assignee:"Riya",   label:"Backend",  due:"2026-05-22", attachments:["schema.sql"], comments:[] },
    { id:"t11", title:"Figma design system",    desc:"Colours, typography, component library in Figma.",              priority:"P1", assignee:"Sneha",  label:"Design",   due:"2026-05-23", attachments:[], comments:[] },
  ],
};

/* ── Kanban card ── */
function KanbanCard({ task, colId, onOpen, onDragStart, onDragOver, onDrop }) {
  const isOverdue = task.due && new Date(task.due) < new Date() && colId !== "done";
  return (
    <motion.div
      layout
      draggable
      onDragStart={(e) => { e.stopPropagation(); onDragStart(task.id, colId); }}
      onDragOver={(e) => e.preventDefault()}
      className="cursor-grab active:cursor-grabbing rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm select-none"
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(79,70,229,0.1)" }}
      onClick={() => onOpen(task, colId)}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${LABEL_COLORS[task.label] || "bg-gray-100 text-gray-500"}`}>{task.label}</span>
        {task.attachments.length > 0 && (
          <span className="ml-auto flex items-center gap-0.5 text-[10px] text-gray-400">
            📎 {task.attachments.length}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-snug">{task.title}</p>
      {task.desc && <p className="mt-1 text-xs text-gray-400 line-clamp-2">{task.desc}</p>}
      <div className="mt-3 flex items-center justify-between">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[task.assignee] || "from-gray-300 to-gray-400"} text-[10px] font-bold text-white`}>
          {task.assignee?.[0]}
        </div>
        <div className="flex items-center gap-2">
          {task.comments.length > 0 && (
            <span className="text-[10px] text-gray-400">💬 {task.comments.length}</span>
          )}
          <span className={`text-[10px] ${isOverdue ? "font-bold text-red-500" : "text-gray-400"}`}>
            📅 {task.due ? new Date(task.due).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "No date"}
            {isOverdue && " ⚠️"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Kanban column ── */
function KanbanColumn({ col, tasks, onAdd, onOpen, onDragStart, onDragOver, onDrop, isDragOver }) {
  return (
    <motion.div
      className={`flex w-72 flex-shrink-0 flex-col rounded-2xl border-2 transition-all duration-200 ${isDragOver ? "border-indigo-400 bg-indigo-50 scale-[1.01]" : "border-gray-100 bg-gray-50"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={(e) => { e.preventDefault(); onDragOver(col.id); }}
      onDrop={(e) => { e.preventDefault(); onDrop(col.id); }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
          <span className="text-sm font-bold text-gray-700">{col.label}</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">{tasks.length}</span>
        </div>
        <motion.button
          className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-indigo-600 transition-colors"
          whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.9 }}
          onClick={() => onAdd(col.id)}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
        </motion.button>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3" style={{ maxHeight: "calc(100vh - 230px)" }}>
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} colId={col.id}
              onOpen={onOpen} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <motion.div
            className={`flex h-20 items-center justify-center rounded-xl border-2 border-dashed text-xs transition-colors ${isDragOver ? "border-indigo-300 text-indigo-400 bg-indigo-50" : "border-gray-200 text-gray-400"}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {isDragOver ? "⬇ Drop here" : "No tasks yet"}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ── List view ── */
function ListView({ tasks, onOpen }) {
  const allTasks = Object.entries(tasks).flatMap(([colId, list]) => list.map(t => ({ task: t, colId })));
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_60px_80px_80px_32px_90px_110px] gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <span>Task</span><span>Priority</span><span>Label</span><span>Assignee</span><span></span><span>Due</span><span>Status</span>
      </div>
      <AnimatePresence>
        {allTasks.map(({ task, colId }, i) => {
          const isOverdue = task.due && new Date(task.due) < new Date() && colId !== "done";
          const col = COLUMNS.find(c => c.id === colId);
          return (
            <motion.div
              key={task.id} layout
              className="grid grid-cols-[1fr_60px_80px_80px_32px_90px_110px] items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm cursor-pointer"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ x: 3, boxShadow: "0 4px 16px rgba(79,70,229,0.08)" }}
              onClick={() => onOpen(task, colId)}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">{task.title}</p>
                {task.desc && <p className="truncate text-xs text-gray-400">{task.desc}</p>}
              </div>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${LABEL_COLORS[task.label] || "bg-gray-100 text-gray-500"}`}>{task.label}</span>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[task.assignee] || "from-gray-300 to-gray-400"} text-[10px] font-bold text-white`}>
                {task.assignee?.[0]}
              </div>
              <span className="text-xs text-gray-400">{task.comments.length > 0 ? `💬${task.comments.length}` : ""}</span>
              <span className={`text-xs ${isOverdue ? "font-bold text-red-500" : "text-gray-400"}`}>
                {task.due ? new Date(task.due).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "—"}{isOverdue ? " ⚠️" : ""}
              </span>
              <span className={`flex items-center gap-1.5 text-xs font-medium`}>
                <span className={`h-2 w-2 rounded-full ${col?.color}`} />
                {col?.label}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ── Calendar view ── */
function CalendarView({ tasks, onOpen }) {
  const today = new Date();
  const year = today.getFullYear(), month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString("default", { month: "long", year: "numeric" });
  const byDay = {};
  Object.entries(tasks).forEach(([colId, list]) => list.forEach(task => {
    if (!task.due) return;
    const d = new Date(task.due);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const k = d.getDate();
      if (!byDay[k]) byDay[k] = [];
      byDay[k].push({ task, colId });
    }
  }));
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="font-bold text-gray-900 text-lg">{monthName}</h3>
      </div>
      <div className="grid grid-cols-7">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="border-b border-gray-100 py-2 text-center text-xs font-bold text-gray-400">{d}</div>
        ))}
        {cells.map((day, i) => {
          const isToday = day === today.getDate();
          const dayTasks = day ? (byDay[day] || []) : [];
          return (
            <div key={i} className={`min-h-[100px] border-b border-r border-gray-50 p-1.5 ${!day ? "bg-gray-50/50" : ""}`}>
              {day && (
                <>
                  <span className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isToday ? "bg-indigo-600 text-white" : "text-gray-500"}`}>{day}</span>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 2).map(({ task, colId }, j) => (
                      <motion.div key={j}
                        className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer ${PRIORITY_COLORS[task.priority]}`}
                        whileHover={{ scale: 1.03 }} onClick={() => onOpen(task, colId)}>
                        {task.title}
                      </motion.div>
                    ))}
                    {dayTasks.length > 2 && <p className="pl-1 text-[10px] text-gray-400">+{dayTasks.length - 2} more</p>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Quick-add modal ── */
function QuickAddModal({ colId, onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("P2");
  const [assignee, setAssignee] = useState("Ankush");
  const [label, setLabel] = useState("Frontend");
  const [due, setDue] = useState("");
  const submit = () => {
    if (!title.trim()) return;
    onAdd(colId, { title: title.trim(), desc: "", priority, assignee, label, due, attachments: [], comments: [] });
    onClose();
  };
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="w-[440px] rounded-2xl bg-white p-6 shadow-2xl"
        initial={{ scale: 0.88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}>
        <h3 className="mb-4 text-base font-bold text-gray-900">Add Task to {COLUMNS.find(c=>c.id===colId)?.label}</h3>
        <div className="space-y-3">
          <input autoFocus className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="Task title..." value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Priority</label>
              <div className="flex gap-1.5">
                {["P0","P1","P2"].map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${priority===p ? PRIORITY_COLORS[p]+" ring-2 ring-offset-1 ring-indigo-300" : "bg-gray-100 text-gray-500"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Assignee</label>
              <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
                value={assignee} onChange={e => setAssignee(e.target.value)}>
                {ALL_MEMBERS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Label</label>
              <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
                value={label} onChange={e => setLabel(e.target.value)}>
                {ALL_LABELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Due Date</label>
              <input type="date" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
                value={due} onChange={e => setDue(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <motion.button className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={submit}>Add Task</motion.button>
          <motion.button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}>Cancel</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main page ── */
export default function KanbanPage() {
  const [tasks, setTasks] = useState(INIT);
  const [view, setView] = useState("board");
  const [addingTo, setAddingTo] = useState(null);
  const [openTask, setOpenTask] = useState(null);
  const [dragInfo, setDragInfo] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  /* consume board events from realtime context */
  const { boardEvents, pushNotification } = useRealtime();
  const processedEvents = useState(new Set())[0];

  useEffect(() => {
    boardEvents.forEach(event => {
      if (processedEvents.has(event.id)) return;
      processedEvents.add(event.id);
      /* apply the remote task move to local state */
      setTasks(prev => {
        const fromCol = event.from;
        const toCol   = event.to;
        if (!prev[fromCol] || !prev[toCol]) return prev;
        const task = prev[fromCol].find(t => t.title === event.taskTitle);
        if (!task) return prev;
        return {
          ...prev,
          [fromCol]: prev[fromCol].filter(t => t.id !== task.id),
          [toCol]:   [task, ...prev[toCol]],
        };
      });
    });
  }, [boardEvents, processedEvents]);

  /* drag handlers */
  const handleDragStart = (taskId, fromCol) => setDragInfo({ taskId, fromCol });
  const handleDragOver  = (colId) => setDragOverCol(colId);
  const handleDrop      = (toCol) => {
    if (!dragInfo || dragInfo.fromCol === toCol) { setDragInfo(null); setDragOverCol(null); return; }
    setTasks(prev => {
      const task = prev[dragInfo.fromCol].find(t => t.id === dragInfo.taskId);
      return {
        ...prev,
        [dragInfo.fromCol]: prev[dragInfo.fromCol].filter(t => t.id !== dragInfo.taskId),
        [toCol]: [task, ...prev[toCol]],
      };
    });
    setDragInfo(null); setDragOverCol(null);
  };

  /* add task */
  const addTask = (colId, fields) => {
    const task = { id: `t${Date.now()}`, ...fields };
    setTasks(prev => ({ ...prev, [colId]: [task, ...prev[colId]] }));
  };

  /* update task (from modal) */
  const updateTask = (colId, updated) => {
    setTasks(prev => ({
      ...prev,
      [colId]: prev[colId].map(t => t.id === updated.id ? updated : t),
    }));
    setOpenTask({ task: updated, colId });
  };

  /* move task (from modal) */
  const moveTask = (taskId, fromCol, toCol) => {
    setTasks(prev => {
      const task = prev[fromCol].find(t => t.id === taskId);
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
        [toCol]: [task, ...prev[toCol]],
      };
    });
    setOpenTask(null);
  };

  return (
    <AppShell title="Kanban Board" subtitle="DevCollab Platform · Sprint 3"
      actions={
        <div className="flex items-center gap-3">
          <PresenceBar />
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 gap-0.5">
            {[["board","⊞ Board"],["list","☰ List"],["calendar","📅 Calendar"]].map(([v, label]) => (
              <motion.button key={v}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${view===v ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                whileTap={{ scale: 0.95 }} onClick={() => setView(v)}>
                {label}
              </motion.button>
            ))}
          </div>
          <motion.button
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setAddingTo("todo")}>
            + Add Task
          </motion.button>
        </div>
      }
    >
      <AnimatePresence>
        {addingTo && <QuickAddModal colId={addingTo} onAdd={addTask} onClose={() => setAddingTo(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {openTask && (
          <TaskModal
            task={openTask.task}
            colId={openTask.colId}
            onClose={() => setOpenTask(null)}
            onUpdate={updateTask}
            onMove={moveTask}
          />
        )}
      </AnimatePresence>

      {view === "board" && (
        <div className="flex gap-4 overflow-x-auto pb-4" onDragLeave={() => setDragOverCol(null)}>
          {COLUMNS.map((col, i) => (
            <motion.div key={col.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.07 }}>
              <KanbanColumn col={col} tasks={tasks[col.id]}
                onAdd={setAddingTo}
                onOpen={(task, colId) => setOpenTask({ task, colId })}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragOver={dragOverCol === col.id} />
            </motion.div>
          ))}
        </div>
      )}

      {view === "list" && (
        <ListView tasks={tasks} onOpen={(task, colId) => setOpenTask({ task, colId })} />
      )}

      {view === "calendar" && (
        <CalendarView tasks={tasks} onOpen={(task, colId) => setOpenTask({ task, colId })} />
      )}
    </AppShell>
  );
}
