import db from '../config/database.js';

/**
 * Student Service
 * Handles student-specific operations
 */
class StudentService {
    /**
     * Get student profile with user information
     * @param {Object} user - Authenticated user object from JWT
     * @returns {Object} Student profile data
     */
    static async getProfile(user) {
        const [students] = await db.query(
            `SELECT 
                s.student_id, s.admission_number, s.first_name, s.last_name, 
                s.dob, s.gender, s.enrollment_date,
                u.username, u.email, u.is_active, u.last_login,
                c.name as class_name, c.level as class_level,
                p.father_name, p.mother_name, p.phone as parent_phone,
                sch.name as school_name, sch.type as school_type
             FROM students s
             INNER JOIN users u ON s.user_id = u.user_id
             LEFT JOIN classes c ON s.current_class_id = c.class_id
             LEFT JOIN parents p ON s.parent_id = p.parent_id
             LEFT JOIN schools sch ON s.school_id = sch.school_id
             WHERE s.user_id = ? AND s.school_id = ?`,
            [user.user_id, user.school_id]
        );

        if (students.length === 0) {
            throw new Error('Student profile not found');
        }

        return students[0];
    }

    /**
     * Update student profile
     * @param {Object} user - Authenticated user object from JWT
     * @param {Object} updateData - Data to update
     * @returns {Object} Success message
     */
    static async updateProfile(user, updateData) {
        const { first_name, last_name, dob, gender, phone } = updateData;

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // Update student table
            const studentUpdates = [];
            const studentValues = [];

            if (first_name) {
                studentUpdates.push('first_name = ?');
                studentValues.push(first_name);
            }
            if (last_name) {
                studentUpdates.push('last_name = ?');
                studentValues.push(last_name);
            }
            if (dob) {
                studentUpdates.push('dob = ?');
                studentValues.push(dob);
            }
            if (gender) {
                studentUpdates.push('gender = ?');
                studentValues.push(gender);
            }

            if (studentUpdates.length > 0) {
                studentValues.push(user.user_id, user.school_id);
                await connection.query(
                    `UPDATE students SET ${studentUpdates.join(', ')} 
                     WHERE user_id = ? AND school_id = ?`,
                    studentValues
                );
            }

            await connection.commit();

            return { message: 'Profile updated successfully' };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Get student's marks for all subjects
     * @param {Object} user - Authenticated user object from JWT
     * @param {number} termId - Optional term ID filter
     * @returns {Array} List of marks
     */
    static async getMyMarks(user, termId = null) {
        let query = `
            SELECT 
                m.mark_id, m.score_obtained, m.is_absent, m.remarks,
                a.name as assessment_name, a.max_marks, a.weightage, a.due_date,
                s.name as subject_name, s.code as subject_code,
                t.name as term_name,
                CONCAT(teach.first_name, ' ', teach.last_name) as teacher_name
            FROM marks m
            INNER JOIN assessments a ON m.assessment_id = a.assessment_id
            INNER JOIN course_offerings co ON a.offering_id = co.offering_id
            INNER JOIN subjects s ON co.subject_id = s.subject_id
            INNER JOIN terms t ON co.term_id = t.term_id
            LEFT JOIN teachers teach ON co.teacher_id = teach.teacher_id
            INNER JOIN students st ON m.student_id = st.student_id
            WHERE st.user_id = ? AND st.school_id = ?`;

        const params = [user.user_id, user.school_id];

        if (termId) {
            query += ' AND co.term_id = ?';
            params.push(termId);
        }

        query += ' ORDER BY t.term_id DESC, s.name, a.due_date DESC';

        const [marks] = await db.query(query, params);

        return marks;
    }

    /**
     * Get student's attendance records
     * @param {Object} user - Authenticated user object from JWT
     * @param {number} termId - Optional term ID filter
     * @returns {Array} List of attendance records
     */
    static async getMyAttendance(user, termId = null) {
        let query = `
            SELECT 
                att.attendance_id, att.date, att.status,
                s.name as subject_name, s.code as subject_code,
                t.name as term_name,
                CONCAT(teach.first_name, ' ', teach.last_name) as teacher_name
            FROM attendance att
            INNER JOIN course_offerings co ON att.offering_id = co.offering_id
            INNER JOIN subjects s ON co.subject_id = s.subject_id
            INNER JOIN terms t ON co.term_id = t.term_id
            LEFT JOIN teachers teach ON co.teacher_id = teach.teacher_id
            INNER JOIN students st ON att.student_id = st.student_id
            WHERE st.user_id = ? AND st.school_id = ?`;

        const params = [user.user_id, user.school_id];

        if (termId) {
            query += ' AND co.term_id = ?';
            params.push(termId);
        }

        query += ' ORDER BY att.date DESC, s.name';

        const [attendance] = await db.query(query, params);

        // Calculate attendance statistics
        const stats = {
            total: attendance.length,
            present: attendance.filter(a => a.status === 'present').length,
            absent: attendance.filter(a => a.status === 'absent').length,
            late: attendance.filter(a => a.status === 'late').length,
            excused: attendance.filter(a => a.status === 'excused').length
        };

        stats.attendance_percentage = stats.total > 0
            ? ((stats.present + stats.late) / stats.total * 100).toFixed(2)
            : 0;

        return {
            records: attendance,
            statistics: stats
        };
    }

    /**
     * Get student's report card for a specific term
     * @param {Object} user - Authenticated user object from JWT
     * @param {number} termId - Term ID
     * @returns {Object} Report card data
     */
    static async getMyReportCard(user, termId) {
        if (!termId) {
            throw new Error('Term ID is required');
        }

        // Get student info
        const [students] = await db.query(
            `SELECT s.student_id, s.first_name, s.last_name, s.admission_number,
                    c.name as class_name, sch.name as school_name
             FROM students s
             LEFT JOIN classes c ON s.current_class_id = c.class_id
             LEFT JOIN schools sch ON s.school_id = sch.school_id
             WHERE s.user_id = ? AND s.school_id = ?`,
            [user.user_id, user.school_id]
        );

        if (students.length === 0) {
            throw new Error('Student not found');
        }

        const student = students[0];

        // Get all marks for the term
        const [marks] = await db.query(
            `SELECT 
                s.name as subject_name, s.code as subject_code, s.credits,
                a.name as assessment_name, a.max_marks, a.weightage,
                m.score_obtained, m.is_absent,
                CONCAT(t.first_name, ' ', t.last_name) as teacher_name
             FROM student_enrollments se
             INNER JOIN course_offerings co ON se.offering_id = co.offering_id
             INNER JOIN subjects s ON co.subject_id = s.subject_id
             LEFT JOIN teachers t ON co.teacher_id = t.teacher_id
             LEFT JOIN assessments a ON a.offering_id = co.offering_id
             LEFT JOIN marks m ON m.assessment_id = a.assessment_id AND m.student_id = se.student_id
             WHERE se.student_id = ? AND co.term_id = ?
             ORDER BY s.name, a.name`,
            [student.student_id, termId]
        );

        // Group marks by subject
        const subjectMap = {};
        marks.forEach(mark => {
            if (!subjectMap[mark.subject_code]) {
                subjectMap[mark.subject_code] = {
                    subject_name: mark.subject_name,
                    subject_code: mark.subject_code,
                    credits: mark.credits,
                    teacher_name: mark.teacher_name,
                    assessments: [],
                    total_score: 0,
                    total_max: 0
                };
            }

            if (mark.assessment_name) {
                subjectMap[mark.subject_code].assessments.push({
                    assessment_name: mark.assessment_name,
                    max_marks: mark.max_marks,
                    weightage: mark.weightage,
                    score_obtained: mark.score_obtained,
                    is_absent: mark.is_absent
                });

                if (!mark.is_absent && mark.score_obtained !== null) {
                    subjectMap[mark.subject_code].total_score += parseFloat(mark.score_obtained);
                    subjectMap[mark.subject_code].total_max += parseFloat(mark.max_marks);
                }
            }
        });

        // Calculate grades and overall statistics
        const subjects = Object.values(subjectMap);
        let totalPercentage = 0;
        let subjectCount = 0;

        subjects.forEach(subject => {
            if (subject.total_max > 0) {
                subject.percentage = ((subject.total_score / subject.total_max) * 100).toFixed(2);
                subject.grade = this.calculateGrade(subject.percentage);
                totalPercentage += parseFloat(subject.percentage);
                subjectCount++;
            } else {
                subject.percentage = 0;
                subject.grade = 'N/A';
            }
        });

        const overallPercentage = subjectCount > 0
            ? (totalPercentage / subjectCount).toFixed(2)
            : 0;

        return {
            student: {
                name: `${student.first_name} ${student.last_name}`,
                admission_number: student.admission_number,
                class: student.class_name,
                school: student.school_name
            },
            subjects: subjects,
            overall: {
                percentage: overallPercentage,
                grade: this.calculateGrade(overallPercentage),
                total_subjects: subjectCount
            }
        };
    }

    /**
     * Get student's invoices and payment history
     * @param {Object} user - Authenticated user object from JWT
     * @param {string} status - Optional status filter (unpaid, partial, paid, overdue)
     * @returns {Array} List of invoices
     */
    static async getMyInvoices(user, status = null) {
        let query = `
            SELECT 
                i.invoice_id, i.title, i.total_amount, i.paid_amount, 
                i.status, i.due_date, i.created_at,
                (i.total_amount - i.paid_amount) as balance
            FROM invoices i
            INNER JOIN students s ON i.student_id = s.student_id
            WHERE s.user_id = ? AND s.school_id = ?`;

        const params = [user.user_id, user.school_id];

        if (status) {
            query += ' AND i.status = ?';
            params.push(status);
        }

        query += ' ORDER BY i.due_date DESC, i.created_at DESC';

        const [invoices] = await db.query(query, params);

        // Get payment details for each invoice
        for (const invoice of invoices) {
            const [payments] = await db.query(
                `SELECT payment_id, amount, payment_date, method, transaction_reference
                 FROM payments
                 WHERE invoice_id = ?
                 ORDER BY payment_date DESC`,
                [invoice.invoice_id]
            );
            invoice.payments = payments;
        }

        // Calculate summary
        const summary = {
            total_invoices: invoices.length,
            total_amount: invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0),
            total_paid: invoices.reduce((sum, inv) => sum + parseFloat(inv.paid_amount), 0),
            total_balance: invoices.reduce((sum, inv) => sum + parseFloat(inv.balance), 0),
            unpaid_count: invoices.filter(inv => inv.status === 'unpaid').length,
            overdue_count: invoices.filter(inv => inv.status === 'overdue').length
        };

        return {
            invoices: invoices,
            summary: summary
        };
    }

    /**
     * Calculate grade based on percentage
     * @param {number} percentage - Percentage score
     * @returns {string} Grade letter
     */
    static calculateGrade(percentage) {
        const score = parseFloat(percentage);
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        if (score >= 50) return 'E';
        return 'F';
    }
}

export default StudentService;
