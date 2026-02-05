# API Debugging Guide - Thunder Client Testing

## Issues Fixed (Senior Backend Review)

### 🔴 **CRITICAL ISSUE #1: Missing Global Error Handler**
- **Problem**: Controllers use `next(error)` but app.js had NO error middleware
- **Result**: Requests would hang indefinitely with no response
- **Fixed**: Added global error handler middleware at the end of app.js

### 🔴 **CRITICAL ISSUE #2: Poor CORS Configuration**
- **Problem**: CORS was too permissive and didn't specify origins
- **Fixed**: Added specific allowed origins and methods

### 🔴 **CRITICAL ISSUE #3: No Health Check Endpoint**
- **Problem**: Couldn't verify if API was running
- **Fixed**: Added `/health` endpoint to verify API status

### 🟡 **CRITICAL ISSUE #4: Missing PORT in .env**
- **Problem**: Server.js hard-coded port 3000, couldn't be changed
- **Fixed**: Added PORT=5000 to .env, updated server.js to read it

### 🟡 **CRITICAL ISSUE #5: No Request Logging**
- **Problem**: Couldn't debug requests, no visibility into what's happening
- **Fixed**: Added request logger middleware

### 🟡 **CRITICAL ISSUE #6: No 404 Handler**
- **Problem**: Non-existent routes would just hang
- **Fixed**: Added 404 handler before error middleware

---

## Testing in Thunder Client

### Step 1: Verify API is Running
**GET** `http://localhost:5000/health`

Expected Response (200):
```json
{
  "status": "OK",
  "timestamp": "2026-02-04T10:30:45.123Z",
  "uptime": 15.234
}
```

If you get an error here, the server isn't running.

### Step 2: Test Signup Endpoint
**POST** `http://localhost:5000/auth/register`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "username": "john_doe",
  "email": "john@test.com",
  "password": "Password123",
  "role": "school_admin",
  "school_id": 1,
  "profile": {
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

Expected Response (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@test.com",
    "role": "school_admin",
    "school_id": 1
  },
  "token": "eyJhbGc..."
}
```

### Step 3: Test Login Endpoint
**POST** `http://localhost:5000/auth/login`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "email": "john@test.com",
  "password": "Password123",
  "school_id": 1
}
```

Expected Response (200):
```json
{
  "message": "Login successful",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@test.com",
    "role": "school_admin",
    "school_id": 1
  },
  "token": "eyJhbGc..."
}
```

---

## Troubleshooting

### Issue: "Connection refused" or "Cannot reach server"
1. ✅ Verify server is running: `npm start` in the `server` folder
2. ✅ Check console for startup message: `✅ Server running on http://localhost:5000`
3. ✅ Verify PORT in `.env` is 5000

### Issue: Requests timeout or hang
1. ✅ Check browser console for errors
2. ✅ Look at server console for error logs
3. ✅ Verify database is connected (check .env DB credentials)
4. ✅ Test `/health` endpoint first

### Issue: 500 Error with error message
1. ✅ Read the error message carefully
2. ✅ Check server logs in console
3. ✅ Most common: Database connection failed
   - Verify MySQL is running
   - Check DB credentials in .env
   - Check database exists

### Issue: CORS Error in browser
```
Access to XMLHttpRequest from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution**: CORS is configured to allow:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Alternative)
- http://localhost:5000 (API itself)

If testing from different origin, add it to app.js CORS origins.

### Issue: "Cannot find module" errors
1. ✅ Reinstall dependencies: `npm install`
2. ✅ Check all import paths use `.js` extension
3. ✅ Verify file exists at the path

---

## Server Console Output

### Healthy Startup
```
✅ Server running on http://localhost:5000
📝 Node Environment: development
🔒 JWT Secret configured: Yes

[2026-02-04T10:30:45.123Z] GET /health - 200 (2ms)
[2026-02-04T10:30:46.456Z] POST /auth/register - 201 (234ms)
[2026-02-04T10:30:47.789Z] POST /auth/login - 200 (189ms)
```

### Database Connection Issue
```
❌ Error connecting to database: connect ECONNREFUSED 127.0.0.1:3306
```
**Fix**: Start MySQL and verify .env credentials

### Missing JWT Secret
```
🔒 JWT Secret configured: No (⚠️ Configure in .env)
```
**Fix**: Add JWT_SECRET to .env

---

## Best Practices for Testing

### 1. Always Test Health First
```
GET http://localhost:5000/health
```
If this works, API is running.

### 2. Use Thunder Client Collections
- Create a collection for each feature set
- Save endpoints with example bodies
- Document expected responses

### 3. Monitor Server Logs
- Always keep server console visible
- Check for errors/warnings
- Look at response times

### 4. Test Error Cases
- Invalid email format
- Missing required fields
- Wrong password
- Invalid role

### 5. Save Tokens for Authenticated Requests
When testing protected endpoints:
1. Copy token from login response
2. Add to Authorization header: `Bearer {token}`
3. Include in subsequent requests

### Protected Endpoint Example
**POST** `http://localhost:5000/auth/change-password`

Headers:
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Body:
```json
{
  "oldPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

---

## Response Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Invalid/missing token |
| 404 | Not Found | Route doesn't exist |
| 500 | Server Error | Database, code error, etc |

---

## Quick Debugging Checklist

- [ ] Server is running (`npm start`)
- [ ] Port is 5000 in .env
- [ ] `/health` endpoint returns 200
- [ ] Database is running
- [ ] .env file has all required variables
- [ ] Network tab shows correct requests
- [ ] Server console shows request logs
- [ ] No CORS errors in browser console
- [ ] Content-Type header is `application/json`
- [ ] Request body is valid JSON

---

## Files Modified

✅ `server/src/app.js` - Added error handler, health check, 404 handler, logging, CORS
✅ `server/src/server.js` - Improved logging, error handling, environment setup
✅ `server/.env` - Added PORT and NODE_ENV

## Next Steps

1. Test all endpoints systematically
2. Add more specific error messages in services
3. Implement request validation middleware
4. Add database connection health checks
5. Set up API documentation (Swagger/OpenAPI)
