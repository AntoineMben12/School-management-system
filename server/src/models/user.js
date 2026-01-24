const db = require("../config/database.js");

exports.User = async (user) => {
    const sql = 'INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)';

    return db.query(sql, [user.name, user.email, user.password, user.role]);
} 