import db from '../config/database.js';

/**
 * Class Model - Handle all class database operations
 */

/**
 * Create a new class
 */
export const create = async (classData) => {
    const { school_id, dept_id, name, level, class_teacher_id } = classData;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO classes (school_id, dept_id, name, level, class_teacher_id)
             VALUES (?, ?, ?, ?, ?)`,
            [school_id, dept_id || null, name, level, class_teacher_id || null]
        );
        return { class_id: result.insertId, ...classData };
    } catch (error) {
        throw new Error(`Failed to create class: ${error.message}`);
    }
};

/**
 * Find class by ID
 */
export const findById = async (class_id) => {
    const [rows] = await db.query(
        `SELECT c.*, t.first_name as teacher_first_name, t.last_name as teacher_last_name, d.name as dept_name
         FROM classes c
         LEFT JOIN teachers t ON c.class_teacher_id = t.teacher_id
         LEFT JOIN departments d ON c.dept_id = d.dept_id
         WHERE c.class_id = ?`,
        [class_id]
    );
    return rows[0] || null;
};

/**
 * Find all classes in a school
 */
export const findBySchool = async (school_id, dept_id = null) => {
    let sql = `SELECT c.*, t.first_name as teacher_first_name, t.last_name as teacher_last_name, d.name as dept_name
               FROM classes c
               LEFT JOIN teachers t ON c.class_teacher_id = t.teacher_id
               LEFT JOIN departments d ON c.dept_id = d.dept_id
               WHERE c.school_id = ?`;
    const params = [school_id];

    if (dept_id) {
        sql += ' AND c.dept_id = ?';
        params.push(dept_id);
    }

    sql += ' ORDER BY c.level, c.name';
    const [rows] = await db.query(sql, params);
    return rows;
};

/**
 * Find classes by teacher
 */
export const findByTeacher = async (teacher_id) => {
    const [rows] = await db.query(
        `SELECT c.*, COUNT(s.student_id) as student_count
         FROM classes c
         LEFT JOIN students s ON c.class_id = s.current_class_id
         WHERE c.class_teacher_id = ?
         GROUP BY c.class_id
         ORDER BY c.level`,
        [teacher_id]
    );
    return rows;
};

/**
 * Update class
 */
export const update = async (class_id, updates) => {
    const allowedFields = ['name', 'level', 'class_teacher_id', 'dept_id'];
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(class_id);
    const [result] = await db.execute(
        `UPDATE classes SET ${fields.join(', ')} WHERE class_id = ?`,
        values
    );
    return result;
};

/**
 * Get student count in class
 */
export const getStudentCount = async (class_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) as count FROM students WHERE current_class_id = ?`,
        [class_id]
    );
    return rows[0].count;
};

/**
 * Delete class
 */
export const deleteClass = async (class_id) => {
    const [result] = await db.execute(
        `DELETE FROM classes WHERE class_id = ?`,
        [class_id]
    );
    return result;
};

export default { create, findById, findBySchool, findByTeacher, update, getStudentCount, deleteClass };
