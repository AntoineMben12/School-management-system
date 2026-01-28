import db from '../config/database.js';

const Marks = async (marks) => {
    const sql = 'INSERT INTO marks (student_id, subject_id, teacher_id, classes_id, ca, mark_subtracted_class, mark_added_class, sn, final_mark, term_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    return db.query(sql, [marks.student_id, marks.subject_id, marks.teacher_id, marks.classes_id, marks.ca, marks.mark_subtracted_class, marks.mark_added_class, marks.sn, marks.final_mark, marks.term_id]);
}

export default Marks;
