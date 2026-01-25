import pool from '../config/database.js';
import { TIMETABLE_GENERATION_PROMPT } from '../ai/prompt.templates.js';

class TimetableGeneratorService {

    /**
     * Main entry point to generate a timetable for a school.
     */
    static async generateTimetable(schoolId, termId) {
        // 1. Fetch Resources
        const resources = await this._fetchResources(schoolId, termId);

        // 2. Prepare Prompt
        const prompt = this._fillPrompt(TIMETABLE_GENERATION_PROMPT, resources);

        // 3. Call AI
        const rawSchedule = await this._mockAICall(prompt);

        // 4. Validate Constraints (Post-Processing)
        const validation = this._validateSchedule(rawSchedule, resources);

        if (!validation.isValid) {
            return {
                status: 'failed',
                errors: validation.errors,
                partial_schedule: rawSchedule
            };
        }

        // 5. Save to Database (if valid)
        // await this._saveTimetable(rawSchedule, termId);

        return {
            status: 'success',
            schedule: rawSchedule
        };
    }

    static async _fetchResources(schoolId, termId) {
        const connection = await pool.getConnection();
        try {
            // Fetch Classes
            const [classes] = await connection.query(
                'SELECT class_id as id, name FROM classes WHERE school_id = ?',
                [schoolId]
            );

            // Fetch Teachers & their subjects
            const [teachers] = await connection.query(
                `SELECT t.teacher_id as id, t.first_name as name, 
                 GROUP_CONCAT(s.name) as subjects
                 FROM teachers t
                 LEFT JOIN course_offerings co ON t.teacher_id = co.teacher_id
                 LEFT JOIN subjects s ON co.subject_id = s.subject_id
                 WHERE t.school_id = ?
                 GROUP BY t.teacher_id`,
                [schoolId]
            );

            // Fetch Rooms (Mocked as we didn't create a rooms table yet, assuming standard rooms)
            const rooms = [
                { id: 'R1', capacity: 40 },
                { id: 'R2', capacity: 40 },
                { id: 'Lab1', capacity: 20 }
            ];

            // Define Slots
            const slots = [
                "Mon 08:00-09:00", "Mon 09:00-10:00", "Mon 10:00-11:00",
                "Tue 08:00-09:00", "Tue 09:00-10:00"
            ];

            return { classes, teachers, rooms, slots };
        } finally {
            connection.release();
        }
    }

    static _fillPrompt(template, data) {
        return template
            .replace('{{classes}}', JSON.stringify(data.classes))
            .replace('{{teachers}}', JSON.stringify(data.teachers))
            .replace('{{rooms}}', JSON.stringify(data.rooms))
            .replace('{{slots}}', JSON.stringify(data.slots));
    }

    static async _mockAICall(prompt) {
        console.log('Timetable Prompt Size:', prompt.length);
        // Mock Response
        return [
            { class_id: 1, subject: "Math", teacher_id: 101, room_id: "R1", day: "Mon", time: "08:00-09:00" },
            { class_id: 1, subject: "English", teacher_id: 102, room_id: "R1", day: "Mon", time: "09:00-10:00" },
            { class_id: 2, subject: "Science", teacher_id: 103, room_id: "Lab1", day: "Mon", time: "08:00-09:00" }
        ];
    }

    static _validateSchedule(schedule, resources) {
        const errors = [];
        const teacherSlots = new Set();
        const roomSlots = new Set();
        const classSlots = new Set();

        for (const session of schedule) {
            const timeKey = `${session.day} ${session.time}`;

            // 1. Teacher Overlap
            const tKey = `${session.teacher_id}-${timeKey}`;
            if (teacherSlots.has(tKey)) errors.push(`Teacher ${session.teacher_id} double booked at ${timeKey}`);
            teacherSlots.add(tKey);

            // 2. Room Overlap
            const rKey = `${session.room_id}-${timeKey}`;
            if (roomSlots.has(rKey)) errors.push(`Room ${session.room_id} double booked at ${timeKey}`);
            roomSlots.add(rKey);

            // 3. Class Overlap
            const cKey = `${session.class_id}-${timeKey}`;
            if (classSlots.has(cKey)) errors.push(`Class ${session.class_id} double booked at ${timeKey}`);
            classSlots.add(cKey);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export default TimetableGeneratorService;