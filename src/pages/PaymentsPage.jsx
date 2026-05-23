import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AppShell from "../components/AppShell";

const PLANS = [
  {
    id: "free", name: "Free", price: 0, period: "forever",
    color: "from-gray-400 to-gray-500", badge: null,
    features: [
      { text: "1 workspace",          ok: true  },
      { text: "3 projects",           ok: true  },
      { text: "5 members",            ok: true  },
      { text: "Kanban board",         ok: true  },
      { text: "Code snippets",        ok: true  },
      { text: "Wiki (basic)",         ok: true  },
      { text: "AI features",          ok: false },
      { text: "Unlimited projects",   ok: false },
      { text: "Unlimited members",    ok: false },
      { text: "Dev Pulse analytics",  ok: false },
      { text: "Priority support",     ok: false },
    ],
  },
  {
    id: "pro", name: "Pro", price: 12, period: "per user / month",
    color: "from-indigo-500 to-violet-600", badge: "Most Popular",
    features: [
      { text: "Unlimited workspaces", ok: true },
      { text: "Unlimited projects",   ok: true },
      { text: "Unlimited members",    ok: true },
      { text: "Kanban board",         ok: true },
      { text: "Code snippets",        ok: true },
      { text: "Wiki (full)",          ok: true },
      { text: "AI Project Assistant", ok: true },
      { text: "AI Code Reviewer",     ok: true },
      { text: "Dev Pulse analytics",  ok: true },
      { text: "Priority support",     ok: true },
      { text: "Custom integrations",  ok: true },
    ],
  },
];

const CARD_BRANDS = ["💳", "🏦", "📱"];

function CheckoutModal({ plan, onClose }) {
  const [step, setStep] = useState(1); // 1=card, 2=processing, 3=success
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvv: "" });

  const formatCard = (val) => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (val) => val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);

  const pay = () => {
    setStep(2);
    setTimeout(() => setStep(3), 2200);
  };

  const valid = form.name.trim() && form.number.replace(/\s/g, "").length === 16 && form.expiry.length === 5 && form.cvv.length >= 3;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        initial={{ scale: 0.88, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 24, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Header */}
              <div className={`bg-gradient-to-r ${plan.color} px-6 py-5`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">Upgrading to</p>
                    <h2 className="text-xl font-extrabold text-white">{plan.name} Plan</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-white">${plan.price}</p>
                    <p className="text-xs text-white/70">{plan.period}</p>
                  </div>
                </div>
                {/* Sandbox badge */}
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2">
                  <span className="text-sm">🧪</span>
                  <p className="text-xs font-semibold text-white">Sandbox Mode — no real charges</p>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">Cardholder Name</label>
                  <input autoFocus className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Rahul Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">Card Number</label>
                  <div className="relative">
                    <input className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-12 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="4242 4242 4242 4242" value={form.number}
                      onChange={e => setForm({...form, number: formatCard(e.target.value)})} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">💳</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">Expiry</label>
                    <input className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="MM/YY" value={form.expiry} onChange={e => setForm({...form, expiry: formatExpiry(e.target.value)})} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">CVV</label>
                    <input className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="123" maxLength={4} value={form.cvv} onChange={e => setForm({...form, cvv: e.target.value.replace(/\D/g, "")})} />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Secured with 256-bit SSL encryption · Sandbox checkout
                </p>
              </div>

              <div className="flex gap-2 border-t border-gray-100 px-6 py-4">
                <motion.button className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}>Cancel</motion.button>
                <motion.button
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white shadow-md transition-all ${valid ? `bg-gradient-to-r ${plan.color} shadow-indigo-200` : "bg-gray-300 cursor-not-allowed"}`}
                  whileHover={valid ? { scale: 1.04 } : {}} whileTap={valid ? { scale: 0.96 } : {}}
                  onClick={valid ? pay : undefined}>
                  Pay ${plan.price}/mo
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="processing" className="flex flex-col items-center justify-center py-16 px-6 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 mb-6"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <h3 className="text-lg font-bold text-gray-900">Processing payment...</h3>
              <p className="mt-1 text-sm text-gray-400">Please wait a moment</p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="success" className="flex flex-col items-center justify-center py-12 px-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <motion.div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl mb-4"
                animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5 }}>
                🎉
              </motion.div>
              <h3 className="text-xl font-extrabold text-gray-900">You're on Pro!</h3>
              <p className="mt-2 text-sm text-gray-500">Welcome to DevCollab Pro. All features are now unlocked.</p>
              <div className="mt-4 w-full rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700 font-medium">
                ✓ Unlimited workspaces, projects & members<br/>
                ✓ AI features fully enabled<br/>
                ✓ Dev Pulse analytics active
              </div>
              <motion.button className="mt-5 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onClose}>
                Start Building →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function PaymentsPage() {
  const [billing, setBilling] = useState("monthly");
  const [checkout, setCheckout] = useState(null);
  const [current, setCurrent] = useState("free");

  return (
    <AppShell title="Plans & Billing" subtitle="Choose the right plan for your team">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Billing toggle */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            {["monthly","yearly"].map(b => (
              <motion.button key={b}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${billing === b ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                whileTap={{ scale: 0.96 }} onClick={() => setBilling(b)}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === "yearly" && <span className="ml-1.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">-20%</span>}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => {
            const isCurrent = current === plan.id;
            const price = billing === "yearly" ? Math.round(plan.price * 0.8) : plan.price;
            return (
              <motion.div key={plan.id}
                className={`relative rounded-2xl border-2 bg-white shadow-sm overflow-hidden transition-all ${isCurrent ? "border-indigo-400" : "border-gray-100"}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(79,70,229,0.12)" }}>

                {plan.badge && (
                  <div className="absolute right-4 top-4">
                    <motion.span className="rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white shadow-md"
                      animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      {plan.badge}
                    </motion.span>
                  </div>
                )}

                {/* Plan header */}
                <div className={`bg-gradient-to-r ${plan.color} px-6 py-5`}>
                  <h3 className="text-lg font-extrabold text-white">{plan.name}</h3>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">${price}</span>
                    <span className="mb-1 text-sm text-white/70">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 space-y-2.5">
                  {plan.features.map((f, j) => (
                    <motion.div key={j} className="flex items-center gap-2.5"
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + j * 0.04 }}>
                      <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${f.ok ? "bg-green-100" : "bg-gray-100"}`}>
                        {f.ok
                          ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.5 7L8.5 2.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1l6 6M7 1L1 7" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        }
                      </div>
                      <span className={`text-sm ${f.ok ? "text-gray-700" : "text-gray-400"}`}>{f.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  {isCurrent ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 py-3 text-sm font-semibold text-indigo-600">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7L5 10.5L12.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Current Plan
                    </div>
                  ) : (
                    <motion.button
                      className={`w-full rounded-xl bg-gradient-to-r ${plan.color} py-3 text-sm font-semibold text-white shadow-md`}
                      whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(79,70,229,0.4)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setCheckout(plan)}>
                      {plan.id === "free" ? "Downgrade to Free" : "Upgrade to Pro →"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-900">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              ["Can I cancel anytime?", "Yes. Cancel anytime from your billing settings. You keep Pro access until the end of your billing period."],
              ["Is there a free trial?", "The Free plan is free forever. Pro has a 14-day trial — no credit card required."],
              ["What payment methods are accepted?", "Visa, Mastercard, American Express, and PayPal. All payments are processed securely via Stripe."],
              ["Can I switch plans mid-cycle?", "Yes. Upgrades are prorated immediately. Downgrades take effect at the next billing cycle."],
            ].map(([q, a], i) => (
              <motion.details key={i} className="group rounded-xl border border-gray-100 bg-gray-50"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 list-none">
                  {q}
                  <svg className="transition-transform group-open:rotate-180" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 5l5 5 5-5" strokeLinecap="round"/>
                  </svg>
                </summary>
                <p className="px-4 pb-3 text-sm text-gray-500">{a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {checkout && <CheckoutModal plan={checkout} onClose={() => setCheckout(null)} />}
      </AnimatePresence>
    </AppShell>
  );
}
