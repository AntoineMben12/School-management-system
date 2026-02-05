import React, { useState } from "react";

function TeacherDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-[#131118]">
            {/* Main Layout Container */}
            <div className="flex h-screen w-full">
                {/* Side Navigation (Left Sidebar) */}
                <aside className="hidden lg:flex flex-col w-64 border-r border-[#e5e7eb] bg-white h-full fixed top-0 left-0 z-20">
                    <div className="flex flex-col h-full justify-between p-4">
                        <div className="flex flex-col gap-6">
                            {/* Logo / School Info */}
                            <div className="flex gap-3 items-center px-2 pt-2">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
                                    data-alt="School logo abstract geometric shape"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDV2O62UqZRRdRulfGxUztkgEZg4ow7fnOifaE5wYM6CScSZqW0lsCS7OhC2S2eMiWDJdvkSqaSk9gsZQvggnIFzgMyvnPe0yyJ4bjW-f5zbgk3Is2d5rHaxoCdK80qefk6hMZnwmm1_562nrgJTk0g64z2_rAv_qfBDpmkKnsn6tJiG2SQCeEjAfvV_uDz8Ytxy4JT_CS5aWmPo-GN6qM_ns0zBWFCLQfO25nMdiVCtGwuzZux39xGP47St1p3NA9FTm0M-sJutNI")' }}
                                ></div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#131118] text-sm font-semibold leading-tight">Lincoln High</h1>
                                    <p className="text-[#706189] text-xs font-normal">Teacher Portal</p>
                                </div>
                            </div>
                            {/* Navigation Links */}
                            <nav className="flex flex-col gap-1">
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-[#706189] hover:text-[#131118] transition-colors group" href="#">
                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">dashboard</span>
                                    <span className="text-sm font-medium">Dashboard</span>
                                </a>
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined filled text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                                    <span className="text-sm font-medium">Classes</span>
                                </a>
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-[#706189] hover:text-[#131118] transition-colors group" href="#">
                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">groups</span>
                                    <span className="text-sm font-medium">Students</span>
                                </a>
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-[#706189] hover:text-[#131118] transition-colors group" href="#">
                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">calendar_month</span>
                                    <span className="text-sm font-medium">Schedule</span>
                                </a>
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-[#706189] hover:text-[#131118] transition-colors group" href="#">
                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">assignment</span>
                                    <span className="text-sm font-medium">Reports</span>
                                </a>
                            </nav>
                        </div>
                        {/* Bottom Links */}
                        <div className="flex flex-col gap-1">
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-[#706189] hover:text-[#131118] transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">settings</span>
                                <span className="text-sm font-medium">Settings</span>
                            </a>
                        </div>
                    </div>
                </aside>
                {/* Main Content Area */}
                <main className="flex-1 lg:ml-64 flex flex-col h-full bg-background-light dark:bg-background-dark relative">
                    {/* Sticky Header */}
                    <header className="sticky top-0 z-10 w-full backdrop-blur-md bg-white/80 border-b border-[#f2f0f4] px-6 py-4 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-xs font-medium text-[#706189]">
                                <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                <a className="hover:text-primary transition-colors" href="#">Classes</a>
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                <span className="text-[#131118]">History Intro</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 rounded-full hover:bg-gray-100 text-[#706189] transition-colors">
                                <span className="material-symbols-outlined text-[24px]">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <div className="h-8 w-[1px] bg-gray-200"></div>
                            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-[#131118]">Ms. Sarah Jenkins</p>
                                    <p className="text-xs text-[#706189]">History Teacher</p>
                                </div>
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white shadow-sm"
                                    data-alt="Teacher portrait photograph"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBW0JL7cMGRi2WNmxMZo1RaZbZbT6Ef_FaF3CkTQQMRF1dYSL1f4EngytRpiN9gFLL98v7t3I98PD7H_w0mInWsFUb0EybkUBFcbYtkcMH_yfEOh4RdEgTo6z7C0ElKexDPiusNJUY5e_wblMBO0NxseDYpZIAqZpv5ZDvk3paMX47av4U00VwgUWdsg52L79rZ6w_RilLY7N9hU1Cb2qGsDlqBE3cBKPbPA1vpt3LraxUz3gC_T7yhR9NjcC3_QzEr4by8cOqxZ-U")' }}
                                ></div>
                            </div>
                        </div>
                    </header>
                    {/* Scrollable Page Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-[1200px] mx-auto p-6 md:p-8 flex flex-col gap-8">
                            {/* Page Heading & Controls */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-[#131118] tracking-tight">Attendance: History Intro</h1>
                                    <div className="flex items-center gap-2 text-[#706189] text-sm">
                                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                                        <span>Period 2 • 09:00 AM - 10:00 AM</span>
                                        <span className="mx-1">•</span>
                                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                                        <span>Room 304</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                    <label className="flex items-center gap-2 bg-[#f7f6f8] px-3 py-2 rounded-lg border border-transparent focus-within:border-primary/20 focus-within:ring-2 focus-within:ring-primary/10 transition-all cursor-pointer group">
                                        <span className="material-symbols-outlined text-[#706189] text-[20px]">calendar_today</span>
                                        <input className="bg-transparent border-none text-sm font-medium text-[#131118] focus:ring-0 p-0 cursor-pointer group-hover:text-primary transition-colors" type="date" defaultValue="2023-10-24" />
                                    </label>
                                    <div className="relative group">
                                        <select className="appearance-none bg-[#f7f6f8] pl-3 pr-10 py-2 rounded-lg text-sm font-medium text-[#131118] border border-transparent focus:ring-2 focus:ring-primary/10 focus:border-primary/20 outline-none w-full cursor-pointer hover:bg-gray-100 transition-colors">
                                            <option>History Intro - Period 2</option>
                                            <option>History 102 - Period 4</option>
                                            <option>Civics 201 - Period 6</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#706189] pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                    <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                        Submit Attendance
                                    </button>
                                </div>
                            </div>
                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <span className="material-symbols-outlined">groups</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#706189] font-medium uppercase tracking-wider">Total</p>
                                        <p className="text-xl font-bold text-[#131118]">28</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <span className="material-symbols-outlined">check</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#706189] font-medium uppercase tracking-wider">Present</p>
                                        <p className="text-xl font-bold text-[#131118]">24</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                                        <span className="material-symbols-outlined">close</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#706189] font-medium uppercase tracking-wider">Absent</p>
                                        <p className="text-xl font-bold text-[#131118]">3</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#706189] font-medium uppercase tracking-wider">Late</p>
                                        <p className="text-xl font-bold text-[#131118]">1</p>
                                    </div>
                                </div>
                            </div>
                            {/* Attendance Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="px-6 py-4 border-b border-[#f2f0f4] flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-semibold text-[#131118]">Student Roster</h3>
                                    <div className="flex items-center gap-2">
                                        <button className="text-xs font-medium text-primary hover:text-primary/80 px-3 py-1.5 hover:bg-primary/5 rounded-md transition-colors">Mark All Present</button>
                                        <div className="h-4 w-[1px] bg-gray-300"></div>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                                            <input className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none w-48 transition-all" placeholder="Find student..." type="text" />
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-white text-xs uppercase text-[#706189] font-semibold border-b border-[#f2f0f4]">
                                            <tr>
                                                <th className="px-6 py-4 w-16">ID</th>
                                                <th className="px-6 py-4">Student Name</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                                <th className="px-6 py-4">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f2f0f4]">
                                            {/* Student Row 1: Present */}
                                            <tr className="group hover:bg-[#fcfcfd] transition-colors">
                                                <td className="px-6 py-4 text-sm text-[#706189] font-mono">#1024</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm"
                                                            data-alt="Portrait of Alice Johnson"
                                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlAIOC9ZTz6IgOprtUgZ2yNqI8cuzgMrsqaFAPuUvzfQJWUqvcWbxBG4p1soKcdfnGljMxhUFWnt_vjZVDyKBIbFfkbcheNKsHMXh7a6i1kY5f-_GBifmxJaeFHgNn0Z6SYrkviq6Zoq-yzvCoAV5TVd9YajrfaPScFA_2LrEsthETq1mDe75N698yTL39xa9Ui1y-oUd0-m_0aEaKBrhAtbv4XAW8WxPfYd1X0iJF06su3paj0IwYlBhWru5KwCnz-T_tl3_GMZY")' }}
                                                        ></div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#131118]">Alice Johnson</p>
                                                            <p className="text-xs text-[#706189]">Upper Sixth</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <div className="bg-[#f2f0f4] p-1 rounded-lg inline-flex shadow-inner">
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition-all">
                                                                <span className="material-symbols-outlined filled text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Present
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-amber-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">schedule</span> Late
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-rose-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">cancel</span> Absent
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input className="w-full bg-transparent border-none text-sm placeholder:text-gray-300 focus:ring-0 hover:bg-gray-50 rounded px-2 py-1 transition-colors" placeholder="Add remark..." type="text" />
                                                </td>
                                            </tr>
                                            {/* Student Row 2: Late */}
                                            <tr className="group hover:bg-[#fcfcfd] transition-colors">
                                                <td className="px-6 py-4 text-sm text-[#706189] font-mono">#1025</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm"
                                                            data-alt="Portrait of Bob Smith"
                                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD48xVdhN2G8A5N4vDwlvb1IKlKv6apYuBiWWabCSiIHAwtkmKILAvLk0r9AucJ1--7RpZZHsqxECJM4azGvvc3lfaAPK6sQ830l0B-k74gSNc5-Ltom_Xgdc_BRszAwokN3SsYqyvHHmzGnzLrrPAvcjgvEI0nR3ZN2bkVZyWfjPHdbaGcrr8kf-uKJ_A-VmTI60Fw1VtqY_YD6FFzIKUnpyoqEkwRwMNMG-Op1nlrPrX9EfjmIxjCuW-E_7-DzLap1a28M0KUqsI")' }}
                                                        ></div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#131118]">Bob Smith</p>
                                                            <p className="text-xs text-[#706189]">Upper Sixth</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <div className="bg-[#f2f0f4] p-1 rounded-lg inline-flex shadow-inner">
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-emerald-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">check_circle</span> Present
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-amber-700 shadow-sm ring-1 ring-amber-100 transition-all">
                                                                <span className="material-symbols-outlined filled text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span> Late
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-rose-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">cancel</span> Absent
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input className="w-full bg-transparent border-none text-sm text-[#131118] placeholder:text-gray-300 focus:ring-0 hover:bg-gray-50 rounded px-2 py-1 transition-colors" type="text" defaultValue="Bus delay" />
                                                </td>
                                            </tr>
                                            {/* Student Row 3: Absent */}
                                            <tr className="group hover:bg-[#fcfcfd] transition-colors bg-rose-50/10">
                                                <td className="px-6 py-4 text-sm text-[#706189] font-mono">#1026</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm grayscale opacity-80"
                                                            data-alt="Portrait of Charlie Davis"
                                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD3m9MWXGP6jHV0kIlcl1SVw-Y2hb4bCmkWRCUT7BHoPVnD74NDDJD_I4KnaF9mYC6YW6FSDbE3LkvRaGTd-W6JyWXRklUlubXSMHnxt9Mg1-QUsYcehWnrhJMt7-XyzrUjUGsf1gyVSbl4-aOhmTI7uZe8-trgD3-_Zvb1c60VnbqXHylOFUkw2X8lsl-PdhNqGv9LrhlhQsb9QehSS_FIHx3EKt4rs7exIKVsjcG_0_aiI2yLzWLK1zCZFcQ1MxbbzH_RjbjdzlQ")' }}
                                                        ></div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#131118]">Charlie Davis</p>
                                                            <p className="text-xs text-[#706189]">Upper Sixth</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <div className="bg-[#f2f0f4] p-1 rounded-lg inline-flex shadow-inner">
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-emerald-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">check_circle</span> Present
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-amber-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">schedule</span> Late
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-rose-700 shadow-sm ring-1 ring-rose-100 transition-all">
                                                                <span className="material-symbols-outlined filled text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span> Absent
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input className="w-full bg-transparent border-none text-sm text-[#131118] placeholder:text-gray-300 focus:ring-0 hover:bg-gray-50 rounded px-2 py-1 transition-colors" type="text" defaultValue="Sick leave" />
                                                </td>
                                            </tr>
                                            {/* Student Row 4: Present */}
                                            <tr className="group hover:bg-[#fcfcfd] transition-colors">
                                                <td className="px-6 py-4 text-sm text-[#706189] font-mono">#1027</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm"
                                                            data-alt="Portrait of Diana Evans"
                                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCrhxd4JosV8AZepSQc37gBBdvo9DZxvbotYawTFg6ElNIrDmKRc5KF4XrM0BeMt0FFO28ACor8luzlkgGf-t6RDXTEgldIFKw4N0-I0krw--lXvQHQ9GVb1o-nGRo6CEODFiBFnxqoso6YCbAXBtu4nrsdUOlpeQU2jAp0nOkdZfgJtzTRul-hFFVZ6VXOpTIw-3FsMX8635v2cTgIudXMV-j5gOO3-1bDuBS3lz77gF_L5ZTYqZKcrGLbgjRYES4gEkXQpHGNf_Y")' }}
                                                        ></div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#131118]">Diana Evans</p>
                                                            <p className="text-xs text-[#706189]">Upper Sixth</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <div className="bg-[#f2f0f4] p-1 rounded-lg inline-flex shadow-inner">
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition-all">
                                                                <span className="material-symbols-outlined filled text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Present
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-amber-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">schedule</span> Late
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-rose-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">cancel</span> Absent
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input className="w-full bg-transparent border-none text-sm placeholder:text-gray-300 focus:ring-0 hover:bg-gray-50 rounded px-2 py-1 transition-colors" placeholder="Add remark..." type="text" />
                                                </td>
                                            </tr>
                                            {/* Student Row 5: Present */}
                                            <tr className="group hover:bg-[#fcfcfd] transition-colors">
                                                <td className="px-6 py-4 text-sm text-[#706189] font-mono">#1028</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm"
                                                            data-alt="Portrait of Ethan Hunt"
                                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZJMAZnfLnujGDohOyXB-4Q0nXH9ibYrTZanfcGesvomXVPZ1xCnAUVSVNvMoW0dYPIRqGCCnqPSd9RjyRLofHTHzSG_9_pZBkoyBiIrfk1Nzp94_K6r4KSzZyhhN9rTLNVFvFwgw7LM4qX4WkWoqrmk6rKjF9CS-WB3Ve31kdPkEX6WEW20qojN5OZVh2KtsE4J3JqaxhUT3jPmloXx8Cnr7WNjm7fHEV2p2kFqsGQvZt3Oksh0tFwovsqE1YodE6XZQ-ec4h6IA")' }}
                                                        ></div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#131118]">Ethan Hunt</p>
                                                            <p className="text-xs text-[#706189]">Upper Sixth</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <div className="bg-[#f2f0f4] p-1 rounded-lg inline-flex shadow-inner">
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition-all">
                                                                <span className="material-symbols-outlined filled text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Present
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-amber-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">schedule</span> Late
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#706189] hover:bg-white/60 hover:text-rose-600 transition-all">
                                                                <span className="material-symbols-outlined text-[16px]">cancel</span> Absent
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input className="w-full bg-transparent border-none text-sm placeholder:text-gray-300 focus:ring-0 hover:bg-gray-50 rounded px-2 py-1 transition-colors" placeholder="Add remark..." type="text" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <div className="flex items-center justify-between px-6 py-4 border-t border-[#f2f0f4] bg-white">
                                    <p className="text-xs text-[#706189]">Showing 1-5 of 28 students</p>
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-1 text-xs font-medium text-[#706189] hover:text-[#131118] disabled:opacity-50">Previous</button>
                                        <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-md shadow-sm">1</button>
                                        <button className="px-3 py-1 text-xs font-medium text-[#706189] hover:text-[#131118] hover:bg-gray-50 rounded-md transition-colors">2</button>
                                        <button className="px-3 py-1 text-xs font-medium text-[#706189] hover:text-[#131118] hover:bg-gray-50 rounded-md transition-colors">3</button>
                                        <button className="px-3 py-1 text-xs font-medium text-[#706189] hover:text-[#131118]">Next</button>
                                    </div>
                                </div>
                            </div>
                            {/* Bottom Action Bar (Mobile Sticky / Desktop Static) */}
                            <div className="flex justify-end gap-3 pb-8">
                                <button className="px-6 py-2.5 rounded-lg border border-gray-200 text-[#131118] text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm bg-white">
                                    Save &amp; Notify Parents
                                </button>
                                <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all transform active:scale-95">
                                    Submit Attendance
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TeacherDashboard;
