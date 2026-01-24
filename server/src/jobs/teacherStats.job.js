import { cron } from "node-cron";
import { Teacher } from "../models/teacher.model.js";

cron.schedule("0 2 * * SUN", () => {
    console.log("Running weekly teacher stats job")
    const teachers = Teacher.find()
    teachers.forEach((teacher) => {
        const marks = Mark.find({ teacher_id: teacher._id })
        const totalMarks = marks.reduce((total, mark) => total + mark.final_mark, 0)
        const averageMarks = totalMarks / marks.length
        teacher.average_marks = averageMarks
        teacher.save()
    })
})