import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TEMPLATES = [
  { name: "Blank Project",  desc: "Start from scratch",          icon: "📄", color: "from-gray-400 to-gray-500"    },
  { name: "Web App",        desc: "Frontend + backend sprints",  icon: "🌐", color: "from-blue-500 to-indigo-600"  },
  { name: "Mobile App",     desc: "iOS & Android workflow",      icon: "📱", color: "from-emerald-500 to-teal-600" },
  { name: "API Service",    desc: "Backend microservice",        icon: "⚙️", color: "from-amber-500 to-orange-600" },
  { name: "Design Sprint",  desc: "UI/UX focused workflow",      icon: "🎨", color: "from-pink-500 to-rose-600"    },
  { name: "Hackathon",      desc: "Fast-paced 48h project",      icon: "⚡", color: "from-violet-500 to-purple-600"},
  { name: "ML / AI",        desc: "Data science pipeline",       icon: "🤖", color: "from-cyan-500 to-blue-600"   },
  { name: "Open Source",    desc: "Community-driven project",    icon: "🌍", color: "from-green-500 to-emerald-600"},
];

const COLORS = [
  "from-indigo-500 to-violet-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
];

const MEMBERS = [
  { name: "Ankush", avatar: "from-pink-400 to-rose-500"    },
  { name: "Riya",   avatar: "from-blue-400 to-indigo-500"  },
  { name: "Sneha",  avatar: "from-emerald-400 to-teal-500" },
  { name: "Dev",    avatar: "from-amber-400 to-orange-500" },
];

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    desc: "",
    template: "Blank Project",
    color: COLORS[0],
    members: [],
    visibility: "private",
  });
  const [creating, setCreating] = useState(false);
  const [done, setDone] = useState(false);

  const toggleMember = (name) => {
    setForm((f) => ({
      ...f,
      members: f.members.includes(name)
        ? f.members.filter((m) => m !== name)
        : [...f.members, name],
    }));
  };

  const handleCreate = () => {
    if (!form.name.trim()) return;
    setCreating(true);
    setTimeout(() => { setCreating(false); setDone(true); }, 1800);
    setTimeout(() => navigate("/dashboard"), 3000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 px-4">
      {/* Blobs */}
      <div className="pointer-events-none absolute top-0 right-1/4 h-80 w-80 rounded-full bg-indigo-200 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-violet-200 opacity-20 blur-3xl" />

      <AnimatePresence mode="wait">
        {done ? (
          /* ── Success state ── */
          <motion.div
            key="success"
            className="flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div
              className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${form.color} text-5xl shadow-2xl`}
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6 }}
            >
              {TEMPLATES.find((t) => t.name === form.template)?.icon || "🚀"}
            </motion.div>
            <h2 className="text-2xl font-extrabold text-gray-900">{form.name} created!</h2>
            <p className="text-gray-500">Redirecting to your dashboard...</p>
            <motion.div
              className="h-1 w-48 rounded-full bg-gray-200 overflow-hidden"
            >
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${form.color}`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
        ) : (
          /* ── Form ── */
          <motion.div
            key="form"
            className="w-full max-w-2xl rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-indigo-100/50 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${form.color} px-8 py-6`}>
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {TEMPLATES.find((t) => t.name === form.template)?.icon || "📄"}
                </motion.div>
                <div>
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">New Project</p>
                  <h2 className="text-xl font-extrabold text-white">
                    {form.name || "Untitled Project"}
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Name + desc */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    autoFocus
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="e.g. DevCollab Platform"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="What are you building?"
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  />
                </div>
              </div>

              {/* Template */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Template</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {TEMPLATES.map((t) => (
                    <motion.button
                      key={t.name}
                      className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                        form.template === t.name
                          ? "border-indigo-400 bg-indigo-50 shadow-sm"
                          : "border-gray-100 bg-white hover:border-indigo-200"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm({ ...form, template: t.name })}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <p className="text-xs font-bold text-gray-800 leading-tight">{t.name}</p>
                      <p className="text-[10px] text-gray-400 leading-tight">{t.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Color + visibility */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Project Color</label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <motion.button
                        key={c}
                        className={`h-8 w-8 rounded-full bg-gradient-to-br ${c} transition-all ${
                          form.color === c ? "ring-2 ring-offset-2 ring-indigo-400 scale-110" : ""
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setForm({ ...form, color: c })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Visibility</label>
                  <div className="flex gap-2">
                    {[
                      { val: "private", icon: "🔒", label: "Private" },
                      { val: "public",  icon: "🌍", label: "Public"  },
                    ].map((v) => (
                      <motion.button
                        key={v.val}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                          form.visibility === v.val
                            ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-600 hover:border-indigo-200"
                        }`}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setForm({ ...form, visibility: v.val })}
                      >
                        {v.icon} {v.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add members */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Add Members</label>
                <div className="flex flex-wrap gap-2">
                  {MEMBERS.map((m) => (
                    <motion.button
                      key={m.name}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                        form.members.includes(m.name)
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:border-indigo-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleMember(m.name)}
                    >
                      <div className={`h-5 w-5 rounded-full bg-gradient-to-br ${m.avatar} text-[9px] font-bold text-white flex items-center justify-center`}>
                        {m.name[0]}
                      </div>
                      {m.name}
                      {form.members.includes(m.name) && <span className="text-indigo-500">✓</span>}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-8 py-4">
              <motion.button
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </motion.button>

              <motion.button
                className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all ${
                  form.name.trim()
                    ? `bg-gradient-to-r ${form.color} shadow-indigo-200`
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                whileHover={form.name.trim() ? { scale: 1.05 } : {}}
                whileTap={form.name.trim() ? { scale: 0.95 } : {}}
                onClick={form.name.trim() ? handleCreate : undefined}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Creating...
                  </>
                ) : (
                  "🚀 Create Project"
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
