import pool from '../config/database.js';
import { TEACHER_EVALUATION_PROMPT } from '../ai/prompt.templates.js';

class TeacherEvaluationService {

    /**
     * Aggregates data and generates an evaluation for a teacher.
     */
    static async evaluateTeacher(teacherId, termId) {
        const connection = await pool.getConnection();
        try {
            // 1. Fetch Teacher Details
            const [teacherRows] = await connection.query(
                'SELECT first_name, last_name FROM teachers WHERE teacher_id = ?',
                [teacherId]
            );
            const teacher = teacherRows[0];

            // 2. Academic Performance (Aggregated from Marks)
            // Get average score of students in subjects taught by this teacher
            const [academicStats] = await connection.query(
                `SELECT 
                    AVG(m.score_obtained) as class_average,
                    MAX(m.score_obtained) as highest_score,
                    MIN(m.score_obtained) as lowest_score,
                    COUNT(CASE WHEN m.score_obtained >= 50 THEN 1 END) * 100.0 / COUNT(*) as pass_rate
                 FROM marks m
                 JOIN course_offerings co ON m.assessment_id IN (SELECT assessment_id FROM assessments WHERE offering_id = co.offering_id)
                 WHERE co.teacher_id = ? AND co.term_id = ?`,
                [teacherId, termId]
            );
            const stats = academicStats[0] || {};

            // 3. Attendance & Workload
            const [attendanceStats] = await connection.query(
                `SELECT 
                    COUNT(*) as total_classes,
                    COUNT(CASE WHEN status = 'present' THEN 1 END) as attended,
                    COUNT(CASE WHEN status = 'absent' THEN 1 END) as missed,
                    COUNT(CASE WHEN status = 'late' THEN 1 END) as late
                 FROM teacher_attendance
                 WHERE teacher_id = ? AND attendance_date BETWEEN '2023-01-01' AND '2023-12-31'`, // Date range should be dynamic based on Term
                [teacherId]
            );
            const att = attendanceStats[0] || {};
            const attendanceRate = att.total_classes > 0 ? (att.attended / att.total_classes) * 100 : 0;

            // 4. Prepare Data for AI
            const evaluationData = {
                teacherName: `${teacher.first_name} ${teacher.last_name}`,
                subject: 'General', // Could be specific if looped per subject
                classAverage: parseFloat(stats.class_average || 0).toFixed(2),
                schoolAverage: 65.0, // Benchmark, ideally fetched from DB
                passRate: parseFloat(stats.pass_rate || 0).toFixed(2),
                highestScore: stats.highest_score || 0,
                lowestScore: stats.lowest_score || 0,
                attendanceRate: attendanceRate.toFixed(2),
                classesMissed: att.missed || 0,
                punctualityScore: att.late > 0 ? Math.max(10 - att.late, 0) : 10,
                assignedHours: att.total_classes || 0, // Proxy for hours
                teachingHours: att.attended || 0
            };

            // 5. Generate Prompt
            const prompt = this._fillPrompt(TEACHER_EVALUATION_PROMPT, evaluationData);

            // 6. Call AI (Mocked here)
            const aiResponse = await this._mockAICall(prompt);

            return {
                raw_data: evaluationData,
                ai_evaluation: aiResponse
            };

        } finally {
            connection.release();
        }
    }

    static _fillPrompt(template, data) {
        return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || 'N/A');
    }

    static async _mockAICall(prompt) {
        // In a real system, this would call OpenAI/Gemini API
        console.log('Generated Prompt:', prompt);
        return {
            performance_score: 85,
            strengths: ["High class pass rate", "Excellent punctuality", "Strong subject mastery"],
            weaknesses: ["Class average is slightly below school benchmark", "Few missed classes"],
            recommendations: ["Focus on underperforming students to boost average", "Maintain perfect attendance"],
            trend_analysis: "Performance is stable and consistent with previous terms."
        };
    }
}

export default TeacherEvaluationService;
