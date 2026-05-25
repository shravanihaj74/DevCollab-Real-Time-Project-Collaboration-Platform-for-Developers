import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

const ROLE_COLORS = {
  Owner:  { badge: "bg-red-100 text-red-700",    dot: "bg-red-500"    },
  Admin:  { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500"  },
  Member: { badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
  Viewer: { badge: "bg-gray-100 text-gray-600",   dot: "bg-gray-400"   },
};

const ROLE_PERMS = {
  Owner:  ["Manage billing", "Delete workspace", "Manage members", "Create projects", "Edit all content", "View all content"],
  Admin:  ["Manage members", "Create projects", "Edit all content", "View all content"],
  Member: ["Create tasks & docs", "Edit own content", "Comment & mention", "View all content"],
  Viewer: ["View all content"],
};

const INIT_MEMBERS = [
  { id: 1, name: "Rahul Kumar",  email: "rahul@devfusion.io",  role: "Owner",  avatar: "from-indigo-500 to-violet-600", online: true,  joined: "Jan 12, 2026" },
  { id: 2, name: "Ankush Sharma",email: "ankush@devfusion.io", role: "Admin",  avatar: "from-pink-400 to-rose-500",     online: true,  joined: "Jan 14, 2026" },
  { id: 3, name: "Riya Patel",   email: "riya@devfusion.io",   role: "Member", avatar: "from-blue-400 to-indigo-500",   online: true,  joined: "Jan 15, 2026" },
  { id: 4, name: "Sneha Gupta",  email: "sneha@devfusion.io",  role: "Member", avatar: "from-emerald-400 to-teal-500",  online: false, joined: "Feb 2, 2026"  },
  { id: 5, name: "Dev Mehta",    email: "dev@devfusion.io",    role: "Member", avatar: "from-amber-400 to-orange-500",  online: false, joined: "Feb 10, 2026" },
  { id: 6, name: "Priya Singh",  email: "priya@devfusion.io",  role: "Viewer", avatar: "from-violet-400 to-purple-500", online: false, joined: "Mar 5, 2026"  },
];

const PENDING_INVITES = [
  { email: "alex@gmail.com",   role: "Member", sent: "2h ago"  },
  { email: "sam@startup.io",   role: "Admin",  sent: "1d ago"  },
  { email: "nina@college.edu", role: "Viewer", sent: "3d ago"  },
];

const TABS = ["Members", "Invites", "Roles & Permissions", "General"];

function RoleDropdown({ current, memberId, onChange }) {
  const [open, setOpen] = useState(false);
  const roles = ["Admin", "Member", "Viewer"];

  return (
    <div className="relative">
      <motion.button
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${ROLE_COLORS[current].badge}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        disabled={current === "Owner"}
      >
        {current}
        {current !== "Owner" && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 3.5L5 6.5L8 3.5" strokeLinecap="round" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-8 z-20 w-36 rounded-xl border border-gray-100 bg-white shadow-xl"
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            {roles.map((r) => (
              <motion.button
                key={r}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  r === current ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                }`}
                whileHover={{ x: 2 }}
                onClick={() => { onChange(memberId, r); setOpen(false); }}
              >
                <span className={`h-2 w-2 rounded-full ${ROLE_COLORS[r].dot}`} />
                {r}
                {r === current && <span className="ml-auto text-indigo-500">✓</span>}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WorkspaceSettingsPage() {
  const [tab, setTab] = useState("Members");
  const [members, setMembers] = useState(INIT_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [pendingInvites, setPendingInvites] = useState(PENDING_INVITES);
  const [inviteSent, setInviteSent] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const changeRole = (id, newRole) => {
    setMembers((m) => m.map((mem) => mem.id === id ? { ...mem, role: newRole } : mem));
  };

  const removeMember = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setMembers((m) => m.filter((mem) => mem.id !== id));
      setRemovingId(null);
    }, 400);
  };

  const sendInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) return;
    setPendingInvites((p) => [{ email: inviteEmail.trim(), role: inviteRole, sent: "just now" }, ...p]);
    setInviteEmail("");
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 2500);
  };

  const revokeInvite = (email) => {
    setPendingInvites((p) => p.filter((i) => i.email !== email));
  };

  return (
    <AppShell
      title="Workspace Settings"
      subtitle="DevFusion Team · devcollab.io/devfusion"
    >
      <div className="mx-auto max-w-4xl space-y-5">

        {/* Workspace header card */}
        <motion.div
          className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl shadow-lg shadow-indigo-200"
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            💻
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-gray-900">DevFusion Team</h2>
            <p className="text-sm text-gray-400">devcollab.io/devfusion · Pro Plan · 6 members</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Edit
            </motion.button>
            <motion.button
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Upgrade Plan
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm">
          {TABS.map((t) => (
            <motion.button
              key={t}
              className={`relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                tab === t ? "text-white" : "text-gray-500 hover:text-gray-700"
              }`}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTab(t)}
            >
              {tab === t && (
                <motion.div
                  layoutId="settings-tab"
                  className="absolute inset-0 rounded-xl bg-indigo-600 shadow-md shadow-indigo-200"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >

            {/* ── MEMBERS TAB ── */}
            {tab === "Members" && (
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Team Members</h3>
                    <p className="text-xs text-gray-400">{members.length} members · {members.filter(m => m.online).length} online now</p>
                  </div>
                  <motion.button
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTab("Invites")}
                  >
                    + Invite Member
                  </motion.button>
                </div>

                <div className="divide-y divide-gray-50">
                  <AnimatePresence>
                    {members.map((member, i) => (
                      <motion.div
                        key={member.id}
                        className="flex items-center gap-4 px-6 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: removingId === member.id ? 0 : 1, x: 0, scale: removingId === member.id ? 0.95 : 1 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        {/* Avatar */}
                        <div className="relative">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${member.avatar} text-sm font-bold text-white shadow-md`}>
                            {member.name[0]}
                          </div>
                          {member.online && (
                            <motion.div
                              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{member.name}</p>
                            {member.role === "Owner" && <span className="text-xs">👑</span>}
                          </div>
                          <p className="text-xs text-gray-400">{member.email} · Joined {member.joined}</p>
                        </div>

                        {/* Role */}
                        <RoleDropdown current={member.role} memberId={member.id} onChange={changeRole} />

                        {/* Remove */}
                        {member.role !== "Owner" && (
                          <motion.button
                            className="ml-2 rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeMember(member.id)}
                            title="Remove member"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                              <path d="M2 2l10 10M12 2L2 12" />
                            </svg>
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* ── INVITES TAB ── */}
            {tab === "Invites" && (
              <div className="space-y-4">
                {/* Send invite card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-bold text-gray-900">Invite New Member</h3>

                  <div className="flex gap-3">
                    <input
                      className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Enter email address..."
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                    />

                    {/* Role selector */}
                    <select
                      className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-indigo-400 bg-white"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                    >
                      {["Admin", "Member", "Viewer"].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>

                    <motion.button
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendInvite}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                      </svg>
                      Send Invite
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {inviteSent && (
                      <motion.div
                        className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-2.5"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <span className="text-green-500">✓</span>
                        <p className="text-sm font-medium text-green-700">Invite sent! They'll receive an email link to join.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="mt-3 text-xs text-gray-400">
                    💡 Invite links expire after 7 days. Members can also join via the workspace URL.
                  </p>
                </div>

                {/* Pending invites */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 px-6 py-4">
                    <h3 className="font-bold text-gray-900">Pending Invites</h3>
                    <p className="text-xs text-gray-400">{pendingInvites.length} invites waiting</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <AnimatePresence>
                      {pendingInvites.map((inv, i) => (
                        <motion.div
                          key={inv.email}
                          className="flex items-center gap-4 px-6 py-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, scale: 0.95 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-500">
                            {inv.email[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">{inv.email}</p>
                            <p className="text-xs text-gray-400">Sent {inv.sent}</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${ROLE_COLORS[inv.role].badge}`}>
                            {inv.role}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <motion.button
                              className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Resend
                            </motion.button>
                            <motion.button
                              className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => revokeInvite(inv.email)}
                            >
                              Revoke
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {pendingInvites.length === 0 && (
                      <div className="flex flex-col items-center py-10 text-center">
                        <span className="text-3xl mb-2">📭</span>
                        <p className="text-sm text-gray-500">No pending invites</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── ROLES & PERMISSIONS TAB ── */}
            {tab === "Roles & Permissions" && (
              <div className="space-y-3">
                {Object.entries(ROLE_PERMS).map(([role, perms], i) => (
                  <motion.div
                    key={role}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`h-3 w-3 rounded-full ${ROLE_COLORS[role].dot}`} />
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${ROLE_COLORS[role].badge}`}>{role}</span>
                      <span className="text-xs text-gray-400">
                        {members.filter((m) => m.role === role).length} member{members.filter((m) => m.role === role).length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perms.map((perm) => (
                        <motion.span
                          key={perm}
                          className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                          whileHover={{ scale: 1.05, backgroundColor: "#eef2ff", color: "#4f46e5" }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5L3.5 7L8.5 2.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          {perm}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── GENERAL TAB ── */}
            {tab === "General" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900">Workspace Details</h3>
                  {[
                    { label: "Workspace Name", value: "DevFusion Team", type: "text" },
                    { label: "Workspace URL", value: "devfusion", prefix: "devcollab.io/", type: "text" },
                    { label: "Description", value: "Building the future of dev collaboration", type: "textarea" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" rows={3} defaultValue={field.value} />
                      ) : field.prefix ? (
                        <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                          <span className="bg-gray-50 px-3 py-3 text-sm text-gray-400 border-r border-gray-200">{field.prefix}</span>
                          <input className="flex-1 px-3 py-3 text-sm outline-none" defaultValue={field.value} />
                        </div>
                      ) : (
                        <input className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" defaultValue={field.value} />
                      )}
                    </div>
                  ))}
                  <motion.button
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Save Changes
                  </motion.button>
                </div>

                {/* Danger zone */}
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
                  <h3 className="mb-1 font-bold text-red-700">Danger Zone</h3>
                  <p className="mb-4 text-xs text-red-400">These actions are irreversible. Please be certain.</p>
                  <div className="flex gap-3">
                    <motion.button
                      className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Transfer Ownership
                    </motion.button>
                    <motion.button
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-200"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Delete Workspace
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
