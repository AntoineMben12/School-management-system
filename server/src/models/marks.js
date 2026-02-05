import db from '../config/database.js';

/**
 * Marks Model - Handle all marks/assessment database operations
 */

/**
 * Create a mark entry
 */
export const create = async (markData) => {
    const { assessment_id, student_id, score_obtained, is_absent = false, remarks = null } = markData;
    
    try {
        const [result] = await db.execute(
            `INSERT INTO marks (assessment_id, student_id, score_obtained, is_absent, remarks)
             VALUES (?, ?, ?, ?, ?)`,
            [assessment_id, student_id, score_obtained || null, is_absent, remarks]
        );
        return { mark_id: result.insertId, ...markData };
    } catch (error) {
        throw new Error(`Failed to create mark: ${error.message}`);
    }
};

/**
 * Find mark by ID
 */
export const findById = async (mark_id) => {
    const [rows] = await db.query(
        `SELECT m.*, a.name as assessment_name, s.first_name, s.last_name
         FROM marks m
         JOIN assessments a ON m.assessment_id = a.assessment_id
         JOIN students s ON m.student_id = s.student_id
         WHERE m.mark_id = ?`,
        [mark_id]
    );
    return rows[0] || null;
};

/**
 * Find marks for a student in an assessment
 */
export const findByAssessmentAndStudent = async (assessment_id, student_id) => {
    const [rows] = await db.query(
        `SELECT * FROM marks WHERE assessment_id = ? AND student_id = ?`,
        [assessment_id, student_id]
    );
    return rows[0] || null;
};

/**
 * Find all marks for a student in a course offering
 */
export const findByStudent = async (student_id, offering_id) => {
    const [rows] = await db.query(
        `SELECT m.*, a.name as assessment_name, a.max_marks, a.weightage
         FROM marks m
         JOIN assessments a ON m.assessment_id = a.assessment_id
         WHERE m.student_id = ? AND a.offering_id = ?
         ORDER BY a.name`,
        [student_id, offering_id]
    );
    return rows;
};

/**
 * Find marks for an assessment
 */
export const findByAssessment = async (assessment_id) => {
    const [rows] = await db.query(
        `SELECT m.*, s.first_name, s.last_name, s.admission_number
         FROM marks m
         JOIN students s ON m.student_id = s.student_id
         WHERE m.assessment_id = ?
         ORDER BY s.last_name`,
        [assessment_id]
    );
    return rows;
};

/**
 * Update mark
 */
export const update = async (mark_id, updates) => {
    const allowedFields = ['score_obtained', 'is_absent', 'remarks'];
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(mark_id);
    const [result] = await db.execute(
        `UPDATE marks SET ${fields.join(', ')} WHERE mark_id = ?`,
        values
    );
    return result;
};

/**
 * Get statistics for an assessment
 */
export const getAssessmentStats = async (assessment_id) => {
    const [rows] = await db.query(
        `SELECT 
            COUNT(*) as total_entries,
            SUM(CASE WHEN is_absent = 0 THEN 1 ELSE 0 END) as present_count,
            AVG(score_obtained) as average_score,
            MIN(score_obtained) as min_score,
            MAX(score_obtained) as max_score,
            (SELECT max_marks FROM assessments WHERE assessment_id = ?) as max_marks
         FROM marks WHERE assessment_id = ?`,
        [assessment_id, assessment_id]
    );
    return rows[0] || null;
};

/**
 * Delete mark
 */
export const deleteMark = async (mark_id) => {
    const [result] = await db.execute(
        `DELETE FROM marks WHERE mark_id = ?`,
        [mark_id]
    );
    return result;
};

export default { create, findById, findByAssessmentAndStudent, findByStudent, findByAssessment, update, getAssessmentStats, deleteMark };
