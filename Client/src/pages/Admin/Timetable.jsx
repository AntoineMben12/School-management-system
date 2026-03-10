import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  MapPin,
  X,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminTimetableHub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTerm, setCurrentTerm] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [formData, setFormData] = useState({
    class_id: '',
    subject_id: '',
    teacher_id: '',
    day_of_week: 'Monday',
    start_time: '08:00',
    end_time: '09:00',
    room_number: ''
  });

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Calendar, label: 'Timetable', },
    { icon: UserSquare2, label: 'Teachers', },
    { icon: Users, label: 'Students', },
    { icon: BookOpen, label: 'Classes', },
    { icon: Settings, label: 'Settings' },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const colors = ['border-purple-500', 'border-emerald-500', 'border-orange-500', 'border-blue-500', 'border-pink-500'];

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        // Fetch current term
        const termRes = await fetch('/admin/timetable/current-term', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!termRes.ok) throw new Error('Failed to fetch current term');
        const term = await termRes.json();
        setCurrentTerm(term);

        // Fetch classes
        const classesRes = await fetch('/admin/timetable/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!classesRes.ok) throw new Error('Failed to fetch classes');
        const classesData = await classesRes.json();
        setClasses(classesData);

        // Set first class as selected
        if (classesData.length > 0) {
          setSelectedClass(classesData[0].id);
        }

        // Fetch teachers
        const teachersRes = await fetch('/admin/timetable/teachers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!teachersRes.ok) throw new Error('Failed to fetch teachers');
        const teachersData = await teachersRes.json();
        setTeachers(teachersData);

        // Fetch subjects
        const subjectsRes = await fetch('/admin/timetable/subjects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!subjectsRes.ok) throw new Error('Failed to fetch subjects');
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch timetable when selected class or term changes
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedClass || !currentTerm) return;

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/admin/timetable/${selectedClass}/${currentTerm.term_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch timetable');
        const data = await res.json();
        setScheduledClasses(data.map((item, idx) => ({
          ...item,
          day: item.day_of_week.substring(0, 3).toUpperCase(),
          time: `${item.start_time} - ${item.end_time}`,
          color: colors[idx % colors.length]
        })));
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setScheduledClasses([]);
      }
    };

    fetchTimetable();
  }, [selectedClass, currentTerm]);

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      if (!currentTerm) {
        alert('No active term found');
        return;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`/admin/timetable/export/all?termId=${currentTerm.term_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch timetable data');
      const data = await res.json();

      // Group by class
      const groupedByClass = {};
      data.forEach(item => {
        if (!groupedByClass[item.class_name]) {
          groupedByClass[item.class_name] = [];
        }
        groupedByClass[item.class_name].push(item);
      });

      const doc = new jsPDF({ orientation: 'landscape' });
      let classIndex = 0;

      Object.keys(groupedByClass).forEach((className) => {
        if (classIndex > 0) {
          doc.addPage();
        }
        classIndex++;

        // Title
        doc.setFontSize(16);
        doc.text(`Timetable - ${className}`, 14, 20);

        // Term info
        doc.setFontSize(10);
        doc.text(`Term: ${currentTerm.term_name} | ${currentTerm.year_name}`, 14, 30);

        // Create table
        const tableData = [];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const times = {};

        groupedByClass[className].forEach(item => {
          const timeKey = `${item.start_time}-${item.end_time}`;
          if (!times[timeKey]) {
            times[timeKey] = {};
          }
          times[timeKey][item.day_of_week] = `${item.subject_name}\n${item.teacher_name || 'TBA'}\nRm: ${item.room_number || 'TBA'}`;
        });

        const sortedTimes = Object.keys(times).sort();
        const headers = ['Time', ...days];
        tableData.push(headers);

        sortedTimes.forEach(time => {
          const row = [time];
          days.forEach(day => {
            row.push(times[time][day] || '-');
          });
          tableData.push(row);
        });

        // Add table
        doc.autoTable({
          startY: 40,
          head: [tableData[0]],
          body: tableData.slice(1),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255] },
          margin: 10
        });
      });

      doc.save('timetable.pdf');
    } catch (err) {
      alert('Error exporting PDF: ' + err.message);
      console.error('PDF export error:', err);
    }
  };

  // Handle adding new subject to schedule
  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        class_id: parseInt(formData.class_id),
        subject_id: parseInt(formData.subject_id),
        teacher_id: formData.teacher_id ? parseInt(formData.teacher_id) : null,
        term_id: currentTerm.term_id
      };

      const res = await fetch('/admin/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create timetable entry');
      }

      // Refresh timetable
      const refreshRes = await fetch(`/admin/timetable/${formData.class_id}/${currentTerm.term_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setScheduledClasses(data.map((item, idx) => ({
          ...item,
          day: item.day_of_week.substring(0, 3).toUpperCase(),
          time: `${item.start_time} - ${item.end_time}`,
          color: colors[idx % colors.length]
        })));
      }

      setShowAddSubjectModal(false);
      setFormData({
        class_id: '',
        subject_id: '',
        teacher_id: '',
        day_of_week: 'Monday',
        start_time: '08:00',
        end_time: '09:00',
        room_number: ''
      });

      alert('Subject added to timetable successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
      console.error('Error adding subject:', err);
    }
  };

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
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
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
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-400">Loading timetable...</div>
            </div>
          ) : (
            <>
              {/* Header Actions */}
              <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-6">
                  <h2 className="text-2xl font-bold">Timetable Configuration Hub</h2>
                  {currentTerm && (
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200">
                      <Calendar size={16} className="text-[#7C3AED]" />
                      <span className="text-sm font-medium">{currentTerm.term_name}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm text-sm font-semibold transition-all"
                >
                  <Download size={18} />
                  Export PDF
                </button>
              </header>

              {/* Class Selector */}
              {classes.length > 1 && (
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                  {classes.map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClass(cls.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        selectedClass === cls.id
                          ? 'bg-[#7C3AED] text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#7C3AED]'
                      }`}
                    >
                      {cls.name}
                    </button>
                  ))}
                </div>
              )}

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
                {daysOfWeek.map((day, idx) => (
                  <div key={day} className="flex-1 border-r border-gray-100 last:border-r-0 relative">
                    <div className="h-16 border-b border-gray-100 flex flex-col items-center justify-center bg-gray-50/30">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{day.substring(0, 3)}</span>
                      <span className="text-lg font-bold">{23 + idx}</span>
                    </div>

                    {/* Grid Content */}
                    <div className="h-full relative">
                      {scheduledClasses.filter(c => c.day === day.substring(0, 3).toUpperCase()).map(item => (
                        <div
                          key={item.id}
                          className={`absolute left-2 right-2 top-4 p-4 bg-white rounded-2xl border-l-4 shadow-md ${item.color} group cursor-pointer hover:shadow-lg transition-all`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-sm">{item.subject_name}</h4>
                            <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                              <MoreVertical size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                              <Clock size={12} /> {item.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                              <UserSquare2 size={12} /> {item.teacher_name || 'TBA'}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                              <MapPin size={12} /> {item.room_number || 'TBA'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Action Sidebar */}
      <aside className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col">
        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#7C3AED] text-white rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-[#6D28D9] transition-all mb-8"
        >
          <Plus size={20} />
          Schedule New Subject
        </button>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm">Available Teachers</h3>
            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{teachers.length}</span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {teachers.map((teacher) => (
              <div key={teacher.teacher_id} className="p-3 border border-gray-100 rounded-xl hover:border-purple-100 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} alt="teacher" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{teacher.name}</p>
                    <p className="text-[9px] text-gray-400">{teacher.assigned_classes} classes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-1">
            <h3 className="font-bold text-sm">Available Subjects</h3>
          </div>
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div key={subject.id} className="p-2 bg-gray-50/50 rounded-lg border border-gray-100 text-xs font-medium">
                {subject.name}
              </div>
            ))}
          </div>
        </section>
      </aside>

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Schedule New Subject</h2>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Teacher (optional)</label>
                <select
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  <option value="">Assign Later</option>
                  {teachers.map(teacher => (
                    <option key={teacher.teacher_id} value={teacher.teacher_id}>{teacher.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Day</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  required
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Room Number (optional)</label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  placeholder="e.g., Lab 3A"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#7C3AED] text-white rounded-lg font-medium hover:bg-[#6D28D9] transition-all"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimetableHub;
