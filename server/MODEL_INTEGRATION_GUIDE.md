# 🚀 Model Integration Guide - Controllers & Routes

## Overview
This guide shows how to integrate the 16 completed database models into your Express controllers and routes.

---

## Pattern 1: Basic CRUD Routes

### **Student Routes Example**

```javascript
// studentRoutes.js
import express from 'express';
import * as studentController from '../controllers/student.controller.js';
import { auth, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all students (school-filtered)
router.get('/', auth, studentController.getAllStudents);

// GET student by ID
router.get('/:id', auth, studentController.getStudentById);

// POST create new student
router.post('/', auth, adminAuth, studentController.createStudent);

// PUT update student
router.put('/:id', auth, adminAuth, studentController.updateStudent);

// DELETE student
router.delete('/:id', auth, adminAuth, studentController.deleteStudent);

export default router;
```

---

## Pattern 2: Controller Implementation

### **Student Controller Example**

```javascript
// student.controller.js
import Student from '../models/student.js';
import User from '../models/user.js';

// Get all students for school
export const getAllStudents = async (req, res, next) => {
    try {
        const schoolId = req.user.school_id;
        const students = await Student.findBySchool(schoolId);
        
        res.json({
            success: true,
            data: students,
            count: students.length
        });
    } catch (error) {
        next(error);
    }
};

// Get student by ID
export const getStudentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }
        
        res.json({ success: true, data: student });
    } catch (error) {
        next(error);
    }
};

// Create student
export const createStudent = async (req, res, next) => {
    try {
        const { first_name, last_name, email, admission_number, class_id } = req.body;
        const schoolId = req.user.school_id;
        
        // 1. Create user account
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: email.split('@')[0], // temp password
            role: 'STUDENT',
            school_id: schoolId
        });
        
        // 2. Create student profile
        const student = await Student.create({
            user_id: user.id,
            school_id: schoolId,
            admission_number,
            class_id,
            enrollment_date: new Date()
        });
        
        res.status(201).json({ 
            success: true, 
            data: student,
            message: 'Student created successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Update student
export const updateStudent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const result = await Student.update(id, updates);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }
        
        const updated = await Student.findById(id);
        res.json({ 
            success: true, 
            data: updated,
            message: 'Student updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete student
export const deleteStudent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Student.deleteStudent(id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
```

---

## Pattern 3: Advanced Query Routes

### **Teacher Routes with Courses**

```javascript
// teacherRoutes.js
import express from 'express';
import * as teacherController from '../controllers/teacher.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all teachers
router.get('/', auth, teacherController.getAllTeachers);

// GET teacher details with courses
router.get('/:id', auth, teacherController.getTeacherWithCourses);

// GET teachers by department
router.get('/department/:dept', auth, teacherController.getTeachersByDepartment);

// POST create teacher
router.post('/', auth, teacherController.createTeacher);

// PUT update teacher
router.put('/:id', auth, teacherController.updateTeacher);

export default router;
```

---

## Pattern 4: Multi-Model Relationships

### **Student-Parent Relationship Controller**

```javascript
// Linking parents to students
export const addParentToStudent = async (req, res, next) => {
    try {
        const { studentId, parentId, relationshipType } = req.body;
        
        // Verify both exist
        const student = await Student.findById(studentId);
        const parent = await Parent.findById(parentId);
        
        if (!student || !parent) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student or parent not found' 
            });
        }
        
        // Add relationship
        const result = await Parent.addStudentParent(parentId, studentId, relationshipType);
        
        res.json({ 
            success: true,
            message: 'Parent linked to student successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get student's parents
export const getStudentParents = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const parents = await Parent.findByStudent(studentId);
        
        res.json({ 
            success: true, 
            data: parents 
        });
    } catch (error) {
        next(error);
    }
};

// Get parent's children
export const getParentChildren = async (req, res, next) => {
    try {
        const { parentId } = req.params;
        const children = await Parent.getChildren(parentId);
        
        res.json({ 
            success: true, 
            data: children 
        });
    } catch (error) {
        next(error);
    }
};
```

---

## Pattern 5: Statistics & Reporting

### **School Statistics Routes**

```javascript
// adminRoutes.js - Dashboard statistics
export const getSchoolDashboard = async (req, res, next) => {
    try {
        const schoolId = req.user.school_id;
        
        // Get multiple statistics in parallel
        const [schoolStats, studentCount, teacherCount, classCount] = 
            await Promise.all([
                School.getSchoolStats(schoolId),
                Student.getCount(schoolId),
                Teacher.getCountBySchool(schoolId),
                Class.getCountBySchool(schoolId)
            ]);
        
        res.json({
            success: true,
            data: {
                schoolStats,
                studentCount,
                teacherCount,
                classCount,
                summary: {
                    totalStudents: studentCount,
                    totalTeachers: teacherCount,
                    totalClasses: classCount
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Teacher statistics
export const getTeacherStats = async (req, res, next) => {
    try {
        const { teacherId } = req.params;
        
        const [stats, average, courses] = await Promise.all([
            TeacherStatistics.findByTeacher(teacherId),
            TeacherStatistics.getTeacherAverageScore(teacherId),
            Teacher.getTeacherCourses(teacherId)
        ]);
        
        res.json({
            success: true,
            data: {
                history: stats,
                averages: average,
                currentCourses: courses
            }
        });
    } catch (error) {
        next(error);
    }
};
```

---

## Pattern 6: Conflict & Validation

### **Timetable Routes with Conflict Check**

```javascript
// timetableRoutes.js
export const createTimetableEntry = async (req, res, next) => {
    try {
        const { class_id, subject_id, teacher_id, day_of_week, 
                start_time, end_time, room_number, term_id } = req.body;
        
        const schoolId = req.user.school_id;
        
        // Check for conflicts
        const [roomConflict, teacherConflict] = await Promise.all([
            Timetable.checkRoomConflict(room_number, day_of_week, start_time, end_time, term_id),
            Timetable.checkTeacherConflict(teacher_id, day_of_week, start_time, end_time, term_id)
        ]);
        
        if (roomConflict) {
            return res.status(409).json({
                success: false,
                message: 'Room is already booked for this time slot'
            });
        }
        
        if (teacherConflict) {
            return res.status(409).json({
                success: false,
                message: 'Teacher already has a class scheduled at this time'
            });
        }
        
        // Create if no conflicts
        const timetable = await Timetable.create({
            school_id: schoolId,
            class_id,
            subject_id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            room_number,
            term_id
        });
        
        res.status(201).json({
            success: true,
            data: timetable,
            message: 'Timetable entry created'
        });
    } catch (error) {
        next(error);
    }
};

// Get class schedule
export const getClassSchedule = async (req, res, next) => {
    try {
        const { classId, termId } = req.params;
        const schedule = await Timetable.findByClass(classId, termId);
        
        res.json({
            success: true,
            data: schedule
        });
    } catch (error) {
        next(error);
    }
};
```

---

## Pattern 7: License Management

### **License Routes**

```javascript
// licenseRoutes.js
export const checkLicenseStatus = async (req, res, next) => {
    try {
        const schoolId = req.user.school_id;
        
        const isValid = await SchoolLicense.checkValidity(schoolId);
        
        if (!isValid) {
            return res.status(403).json({
                success: false,
                message: 'School license is inactive or expired'
            });
        }
        
        const activeLicense = await SchoolLicense.getActiveLicense(schoolId);
        
        res.json({
            success: true,
            data: {
                valid: true,
                license: activeLicense
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get expiring licenses (admin only)
export const getExpiringLicenses = async (req, res, next) => {
    try {
        const { days = 30 } = req.query;
        const expiring = await SchoolLicense.getExpiringLicenses(days);
        
        res.json({
            success: true,
            data: expiring,
            message: `${expiring.length} licenses expiring in ${days} days`
        });
    } catch (error) {
        next(error);
    }
};
```

---

## Pattern 8: Sequence Generation

### **Using Sequences for IDs**

```javascript
// studentController.js
export const generateAdmissionNumber = async (req, res, next) => {
    try {
        const schoolId = req.user.school_id;
        
        // Get or create sequence
        let seq = await Sequence.findByType(schoolId, 'ADMISSION');
        
        if (!seq) {
            seq = await Sequence.create({
                school_id: schoolId,
                sequence_type: 'ADMISSION',
                prefix: 'ADM-',
                current_value: 1000,
                increment_by: 1
            });
        }
        
        // Get next value
        const { value, formatted } = await Sequence.getNextValue(schoolId, 'ADMISSION');
        
        // Increment for next time
        await Sequence.incrementSequence(seq.id);
        
        res.json({
            success: true,
            data: {
                admissionNumber: formatted,
                nextValue: value + 1
            }
        });
    } catch (error) {
        next(error);
    }
};
```

---

## Complete Integration Checklist

- [ ] Import all 16 models in controllers
- [ ] Create controllers for each model
- [ ] Create routes for each model
- [ ] Add authentication middleware to routes
- [ ] Add authorization checks (admin, teacher, student roles)
- [ ] Implement error handling with global error handler
- [ ] Add request validation middleware
- [ ] Test all CRUD operations with Thunder Client
- [ ] Add logging for audit trail
- [ ] Implement pagination for list endpoints
- [ ] Add sorting options to list endpoints
- [ ] Create response standardization (success/error format)

---

## Response Format Standard

```javascript
// Success
{
    "success": true,
    "data": { /* actual data */ },
    "message": "Operation successful"
}

// Error
{
    "success": false,
    "message": "Error description",
    "code": "ERROR_CODE"
}

// List with pagination
{
    "success": true,
    "data": [ /* items */ ],
    "count": 25,
    "page": 1,
    "limit": 10,
    "total": 100
}
```

---

## Error Handling Middleware

```javascript
// errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
```

---

**Ready to implement!** Start with one controller-route pair and test thoroughly before moving to the next model.
