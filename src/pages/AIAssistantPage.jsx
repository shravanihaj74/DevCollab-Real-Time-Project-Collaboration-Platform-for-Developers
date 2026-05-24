import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import AppShell from "../components/AppShell";

const QUICK_ACTIONS = [
  { label: "Summarise this project", icon: "📊", prompt: "Summarise the current project status and progress." },
  { label: "What's blocking us?", icon: "🚧", prompt: "Identify tasks that have been In Progress for too long and what might be blocking them." },
  { label: "Generate standup report", icon: "📋", prompt: "Generate a daily standup report based on task movement in the last 24 hours." },
  { label: "Break down a feature", icon: "⚡", prompt: "Build a login system" },
];

const INIT_MESSAGES = [
  {
    role: "assistant",
    text: "Hey! I'm your AI Project Assistant 🤖\n\nI can help you:\n• Summarise project progress\n• Identify blockers\n• Generate standup reports\n• Break down features into tasks\n• Review code snippets\n\nWhat would you like to do?",
    time: "just now",
  },
];

const AI_RESPONSES = {
  "Summarise the current project status and progress.":
    "📊 **Project Summary — DevCollab Platform**\n\nSprint 3 is 58% complete with 14 of 24 tasks done.\n\n✅ **Completed:** Auth module, DB schema, Design system\n🔄 **In Progress:** Kanban board (P0), Socket.IO integration (P0), AI review endpoint (P1)\n⏳ **Blocked:** CI/CD pipeline — waiting on DevOps access\n\n**Team velocity:** 4.7 tasks/day (↑ from 3.2 last sprint)\n**Estimated completion:** June 3rd",

  "Identify tasks that have been In Progress for too long and what might be blocking them.":
    "🚧 **Blockers Detected**\n\n1. **Socket.IO Integration** — In Progress for 5 days (P0)\n   → Likely blocked by: missing Redis config on staging\n   → Suggested action: @Dev to check infra setup\n\n2. **AI Code Review Endpoint** — In Progress for 3 days (P1)\n   → Likely blocked by: OpenAI API key not set in .env\n   → Suggested action: @Riya to add to secrets manager\n\n3. **CI/CD Pipeline** — In To Do for 8 days (P1)\n   → No assignee! Assign to a DevOps member ASAP.",

  "Generate a daily standup report based on task movement in the last 24 hours.":
    "📋 **Daily Standup — May 23, 2026**\n\n**Yesterday:**\n• Riya moved Auth module → Done ✅\n• Ankush reviewed Kanban board design (2 comments)\n• Sneha created useDebounce snippet\n\n**Today:**\n• Ankush: Continue Kanban drag & drop\n• Riya: Fix AI review endpoint env issue\n• Dev: Investigate Socket.IO Redis blocker\n• Sneha: Start responsive navbar\n\n**Blockers:**\n• Redis config on staging (Dev)\n• OpenAI API key missing (Riya)",

  "Build a login system":
    "⚡ **Feature Breakdown: Login System**\n\nI've created 6 subtasks for you:\n\n1. **[P0] Design login UI** — Figma mockup for login/signup screens\n2. **[P0] POST /auth/register endpoint** — Email + password, bcrypt hash\n3. **[P0] POST /auth/login endpoint** — JWT token generation\n4. **[P1] JWT middleware** — Protect private routes\n5. **[P1] Refresh token logic** — 7-day refresh, 15-min access token\n6. **[P2] OAuth integration** — GitHub + Google login\n\nShall I add these to your Kanban board?",
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-indigo-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isAI = msg.role === "assistant";
  return (
    <motion.div
      className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Avatar */}
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm ${
        isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-indigo-200" : "bg-gradient-to-br from-indigo-400 to-blue-500"
      }`}>
        {isAI ? "🤖" : "RK"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isAI
          ? "bg-white border border-gray-100 shadow-sm text-gray-700"
          : "bg-indigo-600 text-white shadow-md shadow-indigo-200"
      }`}>
        <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
        <p className={`mt-1.5 text-[10px] ${isAI ? "text-gray-400" : "text-indigo-200"}`}>{msg.time}</p>
      </div>
    </motion.div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [tab, setTab] = useState("chat");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text: text.trim(), time: "just now" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = AI_RESPONSES[text.trim()] ||
        `I understand you're asking about "${text.trim()}". Let me analyse your project data...\n\nBased on current sprint metrics, I recommend focusing on the P0 blockers first. Would you like me to generate a detailed breakdown?`;
      setTyping(false);
      setMessages((m) => [...m, { role: "assistant", text: response, time: "just now" }]);
    }, 1800);
  };

  const reviewCode = () => {
    if (!codeInput.trim()) return;
    setReviewing(true);
    setTimeout(() => {
      setReviewing(false);
      setReviewResult({
        score: 7.5,
        issues: [
          { type: "bug", severity: "high", text: "Missing error handling in async function — could cause unhandled promise rejection" },
          { type: "perf", severity: "medium", text: "Consider memoizing this computation with useMemo to avoid re-renders" },
          { type: "security", severity: "high", text: "User input is not sanitized before use — potential XSS vulnerability" },
          { type: "style", severity: "low", text: "Variable name 'x' is not descriptive — consider renaming to 'userCount'" },
        ],
      });
    }, 2200);
  };

  return (
    <AppShell title="AI Assistant" subtitle="Powered by GPT-4 · Project context loaded">
      <div className="flex gap-5 h-[calc(100vh-140px)]">

        {/* Left: tabs */}
        <div className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {[
              { id: "chat", label: "💬 Chat" },
              { id: "review", label: "🔍 Code Review" },
            ].map((t) => (
              <motion.button
                key={t.id}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === t.id ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"
                }`}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </motion.button>
            ))}
          </div>

          {tab === "chat" ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 p-5">
                {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                {typing && (
                  <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm">🤖</div>
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Ask anything about your project..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  />
                  <motion.button
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => sendMessage(input)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Paste your code below</label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 p-4 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  rows={10}
                  placeholder="// Paste your code here..."
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  style={{ background: "#0f172a", color: "#e2e8f0" }}
                />
              </div>
              <motion.button
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200"
                whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={reviewCode}
                disabled={reviewing}
              >
                {reviewing ? (
                  <>
                    <motion.div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    Analysing...
                  </>
                ) : "🔍 Review Code with AI"}
              </motion.button>

              <AnimatePresence>
                {reviewResult && (
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Score */}
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="relative h-16 w-16">
                        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <motion.circle
                            cx="18" cy="18" r="15.9" fill="none" stroke="#7c3aed" strokeWidth="3"
                            strokeDasharray="100" strokeLinecap="round"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 100 - reviewResult.score * 10 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-extrabold text-gray-900">{reviewResult.score}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Quality Score: {reviewResult.score}/10</p>
                        <p className="text-sm text-gray-500">{reviewResult.issues.length} issues found</p>
                      </div>
                    </div>

                    {/* Issues */}
                    {reviewResult.issues.map((issue, i) => {
                      const colors = { high: "border-red-200 bg-red-50", medium: "border-amber-200 bg-amber-50", low: "border-gray-200 bg-gray-50" };
                      const icons = { bug: "🐛", perf: "⚡", security: "🔒", style: "✨" };
                      return (
                        <motion.div
                          key={i}
                          className={`rounded-xl border p-3.5 ${colors[issue.severity]}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-base">{icons[issue.type]}</span>
                            <div>
                              <span className={`text-[10px] font-bold uppercase ${issue.severity === "high" ? "text-red-600" : issue.severity === "medium" ? "text-amber-600" : "text-gray-500"}`}>
                                {issue.severity} · {issue.type}
                              </span>
                              <p className="mt-0.5 text-sm text-gray-700">{issue.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right: quick actions */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Quick Actions</p>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action, i) => (
                <motion.button
                  key={i}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setTab("chat"); sendMessage(action.prompt); }}
                >
                  <span className="text-base">{action.icon}</span>
                  {action.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Context loaded */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="mb-2 text-xs font-bold text-indigo-700">Context Loaded</p>
            {["24 tasks", "4 wiki pages", "5 snippets", "12 members", "Sprint 3 data"].map((item) => (
              <div key={item} className="flex items-center gap-2 py-1">
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                />
                <span className="text-xs text-indigo-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
