import React, { useState } from 'react';

function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white overflow-hidden h-screen flex font-display">
            {/* Sidebar */}
            <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex-col hidden lg:flex h-full z-10 transition-colors duration-300">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                        </div>
                        <div>
                            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-none">EduManager</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1">Student Portal</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-1">
                        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-primary/10 text-primary" href="#">
                            <span className="material-symbols-outlined icon text-primary">person</span>
                            Profile
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors group" href="#">
                            <span className="material-symbols-outlined icon text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">calendar_month</span>
                            Schedule
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors group" href="#">
                            <span className="material-symbols-outlined icon text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">menu_book</span>
                            Grades
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors group" href="#">
                            <span className="material-symbols-outlined icon text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">credit_card</span>
                            Fees
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors group" href="#">
                            <span className="material-symbols-outlined icon text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">settings</span>
                            Settings
                        </a>
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm"
                            data-alt="Student profile thumbnail"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbQfNpOVWQZT4FxdNvKFbzSn5zviltY1JElmm5Dw9nGXkm88bmUl0ICkDMij7AcxjYultpZ9CDOOkUmlQUqG7MU1cnjXYNINz9jXBob6q5RK29rBN8SI0VoS8hHSfqC-JM0sYZLJYtESV_gUts-t5qz2vNNr0R9CIzqQXTMIN7PS9YWo9FdwfhILGzVUsZFozA_O3iNcRh0TxxKk9DW0Sa7U4yuEOS4NyIYx5qLbGbWAj7Xl_0U9qrJj0DhbmMnAgCjtNpQ65Zc1o")' }}
                        ></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Alex Johnson</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Log out</span>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative h-full">
                {/* Mobile Header (Visible only on small screens) */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">EduManager</span>
                    </div>
                    <button className="text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
                <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
                    {/* Breadcrumb / Header Text */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Academic Profile</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your academic progress and reports.</p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Last updated: Today, 9:41 AM</div>
                    </div>
                    {/* Profile Header Card */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="relative">
                                    <div
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-cover bg-center border-4 border-white dark:border-gray-700 shadow-md"
                                        data-alt="Portrait of Alex Johnson, a student"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgHGOVO8ejIBX6TAXMR76t9SnFwe6SpZvwwl7EARWWPXE1fK4e0zernWoLv2d_MYC0bpVUg20Gt-A2446zA56vlo3GAZc3iZOdoIERYfoCu25fBm7ZLTABi98iPA0w7CPFMBa9iWFAILsd-lRDqBgo8JrMnHYJfMpiuH8N9FMmJQa7tKdgMCcuGRnb-C4-XEq1-v2pEjl7Lx7Ml4GCmgFrhZl3YV9Myu51_Rqd3_D5U-m0fV7vr5ymC5PW_JmgvImJ3MHx4zL7cnQ")' }}
                                    ></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-white dark:border-surface-dark rounded-full flex items-center justify-center" title="Online"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Alex Johnson</h1>
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-wider">Active</span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">Grade 11 - Science Stream</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">badge</span> ID: #88291</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span> Room 3B</span>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 w-full md:w-auto">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                Contact Teacher
                            </button>
                        </div>
                    </div>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat 1 */}
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-full">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Current GPA</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">3.8</h3>
                                </div>
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">trending_up</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
                                <span className="bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-green-700 dark:text-green-300">+0.2</span>
                                <span className="text-gray-500 dark:text-gray-400 font-normal">vs last semester</span>
                            </div>
                        </div>
                        {/* Stat 2 */}
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-full">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Attendance</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">98%</h3>
                                </div>
                                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: '98%' }}></div>
                            </div>
                        </div>
                        {/* Stat 3 */}
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-full">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Class Rank</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">5<span className="text-xl text-gray-400 font-normal">/120</span></h3>
                                </div>
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">emoji_events</span>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Top 5% of the class cohort</p>
                        </div>
                    </div>
                    {/* Bento Grid: Charts & Marks */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Chart Section */}
                        <div className="lg:col-span-8 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Academic Performance Trend</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">GPA progression over the last 4 semesters</p>
                                </div>
                                <select className="text-sm border-gray-200 dark:border-gray-700 bg-transparent rounded-lg focus:ring-primary focus:border-primary text-gray-600 dark:text-gray-300">
                                    <option>Last 2 Years</option>
                                    <option>Last Year</option>
                                </select>
                            </div>
                            <div className="relative w-full h-[250px]">
                                {/* SVG Chart */}
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 800 250">
                                    <defs>
                                        <linearGradient id="gradientPrimary" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#7c3bed" stopOpacity="0.2"></stop>
                                            <stop offset="100%" stopColor="#7c3bed" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    {/* Grid Lines */}
                                    <line className="dark:stroke-gray-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
                                    <line className="dark:stroke-gray-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="140" y2="140"></line>
                                    <line className="dark:stroke-gray-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="80" y2="80"></line>
                                    <line className="dark:stroke-gray-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="20" y2="20"></line>
                                    {/* Area Fill */}
                                    <path d="M0,160 C100,160 150,110 200,110 C250,110 300,140 400,140 C500,140 550,60 600,60 C650,60 700,50 800,50 V250 H0 Z" fill="url(#gradientPrimary)"></path>
                                    {/* Line */}
                                    <path d="M0,160 C100,160 150,110 200,110 C250,110 300,140 400,140 C500,140 550,60 600,60 C650,60 700,50 800,50" fill="none" stroke="#7c3bed" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                                    {/* Data Points */}
                                    <circle cx="200" cy="110" fill="#ffffff" r="5" stroke="#7c3bed" strokeWidth="3"></circle>
                                    <circle cx="400" cy="140" fill="#ffffff" r="5" stroke="#7c3bed" strokeWidth="3"></circle>
                                    <circle cx="600" cy="60" fill="#ffffff" r="5" stroke="#7c3bed" strokeWidth="3"></circle>
                                    <circle cx="800" cy="50" fill="#ffffff" r="5" stroke="#7c3bed" strokeWidth="3"></circle>
                                </svg>
                                {/* X Axis Labels */}
                                <div className="flex justify-between mt-4 text-xs font-medium text-gray-400 uppercase tracking-wide px-2">
                                    <span>Fall '22</span>
                                    <span>Spring '23</span>
                                    <span>Fall '23</span>
                                    <span>Current</span>
                                </div>
                            </div>
                        </div>
                        {/* Recent Marks Section */}
                        <div className="lg:col-span-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Marks</h3>
                            <div className="flex flex-col gap-4 flex-1">
                                {/* Mark Item 1 */}
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">M</div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Mathematics</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Mr. Anderson</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold text-gray-900 dark:text-white">92%</span>
                                        <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">A Grade</span>
                                    </div>
                                </div>
                                {/* Mark Item 2 */}
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">P</div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Physics</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Ms. Curie</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold text-gray-900 dark:text-white">88%</span>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">B+ Grade</span>
                                    </div>
                                </div>
                                {/* Mark Item 3 */}
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">E</div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">English Lit</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Mr. Poe</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold text-gray-900 dark:text-white">95%</span>
                                        <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">A+ Grade</span>
                                    </div>
                                </div>
                                {/* Mark Item 4 */}
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">H</div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">History</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Mrs. Carter</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold text-gray-900 dark:text-white">85%</span>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">B Grade</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                View Full Gradebook
                            </button>
                        </div>
                    </div>
                    {/* Report Cards Section */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Report Cards</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Download official transcripts and reports</p>
                            </div>
                            <button className="text-primary text-sm font-medium hover:underline">View Archive</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800">
                            {/* Report Item 1 */}
                            <div className="bg-surface-light dark:bg-surface-dark p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined">picture_as_pdf</span>
                                    </div>
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">download</span>
                                    </button>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Fall Semester 2023</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Issued on Dec 20, 2023</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">Final Report</span>
                                    <span className="text-[10px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">2.4 MB</span>
                                </div>
                            </div>
                            {/* Report Item 2 */}
                            <div className="bg-surface-light dark:bg-surface-dark p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined">picture_as_pdf</span>
                                    </div>
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">download</span>
                                    </button>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Spring Semester 2023</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Issued on Jun 15, 2023</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">Final Report</span>
                                    <span className="text-[10px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">2.1 MB</span>
                                </div>
                            </div>
                            {/* Report Item 3 */}
                            <div className="bg-surface-light dark:bg-surface-dark p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">download</span>
                                    </button>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Mid-Term Progress</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Issued on Oct 10, 2023</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">Progress</span>
                                    <span className="text-[10px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">1.2 MB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Footer Spacing */}
                    <div className="h-10"></div>
                </div>
            </main>
        </div>
    );
}

export default StudentDashboard;
