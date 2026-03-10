import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    "openapi": "3.0.0",
    "info": {
      "title": "SchoolOS API",
      "version": "1.0.0",
      "description": "REST API for the **SchoolOS School Management System**.\n\n### Authentication\nMost endpoints require a Bearer JWT token. Obtain one via `POST /auth/login` or `POST /auth/superadmin/login`, then click **Authorize** and paste it.\n\n### Roles\n| Role | Protected prefix |\n|------|------------------|\n| `super_admin`  | `/superadmin/*` |\n| `school_admin` | `/admin/*`      |\n| `teacher`      | `/teacher/*`    |\n| `student`      | `/student/*`    |",
      "contact": {
        "name": "SchoolOS Support",
        "email": "support@schoolos.dev"
      },
      "license": {
        "name": "ISC"
      }
    },
    "servers": [
      {
        "url": "http://localhost:5000",
        "description": "Local Development"
      }
    ],
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "tags": [
      {
        "name": "Health",
        "description": "Server health check — no auth required."
      },
      {
        "name": "Auth",
        "description": "Authentication and password management. Login routes are public."
      },
      {
        "name": "Admin",
        "description": "School administration operations (role: school_admin)."
      },
      {
        "name": "Teacher",
        "description": "Teacher operations — marks, attendance, students (role: teacher)."
      },
      {
        "name": "Student",
        "description": "Student self-service — profile, marks, attendance, invoices (role: student)."
      },
      {
        "name": "Mark",
        "description": "Standalone mark/grade submission endpoint."
      },
      {
        "name": "SuperAdmin - Dashboard",
        "description": "Global platform metrics (role: super_admin)."
      },
      {
        "name": "SuperAdmin - Schools",
        "description": "School tenant CRUD (role: super_admin)."
      },
      {
        "name": "SuperAdmin - Licenses",
        "description": "License management and renewal (role: super_admin)."
      },
      {
        "name": "SuperAdmin - Finance",
        "description": "Revenue summary and payment history (role: super_admin)."
      },
      {
        "name": "SuperAdmin - Users",
        "description": "Platform-wide user listing and status toggle (role: super_admin)."
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "description": "Paste your JWT token here (without the Bearer prefix). Get it from POST /auth/login."
        }
      },
      "parameters": {
        "pageParam": {
          "name": "page",
          "in": "query",
          "description": "Page number (1-based).",
          "schema": {
            "type": "integer",
            "default": 1,
            "minimum": 1
          }
        },
        "limitParam": {
          "name": "limit",
          "in": "query",
          "description": "Records per page.",
          "schema": {
            "type": "integer",
            "default": 10,
            "minimum": 1,
            "maximum": 100
          }
        },
        "searchParam": {
          "name": "search",
          "in": "query",
          "description": "Free-text search (name, email).",
          "schema": {
            "type": "string",
            "example": "Springfield"
          }
        },
        "statusFilterParam": {
          "name": "status",
          "in": "query",
          "description": "Filter by status.",
          "schema": {
            "type": "string",
            "example": "active"
          }
        },
        "roleFilterParam": {
          "name": "role",
          "in": "query",
          "description": "Filter users by role.",
          "schema": {
            "type": "string",
            "enum": [
              "super_admin",
              "school_admin",
              "teacher",
              "student",
              "parent",
              "accountant"
            ]
          }
        },
        "termIdParam": {
          "name": "term_id",
          "in": "query",
          "description": "Filter by academic term ID.",
          "schema": {
            "type": "integer",
            "example": 1
          }
        },
        "invoiceStatusParam": {
          "name": "status",
          "in": "query",
          "description": "Filter invoices by status.",
          "schema": {
            "type": "string",
            "enum": [
              "paid",
              "pending",
              "overdue"
            ],
            "example": "pending"
          }
        },
        "schoolIdPath": {
          "name": "schoolId",
          "in": "path",
          "required": true,
          "description": "School numeric ID.",
          "schema": {
            "type": "integer",
            "example": 1
          }
        },
        "licenseIdPath": {
          "name": "licenseId",
          "in": "path",
          "required": true,
          "description": "License numeric ID.",
          "schema": {
            "type": "integer",
            "example": 1
          }
        },
        "userIdPath": {
          "name": "userId",
          "in": "path",
          "required": true,
          "description": "User numeric ID.",
          "schema": {
            "type": "integer",
            "example": 42
          }
        }
      },
      "responses": {
        "Unauthorized": {
          "description": "Missing or invalid JWT.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "example": {
                "message": "Unauthorized"
              }
            }
          }
        },
        "Forbidden": {
          "description": "Valid token but insufficient role.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "example": {
                "message": "Forbidden"
              }
            }
          }
        },
        "NotFound": {
          "description": "Resource not found.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "example": {
                "message": "Not found"
              }
            }
          }
        },
        "BadRequest": {
          "description": "Validation or missing fields.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "example": {
                "message": "Missing required fields"
              }
            }
          }
        },
        "Conflict": {
          "description": "Resource already exists.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "example": {
                "message": "Record already exists"
              }
            }
          }
        },
        "InternalServerError": {
          "description": "Unexpected server error.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DetailedErrorResponse"
              }
            }
          }
        }
      },
      "schemas": {
        "PaginationMeta": {
          "type": "object",
          "description": "Pagination metadata attached to every paginated list response.",
          "properties": {
            "total": {
              "type": "integer",
              "example": 100,
              "description": "Total matching records"
            },
            "page": {
              "type": "integer",
              "example": 1,
              "description": "Current page (1-based)"
            },
            "limit": {
              "type": "integer",
              "example": 10,
              "description": "Records per page"
            },
            "totalPages": {
              "type": "integer",
              "example": 10,
              "description": "Total pages"
            }
          }
        },
        "ErrorResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "Unauthorized"
            }
          }
        },
        "DetailedErrorResponse": {
          "type": "object",
          "description": "Structured error envelope emitted by the global error handler.",
          "properties": {
            "error": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "Internal Server Error"
                },
                "status": {
                  "type": "integer",
                  "example": 500
                },
                "timestamp": {
                  "type": "string",
                  "format": "date-time"
                },
                "path": {
                  "type": "string",
                  "example": "/auth/register"
                }
              }
            }
          }
        },
        "SuccessMessage": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "Operation completed successfully"
            }
          }
        },
        "HealthResponse": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "example": "OK"
            },
            "timestamp": {
              "type": "string",
              "format": "date-time"
            },
            "uptime": {
              "type": "number",
              "example": 3600.5,
              "description": "Server uptime in seconds"
            }
          }
        },
        "RegisterRequest": {
          "type": "object",
          "required": [
            "username",
            "email",
            "password",
            "role"
          ],
          "properties": {
            "username": {
              "type": "string",
              "example": "john_doe"
            },
            "email": {
              "type": "string",
              "format": "email",
              "example": "john@school.com"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "Secret123!"
            },
            "role": {
              "type": "string",
              "enum": [
                "school_admin",
                "teacher",
                "student",
                "parent",
                "accountant"
              ],
              "example": "teacher"
            },
            "school_id": {
              "type": "integer",
              "example": 1,
              "description": "Required for all roles except super_admin"
            },
            "profile": {
              "type": "object",
              "properties": {
                "first_name": {
                  "type": "string",
                  "example": "John"
                },
                "last_name": {
                  "type": "string",
                  "example": "Doe"
                }
              }
            }
          }
        },
        "LoginRequest": {
          "type": "object",
          "required": [
            "email",
            "password"
          ],
          "properties": {
            "email": {
              "type": "string",
              "format": "email",
              "example": "admin@school.com"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "Secret123!"
            },
            "school_id": {
              "type": "integer",
              "example": 1,
              "description": "Required for all roles except super_admin"
            }
          }
        },
        "SuperAdminLoginRequest": {
          "type": "object",
          "required": [
            "email",
            "password"
          ],
          "properties": {
            "email": {
              "type": "string",
              "format": "email",
              "example": "superadmin@schoolos.dev"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "Admin@123"
            }
          }
        },
        "AuthResponse": {
          "type": "object",
          "properties": {
            "token": {
              "type": "string",
              "example": "eyJhbGciOiJIUzI1NiJ9.payload.sig",
              "description": "JWT — use as Authorization: Bearer <token>"
            },
            "user": {
              "$ref": "#/components/schemas/UserProfile"
            }
          }
        },
        "ChangePasswordRequest": {
          "type": "object",
          "required": [
            "oldPassword",
            "newPassword"
          ],
          "properties": {
            "oldPassword": {
              "type": "string",
              "format": "password",
              "example": "OldSecret123"
            },
            "newPassword": {
              "type": "string",
              "format": "password",
              "example": "NewSecret456!",
              "description": "Minimum 6 characters"
            }
          }
        },
        "ForgotPasswordRequest": {
          "type": "object",
          "required": [
            "email"
          ],
          "properties": {
            "email": {
              "type": "string",
              "format": "email",
              "example": "user@school.com"
            },
            "school_id": {
              "type": "integer",
              "example": 1
            }
          }
        },
        "ResetPasswordRequest": {
          "type": "object",
          "required": [
            "resetToken",
            "newPassword"
          ],
          "properties": {
            "resetToken": {
              "type": "string",
              "example": "a1b2c3d4e5f6resettoken"
            },
            "newPassword": {
              "type": "string",
              "format": "password",
              "example": "NewSecret456!"
            }
          }
        },
        "UserProfile": {
          "type": "object",
          "description": "Core user object returned in auth responses and user-list endpoints.",
          "properties": {
            "user_id": {
              "type": "integer",
              "example": 1
            },
            "username": {
              "type": "string",
              "example": "john_doe"
            },
            "email": {
              "type": "string",
              "example": "john@school.com"
            },
            "role": {
              "type": "string",
              "enum": [
                "super_admin",
                "school_admin",
                "teacher",
                "student",
                "parent",
                "accountant"
              ],
              "example": "teacher"
            },
            "school_id": {
              "type": "integer",
              "example": 1,
              "nullable": true
            },
            "school_name": {
              "type": "string",
              "example": "Springfield High School",
              "nullable": true
            },
            "is_active": {
              "type": "boolean",
              "example": true
            },
            "created_at": {
              "type": "string",
              "format": "date-time"
            },
            "last_login": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            }
          }
        },
        "StudentProfileUpdateRequest": {
          "type": "object",
          "description": "Fields a student is allowed to update on their own profile.",
          "properties": {
            "first_name": {
              "type": "string",
              "example": "Jane"
            },
            "last_name": {
              "type": "string",
              "example": "Smith"
            },
            "phone": {
              "type": "string",
              "example": "+1234567890"
            },
            "address": {
              "type": "string",
              "example": "123 Main Street"
            }
          }
        },
        "DashboardStats": {
          "type": "object",
          "description": "Aggregated dashboard data returned to the school admin.",
          "properties": {
            "stats": {
              "type": "object",
              "properties": {
                "total_students": {
                  "type": "integer",
                  "example": 320
                },
                "total_teachers": {
                  "type": "integer",
                  "example": 25
                },
                "total_classes": {
                  "type": "integer",
                  "example": 12
                },
                "total_subjects": {
                  "type": "integer",
                  "example": 8
                }
              }
            },
            "attendanceTrends": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "date": {
                    "type": "string",
                    "format": "date"
                  },
                  "present_count": {
                    "type": "integer",
                    "example": 290
                  },
                  "absent_count": {
                    "type": "integer",
                    "example": 30
                  },
                  "attendance_rate": {
                    "type": "number",
                    "example": 90.6
                  }
                }
              }
            },
            "recentActivity": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "activity_type": {
                    "type": "string",
                    "example": "student_enrolled"
                  },
                  "description": {
                    "type": "string",
                    "example": "New student enrolled in Class 10A"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "AddStudentRequest": {
          "type": "object",
          "required": [
            "username",
            "email",
            "password",
            "first_name",
            "last_name"
          ],
          "properties": {
            "username": {
              "type": "string",
              "example": "jane_smith"
            },
            "email": {
              "type": "string",
              "format": "email",
              "example": "jane@school.com"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "Student123!"
            },
            "first_name": {
              "type": "string",
              "example": "Jane"
            },
            "last_name": {
              "type": "string",
              "example": "Smith"
            },
            "class_id": {
              "type": "integer",
              "example": 3
            },
            "date_of_birth": {
              "type": "string",
              "format": "date",
              "example": "2005-06-15"
            },
            "gender": {
              "type": "string",
              "enum": [
                "male",
                "female",
                "other"
              ],
              "example": "female"
            },
            "phone": {
              "type": "string",
              "example": "+1234567890"
            },
            "address": {
              "type": "string",
              "example": "123 Main St"
            }
          }
        },
        "AddTeacherRequest": {
          "type": "object",
          "required": [
            "username",
            "email",
            "password",
            "first_name",
            "last_name"
          ],
          "properties": {
            "username": {
              "type": "string",
              "example": "mr_johnson"
            },
            "email": {
              "type": "string",
              "format": "email",
              "example": "johnson@school.com"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "Teacher123!"
            },
            "first_name": {
              "type": "string",
              "example": "Robert"
            },
            "last_name": {
              "type": "string",
              "example": "Johnson"
            },
            "subject_id": {
              "type": "integer",
              "example": 2
            },
            "phone": {
              "type": "string",
              "example": "+1987654321"
            },
            "qualification": {
              "type": "string",
              "example": "BSc Mathematics"
            }
          }
        },
        "AnnouncementRequest": {
          "type": "object",
          "required": [
            "title",
            "content"
          ],
          "properties": {
            "title": {
              "type": "string",
              "example": "School Holiday Notice"
            },
            "content": {
              "type": "string",
              "example": "School will be closed on Monday."
            },
            "target_audience": {
              "type": "string",
              "enum": [
                "all",
                "students",
                "teachers",
                "parents"
              ],
              "default": "all",
              "example": "all"
            }
          }
        },
        "ReportsSummary": {
          "type": "object",
          "properties": {
            "total_students": {
              "type": "integer",
              "example": 320
            },
            "passed_students": {
              "type": "integer",
              "example": 280
            },
            "failed_students": {
              "type": "integer",
              "example": 40
            },
            "average_score": {
              "type": "number",
              "example": 72.4
            },
            "top_performing_class": {
              "type": "string",
              "example": "10A"
            }
          }
        },
        "ClassItem": {
          "type": "object",
          "properties": {
            "class_id": {
              "type": "integer",
              "example": 3
            },
            "class_name": {
              "type": "string",
              "example": "10A"
            },
            "student_count": {
              "type": "integer",
              "example": 30
            },
            "teacher_name": {
              "type": "string",
              "example": "Mr. Johnson"
            }
          }
        },
        "AddMarkRequest": {
          "type": "object",
          "required": [
            "student_id",
            "subject_id",
            "term_id",
            "score"
          ],
          "properties": {
            "student_id": {
              "type": "integer",
              "example": 10
            },
            "subject_id": {
              "type": "integer",
              "example": 2
            },
            "term_id": {
              "type": "integer",
              "example": 1
            },
            "exam_id": {
              "type": "integer",
              "example": 5
            },
            "score": {
              "type": "number",
              "format": "float",
              "example": 85.5
            },
            "max_score": {
              "type": "number",
              "format": "float",
              "example": 100
            },
            "remarks": {
              "type": "string",
              "example": "Excellent performance"
            }
          }
        },
        "AttendanceRequest": {
          "type": "object",
          "required": [
            "class_id",
            "date",
            "attendance"
          ],
          "properties": {
            "class_id": {
              "type": "integer",
              "example": 3
            },
            "date": {
              "type": "string",
              "format": "date",
              "example": "2024-03-15"
            },
            "attendance": {
              "type": "array",
              "description": "One entry per student in the class.",
              "items": {
                "type": "object",
                "required": [
                  "student_id",
                  "status"
                ],
                "properties": {
                  "student_id": {
                    "type": "integer",
                    "example": 10
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "present",
                      "absent",
                      "late"
                    ],
                    "example": "present"
                  }
                }
              }
            }
          }
        },
        "StudentItem": {
          "type": "object",
          "properties": {
            "user_id": {
              "type": "integer",
              "example": 10
            },
            "username": {
              "type": "string",
              "example": "jane_smith"
            },
            "email": {
              "type": "string",
              "example": "jane@school.com"
            },
            "first_name": {
              "type": "string",
              "example": "Jane"
            },
            "last_name": {
              "type": "string",
              "example": "Smith"
            },
            "class_name": {
              "type": "string",
              "example": "10A"
            },
            "class_id": {
              "type": "integer",
              "example": 3
            }
          }
        },
        "StudentProfile": {
          "type": "object",
          "properties": {
            "user_id": {
              "type": "integer",
              "example": 10
            },
            "username": {
              "type": "string",
              "example": "jane_smith"
            },
            "email": {
              "type": "string",
              "example": "jane@school.com"
            },
            "first_name": {
              "type": "string",
              "example": "Jane"
            },
            "last_name": {
              "type": "string",
              "example": "Smith"
            },
            "class_name": {
              "type": "string",
              "example": "10A"
            },
            "date_of_birth": {
              "type": "string",
              "format": "date"
            },
            "gender": {
              "type": "string",
              "example": "female"
            },
            "phone": {
              "type": "string",
              "example": "+1234567890"
            },
            "address": {
              "type": "string",
              "example": "123 Main St"
            },
            "school_name": {
              "type": "string",
              "example": "Springfield High School"
            }
          }
        },
        "MarkItem": {
          "type": "object",
          "properties": {
            "mark_id": {
              "type": "integer",
              "example": 1
            },
            "subject_name": {
              "type": "string",
              "example": "Mathematics"
            },
            "exam_name": {
              "type": "string",
              "example": "Mid-Term Exam"
            },
            "score": {
              "type": "number",
              "example": 85.5
            },
            "max_score": {
              "type": "number",
              "example": 100
            },
            "grade": {
              "type": "string",
              "example": "A"
            },
            "remarks": {
              "type": "string",
              "example": "Excellent"
            },
            "term_name": {
              "type": "string",
              "example": "Term 1"
            }
          }
        },
        "AttendanceItem": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string",
              "format": "date",
              "example": "2024-03-15"
            },
            "status": {
              "type": "string",
              "enum": [
                "present",
                "absent",
                "late"
              ],
              "example": "present"
            },
            "class_name": {
              "type": "string",
              "example": "10A"
            },
            "subject_name": {
              "type": "string",
              "example": "Mathematics",
              "nullable": true
            }
          }
        },
        "InvoiceItem": {
          "type": "object",
          "properties": {
            "invoice_id": {
              "type": "integer",
              "example": 1
            },
            "amount": {
              "type": "number",
              "example": 500
            },
            "due_date": {
              "type": "string",
              "format": "date"
            },
            "paid_date": {
              "type": "string",
              "format": "date",
              "nullable": true
            },
            "status": {
              "type": "string",
              "enum": [
                "paid",
                "pending",
                "overdue"
              ],
              "example": "pending"
            },
            "description": {
              "type": "string",
              "example": "Term 1 Tuition Fee"
            }
          }
        },
        "MarkRequest": {
          "type": "object",
          "required": [
            "student_id",
            "subject_id",
            "exam_id",
            "marks"
          ],
          "properties": {
            "student_id": {
              "type": "integer",
              "example": 10
            },
            "subject_id": {
              "type": "integer",
              "example": 2
            },
            "exam_id": {
              "type": "integer",
              "example": 5
            },
            "marks": {
              "type": "number",
              "format": "float",
              "example": 78.5
            },
            "max_marks": {
              "type": "number",
              "format": "float",
              "example": 100
            },
            "remarks": {
              "type": "string",
              "example": "Good effort"
            }
          }
        },
        "School": {
          "type": "object",
          "properties": {
            "school_id": {
              "type": "integer",
              "example": 1
            },
            "name": {
              "type": "string",
              "example": "Springfield High School"
            },
            "address": {
              "type": "string",
              "example": "742 Evergreen Terrace, Springfield"
            },
            "phone": {
              "type": "string",
              "example": "+1234567890"
            },
            "email": {
              "type": "string",
              "example": "info@springfield.edu"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive",
                "suspended"
              ],
              "example": "active"
            },
            "student_count": {
              "type": "integer",
              "example": 320
            },
            "teacher_count": {
              "type": "integer",
              "example": 25
            },
            "created_at": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "CreateSchoolRequest": {
          "type": "object",
          "required": [
            "school",
            "admin"
          ],
          "description": "Provisions a new school tenant with an optional license and initial admin in one request.",
          "properties": {
            "school": {
              "type": "object",
              "required": [
                "name"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "example": "Springfield High School"
                },
                "address": {
                  "type": "string",
                  "example": "742 Evergreen Terrace"
                },
                "phone": {
                  "type": "string",
                  "example": "+1234567890"
                },
                "email": {
                  "type": "string",
                  "format": "email",
                  "example": "info@springfield.edu"
                }
              }
            },
            "license": {
              "type": "object",
              "description": "Optional — defaults to a basic 1-year license when omitted.",
              "properties": {
                "plan_name": {
                  "type": "string",
                  "enum": [
                    "basic",
                    "standard",
                    "premium"
                  ],
                  "example": "standard"
                },
                "end_date": {
                  "type": "string",
                  "format": "date",
                  "example": "2025-12-31"
                },
                "max_students": {
                  "type": "integer",
                  "example": 500
                }
              }
            },
            "admin": {
              "type": "object",
              "required": [
                "username",
                "email",
                "password"
              ],
              "properties": {
                "username": {
                  "type": "string",
                  "example": "admin_springfield"
                },
                "email": {
                  "type": "string",
                  "format": "email",
                  "example": "admin@springfield.edu"
                },
                "password": {
                  "type": "string",
                  "format": "password",
                  "example": "AdminPass123!"
                },
                "first_name": {
                  "type": "string",
                  "example": "Alice"
                },
                "last_name": {
                  "type": "string",
                  "example": "Morgan"
                }
              }
            }
          }
        },
        "UpdateSchoolRequest": {
          "type": "object",
          "description": "Any subset of school fields to update.",
          "properties": {
            "name": {
              "type": "string",
              "example": "Springfield High School (Updated)"
            },
            "address": {
              "type": "string",
              "example": "742 Evergreen Terrace"
            },
            "phone": {
              "type": "string",
              "example": "+1234567890"
            },
            "email": {
              "type": "string",
              "example": "info@springfield.edu"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "inactive",
                "suspended"
              ],
              "example": "active"
            }
          }
        },
        "SchoolsListResponse": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/School"
              }
            },
            "pagination": {
              "$ref": "#/components/schemas/PaginationMeta"
            }
          }
        },
        "License": {
          "type": "object",
          "properties": {
            "license_id": {
              "type": "integer",
              "example": 1
            },
            "school_id": {
              "type": "integer",
              "example": 1
            },
            "school_name": {
              "type": "string",
              "example": "Springfield High School"
            },
            "plan_name": {
              "type": "string",
              "enum": [
                "basic",
                "standard",
                "premium"
              ],
              "example": "standard"
            },
            "start_date": {
              "type": "string",
              "format": "date"
            },
            "end_date": {
              "type": "string",
              "format": "date",
              "example": "2025-12-31"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "expired",
                "suspended"
              ],
              "example": "active"
            },
            "max_students": {
              "type": "integer",
              "example": 500
            },
            "student_count": {
              "type": "integer",
              "example": 320
            },
            "days_remaining": {
              "type": "integer",
              "example": 180,
              "nullable": true
            }
          }
        },
        "UpdateLicenseRequest": {
          "type": "object",
          "description": "Any subset of license fields to update.",
          "properties": {
            "plan_name": {
              "type": "string",
              "enum": [
                "basic",
                "standard",
                "premium"
              ],
              "example": "premium"
            },
            "end_date": {
              "type": "string",
              "format": "date",
              "example": "2025-12-31"
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "expired",
                "suspended"
              ],
              "example": "active"
            },
            "max_students": {
              "type": "integer",
              "example": 1000
            }
          }
        },
        "RenewLicenseRequest": {
          "type": "object",
          "required": [
            "end_date"
          ],
          "properties": {
            "end_date": {
              "type": "string",
              "format": "date",
              "example": "2026-12-31",
              "description": "Required — new expiry date."
            },
            "plan_name": {
              "type": "string",
              "enum": [
                "basic",
                "standard",
                "premium"
              ],
              "example": "standard"
            },
            "max_students": {
              "type": "integer",
              "example": 500
            }
          }
        },
        "LicensesListResponse": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/License"
              }
            },
            "pagination": {
              "$ref": "#/components/schemas/PaginationMeta"
            }
          }
        },
        "UsersListResponse": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/UserProfile"
              }
            },
            "pagination": {
              "$ref": "#/components/schemas/PaginationMeta"
            }
          }
        },
        "ToggleUserActiveRequest": {
          "type": "object",
          "required": [
            "is_active"
          ],
          "properties": {
            "is_active": {
              "type": "boolean",
              "example": true,
              "description": "true to activate, false to deactivate."
            }
          }
        },
        "FinanceSummary": {
          "type": "object",
          "properties": {
            "total_revenue": {
              "type": "number",
              "example": 125000,
              "description": "All-time total revenue"
            },
            "monthly_revenue": {
              "type": "number",
              "example": 12500,
              "description": "Current month revenue"
            },
            "active_schools": {
              "type": "integer",
              "example": 10
            },
            "pending_payments": {
              "type": "integer",
              "example": 3
            },
            "expired_licenses": {
              "type": "integer",
              "example": 2
            }
          }
        },
        "Payment": {
          "type": "object",
          "properties": {
            "payment_id": {
              "type": "integer",
              "example": 1
            },
            "school_id": {
              "type": "integer",
              "example": 2
            },
            "school_name": {
              "type": "string",
              "example": "Springfield High School"
            },
            "amount": {
              "type": "number",
              "example": 2500
            },
            "date": {
              "type": "string",
              "format": "date-time"
            },
            "status": {
              "type": "string",
              "enum": [
                "paid",
                "pending",
                "failed"
              ],
              "example": "paid"
            },
            "plan_name": {
              "type": "string",
              "example": "standard"
            }
          }
        },
        "PaymentsListResponse": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Payment"
              }
            },
            "pagination": {
              "$ref": "#/components/schemas/PaginationMeta"
            }
          }
        },
        "GlobalMetrics": {
          "type": "object",
          "properties": {
            "total_schools": {
              "type": "integer",
              "example": 15
            },
            "active_schools": {
              "type": "integer",
              "example": 12
            },
            "total_users": {
              "type": "integer",
              "example": 4800
            },
            "total_students": {
              "type": "integer",
              "example": 4200
            },
            "total_teachers": {
              "type": "integer",
              "example": 350
            },
            "total_revenue": {
              "type": "number",
              "example": 125000
            },
            "expiring_soon": {
              "type": "integer",
              "example": 3,
              "description": "Licenses expiring within 30 days"
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js", "./src/app.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
