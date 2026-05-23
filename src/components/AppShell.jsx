import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

export default function AppShell({ children, title, subtitle, actions }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {actions}
            {/* Bell */}
            <motion.button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <motion.span
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            </motion.button>
            {/* Avatar */}
            <motion.div
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-md shadow-indigo-200"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              RK
            </motion.div>
          </div>
        </header>

        {/* Page content */}
        <motion.main
          className="flex-1 overflow-y-auto p-6"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
