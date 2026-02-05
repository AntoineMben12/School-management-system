import db from '../config/database.js';

/**
 * Subject Model - Handle all subject database operations
 */

export const create = async (subjectData) => {
    const { school_id, name, code, credits = 1.0, is_elective = false } = subjectData;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO subjects (school_id, name, code, credits, is_elective)
             VALUES (?, ?, ?, ?, ?)`,
            [school_id, name, code || null, credits, is_elective]
        );
        return { subject_id: result.insertId, ...subjectData };
    } catch (error) {
        throw new Error(`Failed to create subject: ${error.message}`);
    }
};

export const findById = async (subject_id) => {
    const [rows] = await db.query(
        `SELECT * FROM subjects WHERE subject_id = ?`,
        [subject_id]
    );
    return rows[0] || null;
};

export const findBySchool = async (school_id, is_elective = null) => {
    let sql = `SELECT * FROM subjects WHERE school_id = ?`;
    const params = [school_id];

    if (is_elective !== null) {
        sql += ' AND is_elective = ?';
        params.push(is_elective);
    }

    sql += ' ORDER BY name';
    const [rows] = await db.query(sql, params);
    return rows;
};

export const update = async (subject_id, updates) => {
    const allowedFields = ['name', 'code', 'credits', 'is_elective'];
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(subject_id);
    const [result] = await db.execute(
        `UPDATE subjects SET ${fields.join(', ')} WHERE subject_id = ?`,
        values
    );
    return result;
};

export const deleteSubject = async (subject_id) => {
    const [result] = await db.execute(
        `DELETE FROM subjects WHERE subject_id = ?`,
        [subject_id]
    );
    return result;
};

export default { create, findById, findBySchool, update, deleteSubject };
