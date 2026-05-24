import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

/* ── language config ── */
const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go"];

const LANG_COLORS = {
  JavaScript: "bg-yellow-100 text-yellow-700",
  TypeScript: "bg-blue-100 text-blue-700",
  Python:     "bg-green-100 text-green-700",
  Java:       "bg-orange-100 text-orange-700",
  "C++":      "bg-red-100 text-red-700",
  Go:         "bg-cyan-100 text-cyan-700",
};

/* simple keyword-based syntax highlighter */
const KEYWORDS = {
  JavaScript: ["function","const","let","var","return","if","else","for","while","class","import","export","default","async","await","new","this","=>","true","false","null","undefined"],
  TypeScript: ["function","const","let","var","return","if","else","for","class","import","export","interface","type","async","await","string","number","boolean","void","any","=>"],
  Python:     ["def","return","if","else","elif","for","while","class","import","from","as","with","try","except","True","False","None","lambda","yield","pass"],
  Java:       ["public","private","class","void","return","if","else","for","while","new","import","static","final","int","String","boolean","extends","implements"],
  "C++":      ["int","void","return","if","else","for","while","class","include","using","namespace","std","cout","cin","auto","const","bool","string","new","delete"],
  Go:         ["func","var","const","return","if","else","for","range","package","import","type","struct","interface","go","chan","defer","select","case","switch"],
};

const STRINGS_RE = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
const COMMENTS_RE = /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm;
const NUMBERS_RE  = /\b(\d+\.?\d*)\b/g;

function highlight(code, lang) {
  const kws = KEYWORDS[lang] || [];
  const lines = code.split("\n");
  return lines.map((line, li) => {
    const parts = [];
    let remaining = line;
    let key = 0;

    // comments
    const commentMatch = remaining.match(/\/\/.*$|#.*$/);
    if (commentMatch) {
      const idx = remaining.indexOf(commentMatch[0]);
      if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
      parts.push(<span key={key++} style={{ color: "#64748b" }}>{commentMatch[0]}</span>);
      return <div key={li} className="flex gap-4"><span className="w-6 flex-shrink-0 text-right select-none" style={{ color: "#334155" }}>{li + 1}</span><span>{parts}</span></div>;
    }

    // tokenise word by word
    const tokens = remaining.split(/(\s+|[(){}[\],;.])/);
    tokens.forEach((tok, ti) => {
      if (kws.includes(tok)) {
        parts.push(<span key={ti} style={{ color: "#818cf8", fontWeight: 600 }}>{tok}</span>);
      } else if (/^["'`]/.test(tok)) {
        parts.push(<span key={ti} style={{ color: "#86efac" }}>{tok}</span>);
      } else if (/^\d/.test(tok)) {
        parts.push(<span key={ti} style={{ color: "#fbbf24" }}>{tok}</span>);
      } else {
        parts.push(<span key={ti}>{tok}</span>);
      }
    });

    return (
      <div key={li} className="flex gap-4">
        <span className="w-6 flex-shrink-0 text-right select-none" style={{ color: "#334155" }}>{li + 1}</span>
        <span>{parts}</span>
      </div>
    );
  });
}

/* ── initial snippets ── */
const INIT_SNIPPETS = [
  { id: 1, title: "useDebounce Hook", language: "JavaScript", tags: ["hooks", "performance"], description: "Debounce any value with a configurable delay.", author: "Ankush", time: "2h ago",
    code: `function useDebounce(value, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const t = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(t);\n  }, [value, delay]);\n  return debounced;\n}` },
  { id: 2, title: "JWT Auth Middleware", language: "Python", tags: ["auth", "security"], description: "FastAPI middleware for JWT token validation.", author: "Riya", time: "5h ago",
    code: `def verify_token(token: str):\n    try:\n        payload = jwt.decode(\n            token, SECRET_KEY,\n            algorithms=[ALGORITHM]\n        )\n        return payload.get("sub")\n    except JWTError:\n        raise HTTPException(401, "Invalid token")` },
  { id: 3, title: "Socket.IO Room Manager", language: "JavaScript", tags: ["realtime", "socket"], description: "Manage Socket.IO rooms for project collaboration.", author: "Dev", time: "1d ago",
    code: `io.on("connection", (socket) => {\n  socket.on("join-project", (projectId) => {\n    socket.join(projectId);\n    socket.to(projectId).emit("user-joined", {\n      userId: socket.id,\n      timestamp: Date.now()\n    });\n  });\n});` },
  { id: 4, title: "Tailwind cn() utility", language: "TypeScript", tags: ["utils", "tailwind"], description: "Merge Tailwind classes safely with clsx.", author: "Sneha", time: "2d ago",
    code: `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}` },
  { id: 5, title: "Binary Search", language: "Java", tags: ["algorithms", "search"], description: "Classic binary search implementation.", author: "Dev", time: "3d ago",
    code: `public static int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}` },
  { id: 6, title: "HTTP Server", language: "Go", tags: ["server", "http"], description: "Minimal Go HTTP server with routing.", author: "Ankush", time: "4d ago",
    code: `package main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\nfunc handler(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprintf(w, "Hello, DevCollab!")\n}\n\nfunc main() {\n    http.HandleFunc("/", handler)\n    http.ListenAndServe(":8080", nil)\n}` },
];

/* ── New Snippet Modal ── */
function NewSnippetModal({ onSave, onClose }) {
  const [form, setForm] = useState({ title: "", language: "JavaScript", tags: "", description: "", code: "" });
  const valid = form.title.trim() && form.code.trim();

  const save = () => {
    if (!valid) return;
    onSave({
      id: Date.now(),
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      author: "You",
      time: "just now",
    });
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}>
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">New Snippet</h2>
          <motion.button className="text-gray-400 hover:text-gray-600" whileHover={{ rotate: 90 }} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l12 12M14 2L2 14"/></svg>
          </motion.button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Title *</label>
              <input autoFocus className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g. useLocalStorage Hook" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Language</label>
              <select className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-white"
                value={form.language} onChange={e => setForm({...form, language: e.target.value})}>
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Description</label>
            <input className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="What does this snippet do?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Tags (comma separated)</label>
            <input className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. hooks, performance, react" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Code *</label>
            <textarea className="w-full resize-none rounded-xl border border-gray-200 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              rows={8} placeholder="// Paste your code here..." value={form.code}
              onChange={e => setForm({...form, code: e.target.value})}
              style={{ background: "#0f172a", color: "#e2e8f0" }} />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <motion.button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}>Cancel</motion.button>
          <motion.button className={`rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-md transition-all ${valid ? "bg-indigo-600 shadow-indigo-200" : "bg-gray-300 cursor-not-allowed"}`}
            whileHover={valid ? { scale: 1.04 } : {}} whileTap={valid ? { scale: 0.96 } : {}} onClick={save}>
            Save Snippet
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Snippet card ── */
function SnippetCard({ snippet, selected, onSelect }) {
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div layout
      className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-all ${selected ? "border-indigo-400 ring-2 ring-indigo-100" : "border-gray-100 hover:border-indigo-200"}`}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(79,70,229,0.1)" }}
      onClick={() => onSelect(snippet)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-gray-900">{snippet.title}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{snippet.description}</p>
        </div>
        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${LANG_COLORS[snippet.language] || "bg-gray-100 text-gray-600"}`}>{snippet.language}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {snippet.tags.map(tag => (
          <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">#{tag}</span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">by {snippet.author} · {snippet.time}</span>
        <motion.button
          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${copied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"}`}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={copy}>
          {copied ? "✓ Copied" : "Copy"}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Main page ── */
export default function SnippetsPage() {
  const [snippets, setSnippets] = useState(INIT_SNIPPETS);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("All");
  const [selected, setSelected] = useState(INIT_SNIPPETS[0]);
  const [showNew, setShowNew] = useState(false);
  const [copied, setCopied] = useState(false);

  const filtered = snippets.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.title.toLowerCase().includes(q) || s.tags.some(t => t.includes(q)) || s.description.toLowerCase().includes(q);
    const matchLang = langFilter === "All" || s.language === langFilter;
    return matchSearch && matchLang;
  });

  const copySelected = () => {
    navigator.clipboard.writeText(selected.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveSnippet = (snippet) => {
    setSnippets(prev => [snippet, ...prev]);
    setSelected(snippet);
  };

  const ext = { JavaScript: "js", TypeScript: "ts", Python: "py", Java: "java", "C++": "cpp", Go: "go" };

  return (
    <AppShell title="Code Snippets" subtitle={`Reusable code library · ${snippets.length} snippets`}
      actions={
        <motion.button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNew(true)}>
          + New Snippet
        </motion.button>
      }>

      <AnimatePresence>
        {showNew && <NewSnippetModal onSave={saveSnippet} onClose={() => setShowNew(false)} />}
      </AnimatePresence>

      <div className="flex gap-5" style={{ height: "calc(100vh - 140px)" }}>
        {/* ── Left panel ── */}
        <div className="flex w-80 flex-shrink-0 flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Search by title or tag..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Language filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {["All", ...LANGUAGES].map(l => (
              <motion.button key={l}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${langFilter === l ? "bg-indigo-600 text-white" : "border border-gray-200 bg-white text-gray-500 hover:border-indigo-300"}`}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setLangFilter(l)}>
                {l}
              </motion.button>
            ))}
          </div>

          {/* Snippet list */}
          <div className="flex flex-col gap-2.5 overflow-y-auto flex-1">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div className="flex flex-col items-center py-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-3xl mb-2">🔍</span>
                  <p className="text-sm text-gray-500">No snippets found</p>
                </motion.div>
              ) : filtered.map(s => (
                <motion.div key={s.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <SnippetCard snippet={s} selected={selected?.id === s.id} onSelect={setSelected} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right panel — syntax highlighted viewer ── */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div key={selected.id}
              className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">{selected.title}</h2>
                  <p className="mt-0.5 text-xs text-gray-400">{selected.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${LANG_COLORS[selected.language] || "bg-gray-100 text-gray-600"}`}>{selected.language}</span>
                  <motion.button
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-all ${copied ? "bg-green-600 shadow-green-200" : "bg-indigo-600 shadow-indigo-200"}`}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copySelected}>
                    {copied ? "✓ Copied!" : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copy to Clipboard
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Tags row */}
              <div className="flex items-center gap-2 border-b border-gray-50 px-6 py-2.5">
                {selected.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">#{tag}</span>
                ))}
                <span className="ml-auto text-xs text-gray-400">by {selected.author} · {selected.time}</span>
              </div>

              {/* Syntax highlighted code */}
              <div className="flex-1 overflow-auto" style={{ background: "#0f172a" }}>
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 border-b border-white/10 px-5 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-3 font-mono text-xs text-slate-400">
                    {selected.title.toLowerCase().replace(/\s+/g, "_")}.{ext[selected.language] || "txt"}
                  </span>
                </div>
                <div className="overflow-auto p-5 font-mono text-sm leading-relaxed" style={{ color: "#e2e8f0" }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={selected.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      {highlight(selected.code, selected.language)}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer — AI review */}
              <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-3">
                <motion.button
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200"
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}
                  whileTap={{ scale: 0.95 }}>
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
