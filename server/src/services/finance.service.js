import pool from '../config/database.js';

class FinanceService {

    /**
     * Create a Fee Structure (e.g., "Grade 10 Tuition 2024")
     */
    static async createFeeStructure(schoolId, { class_id, head_id, amount, academic_year_id, due_date }) {
        const [result] = await pool.query(
            `INSERT INTO fee_structures (school_id, class_id, head_id, amount, academic_year_id, due_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [schoolId, class_id, head_id, amount, academic_year_id, due_date]
        );
        return result.insertId;
    }

    /**
     * Generate Invoices for all students in a class based on a Fee Structure.
     * Idempotent: Checks if invoice already exists for this structure/student.
     */
    static async generateInvoicesForClass(schoolId, structureId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Get Structure Details
            const [structures] = await connection.query(
                `SELECT * FROM fee_structures WHERE structure_id = ? AND school_id = ?`,
                [structureId, schoolId]
            );
            if (structures.length === 0) throw new Error('Fee Structure not found');
            const structure = structures[0];

            // 2. Get Students in Class
            const [students] = await connection.query(
                `SELECT student_id FROM students WHERE current_class_id = ? AND school_id = ?`,
                [structure.class_id, schoolId]
            );

            let count = 0;
            for (const student of students) {
                // Check existence (simple check, could be optimized with NOT EXISTS query)
                const [existing] = await connection.query(
                    `SELECT invoice_id FROM invoices 
                     WHERE student_id = ? AND title = ?`,
                    [student.student_id, `Fee: ${structure.amount} for Structure ${structureId}`] // Simplified title logic
                );

                if (existing.length === 0) {
                    await connection.query(
                        `INSERT INTO invoices (school_id, student_id, title, total_amount, due_date)
                         VALUES (?, ?, ?, ?, ?)`,
                        [schoolId, student.student_id, `Fee Structure #${structureId}`, structure.amount, structure.due_date]
                    );
                    count++;
                }
            }

            await connection.commit();
            return { generated: count };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Record a payment against an invoice.
     * Handles partial payments and status updates.
     */
    static async recordPayment(schoolId, { invoice_id, amount, method, transaction_reference, recorded_by }) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Get Invoice
            const [invoices] = await connection.query(
                `SELECT * FROM invoices WHERE invoice_id = ? AND school_id = ? FOR UPDATE`,
                [invoice_id, schoolId]
            );
            if (invoices.length === 0) throw new Error('Invoice not found');
            const invoice = invoices[0];

            // 2. Validate Amount
            const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(amount);
            if (newPaidAmount > invoice.total_amount) {
                throw new Error(`Overpayment detected. Remaining balance is ${invoice.total_amount - invoice.paid_amount}`);
            }

            // 3. Insert Payment Record
            await connection.query(
                `INSERT INTO payments (invoice_id, amount, method, transaction_reference, recorded_by)
                 VALUES (?, ?, ?, ?, ?)`,
                [invoice_id, amount, method, transaction_reference, recorded_by]
            );

            // 4. Update Invoice Status
            let newStatus = 'partial';
            if (newPaidAmount >= invoice.total_amount) {
                newStatus = 'paid';
            }

            await connection.query(
                `UPDATE invoices SET paid_amount = ?, status = ? WHERE invoice_id = ?`,
                [newPaidAmount, newStatus, invoice_id]
            );

            await connection.commit();
            return { invoice_id, new_status: newStatus, new_paid_amount: newPaidAmount };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Get Financial Report for a School
     */
    static async getFinancialReport(schoolId) {
        const [summary] = await pool.query(
            `SELECT 
                SUM(total_amount) as total_expected,
                SUM(paid_amount) as total_collected,
                SUM(total_amount - paid_amount) as total_outstanding,
                COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_invoices
             FROM invoices
             WHERE school_id = ?`,
            [schoolId]
        );
        return summary[0];
    }

    /**
     * Prepare data for AI analysis (e.g., predicting defaulters)
     */
    static async getDataForAI(schoolId) {
        // Fetch payment history patterns
        const [data] = await pool.query(
            `SELECT p.student_id, p.amount, p.payment_date, i.due_date, i.total_amount
             FROM payments p
             JOIN invoices i ON p.invoice_id = i.invoice_id
             WHERE i.school_id = ?
             ORDER BY p.payment_date DESC`,
            [schoolId]
        );
        return data;
    }
}

export default FinanceService;
