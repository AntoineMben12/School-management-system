import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAPI } from '../../services/api.js';
import { X } from 'lucide-react';
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
    TrendingDown,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Dashboard data state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        stats: { totalStudents: 0, totalTeachers: 0, attendancePercentage: 0 },
        attendanceTrends: [],
        recentActivity: []
    });

    // Modal states
    const [activeModal, setActiveModal] = useState(null); // 'addStudent' | 'addTeacher' | 'announce' | null
    const [modalLoading, setModalLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState({ type: '', text: '' });
    const [classesList, setClassesList] = useState([]);

    // Form data states
    const [studentForm, setStudentForm] = useState({
        first_name: '', last_name: '', email: '', admission_number: '', class_id: '', dob: '', gender: ''
    });
    const [teacherForm, setTeacherForm] = useState({
        first_name: '', last_name: '', email: '', qualification: '', phone: ''
    });
    const [announceForm, setAnnounceForm] = useState({
        title: '', content: '', audience: 'all'
    });

    // Fetch dashboard data from backend
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await adminAPI.getDashboardData();
                setDashboardData(data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    // Fetch classes when Add Student modal opens
    useEffect(() => {
        if (activeModal === 'addStudent') {
            adminAPI.getClassesList().then(setClassesList).catch(() => setClassesList([]));
        }
    }, [activeModal]);

    // Quick Action handlers
    const handleQuickAction = (actionName) => {
        setModalMessage({ type: '', text: '' });
        switch (actionName) {
            case 'Add Student':
                setStudentForm({ first_name: '', last_name: '', email: '', admission_number: '', class_id: '', dob: '', gender: '' });
                setActiveModal('addStudent');
                break;
            case 'Add Teacher':
                setTeacherForm({ first_name: '', last_name: '', email: '', qualification: '', phone: '' });
                setActiveModal('addTeacher');
                break;
            case 'Announce':
                setAnnounceForm({ title: '', content: '', audience: 'all' });
                setActiveModal('announce');
                break;
            case 'Reports':
                navigate('/admin/reportCard');
                break;
            default:
                break;
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setModalMessage({ type: '', text: '' });
        try {
            const payload = { ...studentForm };
            if (payload.class_id) payload.class_id = Number(payload.class_id);
            else delete payload.class_id;
            await adminAPI.addStudent(payload);
            setModalMessage({ type: 'success', text: 'Student added successfully!' });
            setTimeout(() => { setActiveModal(null); window.location.reload(); }, 1500);
        } catch (err) {
            setModalMessage({ type: 'error', text: err.message });
        } finally {
            setModalLoading(false);
        }
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setModalMessage({ type: '', text: '' });
        try {
            await adminAPI.addTeacher(teacherForm);
            setModalMessage({ type: 'success', text: 'Teacher added successfully!' });
            setTimeout(() => { setActiveModal(null); window.location.reload(); }, 1500);
        } catch (err) {
            setModalMessage({ type: 'error', text: err.message });
        } finally {
            setModalLoading(false);
        }
    };

    const handleAnnounce = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setModalMessage({ type: '', text: '' });
        try {
            await adminAPI.createAnnouncement(announceForm);
            setModalMessage({ type: 'success', text: 'Announcement created successfully!' });
            setTimeout(() => setActiveModal(null), 1500);
        } catch (err) {
            setModalMessage({ type: 'error', text: err.message });
        } finally {
            setModalLoading(false);
        }
    };

    // Format time for display
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    // Build attendance chart data from backend
    const attendanceData = dashboardData.attendanceTrends.length > 0
        ? dashboardData.attendanceTrends
        : [
            { day: 'Mon', students: 0, teachers: 0 },
            { day: 'Tue', students: 0, teachers: 0 },
            { day: 'Wed', students: 0, teachers: 0 },
            { day: 'Thu', students: 0, teachers: 0 },
            { day: 'Fri', students: 0, teachers: 0 },
        ];

    // Build recent updates from backend data
    const recentUpdates = dashboardData.recentActivity.length > 0
        ? dashboardData.recentActivity.map((item, idx) => ({
            id: item.id || idx,
            user: item.user,
            action: item.action || 'New student registered:',
            subject: item.subject || '',
            time: formatTime(item.time),
            avatar: item.user ? item.user.split(' ').map(n => n[0]).join('') : '?',
            color: ['bg-purple-500', 'bg-green-500', 'bg-blue-500'][idx % 3]
        }))
        : [];

    const navigationItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Students', icon: Users, path: '/admin/student' },
        { name: 'Teachers', icon: GraduationCap, path: '/admin/teacher' },
        { name: 'Classes', icon: BookOpen, path: '/admin/classes' },
        { name: 'Reports', icon: BarChart3, path: '/admin/reportCard' },
        { name: 'Timetable', icon: Calendar, path: '/admin/Timetable' },
    ];

    const { stats } = dashboardData;
    const statsCards = [
        {
            title: 'Total Students',
            value: stats.totalStudents.toLocaleString(),
            icon: GraduationCap,
            change: '',
            trend: 'stable',
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100'
        },
        {
            title: 'Total Teachers',
            value: stats.totalTeachers.toLocaleString(),
            icon: Users,
            change: '',
            trend: 'stable',
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100'
        },
        {
            title: "Today's Attendance",
            value: `${stats.attendancePercentage}%`,
            icon: Calendar,
            change: '',
            trend: stats.attendancePercentage >= 90 ? 'up' : stats.attendancePercentage >= 70 ? 'stable' : 'down',
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

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-xl">!</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Failed to load dashboard</h3>
                    <p className="text-sm text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
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
                                        onClick={() => handleQuickAction(action.name)}
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

            {/* ── MODALS ── */}
            {activeModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                                {activeModal === 'addStudent' && 'Add New Student'}
                                {activeModal === 'addTeacher' && 'Add New Teacher'}
                                {activeModal === 'announce' && 'Create Announcement'}
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Feedback message */}
                        {modalMessage.text && (
                            <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${modalMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {modalMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {modalMessage.text}
                            </div>
                        )}

                        {/* ── Add Student Form ── */}
                        {activeModal === 'addStudent' && (
                            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input type="text" required value={studentForm.first_name}
                                            onChange={e => setStudentForm({ ...studentForm, first_name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input type="text" required value={studentForm.last_name}
                                            onChange={e => setStudentForm({ ...studentForm, last_name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input type="email" required value={studentForm.email}
                                        onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number *</label>
                                        <input type="text" required value={studentForm.admission_number}
                                            onChange={e => setStudentForm({ ...studentForm, admission_number: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                        <select value={studentForm.class_id}
                                            onChange={e => setStudentForm({ ...studentForm, class_id: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm">
                                            <option value="">Select class...</option>
                                            {classesList.map(c => (
                                                <option key={c.class_id} value={c.class_id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input type="date" value={studentForm.dob}
                                            onChange={e => setStudentForm({ ...studentForm, dob: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select value={studentForm.gender}
                                            onChange={e => setStudentForm({ ...studentForm, gender: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm">
                                            <option value="">Select...</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                            <option value="O">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Default password: Student@123</p>
                                <button type="submit" disabled={modalLoading}
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium rounded-xl transition-colors">
                                    {modalLoading ? 'Adding...' : 'Add Student'}
                                </button>
                            </form>
                        )}

                        {/* ── Add Teacher Form ── */}
                        {activeModal === 'addTeacher' && (
                            <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input type="text" required value={teacherForm.first_name}
                                            onChange={e => setTeacherForm({ ...teacherForm, first_name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input type="text" required value={teacherForm.last_name}
                                            onChange={e => setTeacherForm({ ...teacherForm, last_name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input type="email" required value={teacherForm.email}
                                        onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                        <input type="text" value={teacherForm.qualification}
                                            onChange={e => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                                            placeholder="e.g. M.Ed, B.Sc" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="tel" value={teacherForm.phone}
                                            onChange={e => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Default password: Teacher@123</p>
                                <button type="submit" disabled={modalLoading}
                                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-xl transition-colors">
                                    {modalLoading ? 'Adding...' : 'Add Teacher'}
                                </button>
                            </form>
                        )}

                        {/* ── Announcement Form ── */}
                        {activeModal === 'announce' && (
                            <form onSubmit={handleAnnounce} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input type="text" required value={announceForm.title}
                                        onChange={e => setAnnounceForm({ ...announceForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                        placeholder="Announcement title" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                                    <textarea required rows={4} value={announceForm.content}
                                        onChange={e => setAnnounceForm({ ...announceForm, content: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                                        placeholder="Write your announcement..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                                    <select value={announceForm.audience}
                                        onChange={e => setAnnounceForm({ ...announceForm, audience: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                        <option value="all">Everyone</option>
                                        <option value="students">Students Only</option>
                                        <option value="teachers">Teachers Only</option>
                                        <option value="parents">Parents Only</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={modalLoading}
                                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors">
                                    {modalLoading ? 'Publishing...' : 'Publish Announcement'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
