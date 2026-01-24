const db = require('../config/database.js');

exports.Student = async (student) => {
    const sql = 'INSERT INTO student (user_id, class_id, matricule, gender, school_id) VALUES (?, ?, ?, ?, ?)';

    return db.query(sql, [student.user_id, student.class_id, student.matricule, student.gender, student.school_id]);
}