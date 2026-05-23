import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

const MEMBERS = [
  { name: "Ankush", role: "Frontend Lead", avatar: "from-pink-400 to-rose-500", mood: "😄", tasks: 8, done: 6, overdue: 0, sparkline: [3,5,4,7,6,8,6], burnout: 30 },
  { name: "Riya", role: "Backend Dev", avatar: "from-blue-400 to-indigo-500", mood: "😐", tasks: 7, done: 4, overdue: 1, sparkline: [6,7,5,4,6,5,4], burnout: 65 },
  { name: "Sneha", role: "UI/UX Designer", avatar: "from-emerald-400 to-teal-500", mood: "🚀", tasks: 5, done: 5, overdue: 0, sparkline: [2,3,4,5,6,7,8], burnout: 20 },
  { name: "Dev", role: "DevOps", avatar: "from-amber-400 to-orange-500", mood: "😓", tasks: 9, done: 3, overdue: 3, sparkline: [8,7,9,8,7,6,5], burnout: 85 },
];

const MOODS = ["😄", "🙂", "😐", "😓", "🚀"];

function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <motion.polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function BurnoutBar({ pct }) {
  const color = pct >= 75 ? "#ef4444" : pct >= 50 ? "#f59e0b" : "#22c55e";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-gray-400">Burnout Risk</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function MemberCard({ member, i }) {
  const [mood, setMood] = useState(member.mood);
  const [showMoods, setShowMoods] = useState(false);

  return (
    <motion.div
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${member.avatar} text-sm font-bold text-white shadow-md`}>
            {member.name[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{member.name}</p>
            <p className="text-xs text-gray-400">{member.role}</p>
          </div>
        </div>

        {/* Mood picker */}
        <div className="relative">
          <motion.button
            className="text-xl"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMoods((s) => !s)}
            title="Set mood"
          >
            {mood}
          </motion.button>
          <AnimatePresence>
            {showMoods && (
              <motion.div
                className="absolute right-0 top-8 z-10 flex gap-1 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
                initial={{ opacity: 0, scale: 0.8, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {MOODS.map((m) => (
                  <motion.button
                    key={m}
                    className="text-xl"
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setMood(m); setShowMoods(false); }}
                  >
                    {m}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Tasks", val: member.tasks, color: "text-gray-900" },
          { label: "Done", val: member.done, color: "text-green-600" },
          { label: "Overdue", val: member.overdue, color: member.overdue > 0 ? "text-red-500" : "text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-gray-50 py-2">
            <motion.p
              className={`text-xl font-extrabold ${s.color}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, type: "spring" }}
            >
              {s.val}
            </motion.p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 mb-1">Activity (7d)</p>
          <Sparkline data={member.sparkline} color={member.burnout >= 75 ? "#ef4444" : "#4f46e5"} />
        </div>
        <div className="w-28">
          <BurnoutBar pct={member.burnout} />
        </div>
      </div>

      {/* Burnout alert */}
      {member.burnout >= 75 && (
        <motion.div
          className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            🔥
          </motion.span>
          <p className="text-[11px] font-semibold text-red-600">High burnout risk — consider reassigning tasks</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function DevPulsePage() {
  const [generating, setGenerating] = useState(false);
  const [digest, setDigest] = useState(null);

  const generateDigest = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDigest(`📊 **Weekly Digest — Week of May 19–23, 2026**\n\n**Team Velocity:** 23 tasks completed (↑ 18% from last week)\n\n**Highlights:**\n• Sneha had a stellar week — 5/5 tasks done, mood 🚀\n• Ankush closed 6 tasks including the critical Auth module\n• Sprint 3 is 58% complete, on track for June 3rd\n\n**Concerns:**\n• Dev is showing high burnout risk (85%) — 3 overdue tasks\n• Riya has 1 overdue task — Socket.IO blocker needs resolution\n\n**Recommendation:** Schedule a 1:1 with Dev this week and unblock the Redis config issue to reduce pressure.`);
    }, 2000);
  };

  return (
    <AppShell
      title="Dev Pulse"
      subtitle="Team health dashboard · Week 21"
      actions={
        <motion.button
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateDigest}
          disabled={generating}
        >
          {generating ? (
            <>
              <motion.div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
              Generating...
            </>
          ) : "✨ Generate Weekly Digest"}
        </motion.button>
      }
    >
      <div className="space-y-5">
        {/* Team overview bar */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Team Mood", value: "😄 Good", color: "text-green-600", bg: "bg-green-50" },
            { label: "Avg Burnout", value: "50%", color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Tasks Done", value: "18/29", color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Overdue", value: "4", color: "text-red-600", bg: "bg-red-50" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className={`rounded-2xl border border-gray-100 ${s.bg} p-4`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`mt-1 text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Member cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MEMBERS.map((m, i) => <MemberCard key={m.name} member={m} i={i} />)}
        </div>

        {/* Weekly digest output */}
        <AnimatePresence>
          {digest && (
            <motion.div
              className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-indigo-900">AI Weekly Digest</h3>
                <motion.span
                  className="ml-auto rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  AI Generated
                </motion.span>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-indigo-800">{digest}</pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
