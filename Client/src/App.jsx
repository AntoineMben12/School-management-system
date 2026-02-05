
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

        {/* admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/Timetable" element={<AdminTimetableHub />} />

        {/* superadmin Routes */}
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/schools" element={<School />} />
        <Route path="/superadmin/licenses" element={<Licences />} />
        <Route path="/superadmin/finance" element={<Finance />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Teachers routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/gradebook" element={<GradeBook />} />

        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App