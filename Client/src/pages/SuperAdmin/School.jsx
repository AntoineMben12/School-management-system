import React from "react";
function School() {
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
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group" href="#">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">verified_user</span>
                        <span className="text-sm font-medium">Licenses</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all" href="#">
                        <span className="material-symbols-outlined fill-1">domain</span>
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
                                <span className="text-white font-medium">School Management</span>
                            </nav>
                            <div className="flex flex-wrap justify-between items-end gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">School Management</h1>
                                    <p className="text-gray-400 mt-2 text-lg">Manage and view all registered schools in the system.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                                        <span className="material-symbols-outlined text-[20px]">download</span>
                                        Export List
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Layout Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
                            {/* LEFT PANEL: Add School Form */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                        <span className="material-symbols-outlined text-[120px] text-primary">domain</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-primary/20 p-2 rounded-lg">
                                                <span className="material-symbols-outlined text-primary">add_circle</span>
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Add New School</h2>
                                        </div>
                                        <form className="flex flex-col gap-5">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-300">School Name</label>
                                                <input className="w-full bg-[#2e2839] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all" placeholder="e.g. Springfield High School" type="text" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-300">Location</label>
                                                <input className="w-full bg-[#2e2839] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all" placeholder="e.g. New York, NY" type="text" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-gray-300">Admin Email</label>
                                                <input className="w-full bg-[#2e2839] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all" placeholder="admin@school.edu" type="email" />
                                            </div>
                                            <button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 group" type="button">
                                                <span className="material-symbols-outlined text-[20px] group-hover:animate-pulse">add</span>
                                                Add School
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* RIGHT PANEL: Schools Table */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[600px]">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-500/10 p-2 rounded-lg">
                                                <span className="material-symbols-outlined text-purple-400">history</span>
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Registered Schools</h2>
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
                                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Location</th>
                                                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Admin Email</th>
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
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">New York, NY</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">admin@springfield.edu</td>
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
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Los Angeles, CA</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">principal@lincoln.edu</td>
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
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Chicago, IL</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">it@westview.ac</td>
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
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Houston, TX</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">director@oaktree.com</td>
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
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">Miami, FL</td>
                                                    <td className="py-4 px-4 text-sm text-gray-300">ops@riverdale.edu</td>
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
                                        <p className="text-xs text-gray-500">Showing 1-5 of 24 schools</p>
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

export default School;
