import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";

function Contact() {
    // GSAP animation for contact icons
    const iconRef = useRef(null);
    useEffect(() => {
        if (iconRef.current) {
            gsap.fromTo(
                iconRef.current.querySelectorAll('.contact-icon'),
                { y: 40, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 1, ease: "power3.out" }
            );
        }
    }, []);
    return (
        <>
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black">
                            <span className="material-symbols-outlined text-[20px] font-bold">school</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-black dark:text-white">SchoolOS</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-main dark:text-gray-200">
                        <Link className="hover:text-primary transition-colors" to="/features">Features</Link>
                        <Link className="hover:text-primary transition-colors" to="/Pricing">Pricing</Link>
                        <Link className="text-primary font-semibold" to="/contact">Contact</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link className="hidden sm:block text-sm font-medium text-text-main dark:text-gray-200 hover:text-primary transition-colors" to="/login">Log in</Link>
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
                    className="pt-24 pb-12 px-6 text-center max-w-4xl mx-auto"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-6">
                        We’re here to {" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">help.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="text-xl text-text-secondary dark:text-gray-400 font-normal max-w-2xl mx-auto leading-relaxed">
                        Have questions about SchoolOS? Our dedicated team is ready to assist your institution.
                    </motion.p>
                </motion.section>

                {/* Contact Form & Info */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12 } },
                    }}
                    className="w-full px-6 max-w-6xl mx-auto mb-20"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                        {/* Contact Form */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40, scale: 0.97 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
                            }}
                            className="lg:col-span-7 bg-white dark:bg-[#1f1a29] rounded-3xl shadow-card border border-white dark:border-gray-800 p-8 md:p-12"
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(80,0,255,0.08)" }}
                        >
                            <h3 className="text-2xl font-semibold text-black dark:text-white mb-8">Send us a message</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main dark:text-gray-300" htmlFor="name">Name</label>
                                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400" id="name" placeholder="Your full name" type="text" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main dark:text-gray-300" htmlFor="email">School Email</label>
                                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400" id="email" placeholder="name@school.edu" type="email" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-main dark:text-gray-300" htmlFor="subject">Subject</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer" id="subject">
                                        <option>General Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Sales &amp; Licensing</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-main dark:text-gray-300" htmlFor="message">Message</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none" id="message" placeholder="How can we help you?" rows={5}></textarea>
                                </div>
                                <div className="pt-2">
                                    <button className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full shadow-lg shadow-primary/25 transition-all duration-200" type="button">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                        {/* Contact Info & Premium Support */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40, scale: 0.97 },
                                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.1 } },
                            }}
                            className="lg:col-span-5 space-y-10 lg:pl-4 pt-4 lg:pt-12"
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(80,0,255,0.08)" }}
                        >
                            <div ref={iconRef}>
                                <h4 className="text-lg font-semibold text-black dark:text-white mb-6">Contact Information</h4>
                                <div className="space-y-6">
                                    <div className="contact-icon flex items-start gap-4">
                                        <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-0.5">Support Email</p>
                                            <a className="text-base text-black font-medium hover:text-primary transition-colors" href="mailto:ngwemmben@gmail.com">ngwemmben@gmail.com</a>
                                        </div>
                                    </div>
                                    <div className="contact-icon flex items-start gap-4">
                                        <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-0.5">Office</p>
                                            <p className="text-base text-black font-medium">Infinite Loop<br />Yaounde, Yde awae</p>
                                        </div>
                                    </div>
                                    <div className="contact-icon flex items-start gap-4">
                                        <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-[20px]">phone</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-secondary dark:text-purple-400 mb-0.5">Call Us</p>
                                            <p className="text-base text-black font-medium">+237 (688) 495-234</p>
                                            <p className="text-xs text-text-secondary mt-1">Mon-Fri from 8am to 5pm PST</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
                                <div className="flex gap-3 mb-2">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">workspace_premium</span>
                                    <h5 className="font-semibold text-blue-900 dark:text-blue-100">Premium Support</h5>
                                </div>
                                <p className="text-sm text-blue-400/90 leading-relaxed mb-4">
                                    SchoolOS Enterprise customers have access to a dedicated account manager and 24/7 priority phone support.
                                </p>
                               <Link to="/pricing"> <a className="text-sm font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 group" href="#">
                                    Log in to Enterprise Portal
                                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                </a></Link>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* FAQ Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1 } },
                    }}
                    className="w-full max-w-3xl mx-auto px-6 mb-20"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-2xl font-bold text-center text-black mb-10"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <div className="space-y-4">
                        <motion.details
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                            }}
                            className="group bg-white dark:bg-[#1f1a29] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <span>What is the typical response time?</span>
                                <span className="transition group-open:rotate-180">
                                    <span className="material-symbols-outlined text-gray-400">expand_more</span>
                                </span>
                            </summary>
                            <div className="text-text-secondary dark:text-gray-400 px-6 pb-6 pt-0 leading-relaxed text-sm">
                                For standard inquiries, we aim to respond within 24 hours. Premium support ticket holders typically receive a response within 1 hour during business hours.
                            </div>
                        </motion.details>
                        <motion.details
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                            }}
                            className="group bg-white dark:bg-[#1f1a29] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <span>Can I schedule a live demo?</span>
                                <span className="transition group-open:rotate-180">
                                    <span className="material-symbols-outlined text-gray-400">expand_more</span>
                                </span>
                            </summary>
                            <div className="text-text-secondary dark:text-gray-400 px-6 pb-6 pt-0 leading-relaxed text-sm">
                                Absolutely. Please fill out the form above and select "Sales & Licensing" as the subject. Our team will reach out to schedule a comprehensive walkthrough tailored to your school's needs.
                            </div>
                        </motion.details>
                        <motion.details
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                            }}
                            className="group bg-white dark:bg-[#1f1a29] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <span>Where can I find documentation?</span>
                                <span className="transition group-open:rotate-180">
                                    <span className="material-symbols-outlined text-gray-400">expand_more</span>
                                </span>
                            </summary>
                            <div className="text-text-secondary dark:text-gray-400 px-6 pb-6 pt-0 leading-relaxed text-sm">
                                Comprehensive guides for Admins, Teachers, and Students are available in our Help Center. You can access it via the link in the footer or by logging into your dashboard.
                            </div>
                        </motion.details>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-black py-12 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                        <div className="flex flex-col gap-4 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <span className="material-symbols-outlined text-primary">school</span>
                                <span className="font-bold text-black dark:text-white">SchoolOS</span>
                            </div>
                            <p className="text-text-secondary dark:text-gray-400 text-sm max-w-xs">
                                Empowering the next generation of educators and students with seamless management tools.
                            </p>
                            <p className="text-xs text-text-secondary/50 dark:text-gray-600">© 2024 SchoolOS Inc. All rights reserved.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-12 text-sm">
                            <div className="flex flex-col gap-3">
                                <h4 className="font-semibold text-black dark:text-white">Product</h4>
                                <Link className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" to="/features">Features</Link>
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

export default Contact;