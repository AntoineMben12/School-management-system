import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserSquare2, 
  BookOpen, 
  Settings, 
  Download, 
  Plus,
  MoreVertical,
  Clock,
  MapPin
} from 'lucide-react';

const AdminTimetableHub = () => {
  const [isFixed, setIsFixed] = useState(false);

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Calendar, label: 'Timetable', active: true },
    { icon: UserSquare2, label: 'Staff', active: false },
    { icon: Users, label: 'Students', active: false },
    { icon: BookOpen, label: 'Courses', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  const teachers = [
    { name: 'Mr. Newton', availability: 'Mon 10-11, Tue 13-14', load: 12, total: 20 },
    { name: 'Ms. Austen', availability: 'Mon 10-11, Tue 13-14', load: 12, total: 20 },
    { name: 'Mr. Smith', availability: 'Mon 10-11, Tue 13-14', load: 12, total: 20 },
    { name: 'Ms. Lee', availability: 'Mon 10-11, Tue 13-14', load: 12, total: 20 },
  ];

  const scheduledClasses = [
    { 
      id: 1, 
      subject: 'Physics', 
      teacher: 'Mr. Newton', 
      room: 'Lab 3A', 
      time: '08:00 - 10:30', 
      day: 'MON', 
      load: '1/2 hrs',
      color: 'border-purple-500' 
    },
    { 
      id: 2, 
      subject: 'English Lit', 
      teacher: 'Ms. Austen', 
      room: 'Lib 2', 
      time: '08:00 - 08:30', 
      day: 'TUE', 
      load: '2/2 hrs',
      color: 'border-emerald-500' 
    },
    { 
      id: 3, 
      subject: 'Adv. Math', 
      teacher: 'Dr. A. Smith', 
      room: 'Room 304', 
      time: '09:00 - 10:30', 
      day: 'WED', 
      load: '1/2 hrs',
      color: 'border-orange-500' 
    },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-slate-900">
      {/* Main Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center text-white">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">EduSync</h1>
            <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active 
                ? 'bg-[#F3E8FF] text-[#7C3AED] font-semibold' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Admin Profile</p>
              <p className="text-xs text-gray-500 truncate">Year TT • Science</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Actions */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-bold">Timetable Configuration Hub</h2>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <span className={`text-xs font-medium ${!isFixed ? 'text-gray-400' : 'text-slate-900'}`}>Fixed Schedule</span>
                <button 
                  onClick={() => setIsFixed(!isFixed)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isFixed ? 'bg-gray-200' : 'bg-[#7C3AED]'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFixed ? 'left-1' : 'left-7'}`} />
                </button>
                <span className={`text-xs font-medium ${isFixed ? 'text-slate-900' : 'text-gray-400'}`}>Flexible/Rotating Schedule</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm text-sm font-semibold transition-all">
              <Download size={18} />
              Export
            </button>
          </header>

          {/* Timetable Grid */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex">
            {/* Hours Column */}
            <div className="w-20 border-r border-gray-100 bg-gray-50/30">
              <div className="h-16 border-b border-gray-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</span>
              </div>
              {[8, 9, 10, 11, 12, 13, 14].map(hour => (
                <div key={hour} className="h-32 border-b border-gray-100 p-4 text-center">
                  <span className="text-xs font-medium text-gray-400">{hour.toString().padStart(2, '0')}:00</span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, idx) => (
              <div key={day} className="flex-1 border-r border-gray-100 last:border-r-0 relative">
                <div className="h-16 border-b border-gray-100 flex flex-col items-center justify-center bg-gray-50/30">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{day}</span>
                  <span className="text-lg font-bold">{23 + idx}</span>
                </div>
                
                {/* Simulated Grid Content */}
                <div className="h-full relative">
                  {scheduledClasses.filter(c => c.day === day).map(item => (
                    <div 
                      key={item.id}
                      className={`absolute left-2 right-2 top-4 p-4 bg-white rounded-2xl border-l-4 shadow-md ${item.color} group cursor-pointer hover:shadow-lg transition-all`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm">{item.subject}</h4>
                        <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <MoreVertical size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          {item.load}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                          <Clock size={12} /> {item.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                          <UserSquare2 size={12} /> {item.teacher}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                          <MapPin size={12} /> {item.room}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Visual Guide: Today Indicator */}
                  {day === 'WED' && <div className="absolute top-[35%] w-full h-[2px] bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)] z-10" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Action Sidebar */}
      <aside className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#7C3AED] text-white rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-[#6D28D9] transition-all mb-8">
          <Plus size={20} />
          Schedule New Subject
        </button>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm">Unassigned Classes</h3>
            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">4 Total</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Art', 'CS', 'Chem', 'PE'].map(subject => (
              <div key={subject} className="p-3 border border-gray-100 bg-gray-50/50 rounded-xl cursor-grab active:scale-95 transition-transform">
                <p className="text-xs font-bold mb-0.5">{subject}</p>
                <p className="text-[10px] text-gray-400 font-medium italic">Unassigned</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-1">
            <h3 className="font-bold text-sm">Teacher Availability</h3>
          </div>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div key={teacher.name} className="p-4 border border-gray-100 rounded-2xl hover:border-purple-100 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} alt="teacher" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{teacher.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{teacher.availability}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-gray-400">WORKLOAD</span>
                    <span className="text-[#7C3AED]">{teacher.load}/{teacher.total} hrs</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#7C3AED] rounded-full" 
                      style={{ width: `${(teacher.load / teacher.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
};

export default AdminTimetableHub;