import db from '../config/database.js'

/**
 * School Model - Handle all school database operations
 */

export const create = async (schoolData) => {
    const { name, subdomain, contact_email, address, logo_url, type } = schoolData;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO schools (name, subdomain, contact_email, address, logo_url, type)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, subdomain || null, contact_email, address || null, logo_url || null, type]
        );
        return { school_id: result.insertId, ...schoolData };
    } catch (error) {
        throw new Error(`Failed to create school: ${error.message}`);
    }
}

export const findById = async (school_id) => {
    const [rows] = await db.query(
        `SELECT * FROM schools WHERE school_id = ?`,
        [school_id]
    );
    return rows[0] || null;
}

export const findBySubdomain = async (subdomain) => {
    const [rows] = await db.query(
        `SELECT * FROM schools WHERE subdomain = ?`,
        [subdomain]
    );
    return rows[0] || null;
}

export const getAll = async () => {
    const [rows] = await db.query(
        `SELECT * FROM schools ORDER BY created_at DESC`
    );
    return rows;
}

export const getSchoolStats = async (school_id) => {
    const [rows] = await db.query(
        `SELECT 
            (SELECT COUNT(*) FROM students WHERE school_id = ?) as total_students,
            (SELECT COUNT(*) FROM teachers WHERE school_id = ?) as total_teachers,
            (SELECT COUNT(*) FROM classes WHERE school_id = ?) as total_classes,
            (SELECT COUNT(*) FROM subjects WHERE school_id = ?) as total_subjects
         FROM schools WHERE school_id = ?`,
        [school_id, school_id, school_id, school_id, school_id]
    );
    return rows[0] || null;
}

export const update = async (school_id, updates) => {
    const allowedFields = ['name', 'contact_email', 'address', 'logo_url', 'type'];
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(school_id);
    const [result] = await db.execute(
        `UPDATE schools SET ${fields.join(', ')} WHERE school_id = ?`,
        values
    );
    return result;
}

export const deleteSchool = async (school_id) => {
    const [result] = await db.execute(
        `DELETE FROM schools WHERE school_id = ?`,
        [school_id]
    );
    return result;
}

export default { create, findById, findBySubdomain, getAll, getSchoolStats, update, deleteSchool };