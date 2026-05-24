import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NOTIFS = [
  { id: 1, read: false, icon: "💬", title: "Ankush mentioned you",       body: "in Kanban board design — @Rahul can you review?", time: "2m ago",  path: "/kanban"   },
  { id: 2, read: false, icon: "📋", title: "Task assigned to you",       body: "Write API documentation — Priority P2",           time: "15m ago", path: "/kanban"   },
  { id: 3, read: false, icon: "🔀", title: "Riya moved a task",          body: "Auth module → Done",                              time: "1h ago",  path: "/kanban"   },
  { id: 4, read: true,  icon: "👋", title: "Sneha joined the board",     body: "DevCollab Platform project",                      time: "3h ago",  path: "/dashboard"},
  { id: 5, read: true,  icon: "🤖", title: "AI Review complete",         body: "JWT middleware scored 8.5/10",                    time: "5h ago",  path: "/ai"       },
  { id: 6, read: true,  icon: "📄", title: "Wiki page updated",          body: "API Reference — Added auth section",              time: "1d ago",  path: "/wiki"     },
];

export default function NotificationPanel({ onClose }) {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(NOTIFS);
  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll  = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const remove   = (id, e) => { e.stopPropagation(); setNotifs(p => p.filter(n => n.id !== id)); };

  const open = (notif) => {
    markRead(notif.id);
    navigate(notif.path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <motion.div
        className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-indigo-100/50"
        initial={{ opacity: 0, scale: 0.92, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -8 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">Notifications</span>
            {unread > 0 && (
              <motion.span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {unread}
              </motion.span>
            )}
          </div>
          {unread > 0 && (
            <button className="text-xs font-semibold text-indigo-600 hover:underline" onClick={markAll}>
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
          <AnimatePresence>
            {notifs.map((n, i) => (
              <motion.div
                key={n.id}
                className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${!n.read ? "bg-indigo-50/40" : ""}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => open(n)}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-base ${!n.read ? "bg-indigo-100" : "bg-gray-100"}`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${!n.read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                    {n.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-gray-400">{n.body}</p>
                  <p className="mt-0.5 text-[10px] text-gray-300">{n.time}</p>
                </div>
                {!n.read && (
                  <motion.div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"
                    animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                )}
                <button
                  className="mt-0.5 flex-shrink-0 text-gray-200 hover:text-red-400 transition-colors"
                  onClick={(e) => remove(n.id, e)}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M1 1l9 9M10 1L1 10" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {notifs.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="text-3xl mb-2">🎉</span>
              <p className="text-sm font-semibold text-gray-600">All caught up!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-2.5">
          <button
            className="w-full text-center text-xs font-semibold text-indigo-600 hover:underline"
            onClick={() => { navigate("/profile"); onClose(); }}
          >
            View all notifications →
          </button>
        </div>
      </motion.div>
    </>
  );
}
