import db from '../config/database.js'

export const create = async (license) => {
    const [result] = await db.execute('INSERT INTO license (school_id, type, status, start_date, end_date, max_student) VALUES (?, ?, ?, ?, ?, ?)', [
        license.school_id,
        license.type,
        license.status,
        license.start_date,
        license.end_date,
        license.max_student
    ])
    return { id: result.insertId, ...license }
}

export const isValid = async (school_id) => {
    const [rows] = await db.execute('SELECT * FROM license WHERE school_id = ? AND status = "ACTIVE" AND end_date >= NOW()', [school_id])
    return rows.length > 0
}