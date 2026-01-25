import pool from '../config/database.js';

class GradingService {

    /**
     * Calculate the final mark for a specific subject enrollment.
     * Handles both University and Secondary logic based on School Type.
     */
    static async calculateSubjectMark(enrollmentId, schoolType) {
        // 1. Fetch all raw marks for this enrollment
        const [marks] = await pool.query(
            `SELECT m.score_obtained, m.is_absent, a.name as assessment_name, a.weightage 
             FROM marks m
             JOIN assessments a ON m.assessment_id = a.assessment_id
             WHERE m.student_id = (SELECT student_id FROM student_enrollments WHERE enrollment_id = ?)
             AND a.offering_id = (SELECT offering_id FROM student_enrollments WHERE enrollment_id = ?)`,
            [enrollmentId, enrollmentId]
        );

        if (schoolType === 'university') {
            return this._calculateUniversityFormat(marks);
        } else {
            return this._calculateSecondaryFormat(marks);
        }
    }

    /**
     * University Formula:
     * Final = (CA * 0.4) + (Exam * 0.6) + (Bonus - Penalty)
     * Note: In our schema, Bonus/Penalty might be separate columns or specific assessment types.
     * Let's assume they are stored as specific assessment names or types for this implementation.
     */
    static _calculateUniversityFormat(marks) {
        let ca = 0;
        let exam = 0;
        let bonus = 0;
        let penalty = 0;

        for (const m of marks) {
            if (m.is_absent) continue; // Treat as 0

            const name = m.assessment_name.toLowerCase();
            const score = parseFloat(m.score_obtained) || 0;

            if (name.includes('ca') || name.includes('continuous')) {
                ca = score; // Assuming CA is already aggregated or single entry
            } else if (name.includes('exam') || name.includes('final')) {
                exam = score;
            } else if (name.includes('bonus')) {
                bonus += score;
            } else if (name.includes('penalty')) {
                penalty += score;
            }
        }

        // Formula: ((CA * 40/100 + (added – subtracted)) + (SN * 60/100))
        // Note: If CA is out of 20 or 100, we need to normalize. 
        // Assuming inputs are normalized to 100 before storage or are raw scores.
        // Let's assume raw scores out of 100.

        const weightedCA = ca * 0.40;
        const weightedExam = exam * 0.60;
        const netAdjustment = bonus - penalty;

        let finalMark = weightedCA + netAdjustment + weightedExam;

        // Clamp
        return Math.min(Math.max(finalMark, 0), 100).toFixed(2);
    }

    /**
     * Secondary School Formula:
     * Average of Sequences or Term Weights
     */
    static _calculateSecondaryFormat(marks) {
        let totalWeightedScore = 0;
        let totalWeight = 0;

        for (const m of marks) {
            if (m.is_absent) continue;

            const score = parseFloat(m.score_obtained) || 0;
            const weight = parseFloat(m.weightage) || 0; // e.g., 1.0 for equal weight

            totalWeightedScore += score * weight;
            totalWeight += weight;
        }

        if (totalWeight === 0) return 0.00;

        return (totalWeightedScore / totalWeight).toFixed(2);
    }

    /**
     * Generates the full report card data for a student in a term.
     */
    static async generateReportCardData(studentId, termId) {
        // 1. Get Student Info & School Type
        const [studentRows] = await pool.query(
            `SELECT s.first_name, s.last_name, sch.type as school_type, c.name as class_name
             FROM students s
             JOIN schools sch ON s.school_id = sch.school_id
             JOIN classes c ON s.current_class_id = c.class_id
             WHERE s.student_id = ?`,
            [studentId]
        );
        const student = studentRows[0];

        // 2. Get All Subjects & Marks
        const [subjects] = await pool.query(
            `SELECT sub.name as subject, sub.code, sub.credits,
                    m.score_obtained, m.is_absent, a.name as assessment_type, a.weightage
             FROM student_enrollments se
             JOIN course_offerings co ON se.offering_id = co.offering_id
             JOIN subjects sub ON co.subject_id = sub.subject_id
             JOIN assessments a ON co.offering_id = a.offering_id
             LEFT JOIN marks m ON a.assessment_id = m.assessment_id AND m.student_id = ?
             WHERE se.student_id = ? AND co.term_id = ?`,
            [studentId, studentId, termId]
        );

        // 3. Aggregate per Subject
        const subjectMap = {};
        for (const row of subjects) {
            if (!subjectMap[row.code]) {
                subjectMap[row.code] = {
                    name: row.subject,
                    code: row.code,
                    credits: row.credits,
                    marks: []
                };
            }
            subjectMap[row.code].marks.push(row);
        }

        // 4. Calculate Final Grades
        const reportCard = {
            student: student,
            subjects: [],
            summary: {
                total_score: 0,
                average: 0,
                gpa: 0 // Only for University
            }
        };

        let totalPoints = 0;
        let totalCredits = 0;

        for (const code in subjectMap) {
            const subject = subjectMap[code];
            let finalMark = 0;

            if (student.school_type === 'university') {
                finalMark = this._calculateUniversityFormat(subject.marks);
                // Calculate GPA Points (Example: A=4.0 for >80)
                const points = this._getGPAPoints(finalMark);
                totalPoints += points * subject.credits;
                totalCredits += subject.credits;
                subject.grade = this._getLetterGrade(finalMark);
            } else {
                finalMark = this._calculateSecondaryFormat(subject.marks);
            }

            subject.final_mark = finalMark;
            reportCard.subjects.push(subject);
            reportCard.summary.total_score += parseFloat(finalMark);
        }

        // 5. Final Averages
        if (reportCard.subjects.length > 0) {
            reportCard.summary.average = (reportCard.summary.total_score / reportCard.subjects.length).toFixed(2);
            if (student.school_type === 'university' && totalCredits > 0) {
                reportCard.summary.gpa = (totalPoints / totalCredits).toFixed(2);
            }
        }

        return reportCard;
    }

    static _getGPAPoints(mark) {
        if (mark >= 80) return 4.0;
        if (mark >= 70) return 3.5;
        if (mark >= 60) return 3.0;
        if (mark >= 50) return 2.5;
        if (mark >= 40) return 2.0;
        return 0.0;
    }

    static _getLetterGrade(mark) {
        if (mark >= 80) return 'A';
        if (mark >= 70) return 'B+';
        if (mark >= 60) return 'B';
        if (mark >= 50) return 'C+';
        if (mark >= 40) return 'C';
        return 'F';
    }
}

export default GradingService;
