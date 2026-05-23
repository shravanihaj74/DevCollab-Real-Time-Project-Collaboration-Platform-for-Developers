import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LINKS = [
  { label: "Projects", path: "/dashboard" },
  { label: "Activity", path: "/activity" },
  { label: "Wiki", path: "/wiki" },
  { label: "Pulse", path: "/pulse" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Wiki");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 flex items-center justify-between px-8 py-3.5 transition-all duration-300 ${
        scrolled
          ? "bg-white/75 backdrop-blur-2xl shadow-lg shadow-indigo-100/60 border-b border-indigo-100/60"
          : "bg-white/50 backdrop-blur-md"
      }`}
    >
      {/* Logo */}
      <motion.div
        className="flex cursor-pointer items-center gap-2.5"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-300/50"
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Code brackets icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3.5L1.5 8L5 12.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3.5L14.5 8L11 12.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <span className="text-[17px] font-bold tracking-tight text-gray-900">DevCollab</span>
      </motion.div>

      {/* Nav links */}
      <nav className="hidden items-center gap-1 md:flex">
        {LINKS.map((link, i) => (
          <motion.button
            key={link.label}
            onClick={() => { setActive(link.label); navigate(link.path); }}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              active === link.label ? "text-indigo-600" : "text-gray-500 hover:text-gray-800"
            }`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i + 0.2 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            {link.label}
            {active === link.label && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-lg bg-indigo-50"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {active === link.label && (
              <motion.span
                layoutId="nav-underline"
                className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-indigo-600"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2.5">
        {/* Sign In */}
        <motion.button
          className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-indigo-400 hover:text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign In
        </motion.button>

        {/* New Project */}
        <motion.button
          className="btn-shimmer btn-glow rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-300/40"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 280 }}
          whileHover={{ scale: 1.07, boxShadow: "0 12px 40px rgba(79,70,229,0.55)" }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate("/dashboard")}
        >
          New Project
        </motion.button>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Bell */}
        <motion.button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
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

        {/* Chat */}
        <motion.button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </motion.button>

        {/* Avatar */}
        <motion.div
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-md shadow-indigo-200"
          whileHover={{ scale: 1.12, rotate: 6 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          RK
        </motion.div>
      </div>
    </motion.header>
  );
}
