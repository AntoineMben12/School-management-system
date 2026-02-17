import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on actual role
        switch (user.role) {
            case 'school_admin': return <Navigate to="/admin/dashboard" replace />;
            case 'teacher': return <Navigate to="/teacher/dashboard" replace />;
            case 'student': return <Navigate to="/student/dashboard" replace />;
            case 'super_admin': return <Navigate to="/superadmin/dashboard" replace />;
            default: return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
