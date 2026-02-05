import React, { useState } from 'react';
import {
    Bell,
    Mail,
    Search,
    Users,
    UserPlus,
    GraduationCap,
    Calendar,
    BarChart3,
    Settings,
    LayoutDashboard,
    BookOpen,
    Megaphone,
    FileText,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Mock data for the attendance chart
    const attendanceData = [
        { day: 'Mon', students: 420, teachers: 78 },
        { day: 'Tue', students: 450, teachers: 80 },
        { day: 'Wed', students: 480, teachers: 82 },
        { day: 'Thu', students: 470, teachers: 81 },
        { day: 'Fri', students: 490, teachers: 83 },
        { day: 'Sat', students: 380, teachers: 75 },
        { day: 'Sun', students: 350, teachers: 70 },
    ];

    // Mock data for recent updates
    const recentUpdates = [
        {
            id: 1,
            user: 'Sarah Smith',
            action: 'uploaded grades for',
            subject: 'Math 101',
            time: '2 hours ago',
            avatar: 'SS',
            color: 'bg-purple-500'
        },
        {
            id: 2,
            type: 'event',
            title: 'New event created: Science Fair 2024',
            time: '5 hours ago',
            icon: Calendar,
            color: 'bg-blue-500'
        },
        {
            id: 3,
            user: 'John Doe',
            action: 'New student registered:',
            subject: 'John Doe',
            time: '1 day ago',
            avatar: 'JD',
            color: 'bg-green-500'
        }
    ];

    const navigationItems = [
        { name: 'Dashboard', icon: LayoutDashboard, active: true },
        { name: 'Students', icon: Users, active: false },
        { name: 'Teachers', icon: GraduationCap, active: false },
        { name: 'Classes', icon: BookOpen, active: false },
        { name: 'Schedule', icon: Calendar, active: false },
        { name: 'Reports', icon: BarChart3, active: false },
        { name: 'Timetable', icon: Calendar, active: false },
    ];

    const statsCards = [
        {
            title: 'Total Students',
            value: '1,240',
            icon: GraduationCap,
            change: '+12',
            trend: 'up',
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100'
        },
        {
            title: 'Total Teachers',
            value: '84',
            icon: Users,
            change: 'Stable',
            trend: 'stable',
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100'
        },
        {
            title: "Today's Attendance",
            value: '92%',
            icon: Calendar,
            change: '-1.4%',
            trend: 'down',
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100'
        }
    ];

    const quickActions = [
        { name: 'Add Student', icon: UserPlus, color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
        { name: 'Add Teacher', icon: GraduationCap, color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
        { name: 'Announce', icon: Megaphone, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
        { name: 'Reports', icon: FileText, color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' }
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">SchoolOS</h1>
                                <p className="text-sm text-gray-500">Admin Portal</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navigationItems.map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                                ? 'bg-purple-50 text-purple-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="text-sm">{item.name}</span>}
                        </button>
                    ))}
                </nav>

                {/* Settings */}
                <div className="p-4 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200">
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="text-sm">Settings</span>}
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-orange-600">JD</span>
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">Jane Doe</p>
                                <p className="text-xs text-gray-500 truncate">Super Admin</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Messages */}
                            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {statsCards.map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`${stat.iconBg} p-3 rounded-xl`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                        {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                                        {stat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Attendance Trends - Takes 2 columns */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Attendance Trends</h3>
                                    <p className="text-sm text-gray-500">Overview of the last 7 days</p>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    Weekly
                                </button>
                            </div>

                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        iconType="circle"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="students"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ fill: '#8b5cf6', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Students"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="teachers"
                                        stroke="#14b8a6"
                                        strokeWidth={3}
                                        strokeDasharray="5 5"
                                        dot={{ fill: '#14b8a6', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Teachers"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        className={`${action.color} ${action.hoverColor} p-4 rounded-xl text-white transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 aspect-square`}
                                    >
                                        <action.icon className="w-6 h-6" />
                                        <span className="text-sm font-medium">{action.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Updates - Takes 2 columns */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Recent Updates</h3>
                                <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                                    View all
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentUpdates.map((update) => (
                                    <div key={update.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        {update.avatar ? (
                                            <div className={`${update.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                                                <span className="text-sm font-semibold text-white">{update.avatar}</span>
                                            </div>
                                        ) : (
                                            <div className={`${update.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                                                <update.icon className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            {update.user ? (
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-semibold">{update.user}</span> {update.action}{' '}
                                                    <span className="font-semibold">{update.subject}</span>
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-900 font-medium">{update.title}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">{update.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm font-semibold text-purple-900">Parent-Teacher Meeting</span>
                                    </div>
                                    <p className="text-xs text-purple-700 ml-8">Tomorrow, 10:00 AM</p>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-900">Science Fair 2024</span>
                                    </div>
                                    <p className="text-xs text-blue-700 ml-8">March 15, 2024</p>
                                </div>

                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="w-5 h-5 text-orange-600" />
                                        <span className="text-sm font-semibold text-orange-900">Sports Day</span>
                                    </div>
                                    <p className="text-xs text-orange-700 ml-8">March 20, 2024</p>
                                </div>
                            </div>

                            <button className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors">
                                View Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
