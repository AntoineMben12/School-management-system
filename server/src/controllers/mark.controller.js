import { calculateTotalMark } from "../services/markCalculation.js";
import Marks from "../models/marks.js";

export const addMark = async (req, res) => {
    try {
        const { student_id, subject_id, teacher_id, classes_id, ca, mark_subtracted_class, mark_added_class, sn, final_mark, term_id } = req.body;
        const finalMark = calculateTotalMark(ca, sn, mark_added_class, mark_subtracted_class);
        const mark = await Marks.create({ student_id, subject_id, teacher_id, classes_id, ca, mark_subtracted_class, mark_added_class, sn, final_mark, term_id });
        res.status(201).json(mark);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}