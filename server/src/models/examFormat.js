import db from '../config/database.js';

/**
 * Exam Format Model - Comprehensive CRUD operations
 * Manages grading systems, exam formats, and assessment configurations
 */

export const create = async (formatData) => {
    const { school_id, name, grading_system, max_score, pass_mark, is_active } = formatData;
    const gradingSystemJson = typeof grading_system === 'string'
        ? grading_system
        : JSON.stringify(grading_system);

    try {
        const [result] = await db.execute(
            `INSERT INTO exam_formats (school_id, name, grading_system, max_score, pass_mark, is_active, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [school_id, name, gradingSystemJson, max_score || 100, pass_mark || 40, is_active !== false]
        );
        return { id: result.insertId, ...formatData };
    } catch (error) {
        throw new Error(`Failed to create exam format: ${error.message}`);
    }
};

export const findById = async (formatId) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM exam_formats WHERE id = ?',
            [formatId]
        );

        if (!rows[0]) return null;

        const row = rows[0];
        return {
            ...row,
            grading_system: typeof row.grading_system === 'string'
                ? JSON.parse(row.grading_system)
                : row.grading_system
        };
    } catch (error) {
        throw new Error(`Failed to find exam format: ${error.message}`);
    }
};

export const findBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM exam_formats WHERE school_id = ? ORDER BY name`,
            [schoolId]
        );

        return rows.map(row => ({
            ...row,
            grading_system: typeof row.grading_system === 'string'
                ? JSON.parse(row.grading_system)
                : row.grading_system
        }));
    } catch (error) {
        throw new Error(`Failed to find exam formats by school: ${error.message}`);
    }
};

export const findActiveBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM exam_formats WHERE school_id = ? AND is_active = 1 ORDER BY name`,
            [schoolId]
        );

        return rows.map(row => ({
            ...row,
            grading_system: typeof row.grading_system === 'string'
                ? JSON.parse(row.grading_system)
                : row.grading_system
        }));
    } catch (error) {
        throw new Error(`Failed to find active exam formats: ${error.message}`);
    }
};

export const update = async (formatId, updates) => {
    const allowedFields = ['name', 'grading_system', 'max_score', 'pass_mark', 'is_active'];
    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            if (key === 'grading_system') {
                const gradingJson = typeof value === 'string' ? value : JSON.stringify(value);
                updateFields.push(`${key} = ?`);
                updateValues.push(gradingJson);
            } else {
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            }
        }
    }

    if (updateFields.length === 0) return { affectedRows: 0 };

    updateFields.push('updated_at = NOW()');
    updateValues.push(formatId);

    try {
        const [result] = await db.execute(
            `UPDATE exam_formats SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update exam format: ${error.message}`);
    }
};

export const deleteFormat = async (formatId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM exam_formats WHERE id = ?',
            [formatId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete exam format: ${error.message}`);
    }
};

export const getCountBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM exam_formats WHERE school_id = ?',
            [schoolId]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        throw new Error(`Failed to count exam formats: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findBySchool,
    findActiveBySchool,
    update,
    deleteFormat,
    getCountBySchool
};
