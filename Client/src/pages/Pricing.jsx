import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";

function PricingPage() {
  // GSAP animation for trust logos
  const trustRef = useRef(null);
  useEffect(() => {
    if (trustRef.current) {
      gsap.fromTo(
        trustRef.current.querySelectorAll('.trust-logo'),
        { y: 40, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.18, duration: 1, ease: "power3.out" }
      );
    }
  }, []);
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white antialiased selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="size-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black">
              <span className="material-symbols-outlined text-[20px] font-bold">school</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-black dark:text-white">SchoolOS</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-text-main dark:text-gray-200">
            <Link className="hover:text-primary transition-colors" to="/feature">Features</Link>
            <Link className="text-primary" to='/Pricing'>Pricing</Link>
            <Link className="hover:text-primary transition-colors" to={"/contact"}>Contact</Link>
            
          </div>
          <div className="flex items-center gap-4">
            <a className="hidden sm:block text-sm font-medium text-text-main dark:text-gray-200 hover:text-primary transition-colors" href="#">Log in</a>
            <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"><Link to="/signup">Sign up</Link></button>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen pb-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white mb-6"
          >
            Simple pricing for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">complex management.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-xl md:text-2xl text-text-secondary dark:text-gray-400 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Choose the license that fits your academic calendar. No hidden fees. Cancel anytime.
          </motion.p>
        </motion.section>
        {/* Pricing Cards Container */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="w-full px-6 md:px-10 lg:px-20 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Term License Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="relative flex flex-col p-8 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 transition-transform hover:-translate-y-1 duration-300"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(80,0,255,0.08)" }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Term License</h3>
                <p className="text-sm text-text-secondary dark:text-gray-400">Ideal for short-term courses.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-black dark:text-white tracking-tight">$180</span>
                <span className="text-text-secondary dark:text-gray-400 font-medium">/ term</span>
              </div>
              <button className="w-full py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 text-sm font-bold mb-8">Get Started</button>
              <div className="space-y-4">
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300">Single Term Access</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300">Basic Email Support</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300">Student Portal</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[20px]">cancel</span><span className="text-sm text-gray-400 dark:text-gray-600 line-through">API Access</span></div>
              </div>
            </motion.div>
            {/* Semester License Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
              }}
              className="relative flex flex-col p-8 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 transition-transform hover:-translate-y-1 duration-300"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(80,0,255,0.08)" }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Semester License</h3>
                <p className="text-sm text-text-secondary dark:text-gray-400">Great for seasonal programs.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-black dark:text-white tracking-tight">$240</span>
                <span className="text-text-secondary dark:text-gray-400 font-medium">/ semester</span>
              </div>
              <button className="w-full py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 text-sm font-bold mb-8">Get Started</button>
              <div className="space-y-4">
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300">2 Terms Access</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300">Priority Chat Support</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300">Student & Parent Portals</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300">Advanced Analytics</span></div>
              </div>
            </motion.div>
            {/* Yearly License Card (Featured) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.2 } },
              }}
              className="relative flex flex-col p-8 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-2xl shadow-primary/10 border-2 border-primary/20 dark:border-primary/40 transform scale-100 md:scale-105 z-10"
              whileHover={{ scale: 1.08, boxShadow: "0 16px 48px 0 rgba(128,0,255,0.2)" }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Yearly License</h3>
                <p className="text-sm text-text-secondary dark:text-gray-400">Best value for full-time schools.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-black dark:text-white tracking-tight">$500</span>
                <span className="text-text-secondary dark:text-gray-400 font-medium">/ year</span>
              </div>
              <button className="w-full py-3 rounded-full bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all duration-200 text-sm font-bold mb-8">Get Started</button>
              <div className="space-y-4">
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Full Year Access</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Dedicated Manager</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Full API Access</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Unlimited Storage</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span><span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Custom Branding</span></div>
              </div>
            </motion.div>
          </div>
        </motion.section>
        {/* Trust Section */}
        <section ref={trustRef} className="mt-20 px-6 text-center">
          <p className="text-sm font-semibold text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-8">Trusted by 500+ innovative institutions</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="trust-logo flex items-center gap-2 text-xl font-bold text-gray-600 dark:text-gray-400"><span className="material-symbols-outlined">school</span>EduTech</div>
            <div className="trust-logo flex items-center gap-2 text-xl font-bold text-gray-600 dark:text-gray-400"><span className="material-symbols-outlined">menu_book</span>UniSystem</div>
            <div className="trust-logo flex items-center gap-2 text-xl font-bold text-gray-600 dark:text-gray-400"><span className="material-symbols-outlined">science</span>LabCore</div>
            <div className="trust-logo flex items-center gap-2 text-xl font-bold text-gray-600 dark:text-gray-400"><span className="material-symbols-outlined">public</span>GlobalHigh</div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-white dark:bg-black py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            {/* Brand */}
            <div className="flex flex-col gap-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-primary">school</span>
                <span className="font-bold text-black dark:text-white">SchoolOS</span>
              </div>
              <p className="text-text-secondary dark:text-gray-400 text-sm max-w-xs">Empowering the next generation of educators and students with seamless management tools.</p>
              <p className="text-xs text-text-secondary/50 dark:text-gray-600">© 2024 SchoolOS Inc. All rights reserved.</p>
            </div>
            {/* Link Columns */}
            <div className="flex flex-wrap justify-center gap-12 text-sm">
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold text-black dark:text-white">Product</h4>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Features</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Security</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Roadmap</a>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold text-black dark:text-white">Company</h4>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">About</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Careers</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Legal</a>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold text-black dark:text-white">Support</h4>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Help Center</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Contact</a>
                <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Status</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PricingPage;
