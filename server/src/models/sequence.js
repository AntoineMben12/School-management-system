import db from '../config/database.js';

/**
 * Sequence Model - ID and number sequence generation
 * Manages auto-incrementing sequences for various document types
 */

export const create = async (sequenceData) => {
    const { school_id, sequence_type, prefix, current_value, increment_by } = sequenceData;
    try {
        const [result] = await db.execute(
            `INSERT INTO sequences (school_id, sequence_type, prefix, current_value, increment_by, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [school_id, sequence_type, prefix || '', current_value || 1, increment_by || 1]
        );
        return { id: result.insertId, ...sequenceData };
    } catch (error) {
        throw new Error(`Failed to create sequence: ${error.message}`);
    }
};

export const findById = async (sequenceId) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM sequences WHERE id = ?',
            [sequenceId]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find sequence: ${error.message}`);
    }
};

export const findByType = async (schoolId, sequenceType) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM sequences WHERE school_id = ? AND sequence_type = ?',
            [schoolId, sequenceType]
        );
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to find sequence by type: ${error.message}`);
    }
};

export const findBySchool = async (schoolId) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM sequences WHERE school_id = ? ORDER BY sequence_type',
            [schoolId]
        );
        return rows;
    } catch (error) {
        throw new Error(`Failed to find sequences by school: ${error.message}`);
    }
};

export const getNextValue = async (schoolId, sequenceType) => {
    try {
        const sequence = await findByType(schoolId, sequenceType);
        if (!sequence) {
            throw new Error(`Sequence not found for type: ${sequenceType}`);
        }

        const nextValue = sequence.current_value + (sequence.increment_by || 1);
        const formatted = sequence.prefix ? `${sequence.prefix}${nextValue}` : nextValue.toString();

        return { value: nextValue, formatted };
    } catch (error) {
        throw new Error(`Failed to get next value: ${error.message}`);
    }
};

export const incrementSequence = async (sequenceId, incrementBy = 1) => {
    try {
        const [result] = await db.execute(
            'UPDATE sequences SET current_value = current_value + ?, updated_at = NOW() WHERE id = ?',
            [incrementBy, sequenceId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to increment sequence: ${error.message}`);
    }
};

export const update = async (sequenceId, updates) => {
    const allowedFields = ['prefix', 'current_value', 'increment_by'];
    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
        }
    }

    if (updateFields.length === 0) return { affectedRows: 0 };

    updateFields.push('updated_at = NOW()');
    updateValues.push(sequenceId);

    try {
        const [result] = await db.execute(
            `UPDATE sequences SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to update sequence: ${error.message}`);
    }
};

export const deleteSequence = async (sequenceId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM sequences WHERE id = ?',
            [sequenceId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to delete sequence: ${error.message}`);
    }
};

export const resetSequence = async (sequenceId, startValue = 1) => {
    try {
        const [result] = await db.execute(
            'UPDATE sequences SET current_value = ?, updated_at = NOW() WHERE id = ?',
            [startValue, sequenceId]
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to reset sequence: ${error.message}`);
    }
};

export default {
    create,
    findById,
    findByType,
    findBySchool,
    getNextValue,
    incrementSequence,
    update,
    deleteSequence,
    resetSequence
};
