# Quick Start Guide - Authentication Setup

## Prerequisites
- Node.js 16+ installed
- MySQL database running
- Both Client and Server directories have `node_modules` installed

## Step 1: Configure Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Verify `.env` file has these variables:
   ```
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=24h
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-password
   DB_NAME=your-database
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`

## Step 2: Configure Frontend

1. Navigate to the `Client` directory:
   ```bash
   cd Client
   ```

2. Verify `.env` file exists with:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Client will run on `http://localhost:5173`

## Step 3: Test Authentication

### Test Sign Up
1. Open `http://localhost:5173/signup` in your browser
2. Fill in the signup form:
   - Select a role (School Admin, Teacher, or Student)
   - Enter full name
   - Enter email
   - Enter password (min 8 characters)
3. Click "Sign Up"
4. You should be redirected to the dashboard

### Test Login
1. Open `http://localhost:5173/login` in your browser
2. Fill in the login form:
   - Select a role
   - Enter the email from signup
   - Enter the password
3. Click "Log In"
4. You should be redirected to the dashboard

## API Endpoints

### Public Endpoints
- `POST /auth/register` - Sign up a new user
- `POST /auth/login` - Login with email and password
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Protected Endpoints
- `POST /auth/change-password` - Change password (requires token)

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer {token}
```

## Common Issues & Solutions

### CORS Error
**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
- Ensure backend server is running on `http://localhost:5000`
- Verify `VITE_API_BASE_URL` in Client `.env` matches backend URL
- Check backend has CORS enabled in `src/app.js`

### Invalid Credentials
**Error:** "Invalid credentials" after login

**Solution:**
- Verify email is correct (case-sensitive)
- Verify password is correct
- Check you signed up before trying to login
- Ensure the same `school_id` is used

### Token Expiration
**Error:** "Unauthorized" on protected routes

**Solution:**
- Token expires after 24 hours (default)
- User must login again to get new token
- Change `JWT_EXPIRES_IN` in server `.env` to adjust expiration

### Database Connection Error
**Error:** "Cannot connect to database"

**Solution:**
- Ensure MySQL is running
- Verify database credentials in `.env`
- Check database name in `.env`
- Run database migrations if needed

## File Structure

```
Client/
├── src/
│   ├── pages/Auth/
│   │   ├── SignUp.jsx (Updated with API integration)
│   │   └── Login.jsx (Updated with API integration)
│   ├── services/
│   │   └── api.js (NEW - API service)
│   └── ...
├── .env (NEW - Configuration)
└── .env.example (NEW - Template)

server/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js (Existing)
│   ├── services/
│   │   └── auth.service.js (Existing)
│   ├── routes/
│   │   └── authRoutes.js (Existing)
│   └── ...
├── .env (Update with JWT config)
└── ...
```

## Token Information

### Token Storage
- Token: `localStorage.authToken`
- User Info: `localStorage.user`

### Token Contents
```json
{
  "user_id": 1,
  "email": "user@school.edu",
  "role": "school_admin",
  "school_id": 1,
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Using the Auth API in Components

```javascript
import { authAPI } from "../../services/api";

// Sign up
try {
  const result = await authAPI.signup({
    fullName: "John Doe",
    email: "john@school.edu",
    password: "Password123",
    role: "School Admin"
  });
  console.log("Signup successful:", result);
} catch (error) {
  console.error("Signup failed:", error.message);
}

// Login
try {
  const result = await authAPI.login({
    email: "john@school.edu",
    password: "Password123",
    role: "School Admin"
  });
  console.log("Login successful:", result);
} catch (error) {
  console.error("Login failed:", error.message);
}

// Check if user is logged in
if (authAPI.isAuthenticated()) {
  const user = authAPI.getCurrentUser();
  console.log("Current user:", user);
}

// Logout
authAPI.logout();

// Get auth header for API requests
const headers = {
  ...authAPI.getAuthHeader()
};
```

## Next Steps

1. Create protected route components
2. Implement dashboard pages for each role
3. Add API integration for other endpoints
4. Set up email notifications for password reset
5. Implement role-based access control (RBAC)

## Support

For detailed documentation, see:
- `AUTHENTICATION.md` - Complete authentication guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details

## Troubleshooting

Check these in order:
1. ✓ Both backend and frontend servers are running
2. ✓ API URL is correct in Client `.env`
3. ✓ JWT_SECRET is set in server `.env`
4. ✓ Database is running and accessible
5. ✓ Database tables exist (run migrations if needed)
6. ✓ No CORS errors in browser console
7. ✓ Network tab shows requests going to correct URLs

Happy coding! 🚀
