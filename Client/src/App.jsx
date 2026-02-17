
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login.jsx';
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard.jsx';
import TeacherDashboard from './pages/Teachers/Dashboard.jsx';
import StudentDashboard from './pages/Student/Dashboard.jsx';
import GradeBook from './pages/Teachers/GradeBook.jsx';
import PricingPage from './pages/Pricing.jsx';
import School from './pages/SuperAdmin/School.jsx';
import Licences from './pages/SuperAdmin/Licences.jsx';
import Finance from './pages/SuperAdmin/Finance.jsx';
import Features from './pages/Features.jsx';
import Contact from './pages/Contact.jsx';
import SignUp from './pages/Auth/SignUp.jsx';
import AdminTimetableHub from './pages/Admin/Timetable.jsx';
import AdminTeacher from './pages/Admin/Teacher.jsx';
import AdminFees from './pages/Admin/Fees.jsx';
import AdminClasses from './pages/Admin/Classes.jsx';
import AdminreportCard from './pages/Admin/reportCard.jsx';
import AdminStudent from './pages/Admin/Student.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Pricing" element={<PricingPage />} />
        {/* Main navigation pages */}
        <Route path="/" element={<Features />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['school_admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/Timetable" element={<AdminTimetableHub />} />
          <Route path="/admin/student" element={<AdminStudent />} />
          <Route path="/admin/teacher" element={<AdminTeacher />} />
          <Route path="/admin/fees" element={<AdminFees />} />
          <Route path="/admin/classes" element={<AdminClasses />} />
          <Route path="/admin/reportCard" element={<AdminreportCard />} />
        </Route>

        {/* SuperAdmin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/schools" element={<School />} />
          <Route path="/superadmin/licenses" element={<Licences />} />
          <Route path="/superadmin/finance" element={<Finance />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/gradebook" element={<GradeBook />} />
        </Route>

        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App