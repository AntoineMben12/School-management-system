import React, { useEffect, useRef } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
function Features() {
  // GSAP animation for trusted-by logos
  const trustedRef = useRef(null);
  useEffect(() => {
    if (trustedRef.current) {
      gsap.fromTo(
        trustedRef.current.querySelectorAll('.trusted-logo'),
        { y: 40, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.18, duration: 1, ease: "power3.out" }
      );
    }
  }, []);
  return (
    <>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black">
              <span className="material-symbols-outlined text-[20px] font-bold">
                school
              </span>
            </div>
            <span className="text-lg font-bold tracking-tight text-black dark:text-white">
              SchoolOS
            </span>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-main dark:text-gray-200">
            <Link className="text-primary" to="/features">
              Features
            </Link>
            <Link className="hover:text-primary transition-colors" to="/pricing">
              Pricing
            </Link>
            <Link className="hover:text-primary transition-colors" to="/contact">
              Contact
            </Link>
          </div>
          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                if (menu) menu.classList.toggle('hidden');
              }}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link
              className="hidden sm:block text-sm font-medium text-text-main dark:text-gray-200 hover:text-primary transition-colors"
              to="/login"
            >
              Log in
            </Link>
            <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity">
              <Link to="/signup">Sign up</Link>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div id="mobile-menu" className="md:hidden hidden px-4 pb-4 bg-white dark:bg-background-dark border-b border-gray-200/50 dark:border-white/10">
          <div className="flex pt-4 flex-col gap-2 text-sm font-medium text-text-main dark:text-gray-200">
            <Link className="py-2 px-2 rounded hover:bg-primary/10" to="/features" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>Features</Link>
            <Link className="py-2 px-2 rounded hover:bg-primary/10" to="/pricing" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>Pricing</Link>
            <Link className="py-2 px-2 rounded hover:bg-primary/10" to="/contact" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>Contact</Link>
            <Link className="py-2 px-2 rounded hover:bg-primary/10" to="/login" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>Log in</Link>
            <Link className="py-2 px-2 rounded hover:bg-primary/10" to="/signup" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>Sign up</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative flex flex-col items-center min-h-screen pb-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 text-center max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-black mb-4 sm:mb-6 leading-[1.1]"
          >
            Everything your
            <br />
            <span className="text-secondary">institution needs.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-base xs:text-lg sm:text-xl md:text-2xl text-text-secondary dark:text-gray-400 font-normal max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12"
          >
            Powerful, intuitive tools designed to bring students, teachers, and administration into perfect sync.
          </motion.p>
          {/* Demo UI Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="relative w-full max-w-4xl mx-auto mt-6 sm:mt-10 perspective-1000"
          >
            <div className="relative bg-white dark:bg-[#1f1a29] rounded-t-2xl sm:rounded-t-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden aspect-[16/10] md:aspect-[21/9] flex flex-col">
              <div className="h-8 sm:h-10 border-b border-gray-100 dark:border-gray-800 flex items-center px-2 sm:px-4 gap-2 bg-gray-50 dark:bg-[#15101f]">
                <div className="size-3 rounded-full bg-red-400"></div>
                <div className="size-3 rounded-full bg-yellow-400"></div>
                <div className="size-3 rounded-full bg-green-400"></div>
                <div className="ml-2 sm:ml-4 h-4 sm:h-5 w-32 sm:w-64 rounded bg-gray-200 dark:bg-gray-700 opacity-50 hidden xs:block"></div>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                <div className="w-full sm:w-16 md:w-60 border-r border-gray-100 dark:border-gray-800 p-2 sm:p-4 flex flex-row sm:flex-col gap-2 sm:gap-4 bg-gray-50/50 dark:bg-white/5">
                  <div className="h-8 w-8 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-lg opacity-50"></div>
                  <div className="space-y-2 sm:space-y-3 mt-2 sm:mt-4 flex-1">
                    <div className="h-8 w-full bg-primary/10 rounded-lg border border-primary/20"></div>
                    <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                    <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                    <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                  </div>
                </div>
                <div className="flex-1 p-4 sm:p-6 md:p-8 bg-white dark:bg-[#1f1a29]">
                  <div className="flex flex-col xs:flex-row justify-between items-center mb-4 sm:mb-8 gap-2 xs:gap-0">
                    <div className="h-8 w-32 sm:w-48 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                    <div className="h-8 w-20 sm:w-24 bg-primary rounded-full opacity-80"></div>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-8">
                    <div className="h-24 sm:h-32 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2 sm:p-4"></div>
                    <div className="h-24 sm:h-32 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2 sm:p-4"></div>
                    <div className="h-24 sm:h-32 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2 sm:p-4 hidden md:block"></div>
                  </div>
                  <div className="h-32 sm:h-48 w-full bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"></div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-40"></div>
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.13 } },
          }}
          className="w-full px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl mx-auto py-10 sm:py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
            {/* AI Report Cards */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="md:col-span-2 group relative p-8 md:p-10 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 feature-card-hover overflow-hidden"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px 0 rgba(80,0,255,0.10)" }}
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="size-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-[28px]">
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-black dark:text-white mb-3">
                    AI Report Cards
                  </h3>
                  <p className="text-text-secondary dark:text-gray-400 leading-relaxed max-w-md">
                    Generate comprehensive student performance insights
                    instantly. Our local-first AI analyzes grades, attendance,
                    and participation to write personalized comments for every
                    student.
                  </p>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 size-64 bg-gradient-to-br from-purple-100/50 to-transparent dark:from-purple-900/10 rounded-full blur-2xl group-hover:bg-purple-200/50 dark:group-hover:bg-purple-800/20 transition-colors duration-500"></div>
            </motion.div>
            {/* Finance Suite */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="md:col-span-1 group relative p-8 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 feature-card-hover"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(0,80,255,0.10)" }}
            >
              <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  account_balance
                </span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Finance Suite
              </h3>
              <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                Track tuition, handle payroll, and manage departmental budgets
                with bank-grade security and automated invoicing.
              </p>
            </motion.div>
            {/* Communication Hub */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="md:col-span-1 group relative p-8 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 feature-card-hover"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(0,255,80,0.10)" }}
            >
              <div className="size-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  forum
                </span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Communication Hub
              </h3>
              <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                A unified inbox for teachers, parents, and students. Broadcast
                announcements or chat one-on-one without exchanging phone
                numbers.
              </p>
            </motion.div>
            {/* Dynamic Scheduling */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="md:col-span-2 group relative p-8 md:p-10 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 feature-card-hover overflow-hidden"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px 0 rgba(255,140,0,0.10)" }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center h-full">
                <div className="flex-1">
                  <div className="size-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 mb-6">
                    <span className="material-symbols-outlined text-[28px]">
                      calendar_month
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-black dark:text-white mb-3">
                    Dynamic Scheduling
                  </h3>
                  <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                    Conflict-free timetable generation. Handle complex
                    rotations, substitute teacher assignment, and room bookings
                    with a drag-and-drop interface.
                  </p>
                </div>
                <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="w-12 h-8 rounded bg-gray-200 dark:bg-gray-600"></div>
                      <div className="flex-1 h-8 rounded bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-12 h-8 rounded bg-gray-200 dark:bg-gray-600"></div>
                      <div className="flex-1 h-8 rounded bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-12 h-8 rounded bg-gray-200 dark:bg-gray-600"></div>
                      <div className="flex-1 h-8 rounded bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Digital Library */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="md:col-span-1 group relative p-8 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 feature-card-hover"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(255,0,140,0.10)" }}
            >
              <div className="size-12 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  local_library
                </span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Digital Library
              </h3>
              <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                Manage physical and digital assets. Track book loans, tablet
                assignments, and lab equipment inventory.
              </p>
            </motion.div>
            {/* Enterprise Security */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="md:col-span-1 group relative p-8 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 feature-card-hover"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(80,80,80,0.10)" }}
            >
              <div className="size-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  shield_lock
                </span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Enterprise Security
              </h3>
              <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                Role-based access control, audit logs, and GDPR compliance
                built-in to protect sensitive student data.
              </p>
            </motion.div>
            {/* Real-time Analytics */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="md:col-span-1 group relative p-8 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 feature-card-hover"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(0,255,255,0.10)" }}
            >
              <div className="size-12 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-600 mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  analytics
                </span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Real-time Analytics
              </h3>
              <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                Visual dashboards for attendance trends, grade distribution, and
                enrollment statistics.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-8 sm:mt-10 mb-12 sm:mb-20 px-4 sm:px-6 text-center w-full max-w-4xl"
        >
          <div className="bg-black dark:bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 sm:-mr-20 -mt-10 sm:-mt-20 w-40 sm:w-80 h-40 sm:h-80 bg-gray-800 dark:bg-gray-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 sm:-ml-20 -mb-10 sm:-mb-20 w-40 sm:w-80 h-40 sm:h-80 bg-gray-800 dark:bg-gray-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white dark:text-black mb-4 sm:mb-6 tracking-tight">
                Ready to modernize your school?
              </h2>
              <p className="text-gray-400 dark:text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
                Join over 500 institutions using SchoolOS to streamline their operations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button className="bg-white dark:bg-black text-black dark:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                  Start Free Trial
                </button>
                <button className="bg-transparent border border-gray-600 dark:border-gray-300 text-white dark:text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-bold hover:bg-white/10 dark:hover:bg-black/5 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Trusted By Section */}
        <section ref={trustedRef} className="px-4 sm:px-6 text-center pb-12 sm:pb-20">
          <p className="text-xs font-semibold text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-6 sm:mb-8">
            Trusted by innovative institutions
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="trusted-logo flex items-center gap-2 text-base sm:text-xl font-bold text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined">school</span>EduTech
            </div>
            <div className="trusted-logo flex items-center gap-2 text-base sm:text-xl font-bold text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined">menu_book</span>
              UniSystem
            </div>
            <div className="trusted-logo flex items-center gap-2 text-base sm:text-xl font-bold text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined">science</span>LabCore
            </div>
            <div className="trusted-logo flex items-center gap-2 text-base sm:text-xl font-bold text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined">public</span>
              GlobalHigh
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-black py-8 sm:py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 sm:gap-8">
            <div className="flex flex-col gap-3 sm:gap-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-primary">
                  school
                </span>
                <span className="font-bold text-black dark:text-white">
                  SchoolOS
                </span>
              </div>
              <p className="text-text-secondary dark:text-gray-400 text-xs sm:text-sm max-w-xs">
                Empowering the next generation of educators and students with seamless management tools.
              </p>
              <p className="text-xs text-text-secondary/50 dark:text-gray-600">
                © 2024 SchoolOS Inc. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-xs sm:text-sm">
              <div className="flex flex-col gap-2 sm:gap-3">
                <h4 className="font-semibold text-black dark:text-white">
                  Product
                </h4>
                <Link className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" to="/features">Features</Link>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Security</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Roadmap</a>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h4 className="font-semibold text-black dark:text-white">
                  Company
                </h4>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">About</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Careers</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Legal</a>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h4 className="font-semibold text-black dark:text-white">
                  Support
                </h4>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Help Center</a>
                <Link className="text-primary font-medium transition-colors" to="/contact">Contact</Link>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Status</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Features;
