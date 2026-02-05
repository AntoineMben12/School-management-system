import db from '../config/database.js';

/**
 * Teacher Model - Comprehensive CRUD operations
 * Handles all teacher profile management and course assignments
 */

export const create = async (teacherData) => {
    const { user_id, school_id, department, specialization, phone, address, qualification } = teacherData;
    try {
        const [result] = await db.execute(
            `INSERT INTO teachers (user_id, school_id, department, specialization, phone, address, qualification, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, school_id, department || null, specialization || null, phone || null, address || null, qualification || null]
        );
        return { id: result.insertId, ...teacherData };
    } catch (error) {
        throw new Error(`Failed to create teacher: ${error.message}`);
    }
};

export const findById = async (teacherId) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, u.email, u.first_name, u.last_name, u.is_active,
                    s.name as school_name
             FROM teachers t
             JOIN users u ON t.user_id = u.id
             LEFT JOIN schools s ON t.school_id = s.id
             WHERE t.id = ?`,
            [teacherId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find teacher: ${error.message}`);
    }
};

export const findByUserId = async (userId) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, u.email, u.first_name, u.last_name, u.is_active,
                    s.name as school_name
             FROM teachers t
             JOIN users u ON t.user_id = u.id
             LEFT JOIN schools s ON t.school_id = s.id
             WHERE t.user_id = ?`,
            [userId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find teacher by user: ${error.message}`);
    }
};

export const findBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, u.email, u.first_name, u.last_name, u.is_active
             FROM teachers t
             JOIN users u ON t.user_id = u.id
             WHERE t.school_id = ?
             ORDER BY u.last_name, u.first_name`,
            [schoolId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find teachers by school: ${error.message}`);
    }
};

export const findByDepartment = async (schoolId, department) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, u.email, u.first_name, u.last_name, u.is_active
             FROM teachers t
             JOIN users u ON t.user_id = u.id
             WHERE t.school_id = ? AND t.department = ?
             ORDER BY u.last_name, u.first_name`,
            [schoolId, department]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find teachers by department: ${error.message}`);
    }
};

export const update = async (teacherId, updates) => {
    const allowedFields = ['department', 'specialization', 'phone', 'address', 'qualification'];
    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
        }
    }

    if (updateFields.length === 0) return { affectedRows: 0 };

    updateFields.push('updated_at = NOW()');
    updateValues.push(teacherId);

    try {
        const [result] = await db.execute(
            `UPDATE teachers SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update teacher: ${error.message}`);
    }
};

export const deleteTeacher = async (teacherId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM teachers WHERE id = ?',
            [teacherId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete teacher: ${error.message}`);
    }
};

export const getCountBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM teachers WHERE school_id = ?',
            [schoolId]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count teachers: ${error.message}`);
    }
};

export const getCountByDepartment = async (schoolId, department) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM teachers WHERE school_id = ? AND department = ?',
            [schoolId, department]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count teachers by department: ${error.message}`);
    }
};

export const getTeacherCourses = async (teacherId) => {
    try {
        const [rows] = await db.query(
            `SELECT DISTINCT co.*, s.name as subject_name, c.name as class_name,
                    t.name as term_name
             FROM course_offerings co
             JOIN subjects s ON co.subject_id = s.id
             LEFT JOIN classes c ON co.class_id = c.id
             JOIN academic_terms t ON co.term_id = t.id
             WHERE co.teacher_id = ?
             ORDER BY t.start_date DESC, s.name`,
            [teacherId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to get teacher courses: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findByUserId,
    findBySchool,
    findByDepartment,
    update,
    deleteTeacher,
    getCountBySchool,
    getCountByDepartment,
    getTeacherCourses
};
