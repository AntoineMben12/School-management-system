import db from '../config/database.js';

/**
 * Parent Model - Guardian and parent information management
 * Manages parent/guardian profiles and their relationship to students
 */

export const create = async (parentData) => {
    const { user_id, school_id, occupation, phone, address, relationship_type } = parentData;
    try {
        const [result] = await db.execute(
            `INSERT INTO parents (user_id, school_id, occupation, phone, address, relationship_type, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, school_id, occupation || null, phone || null, address || null, relationship_type || 'PARENT']
        );
        return { id: result.insertId, ...parentData };
    } catch (error) {
        throw new Error(`Failed to create parent: ${error.message}`);
    }
};

export const findById = async (parentId) => {
    try {
        const [rows] = await db.query(
            `SELECT p.*, u.email, u.first_name, u.last_name, u.is_active,
                    s.name as school_name
             FROM parents p
             JOIN users u ON p.user_id = u.id
             LEFT JOIN schools s ON p.school_id = s.id
             WHERE p.id = ?`,
            [parentId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find parent: ${error.message}`);
    }
};

export const findByUserId = async (userId) => {
    try {
        const [rows] = await db.query(
            `SELECT p.*, u.email, u.first_name, u.last_name, u.is_active,
                    s.name as school_name
             FROM parents p
             JOIN users u ON p.user_id = u.id
             LEFT JOIN schools s ON p.school_id = s.id
             WHERE p.user_id = ?`,
            [userId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find parent by user: ${error.message}`);
    }
};

export const findBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT p.*, u.email, u.first_name, u.last_name, u.is_active
             FROM parents p
             JOIN users u ON p.user_id = u.id
             WHERE p.school_id = ?
             ORDER BY u.last_name, u.first_name`,
            [schoolId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find parents by school: ${error.message}`);
    }
};

export const findByStudent = async (studentId) => {
    try {
        const [rows] = await db.query(
            `SELECT DISTINCT p.*, u.email, u.first_name, u.last_name, u.is_active
             FROM parents p
             JOIN users u ON p.user_id = u.id
             JOIN student_parents sp ON p.id = sp.parent_id
             WHERE sp.student_id = ?
             ORDER BY u.last_name, u.first_name`,
            [studentId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find parents by student: ${error.message}`);
    }
};

export const addStudentParent = async (parentId, studentId, relationshipType = 'PRIMARY') => {
    try {
        const [result] = await db.execute(
            `INSERT INTO student_parents (parent_id, student_id, relationship_type, created_at)
             VALUES (?, ?, ?, NOW())`,
            [parentId, studentId, relationshipType]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to add student parent: ${error.message}`);
    }
};

export const removeStudentParent = async (parentId, studentId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM student_parents WHERE parent_id = ? AND student_id = ?',
            [parentId, studentId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to remove student parent: ${error.message}`);
    }
};

export const getChildren = async (parentId) => {
    try {
        const [rows] = await db.query(
            `SELECT DISTINCT s.*, u.first_name, u.last_name, u.email,
                    c.name as class_name, sp.relationship_type
             FROM students s
             JOIN users u ON s.user_id = u.id
             LEFT JOIN classes c ON s.class_id = c.id
             JOIN student_parents sp ON s.id = sp.student_id
             WHERE sp.parent_id = ?
             ORDER BY u.first_name, u.last_name`,
            [parentId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to get parent's children: ${error.message}`);
    }
};

export const update = async (parentId, updates) => {
    const allowedFields = ['occupation', 'phone', 'address', 'relationship_type'];
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
    updateValues.push(parentId);

    try {
        const [result] = await db.execute(
            `UPDATE parents SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update parent: ${error.message}`);
    }
};

export const deleteParent = async (parentId) => {
    try {
        // First delete all parent-student relationships
        await db.execute('DELETE FROM student_parents WHERE parent_id = ?', [parentId]);
        // Then delete the parent
        const [result] = await db.execute(
            'DELETE FROM parents WHERE id = ?',
            [parentId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete parent: ${error.message}`);
    }
};

export const getCountBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM parents WHERE school_id = ?',
            [schoolId]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count parents: ${error.message}`);
    }
};

export const getCountByRelationship = async (schoolId, relationshipType) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM parents WHERE school_id = ? AND relationship_type = ?',
            [schoolId, relationshipType]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count parents by relationship: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findByUserId,
    findBySchool,
    findByStudent,
    addStudentParent,
    removeStudentParent,
    getChildren,
    update,
    deleteParent,
    getCountBySchool,
    getCountByRelationship
};
