# Authentication Implementation Guide

## Overview
The School Management System has a complete authentication system with JWT tokens for secure API communication.

## Backend Setup

### Environment Variables
Ensure your server `.env` file has:
```
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Auth Endpoints

#### 1. Sign Up (Register)
**POST** `/auth/register`

Request Body:
```json
{
  "username": "John Doe",
  "email": "john@school.edu",
  "password": "SecurePassword123",
  "role": "school_admin", // or "teacher", "student", "parent", "accountant"
  "school_id": 1,
  "profile": {
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "username": "John Doe",
    "email": "john@school.edu",
    "role": "school_admin",
    "school_id": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 2. Login
**POST** `/auth/login`

Request Body:
```json
{
  "email": "john@school.edu",
  "password": "SecurePassword123",
  "school_id": 1
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "user_id": 1,
    "username": "John Doe",
    "email": "john@school.edu",
    "role": "school_admin",
    "school_id": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 3. Change Password
**POST** `/auth/change-password` (Protected - requires token)

Headers:
```
Authorization: Bearer {token}
```

Request Body:
```json
{
  "oldPassword": "CurrentPassword123",
  "newPassword": "NewPassword456"
}
```

#### 4. Request Password Reset
**POST** `/auth/forgot-password`

Request Body:
```json
{
  "email": "john@school.edu",
  "school_id": 1
}
```

#### 5. Reset Password
**POST** `/auth/reset-password`

Request Body:
```json
{
  "resetToken": "token-from-email",
  "newPassword": "NewPassword789"
}
```

## Frontend Setup

### Environment Variables
Create a `.env` file in the Client directory:
```
VITE_API_BASE_URL=http://localhost:5000
```

### API Service
The authentication API service is located at `src/services/api.js` and provides:

```javascript
import { authAPI } from "../../services/api";

// Sign up
await authAPI.signup({
  fullName: "John Doe",
  email: "john@school.edu",
  password: "SecurePassword123",
  role: "School Admin",
  school_id: 1
});

// Login
await authAPI.login({
  email: "john@school.edu",
  password: "SecurePassword123",
  role: "School Admin",
  school_id: 1
});

// Logout
authAPI.logout();

// Get current user
const user = authAPI.getCurrentUser();

// Check if authenticated
if (authAPI.isAuthenticated()) {
  // User is logged in
}

// Get auth header for API requests
const headers = authAPI.getAuthHeader();
```

### Updated Components

#### SignUp.jsx
- Integrated with backend signup endpoint
- Validates form inputs
- Stores token and user info in localStorage
- Redirects to appropriate dashboard based on role

#### Login.jsx
- Integrated with backend login endpoint
- Validates email and password
- Stores token in localStorage
- Supports role-based redirects
- Remember me functionality

## How to Use

### 1. Starting the Backend
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:5000`

### 2. Starting the Frontend
```bash
cd Client
npm install
npm run dev
```
The client will run on `http://localhost:5173`

### 3. Testing Authentication

#### Sign Up Flow:
1. Go to `/signup`
2. Select a role (School Admin, Teacher, or Student)
3. Enter your details
4. Click "Sign Up"
5. You'll be redirected to the appropriate dashboard

#### Login Flow:
1. Go to `/login`
2. Select a role
3. Enter your credentials
4. Click "Log In"
5. You'll be redirected to the appropriate dashboard

## Token Management

### Token Storage
- Tokens are automatically saved in `localStorage` under `authToken`
- User info is saved under `user`
- Retrieved automatically for API requests

### Token Expiration
- Default expiration: 24 hours
- Configure via `JWT_EXPIRES_IN` in server `.env`

### Making Protected API Requests
```javascript
import { authAPI } from "../../services/api";

const headers = {
  'Content-Type': 'application/json',
  ...authAPI.getAuthHeader()
};

const response = await fetch('http://localhost:5000/protected-endpoint', {
  method: 'GET',
  headers
});
```

## Role-Based Redirects

The system automatically redirects users based on their role:
- **Superadmin** → `/superadmin/dashboard`
- **Admin** → `/admin/dashboard`
- **Teacher** → `/teacher/dashboard`
- **Student** → `/student/dashboard`

## Security Best Practices

1. ✅ Passwords are hashed using bcrypt
2. ✅ JWT tokens are signed with a secret key
3. ✅ Protected routes require valid authentication middleware
4. ✅ Tokens are stored securely in localStorage
5. ✅ Sensitive data is not exposed in API responses

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure:
- Backend server has CORS enabled
- Frontend API base URL matches backend server

### Token Expired
- Tokens expire after 24 hours by default
- User must log in again to get a new token
- Configure expiration time in server `.env`

### Invalid Credentials
- Ensure email matches exactly (case-sensitive)
- Check password is correct
- Verify school_id is correct

## Next Steps

1. Implement role-based access control (RBAC)
2. Add refresh token functionality
3. Implement password reset email notifications
4. Add multi-factor authentication (MFA)
5. Implement session management
