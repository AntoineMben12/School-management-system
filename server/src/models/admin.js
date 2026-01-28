import db from '../config/database.js'
import bcrypt from 'bcrypt'

export const create = async (admin) => {
    const hashedPassword = await bcrypt.hash(admin.password, 10)
    const [result] = await db.execute('INSERT INTO admin (name, email, password, role, school_id) VALUES (?,?,?,?,?)', [
        admin.name,
        admin.email,
        hashedPassword,
        'ADMIN',
        admin.school_id
    ])
    return { id: result.insertId, ...admin }
}