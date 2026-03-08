import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  animate,
  AnimatePresence,
} from "framer-motion";

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER HOOK
═══════════════════════════════════════════════ */
function useCounter(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const ctrl = animate(0, target, {
      duration: 2.4,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.floor(v)),
    });
    return ctrl.stop;
  }, [active, target]);
  return val;
}

/* ═══════════════════════════════════════════════
   STAT ITEM
═══════════════════════════════════════════════ */
function StatItem({ value, suffix, label, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent tabular-nums">
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   3-D TILT CARD
═══════════════════════════════════════════════ */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 450,
    damping: 45,
  });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 450,
    damping: 45,
  });

  const onMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my],
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   INFINITE MARQUEE
═══════════════════════════════════════════════ */
function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#08050f] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#08050f] to-transparent pointer-events-none" />
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-white/25 hover:text-white/50 transition-colors duration-300 cursor-default select-none"
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span className="text-base font-bold tracking-tight">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const FEATURES = [
  {
    id: "ai",
    icon: "auto_awesome",
    label: "AI Report Cards",
    desc: "Generate comprehensive student performance insights instantly. Local-first AI analyzes grades, attendance, and participation to write personalized, nuanced comments for every student in seconds.",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    glowColor: "rgba(139,92,246,0.18)",
    hoverBorder: "hover:border-violet-500/40",
    badge: "AI Powered",
    badgeCls: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
    wide: true,
    accent: "from-violet-600/10 to-fuchsia-600/5",
  },
  {
    id: "finance",
    icon: "account_balance",
    label: "Finance Suite",
    desc: "Track tuition, handle payroll, and manage budgets with bank-grade security and fully automated invoicing.",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    glowColor: "rgba(59,130,246,0.18)",
    hoverBorder: "hover:border-blue-500/40",
    accent: "from-blue-600/10 to-cyan-600/5",
  },
  {
    id: "attendance",
    icon: "how_to_reg",
    label: "Smart Attendance",
    desc: "One-tap marking, automated absence alerts, and daily trend reports delivered to parents and admin instantly.",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    glowColor: "rgba(16,185,129,0.18)",
    hoverBorder: "hover:border-emerald-500/40",
    accent: "from-emerald-600/10 to-teal-600/5",
  },
  {
    id: "schedule",
    icon: "calendar_month",
    label: "Dynamic Scheduling",
    desc: "Conflict-free timetable generation. Handle complex rotations, substitute teacher assignment, and room bookings with an intuitive drag-and-drop interface that adapts in real time.",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-400",
    glowColor: "rgba(249,115,22,0.18)",
    hoverBorder: "hover:border-orange-500/40",
    wide: true,
    accent: "from-orange-600/10 to-yellow-600/5",
  },
  {
    id: "comm",
    icon: "forum",
    label: "Communication Hub",
    desc: "Unified inbox for teachers, parents, and students. Broadcast announcements or chat one-on-one without ever sharing phone numbers.",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.18)",
    hoverBorder: "hover:border-cyan-500/40",
    accent: "from-cyan-600/10 to-sky-600/5",
  },
  {
    id: "analytics",
    icon: "analytics",
    label: "Real-time Analytics",
    desc: "Visual dashboards for attendance trends, grade distributions, and enrollment statistics — updated live.",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-400",
    glowColor: "rgba(99,102,241,0.18)",
    hoverBorder: "hover:border-indigo-500/40",
    accent: "from-indigo-600/10 to-blue-600/5",
  },
  {
    id: "security",
    icon: "shield_lock",
    label: "Enterprise Security",
    desc: "Role-based access control, full audit logs, and GDPR compliance built-in to protect every sensitive record.",
    iconBg: "bg-slate-500/15",
    iconColor: "text-slate-300",
    glowColor: "rgba(100,116,139,0.18)",
    hoverBorder: "hover:border-slate-400/30",
    accent: "from-slate-600/10 to-slate-700/5",
  },
  {
    id: "library",
    icon: "local_library",
    label: "Digital Library",
    desc: "Manage physical and digital assets. Track book loans, tablet assignments, and lab equipment inventory.",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-400",
    glowColor: "rgba(236,72,153,0.18)",
    hoverBorder: "hover:border-pink-500/40",
    accent: "from-pink-600/10 to-rose-600/5",
  },
];

const STATS = [
  { value: 500, suffix: "+", label: "Institutions" },
  { value: 50000, suffix: "+", label: "Active Students" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
  { value: 10, suffix: "×", label: "Faster Operations" },
];

const LOGOS = [
  { icon: "school", name: "EduTech" },
  { icon: "menu_book", name: "UniSystem" },
  { icon: "science", name: "LabCore" },
  { icon: "public", name: "GlobalHigh" },
  { icon: "apartment", name: "AcadeHub" },
  { icon: "domain", name: "SmartCampus" },
  { icon: "business_center", name: "ProLearn" },
  { icon: "hub", name: "NexusEdu" },
];

const STEPS = [
  {
    num: "01",
    icon: "settings_suggest",
    title: "Configure Your School",
    desc: "Set up classes, subjects, and user roles in minutes with our guided onboarding wizard.",
    color: "violet",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    borderColor: "border-violet-500/30",
    numColor: "text-violet-500/40",
  },
  {
    num: "02",
    icon: "group_add",
    title: "Invite Your Team",
    desc: "Teachers and staff get personalized dashboards the moment they accept their invitation.",
    color: "blue",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    numColor: "text-blue-500/40",
  },
  {
    num: "03",
    icon: "rocket_launch",
    title: "Go Live Instantly",
    desc: "Start recording attendance, grades, and communications from day one with zero downtime.",
    color: "emerald",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    numColor: "text-emerald-500/40",
  },
];

/* ═══════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const cardV = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
function Features() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Parallax for hero */
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, 130]);
  const heroParallaxOpacity = useTransform(scrollY, [0, 480], [1, 0]);

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 12));
  }, [scrollY]);

  const navLinks = [
    { to: "/features", label: "Features", active: true },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="relative min-h-screen bg-[#08050f] text-white overflow-x-hidden">
      {/* ══════════════════════════════════════════
          AMBIENT BACKGROUND
      ══════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-52 -left-52 w-[750px] h-[750px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,59,237,0.20) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 70, 0], y: [0, -50, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-64 w-[650px] h-[650px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 70%)",
          }}
          animate={{ x: [0, -55, 0], y: [0, 65, 0] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-10 left-1/3 w-[520px] h-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 45, 0], y: [0, -55, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 9,
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08050f] via-transparent to-[#08050f] opacity-60" />
      </div>

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#08050f]/88 backdrop-blur-2xl border-b border-white/[0.07] shadow-2xl shadow-black/40"
            : "border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="size-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30"
            >
              <span className="material-symbols-outlined text-white text-[20px] font-bold">
                school
              </span>
            </motion.div>
            <span className="text-[17px] font-bold tracking-tight">
              SchoolOS
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`relative transition-colors duration-200 ${
                  l.active
                    ? "text-violet-400"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {l.label}
                {l.active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-violet-400 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-white/55 hover:text-white transition-colors duration-200"
            >
              Log in
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 24px rgba(124,59,237,0.50)",
                }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25"
              >
                <span className="relative z-10">Get Started →</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </motion.button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-[#0c0917]/96 backdrop-blur-2xl border-b border-white/[0.07]"
            >
              <div className="px-5 py-5 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                      l.active
                        ? "text-violet-400 bg-violet-500/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.07]">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 transition-opacity"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <motion.section
        style={{ y: heroParallaxY, opacity: heroParallaxOpacity }}
        className="relative z-10 pt-28 pb-20 px-5 text-center max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-wide mb-8"
        >
          <span className="size-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
          Trusted by 500+ institutions worldwide
          <span className="text-violet-500/50">✦</span>
        </motion.div>

        {/* Headline — line-by-line reveal */}
        <div className="mb-6 space-y-2">
          {[
            { text: "Everything your", gradient: false },
            { text: "institution needs.", gradient: true },
          ].map((line, li) => (
            <div key={li} className="overflow-hidden">
              <motion.h1
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{
                  delay: 0.18 + li * 0.14,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`text-5xl sm:text-6xl md:text-[5.25rem] font-extrabold tracking-tight leading-[1.04] ${
                  line.gradient
                    ? "bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent"
                    : "text-white"
                }`}
              >
                {line.text}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.7 }}
          className="text-lg sm:text-xl text-white/45 font-normal max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Powerful, intuitive tools designed to bring students, teachers, and
          administration into perfect sync — all from one beautifully unified
          platform.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.65 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20"
        >
          <Link to="/signup">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 50px rgba(124,59,237,0.45)",
              }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-violet-500/30 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.28 }}
              />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-full border border-white/12 text-white/70 hover:text-white font-semibold text-sm transition-colors duration-200 hover:bg-white/[0.04] flex items-center gap-2"
          >
            <span className="size-6 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-[10px]">▶</span>
            </span>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* ── Dashboard mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.88, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Multi-layer glow */}
          <div className="absolute -inset-6 bg-gradient-to-b from-violet-600/25 via-blue-600/10 to-transparent rounded-3xl blur-3xl -z-10" />
          <div className="absolute -inset-1 bg-gradient-to-b from-violet-500/20 to-transparent rounded-2xl blur-xl -z-10" />

          <div className="rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#18112a] to-[#0e0b1a] shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-5 h-11 border-b border-white/[0.07] bg-[#110d1e]">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/70" />
                <div className="size-3 rounded-full bg-yellow-500/70" />
                <div className="size-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4 h-5 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                <span className="text-[10px] text-white/20 font-mono">
                  app.schoolos.io/dashboard
                </span>
              </div>
              <div className="size-6 rounded bg-white/5 hidden sm:flex items-center justify-center">
                <span className="material-symbols-outlined text-[13px] text-white/30">
                  refresh
                </span>
              </div>
            </div>

            <div className="flex h-[340px] sm:h-[400px] md:h-[440px]">
              {/* Sidebar */}
              <div className="w-12 sm:w-52 border-r border-white/[0.07] bg-[#0d0919] flex flex-col p-3 gap-1.5 shrink-0">
                <div className="flex items-center gap-2.5 p-2 mb-3">
                  <div className="size-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/30">
                    <span className="material-symbols-outlined text-white text-[13px]">
                      school
                    </span>
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-white/80 tracking-tight">
                    SchoolOS
                  </span>
                </div>
                {[
                  { icon: "grid_view", label: "Dashboard", active: true },
                  { icon: "group", label: "Students" },
                  { icon: "person_outline", label: "Teachers" },
                  { icon: "calendar_month", label: "Schedule" },
                  { icon: "analytics", label: "Analytics" },
                  { icon: "account_balance", label: "Finance" },
                  { icon: "settings", label: "Settings" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                      item.active
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-white/25 hover:text-white/50 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] shrink-0">
                      {item.icon}
                    </span>
                    <span className="hidden sm:block text-[11px] font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 sm:p-5 overflow-hidden flex flex-col gap-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-32 rounded-md bg-white/10 mb-1.5" />
                    <div className="h-2.5 w-20 rounded-md bg-white/5" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-20 rounded-full bg-violet-500/20 border border-violet-500/30" />
                    <div className="h-7 w-7 rounded-full bg-white/5 border border-white/10" />
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      label: "Students",
                      val: "1,247",
                      icon: "group",
                      color: "text-violet-400",
                      bg: "bg-violet-500/10",
                    },
                    {
                      label: "Teachers",
                      val: "86",
                      icon: "person",
                      color: "text-blue-400",
                      bg: "bg-blue-500/10",
                    },
                    {
                      label: "Attendance",
                      val: "94.2%",
                      icon: "how_to_reg",
                      color: "text-emerald-400",
                      bg: "bg-emerald-500/10",
                    },
                    {
                      label: "Revenue",
                      val: "$48k",
                      icon: "payments",
                      color: "text-orange-400",
                      bg: "bg-orange-500/10",
                    },
                  ].map((s, si) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + si * 0.08, duration: 0.5 }}
                      className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 flex flex-col gap-2"
                    >
                      <div
                        className={`size-6 rounded-md ${s.bg} flex items-center justify-center`}
                      >
                        <span
                          className={`material-symbols-outlined text-[13px] ${s.color}`}
                        >
                          {s.icon}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white/80">
                        {s.val}
                      </div>
                      <div className="text-[10px] text-white/30 hidden sm:block">
                        {s.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-2.5 w-24 rounded bg-white/10" />
                    <div className="flex gap-1">
                      {["Week", "Month", "Year"].map((t, i) => (
                        <div
                          key={t}
                          className={`px-2 py-0.5 rounded-md text-[9px] font-medium ${i === 1 ? "bg-violet-500/20 text-violet-300" : "text-white/20"}`}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Animated bar chart */}
                  <div className="flex items-end gap-1.5 h-16 sm:h-20">
                    {[65, 80, 55, 90, 70, 85, 75, 95, 60, 88, 72, 92].map(
                      (h, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-600/60 to-violet-400/30"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{
                            delay: 1.3 + i * 0.05,
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                          style={{ height: `${h}%`, transformOrigin: "bottom" }}
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* Activity rows */}
                <div className="hidden sm:flex flex-col gap-1.5">
                  {[
                    {
                      dot: "bg-violet-400",
                      text: "Class 10A report cards generated",
                      time: "2m ago",
                    },
                    {
                      dot: "bg-emerald-400",
                      text: "98% attendance recorded — Grade 7",
                      time: "14m ago",
                    },
                    {
                      dot: "bg-blue-400",
                      text: "New teacher onboarded: Mr. Okafor",
                      time: "1h ago",
                    },
                  ].map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors"
                    >
                      <div
                        className={`size-1.5 rounded-full ${a.dot} shrink-0`}
                      />
                      <span className="text-[10px] text-white/40 flex-1">
                        {a.text}
                      </span>
                      <span className="text-[9px] text-white/20">{a.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom reflection */}
          <div className="h-8 bg-gradient-to-b from-[#0e0b1a] to-transparent" />
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-10 sm:p-12 overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/8 via-transparent to-blue-600/8 rounded-2xl" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
              {STATS.map((s, i) => (
                <StatItem
                  key={s.label}
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES BENTO GRID
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-16 px-5 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400 mb-4"
          >
            Platform Features
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Built for every role.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/40 text-lg max-w-xl mx-auto"
          >
            From the superintendent to the student — one platform, every
            workflow.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {FEATURES.map((f) => (
            <TiltCard
              key={f.id}
              className={`group relative rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-white/[0.02] overflow-hidden cursor-default transition-all duration-300 ${f.hoverBorder} ${f.wide ? "md:col-span-2" : "md:col-span-1"}`}
            >
              <motion.div
                variants={cardV}
                className="relative z-10 h-full p-7 sm:p-8 flex flex-col gap-5"
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div
                    className={`size-12 rounded-xl ${f.iconBg} flex items-center justify-center`}
                  >
                    <span
                      className={`material-symbols-outlined text-[26px] ${f.iconColor}`}
                    >
                      {f.icon}
                    </span>
                  </div>
                  {f.badge && (
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${f.badgeCls} tracking-wide`}
                    >
                      {f.badge}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                    {f.label}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/55 transition-colors">
                    {f.desc}
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  className="flex items-center gap-1.5 text-xs font-semibold text-white/25 group-hover:text-white/60 transition-colors"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  <span>Learn more</span>
                  <span className="text-sm">→</span>
                </motion.div>
              </motion.div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 100%, ${f.glowColor}, transparent 65%)`,
                }}
              />
              {/* Gradient accent bg */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`}
              />
            </TiltCard>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-5 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400 mb-4"
          >
            How It Works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Up and running in minutes.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/40 text-lg max-w-lg mx-auto"
          >
            No lengthy setup. No IT team required. Just a smooth, guided path to
            your modern school.
          </motion.p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-14 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
              className="h-full origin-left"
              style={{
                background:
                  "linear-gradient(90deg, rgba(124,59,237,0.5), rgba(124,59,237,0.2), rgba(124,59,237,0.5))",
              }}
            />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.18,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative flex flex-col items-center text-center p-7 rounded-2xl border bg-gradient-to-b from-white/[0.04] to-white/[0.01] ${step.borderColor}`}
            >
              {/* Step number */}
              <span
                className={`text-6xl font-black mb-4 ${step.numColor} select-none`}
              >
                {step.num}
              </span>
              {/* Icon */}
              <div
                className={`size-12 rounded-xl ${step.iconBg} flex items-center justify-center mb-5`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${step.iconColor}`}
                >
                  {step.icon}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LOGO MARQUEE
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-14 border-y border-white/[0.05]">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/25 mb-8">
          Trusted by innovative institutions worldwide
        </p>
        <Marquee items={LOGOS} />
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIAL STRIP
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-5 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            {
              quote:
                "SchoolOS cut our report card process from 3 weeks down to a single afternoon. The AI comments are genuinely impressive.",
              name: "Dr. Amara Nwosu",
              role: "Principal, Greenfield Academy",
              avatar: "AN",
              avatarColor: "from-violet-500 to-purple-700",
            },
            {
              quote:
                "Finally, a platform where parents, teachers, and admin are truly on the same page. The communication hub is a game-changer.",
              name: "James Okonkwo",
              role: "Head of Admin, Sunrise College",
              avatar: "JO",
              avatarColor: "from-blue-500 to-cyan-600",
            },
            {
              quote:
                "The analytics dashboard gives us insights we never had before. We identified at-risk students 4 weeks earlier this term.",
              name: "Fatima Al-Hassan",
              role: "Deputy Head, Nova International",
              avatar: "FA",
              avatarColor: "from-emerald-500 to-teal-600",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              variants={cardV}
              className="group relative p-7 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.02] hover:border-white/[0.14] transition-all duration-300 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, si) => (
                  <span key={si} className="text-yellow-400 text-xs">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/55 leading-relaxed flex-1">
                {"\u201C"}
                {t.quote}
                {"\u201D"}
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div
                  className={`size-9 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{t.name}</p>
                  <p className="text-[10px] text-white/35">{t.role}</p>
                </div>
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-10 px-5 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800" />
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(120deg, rgba(124,59,237,0.9), rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(168,85,247,0.9))",
              backgroundSize: "200% 200%",
            }}
          />
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            }}
          />
          {/* Orb decorations */}
          <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 text-center py-16 sm:py-20 px-6 sm:px-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold mb-8"
            >
              <span className="size-1.5 rounded-full bg-white animate-pulse inline-block" />
              No credit card required
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
              Ready to modernize
              <br className="hidden sm:block" /> your school?
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join over 500 institutions already using SchoolOS to streamline
              operations, boost outcomes, and delight every stakeholder.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/signup">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-full bg-white text-violet-700 font-bold text-sm shadow-xl hover:bg-white/95 transition-colors"
                >
                  {"Start Free Trial — It's Free"}
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Schedule a Demo →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#06040d] py-14 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16 mb-12">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-500/30">
                  <span className="material-symbols-outlined text-white text-[16px]">
                    school
                  </span>
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  SchoolOS
                </span>
              </div>
              <p className="text-sm text-white/35 leading-relaxed">
                Empowering the next generation of educators and students with
                seamlessly unified management tools.
              </p>
              <div className="flex gap-3 mt-5">
                {["twitter", "linkedin", "github"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="size-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[14px] text-white/40">
                      {s === "twitter"
                        ? "share"
                        : s === "linkedin"
                          ? "work"
                          : "code"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              {[
                {
                  heading: "Product",
                  links: [
                    { label: "Features", to: "/features" },
                    { label: "Pricing", to: "/pricing" },
                    { label: "Security", href: "#" },
                    { label: "Roadmap", href: "#" },
                  ],
                },
                {
                  heading: "Company",
                  links: [
                    { label: "About", href: "#" },
                    { label: "Careers", href: "#" },
                    { label: "Blog", href: "#" },
                    { label: "Legal", href: "#" },
                  ],
                },
                {
                  heading: "Support",
                  links: [
                    { label: "Help Center", href: "#" },
                    { label: "Contact", to: "/contact" },
                    { label: "Status", href: "#" },
                    { label: "API Docs", href: "#" },
                  ],
                },
              ].map((col) => (
                <div key={col.heading} className="flex flex-col gap-3">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-[0.14em]">
                    {col.heading}
                  </h4>
                  {col.links.map((l) =>
                    l.to ? (
                      <Link
                        key={l.label}
                        to={l.to}
                        className="text-white/35 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        key={l.label}
                        href={l.href}
                        className="text-white/35 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {l.label}
                      </a>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-7 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-white/20">
              {"© 2025 SchoolOS Inc. All rights reserved."}
            </p>
            <div className="flex gap-5 text-xs text-white/20">
              <a href="#" className="hover:text-white/50 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white/50 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white/50 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Features;
