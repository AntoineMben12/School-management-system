import db from '../config/database.js'

export const create = async (school) => {
    const [result] = await db.execute('INSERT INTO school (name, code, type, status) VALUES (?, ?, ?, ?)', [
        school.name,
        school.code,
        school.type,
        'ACTIVE'
    ])
    return { id: result.insertId, ...school }
}

export const updateStatus = async (id, status) => {
    return await db.execute('UPDATE school SET status = ? WHERE id = ?', [status, id])
}

export const getGlobalStats = async () => {
    const [rows] = await db.execute('SELECT COUNT(*) as totalSchools, SUM(status = "ACTIVE") AS activeSchools FROM school')
    return rows[0]
}