import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

const SNIPPETS = [
  {
    id: 1, title: "useDebounce Hook", language: "JavaScript", tags: ["hooks", "performance"],
    description: "Debounce any value with a configurable delay.",
    code: `function useDebounce(value, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const t = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(t);\n  }, [value, delay]);\n  return debounced;\n}`,
    author: "Ankush", time: "2h ago",
  },
  {
    id: 2, title: "JWT Auth Middleware", language: "Python", tags: ["auth", "security"],
    description: "FastAPI middleware for JWT token validation.",
    code: `def verify_token(token: str):\n    try:\n        payload = jwt.decode(\n            token, SECRET_KEY,\n            algorithms=[ALGORITHM]\n        )\n        return payload.get("sub")\n    except JWTError:\n        raise HTTPException(401, "Invalid token")`,
    author: "Riya", time: "5h ago",
  },
  {
    id: 3, title: "Socket.IO Room Manager", language: "JavaScript", tags: ["realtime", "socket"],
    description: "Manage Socket.IO rooms for project collaboration.",
    code: `io.on("connection", (socket) => {\n  socket.on("join-project", (projectId) => {\n    socket.join(projectId);\n    socket.to(projectId).emit("user-joined", {\n      userId: socket.id,\n      timestamp: Date.now()\n    });\n  });\n});`,
    author: "Dev", time: "1d ago",
  },
  {
    id: 4, title: "Tailwind cn() utility", language: "TypeScript", tags: ["utils", "tailwind"],
    description: "Merge Tailwind classes safely with clsx.",
    code: `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}`,
    author: "Sneha", time: "2d ago",
  },
  {
    id: 5, title: "Framer Motion Page Transition", language: "JavaScript", tags: ["animation", "react"],
    description: "Smooth page transitions with Framer Motion.",
    code: `const pageVariants = {\n  initial: { opacity: 0, y: 20 },\n  animate: { opacity: 1, y: 0 },\n  exit:    { opacity: 0, y: -20 }\n};\n\n<motion.div\n  variants={pageVariants}\n  initial="initial"\n  animate="animate"\n  exit="exit"\n/>`,
    author: "Ankush", time: "3d ago",
  },
];

const LANG_COLORS = {
  JavaScript: "bg-yellow-100 text-yellow-700",
  TypeScript: "bg-blue-100 text-blue-700",
  Python: "bg-green-100 text-green-700",
  Go: "bg-cyan-100 text-cyan-700",
  Java: "bg-orange-100 text-orange-700",
};

const CODE_THEME = {
  bg: "#0f172a",
  text: "#e2e8f0",
};

function SnippetCard({ snippet, onSelect, selected }) {
  const [copied, setCopied] = useState(false);

  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-all ${
        selected ? "border-indigo-400 ring-2 ring-indigo-100" : "border-gray-100 hover:border-indigo-200"
      }`}
      whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(79,70,229,0.1)" }}
      onClick={() => onSelect(snippet)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-bold text-gray-900">{snippet.title}</h3>
          <p className="mt-0.5 text-xs text-gray-400 line-clamp-2">{snippet.description}</p>
        </div>
        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${LANG_COLORS[snippet.language] || "bg-gray-100 text-gray-600"}`}>
          {snippet.language}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {snippet.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">by {snippet.author} · {snippet.time}</span>
        <motion.button
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            copied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={copy}
        >
          {copied ? "✓ Copied" : "Copy"}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function SnippetsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(SNIPPETS[0]);
  const [filter, setFilter] = useState("All");

  const langs = ["All", "JavaScript", "TypeScript", "Python"];
  const filtered = SNIPPETS.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.includes(search.toLowerCase()));
    const matchLang = filter === "All" || s.language === filter;
    return matchSearch && matchLang;
  });

  return (
    <AppShell
      title="Code Snippets"
      subtitle="Reusable code library · 5 snippets"
      actions={
        <motion.button
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + New Snippet
        </motion.button>
      }
    >
      <div className="flex gap-5 h-full">
        {/* Left panel */}
        <div className="flex w-80 flex-shrink-0 flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Search snippets or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Language filter */}
          <div className="flex flex-wrap gap-1.5">
            {langs.map((l) => (
              <motion.button
                key={l}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  filter === l ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-indigo-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(l)}
              >
                {l}
              </motion.button>
            ))}
          </div>

          {/* Snippet list */}
          <div className="flex flex-col gap-2.5 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filtered.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <SnippetCard snippet={s} onSelect={setSelected} selected={selected?.id === s.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right panel — code viewer */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">{selected.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{selected.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${LANG_COLORS[selected.language] || "bg-gray-100 text-gray-600"}`}>
                    {selected.language}
                  </span>
                  <motion.button
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigator.clipboard.writeText(selected.code).catch(() => {})}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy to Clipboard
                  </motion.button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 border-b border-gray-50 px-6 py-2.5">
                {selected.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                    #{tag}
                  </span>
                ))}
                <span className="ml-auto text-xs text-gray-400">by {selected.author} · {selected.time}</span>
              </div>

              {/* Code block */}
              <div className="flex-1 overflow-auto" style={{ background: CODE_THEME.bg }}>
                <div className="flex items-center gap-1.5 border-b border-white/10 px-5 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-3 font-mono text-xs text-slate-400">{selected.title.toLowerCase().replace(/ /g, "_")}.{selected.language === "Python" ? "py" : selected.language === "TypeScript" ? "ts" : "js"}</span>
                </div>
                <pre className="overflow-auto p-6 font-mono text-sm leading-relaxed" style={{ color: CODE_THEME.text }}>
                  {selected.code.split("\n").map((line, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <span className="w-6 flex-shrink-0 text-right text-slate-600 select-none">{i + 1}</span>
                      <span>{line}</span>
                    </motion.div>
                  ))}
                </pre>
              </div>

              {/* AI Review button */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center gap-3">
                <motion.button
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200"
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  🤖 AI Review this Snippet
                </motion.button>
                <span className="text-xs text-gray-400">Get bugs, performance & security feedback</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
