// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Auth API calls
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - { fullName, email, password, role, school_id }
   * @returns {Promise} User and token
   */
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.fullName,
          email: userData.email,
          password: userData.password,
          role: userData.role.toLowerCase().replace(' ', '_'),
          school_id: userData.school_id || 1,
          profile: {
            first_name: userData.fullName.split(' ')[0],
            last_name: userData.fullName.split(' ').slice(1).join(' ') || 'User',
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || errorData.message || 'Signup failed';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw new Error(error.message || 'Signup failed. Please try again.');
    }
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password, role }
   * @returns {Promise} User and token
   */
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          school_id: credentials.school_id || 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || errorData.message || 'Login failed';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Store token and user info in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get authorization header with token
   * @returns {Object} Authorization header
   */
  getAuthHeader: () => {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} Current user or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// Admin API calls
export const adminAPI = {
  /**
   * Get admin dashboard data (stats, attendance trends, recent activity)
   * @returns {Promise<Object>} Dashboard data
   */
  getDashboardData: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Content-Type': 'application/json',
        ...authAPI.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to fetch dashboard data');
    }

    return response.json();
  },

  addStudent: async (data) => {
    const response = await fetch(`${API_BASE_URL}/admin/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authAPI.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || errorData.message || 'Failed to add student');
    }
    return response.json();
  },

  addTeacher: async (data) => {
    const response = await fetch(`${API_BASE_URL}/admin/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authAPI.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || errorData.message || 'Failed to add teacher');
    }
    return response.json();
  },

  createAnnouncement: async (data) => {
    const response = await fetch(`${API_BASE_URL}/admin/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authAPI.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || errorData.message || 'Failed to create announcement');
    }
    return response.json();
  },

  getReportsSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/reports`, {
      headers: {
        'Content-Type': 'application/json',
        ...authAPI.getAuthHeader(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to fetch reports');
    }
    return response.json();
  },

  getClassesList: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/classes`, {
      headers: {
        'Content-Type': 'application/json',
        ...authAPI.getAuthHeader(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to fetch classes');
    }
    return response.json();
  },
};

export default authAPI;
