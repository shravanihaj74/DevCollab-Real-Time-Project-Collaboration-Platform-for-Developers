import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

const SKILLS = ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Framer Motion", "Socket.IO", "Python"];

const NOTIFICATIONS = [
  { id: 1, type: "mention",  read: false, icon: "💬", text: "Ankush mentioned you in Kanban board design",         time: "2 min ago",  link: "Kanban Board"  },
  { id: 2, type: "assign",   read: false, icon: "📋", text: "You were assigned to Write API documentation",        time: "15 min ago", link: "Task"          },
  { id: 3, type: "move",     read: false, icon: "🔀", text: "Riya moved Auth module to Done",                      time: "1 hour ago", link: "Kanban Board"  },
  { id: 4, type: "mention",  read: true,  icon: "💬", text: "Dev mentioned you in Socket.IO integration",          time: "3 hours ago",link: "Task"          },
  { id: 5, type: "invite",   read: true,  icon: "👋", text: "You were invited to Mobile App project",              time: "1 day ago",  link: "Project"       },
  { id: 6, type: "assign",   read: true,  icon: "📋", text: "Sneha assigned Design onboarding flow to you",        time: "2 days ago", link: "Task"          },
  { id: 7, type: "comment",  read: true,  icon: "💬", text: "Riya commented on AI code review endpoint",           time: "2 days ago", link: "Task"          },
  { id: 8, type: "move",     read: true,  icon: "🔀", text: "Ankush moved Responsive navbar to In Progress",       time: "3 days ago", link: "Kanban Board"  },
];

const TYPE_COLORS = {
  mention: "bg-indigo-100 text-indigo-700",
  assign:  "bg-amber-100 text-amber-700",
  move:    "bg-blue-100 text-blue-700",
  invite:  "bg-green-100 text-green-700",
  comment: "bg-violet-100 text-violet-700",
};

const ACTIVITY = [
  { text: "Moved Auth module → Done",          time: "1h ago",  icon: "🔀" },
  { text: "Commented on Kanban board design",  time: "3h ago",  icon: "💬" },
  { text: "Created useDebounce snippet",       time: "1d ago",  icon: "💻" },
  { text: "Updated Wiki: Getting Started",     time: "2d ago",  icon: "📄" },
  { text: "Completed Figma design system",     time: "3d ago",  icon: "✅" },
];

export default function ProfilePage() {
  const [tab, setTab] = useState("profile");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Rahul Kumar",
    role: "Full Stack Developer",
    bio: "Building DevCollab — a real-time collaboration platform for dev teams. Passionate about React, Node.js, and great UX.",
    github: "github.com/rahulkumar",
    email: "rahul@devfusion.io",
    skills: [...SKILLS],
  });

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <AppShell title="Profile" subtitle="Your account & notifications">
      <div className="mx-auto max-w-4xl space-y-5">

        {/* Profile card */}
        <motion.div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          </div>
          {/* Info row */}
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-extrabold text-white shadow-xl"
                whileHover={{ scale: 1.08, rotate: 5 }}>
                RK
              </motion.div>
              <motion.button
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${editing ? "bg-green-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setEditing(e => !e)}>
                {editing ? "✓ Save Profile" : "✏️ Edit Profile"}
              </motion.button>
            </div>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Name</label>
                    <input className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Role</label>
                    <input className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">GitHub</label>
                    <input className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      value={profile.github} onChange={e => setProfile({...profile, github: e.target.value})} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Email</label>
                    <input className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">Bio</label>
                  <textarea className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" rows={3}
                    value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-extrabold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-indigo-600 font-medium">{profile.role}</p>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-lg">{profile.bio}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                  <a href="#" className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    {profile.github}
                  </a>
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {profile.email}
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm">
          {[["profile","👤 Profile"],["notifications",`🔔 Notifications${unread > 0 ? ` (${unread})` : ""}`],["activity","📊 Activity"]].map(([id, label]) => (
            <motion.button key={id}
              className={`relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${tab === id ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
              whileTap={{ scale: 0.97 }} onClick={() => setTab(id)}>
              {tab === id && (
                <motion.div layoutId="profile-tab" className="absolute inset-0 rounded-xl bg-indigo-600 shadow-md shadow-indigo-200"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div className="grid grid-cols-2 gap-4">
                {/* Skills */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 font-bold text-gray-900">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <motion.span key={skill}
                        className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, type: "spring" }}
                        whileHover={{ scale: 1.08 }}>
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
                {/* Stats */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 font-bold text-gray-900">Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Tasks Done",    val: "47", color: "text-green-600",  bg: "bg-green-50"  },
                      { label: "Snippets",      val: "12", color: "text-indigo-600", bg: "bg-indigo-50" },
                      { label: "Comments",      val: "89", color: "text-blue-600",   bg: "bg-blue-50"   },
                      { label: "Wiki Pages",    val: "6",  color: "text-violet-600", bg: "bg-violet-50" },
                    ].map((s, i) => (
                      <motion.div key={s.label} className={`rounded-xl ${s.bg} p-3 text-center`}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.07, type: "spring" }}>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {tab === "notifications" && (
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-400">{unread} unread</p>
                  </div>
                  {unread > 0 && (
                    <motion.button className="text-xs font-semibold text-indigo-600 hover:underline"
                      whileHover={{ x: 1 }} onClick={markAllRead}>
                      Mark all as read
                    </motion.button>
                  )}
                </div>
                <div className="divide-y divide-gray-50">
                  <AnimatePresence>
                    {notifications.map((n, i) => (
                      <motion.div key={n.id}
                        className={`flex items-start gap-4 px-6 py-4 transition-colors ${n.read ? "" : "bg-indigo-50/50"}`}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }} transition={{ delay: i * 0.03 }}
                        onClick={() => markRead(n.id)}>
                        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg ${n.read ? "bg-gray-100" : "bg-indigo-100"}`}>
                          {n.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${n.read ? "text-gray-600" : "font-semibold text-gray-900"}`}>{n.text}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[n.type] || "bg-gray-100 text-gray-500"}`}>{n.type}</span>
                            <span className="text-[10px] text-gray-400">{n.time}</span>
                          </div>
                        </div>
                        {!n.read && (
                          <motion.div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-indigo-500 mt-1.5"
                            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        )}
                        <motion.button className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                          onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 1l10 10M11 1L1 11"/>
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {notifications.length === 0 && (
                    <div className="flex flex-col items-center py-12 text-center">
                      <span className="text-4xl mb-3">🎉</span>
                      <p className="font-semibold text-gray-700">All caught up!</p>
                      <p className="text-sm text-gray-400">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ACTIVITY TAB */}
            {tab === "activity" && (
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h3 className="font-bold text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {ACTIVITY.map((a, i) => (
                    <motion.div key={i} className="flex items-center gap-4 px-6 py-4"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-lg">{a.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{a.text}</p>
                      </div>
                      <span className="text-xs text-gray-400">{a.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
