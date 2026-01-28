import db from "../config/database.js";

export const User = async (user) => {
    const sql = 'INSERT INTO user (name, email, password, role, school_id) VALUES (?, ?, ?, ?, ?)';

    return db.query(sql, [user.name, user.email, user.password, user.role, user.school_id]);
}

