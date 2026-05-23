/**
 * RealtimeContext — simulates Socket.IO real-time collaboration
 * for UI demo purposes. Mimics:
 *   - Live presence (who is online, which task they're viewing)
 *   - Real-time notifications (task moved, commented, assigned)
 *   - Board sync events (task moves broadcast to all "users")
 */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const RealtimeContext = createContext(null);

/* ── Simulated remote users ── */
const REMOTE_USERS = [
  { id: "u2", name: "Ankush", avatar: "from-pink-400 to-rose-500"    },
  { id: "u3", name: "Riya",   avatar: "from-blue-400 to-indigo-500"  },
  { id: "u4", name: "Sneha",  avatar: "from-emerald-400 to-teal-500" },
  { id: "u5", name: "Dev",    avatar: "from-amber-400 to-orange-500" },
];

/* ── Simulated event scripts ── */
const EVENT_SCRIPTS = [
  { delay: 4000,  type: "task_move",   user: "Riya",   payload: { taskTitle: "Auth module (JWT)",       from: "review",     to: "done"       } },
  { delay: 9000,  type: "task_view",   user: "Ankush", payload: { taskTitle: "Build Kanban drag & drop"                                       } },
  { delay: 14000, type: "comment",     user: "Sneha",  payload: { taskTitle: "AI code review endpoint", text: "@Riya I pushed the fix!"       } },
  { delay: 20000, type: "task_move",   user: "Dev",    payload: { taskTitle: "Integrate Socket.IO",     from: "inprogress", to: "review"      } },
  { delay: 26000, type: "task_assign", user: "Ankush", payload: { taskTitle: "Write API documentation", assignedTo: "Sneha"                   } },
  { delay: 32000, type: "task_view",   user: "Riya",   payload: { taskTitle: "Set up CI/CD pipeline"                                          } },
  { delay: 38000, type: "comment",     user: "Dev",    payload: { taskTitle: "Build Kanban drag & drop", text: "@Ankush looks great, ship it!" } },
  { delay: 44000, type: "task_move",   user: "Sneha",  payload: { taskTitle: "Design onboarding flow",  from: "todo",       to: "inprogress"  } },
];

const NOTIFICATION_MESSAGES = {
  task_move:   (u, p) => `${u.name} moved "${p.taskTitle}" → ${p.to === "inprogress" ? "In Progress" : p.to === "review" ? "In Review" : p.to.charAt(0).toUpperCase()+p.to.slice(1)}`,
  comment:     (u, p) => `${u.name} commented on "${p.taskTitle}": "${p.text}"`,
  task_assign: (u, p) => `${u.name} assigned "${p.taskTitle}" to ${p.assignedTo}`,
  task_view:   (u, p) => `${u.name} is viewing "${p.taskTitle}"`,
};

export function RealtimeProvider({ children }) {
  /* who is currently online */
  const [onlineUsers, setOnlineUsers] = useState([
    { id: "u2", name: "Ankush", avatar: "from-pink-400 to-rose-500",    viewing: "Kanban Board"              },
    { id: "u3", name: "Riya",   avatar: "from-blue-400 to-indigo-500",  viewing: "Build Kanban drag & drop"  },
  ]);

  /* notification queue — shown in the toast stack */
  const [notifications, setNotifications] = useState([]);

  /* task-level presence: taskId → [userName, ...] */
  const [taskViewers, setTaskViewers] = useState({
    t4: ["Riya"],
  });

  /* board-level events (task moves from remote users) */
  const [boardEvents, setBoardEvents] = useState([]);

  const timers = useRef([]);

  /* push a notification */
  const pushNotification = useCallback((notif) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [{ ...notif, id }, ...prev].slice(0, 6));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  /* dismiss a notification manually */
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /* simulate a user viewing a task */
  const setViewingTask = useCallback((taskId, taskTitle) => {
    setTaskViewers(prev => {
      const current = prev[taskId] || [];
      if (current.includes("You")) return prev;
      return { ...prev, [taskId]: ["You", ...current] };
    });
    return () => {
      setTaskViewers(prev => {
        const current = (prev[taskId] || []).filter(u => u !== "You");
        return { ...prev, [taskId]: current };
      });
    };
  }, []);

  /* run the scripted simulation on mount */
  useEffect(() => {
    EVENT_SCRIPTS.forEach(script => {
      const t = setTimeout(() => {
        const user = REMOTE_USERS.find(u => u.name === script.user);
        if (!user) return;

        /* update online users list */
        setOnlineUsers(prev => {
          const exists = prev.find(u => u.id === user.id);
          if (exists) {
            return prev.map(u => u.id === user.id
              ? { ...u, viewing: script.payload.taskTitle || "Kanban Board" }
              : u
            );
          }
          return [...prev, { ...user, viewing: script.payload.taskTitle || "Kanban Board" }];
        });

        /* push notification */
        const msg = NOTIFICATION_MESSAGES[script.type]?.(user, script.payload);
        if (msg) {
          pushNotification({
            type: script.type,
            user,
            message: msg,
            payload: script.payload,
          });
        }

        /* update task viewers for task_view events */
        if (script.type === "task_view") {
          setTaskViewers(prev => {
            const taskId = Object.keys(prev).find(k => true) || "t4";
            const current = prev[taskId] || [];
            if (current.includes(user.name)) return prev;
            return { ...prev, [taskId]: [...current, user.name] };
          });
        }

        /* emit board event for task_move */
        if (script.type === "task_move") {
          setBoardEvents(prev => [...prev, {
            id: Date.now(),
            user,
            ...script.payload,
          }]);
        }

      }, script.delay);
      timers.current.push(t);
    });

    /* simulate users joining/leaving */
    const joinTimer = setTimeout(() => {
      setOnlineUsers(prev => {
        if (prev.find(u => u.id === "u4")) return prev;
        return [...prev, { id: "u4", name: "Sneha", avatar: "from-emerald-400 to-teal-500", viewing: "Kanban Board" }];
      });
      pushNotification({ type: "join", user: REMOTE_USERS[2], message: "Sneha joined the board" });
    }, 7000);
    timers.current.push(joinTimer);

    return () => timers.current.forEach(clearTimeout);
  }, [pushNotification]);

  return (
    <RealtimeContext.Provider value={{
      onlineUsers,
      notifications,
      taskViewers,
      boardEvents,
      pushNotification,
      dismissNotification,
      setViewingTask,
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
