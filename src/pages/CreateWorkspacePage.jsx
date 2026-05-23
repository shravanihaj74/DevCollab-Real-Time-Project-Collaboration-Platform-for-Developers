import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = ["Workspace", "Invite Team", "First Project"];

const AVATARS = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
];

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.25 } }),
};

/* ── Step 1: Workspace details ── */
function StepWorkspace({ data, onChange }) {
  const icons = ["💻", "🚀", "🎯", "⚡", "🔥", "🌟", "🛠️", "🎨"];
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Workspace Name <span className="text-red-400">*</span>
        </label>
        <input
          autoFocus
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          placeholder="e.g. DevFusion Team"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
        <textarea
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          placeholder="What does your team build?"
          rows={3}
          value={data.desc}
          onChange={(e) => onChange({ ...data, desc: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Pick an Icon</label>
        <div className="flex flex-wrap gap-2">
          {icons.map((icon) => (
            <motion.button
              key={icon}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                data.icon === icon
                  ? "bg-indigo-600 shadow-lg shadow-indigo-200 ring-2 ring-indigo-400"
                  : "bg-gray-100 hover:bg-indigo-50"
              }`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange({ ...data, icon })}
            >
              {icon}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Workspace URL <span className="text-red-400">*</span></label>
        <div className="flex items-center rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
          style={{ borderColor: data.slug.trim() ? "#4f46e5" : "#e5e7eb" }}>
          <span className="bg-gray-50 px-3 py-3 text-sm text-gray-400 border-r border-gray-200">
            devcollab.io/
          </span>
          <input
            className="flex-1 px-3 py-3 text-sm outline-none"
            placeholder="your-team (required)"
            value={data.slug}
            onChange={(e) => onChange({ ...data, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
          />
        </div>
        {!data.slug.trim() && (
          <p className="mt-1 text-[11px] text-red-400">Workspace URL is required to continue</p>
        )}
      </div>
    </div>
  );
}

/* ── Step 2: Invite members ── */
function StepInvite({ data, onChange }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  const addInvite = () => {
    if (!email.trim() || !email.includes("@")) return;
    onChange({ ...data, invites: [...data.invites, { email: email.trim(), role }] });
    setEmail("");
  };

  const removeInvite = (i) => {
    onChange({ ...data, invites: data.invites.filter((_, idx) => idx !== i) });
  };

  const ROLES = ["Owner", "Admin", "Member", "Viewer"];
  const ROLE_DESC = {
    Owner: "Full access, billing, delete workspace",
    Admin: "Manage members, projects, settings",
    Member: "Create & edit tasks, docs, snippets",
    Viewer: "Read-only access to all content",
  };
  const ROLE_COLORS = {
    Owner: "bg-red-100 text-red-700",
    Admin: "bg-amber-100 text-amber-700",
    Member: "bg-indigo-100 text-indigo-700",
    Viewer: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-5">
      {/* Role info cards */}
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map((r) => (
          <motion.div
            key={r}
            className={`rounded-xl border p-3 cursor-pointer transition-all ${
              role === r ? "border-indigo-400 bg-indigo-50" : "border-gray-100 bg-white hover:border-indigo-200"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole(r)}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_COLORS[r]}`}>{r}</span>
              {role === r && (
                <motion.div
                  className="ml-auto h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
              )}
            </div>
            <p className="text-[10px] text-gray-400">{ROLE_DESC[r]}</p>
          </motion.div>
        ))}
      </div>

      {/* Email input */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Invite by Email</label>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="teammate@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addInvite()}
          />
          <motion.button
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addInvite}
          >
            Invite
          </motion.button>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          They'll receive an email with a link to join as <span className={`font-semibold rounded px-1 ${ROLE_COLORS[role]}`}>{role}</span>
        </p>
      </div>

      {/* Invited list */}
      <AnimatePresence>
        {data.invites.length > 0 && (
          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Pending Invites</p>
            {data.invites.map((inv, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-2.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${AVATARS[i % AVATARS.length]} text-xs font-bold text-white`}>
                  {inv.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">{inv.email}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_COLORS[inv.role]}`}>{inv.role}</span>
                <motion.button
                  className="text-gray-300 hover:text-red-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeInvite(i)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 2l10 10M12 2L2 12" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {data.invites.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-8 text-center">
          <span className="text-3xl mb-2">👥</span>
          <p className="text-sm font-medium text-gray-500">No invites yet</p>
          <p className="text-xs text-gray-400">You can always invite people later from Settings</p>
        </div>
      )}
    </div>
  );
}

/* ── Step 3: First project ── */
function StepProject({ data, onChange }) {
  const templates = [
    { name: "Blank Project", desc: "Start from scratch", icon: "📄" },
    { name: "Web App", desc: "Frontend + backend tasks", icon: "🌐" },
    { name: "Mobile App", desc: "iOS & Android sprints", icon: "📱" },
    { name: "API Service", desc: "Backend microservice", icon: "⚙️" },
    { name: "Design Sprint", desc: "UI/UX focused workflow", icon: "🎨" },
    { name: "Hackathon", desc: "Fast-paced 48h project", icon: "⚡" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Project Name <span className="text-red-400">*</span>
        </label>
        <input
          autoFocus
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          placeholder="e.g. DevCollab Platform"
          value={data.projectName}
          onChange={(e) => onChange({ ...data, projectName: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Start from a Template</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {templates.map((t) => (
            <motion.button
              key={t.name}
              className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                data.template === t.name
                  ? "border-indigo-400 bg-indigo-50 shadow-sm"
                  : "border-gray-100 bg-white hover:border-indigo-200"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange({ ...data, template: t.name })}
            >
              <span className="text-xl">{t.icon}</span>
              <p className="text-xs font-bold text-gray-800">{t.name}</p>
              <p className="text-[10px] text-gray-400">{t.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function CreateWorkspacePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [workspace, setWorkspace] = useState({ name: "", desc: "", icon: "💻", slug: "" });
  const [invite, setInvite] = useState({ invites: [] });
  const [project, setProject] = useState({ projectName: "", template: "Blank Project" });

  const goNext = () => {
    if (step < STEPS.length - 1) { setDir(1); setStep((s) => s + 1); }
    else { navigate("/dashboard"); }
  };
  const goBack = () => { setDir(-1); setStep((s) => s - 1); };

  const canNext = () => {
    if (step === 0) return workspace.name.trim().length > 0 && workspace.slug.trim().length > 0;
    if (step === 2) return project.projectName.trim().length > 0;
    return true;
  };

  const stepContent = [
    <StepWorkspace data={workspace} onChange={setWorkspace} />,
    <StepInvite data={invite} onChange={setInvite} />,
    <StepProject data={project} onChange={setProject} />,
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4">
      {/* Background blobs */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-200 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-violet-200 opacity-20 blur-3xl" />

      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-indigo-100/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-xl">
                {workspace.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest">
                  Step {step + 1} of {STEPS.length}
                </p>
                <h2 className="text-lg font-bold text-white">{STEPS[step]}</h2>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-white"
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Step pills */}
            <div className="mt-3 flex gap-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    i < step ? "bg-white text-indigo-600" :
                    i === step ? "bg-white/30 text-white ring-2 ring-white" :
                    "bg-white/10 text-white/50"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${i === step ? "text-white" : "text-white/50"}`}>{s}</span>
                  {i < STEPS.length - 1 && <div className="h-px w-4 bg-white/20" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="px-8 py-6 min-h-[360px] overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {stepContent[step]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-8 py-4">
            <motion.button
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                step === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"
              }`}
              whileHover={step > 0 ? { scale: 1.03 } : {}}
              whileTap={step > 0 ? { scale: 0.97 } : {}}
              onClick={step > 0 ? goBack : undefined}
              disabled={step === 0}
            >
              ← Back
            </motion.button>

            <div className="flex items-center gap-3">
              {step < STEPS.length - 1 && (
                <motion.button
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ x: 2 }}
                  onClick={goNext}
                >
                  Skip
                </motion.button>
              )}
              <motion.button
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all ${
                  canNext()
                    ? "bg-indigo-600 shadow-indigo-200 hover:shadow-indigo-300"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                whileHover={canNext() ? { scale: 1.05, boxShadow: "0 8px 24px rgba(79,70,229,0.4)" } : {}}
                whileTap={canNext() ? { scale: 0.95 } : {}}
                onClick={canNext() ? goNext : undefined}
              >
                {step === STEPS.length - 1 ? "🚀 Create Workspace" : "Continue →"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <motion.button
          className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          whileHover={{ y: -1 }}
          onClick={() => navigate("/")}
        >
          ← Back to home
        </motion.button>
      </motion.div>
    </div>
  );
}
