import React from "react";

// NOTE: For custom scrollbar and glass-sidebar, add the CSS to your global styles or Tailwind config.

function Licences() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display antialiased overflow-hidden flex h-screen w-full">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 h-full glass-sidebar z-20 fixed md:relative shrink-0">
                <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
                    <div className="bg-gradient-to-br from-primary to-purple-900 rounded-lg w-10 h-10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white">school</span>
                    </div>
                    <div>
                        <h1 className="text-white text-base font-semibold leading-tight">EduSys Admin</h1>
                        <p className="text-gray-400 text-xs">Superadmin Console</p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</p>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all" href="#">
                        <span className="material-symbols-outlined fill-1">verified_user</span>
                        <span className="text-sm font-medium">Licenses</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">domain</span>
                        <span className="text-sm font-medium">Schools</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">group</span>
                        <span className="text-sm font-medium">User Management</span>
                    </a>
                    <p className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</p>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">description</span>
                        <span className="text-sm font-medium">Audit Logs</span>
                    </a>
                </div>
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-cover bg-center border border-white/10" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEdh08uPx7-FZrDzQ8ANeh2j4zhnpqTs2RkY330Ad0e1zeUrxJeEv8z1RSNwp5yV1pS2OkpU6T0xGuBiHk1QJGnjQR-xlW58bqMIREqB84AmNgkk-2BMsEGTPdzsztJDYfvWeifDAHiKTlSU09e98CuKRPMcFGPAPu_t9q4NiS6pWl9wd-4z3jAd9a4vWa2VxrzHX1Mb8-32kyz7PEA8XEufV9rDGu_Dxi7ByNfpEVnHryHhXak7vS2UTPP556y_Ak4IVre5wUQ4M')` }} />
                        <div className="flex flex-col">
                            <span className="text-sm text-white font-medium">Jane Doe</span>
                            <span className="text-xs text-gray-400">View Profile</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-[#131118] border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">school</span>
                        <span className="text-white font-semibold">EduSys</span>
                    </div>
                    <button className="text-white">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto flex flex-col gap-8">
                        {/* Header Section */}
                        <div className="flex flex-col gap-2">
                            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                <span className="text-white font-medium">License Management</span>
                            </nav>
                            <div className="flex flex-wrap justify-between items-end gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">License Management</h1>
                                    <p className="text-gray-400 mt-2 text-lg">Issue and manage digital licenses for educational institutions.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                                        <span className="material-symbols-outlined text-[20px]">download</span>
                                        Export Report
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Layout Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
                            {/* LEFT PANEL: Issue License Form */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                        <span className="material-symbols-outlined text-[120px] text-primary">verified_user</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-primary/20 p-2 rounded-lg">
                                                <span className="material-symbols-outlined text-primary">add_circle</span>
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Issue New License</h2>
                                        </div>
                                        <form className="flex flex-col gap-5">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-300">School Name</label>
                                                <input className="w-full bg-[#2e2839] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all" placeholder="e.g. Springfield High School" type="text" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-300">Admin Email</label>
                                                <input className="w-full bg-[#2e2839] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all" placeholder="admin@school.edu" type="email" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-sm font-medium text-gray-300">Subscription Tier</label>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <label className="cursor-pointer group">
                                                        <input className="peer sr-only" name="tier" type="radio" />
                                                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#2e2839]/50 hover:bg-[#2e2839] peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 group-hover:bg-gray-600 peer-checked:bg-primary peer-checked:text-white transition-colors">S</div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-white">Standard</p>
                                                                    <p className="text-xs text-gray-400">Up to 500 students</p>
                                                                </div>
                                                            </div>
                                                            <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                                                        </div>
                                                    </label>
                                                    <label className="cursor-pointer group">
                                                        <input defaultChecked className="peer sr-only" name="tier" type="radio" />
                                                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#2e2839]/50 hover:bg-[#2e2839] peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 group-hover:bg-gray-600 peer-checked:bg-primary peer-checked:text-white transition-colors">P</div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-white">Premium</p>
                                                                    <p className="text-xs text-gray-400">Up to 2000 students</p>
                                                                </div>
                                                            </div>
                                                            <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                                                        </div>
                                                    </label>
                                                    <label className="cursor-pointer group">
                                                        <input className="peer sr-only" name="tier" type="radio" />
                                                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#2e2839]/50 hover:bg-[#2e2839] peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 group-hover:bg-gray-600 peer-checked:bg-primary peer-checked:text-white transition-colors">E</div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-white">Enterprise</p>
                                                                    <p className="text-xs text-gray-400">Unlimited access</p>
                                                                </div>
                                                            </div>
                                                            <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-2">
                                                <label className="text-sm font-medium text-gray-300">Validity Period</label>
                                                <div className="relative">
                                                    <select className="w-full bg-[#2e2839] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-white appearance-none outline-none transition-all cursor-pointer">
                                                        <option>1 Year License</option>
                                                        <option>3 Years License</option>
                                                        <option>Lifetime Access</option>
                                                    </select>
                                                    <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
                                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 group" type="button">
                                                <span className="material-symbols-outlined text-[20px] group-hover:animate-pulse">key</span>
                                                Create & Send Key
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* RIGHT PANEL: Recent Allocations Table */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[600px]">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-500/10 p-2 rounded-lg">
                                                <span className="material-symbols-outlined text-purple-400">history</span>
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Recent Allocations</h2>
                                        </div>
                                        <div className="relative w-full sm:w-64">
                                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500">search</span>
                                            <input className="w-full bg-[#2e2839] border border-transparent focus:border-primary/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all" placeholder="Search schools..." type="text" />
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto flex-1">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">School</th>
                                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Tier</th>
                                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">License Key</th>
                                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Valid Until</th>
                                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 text-center">Status</th>
                                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {/* Row 1 */}
                                                <tr className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-xs font-bold text-white">SH</div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white">Springfield High</p>
                                                                <p className="text-xs text-gray-500">admin@springfield.edu</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">Enterprise</span>
                                                    </td>
                                                    <td className="py-4 px-4 font-mono text-sm text-gray-300">XXXX-8921-AKL</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Oct 12, 2025</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-all">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                                {/* Row 2 */}
                                                <tr className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-xs font-bold text-white">LE</div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white">Lincoln Elementary</p>
                                                                <p className="text-xs text-gray-500">principal@lincoln.edu</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-700/50 text-gray-300 border border-white/10">Standard</span>
                                                    </td>
                                                    <td className="py-4 px-4 font-mono text-sm text-gray-300">XXXX-1190-BBM</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Sep 01, 2024</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Expiring Soon</span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-all">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                                {/* Row 3 */}
                                                <tr className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white">WA</div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white">Westview Academy</p>
                                                                <p className="text-xs text-gray-500">it@westview.ac</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">Premium</span>
                                                    </td>
                                                    <td className="py-4 px-4 font-mono text-sm text-gray-300">XXXX-3342-PLS</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Jan 15, 2026</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-all">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                                {/* Row 4 */}
                                                <tr className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-xs font-bold text-white">OT</div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white">Oak Tree Int.</p>
                                                                <p className="text-xs text-gray-500">director@oaktree.com</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">Enterprise</span>
                                                    </td>
                                                    <td className="py-4 px-4 font-mono text-sm text-gray-300">XXXX-9900-EXP</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Dec 31, 2023</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Expired</span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-all">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                                {/* Row 5 */}
                                                <tr className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-bold text-white">RH</div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white">Riverdale High</p>
                                                                <p className="text-xs text-gray-500">ops@riverdale.edu</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">Premium</span>
                                                    </td>
                                                    <td className="py-4 px-4 font-mono text-sm text-gray-300">XXXX-5521-PEN</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Pending Activation</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Pending</span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-all">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                        <p className="text-xs text-gray-500">Showing 1-5 of 24 allocations</p>
                                        <div className="flex gap-2">
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2e2839] text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white shadow-lg shadow-primary/20">
                                                <span className="text-sm font-medium">1</span>
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2e2839] text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                <span className="text-sm font-medium">2</span>
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2e2839] text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                <span className="text-sm font-medium">3</span>
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2e2839] text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Licences;