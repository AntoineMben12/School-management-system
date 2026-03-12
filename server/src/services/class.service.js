import db from '../config/database.js';

class ClassService {
  /**
   * Get all classes for a school with student count
   */
  static async getAllClasses(schoolId, filters = {}) {
    try {
      let query = `
        SELECT
          c.class_id as id,
          c.name,
          c.level as grade,
          'A' as section,
          COUNT(s.student_id) as student_count
        FROM classes c
        LEFT JOIN students s ON c.class_id = s.current_class_id
        WHERE c.school_id = ?
      `;

      const params = [schoolId];

      if (filters.grade) {
        query += ` AND c.level = ?`;
        params.push(filters.grade);
      }

      if (filters.search) {
        query += ` AND c.name LIKE ?`;
        params.push(`%${filters.search}%`);
      }

      query += ` GROUP BY c.class_id ORDER BY c.level, c.name`;

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a single class by ID
   */
  static async getClassById(schoolId, classId) {
    try {
      const query = `
        SELECT
          c.class_id as id,
          c.name,
          c.level as grade,
          'A' as section,
          COUNT(s.student_id) as student_count
        FROM classes c
        LEFT JOIN students s ON c.class_id = s.current_class_id
        WHERE c.school_id = ? AND c.class_id = ?
        GROUP BY c.class_id
      `;

      const [rows] = await db.query(query, [schoolId, classId]);

      if (rows.length === 0) {
        throw new Error('Class not found');
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new class
   */
  static async createClass(schoolId, classData) {
    try {
      const { name, grade, section, class_teacher_id } = classData;

      // Validate required fields
      if (!name) {
        throw new Error('Class name is required');
      }

      const query = `
        INSERT INTO classes (school_id, name, level, class_teacher_id)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await db.query(query, [
        schoolId,
        name,
        grade || null,
        class_teacher_id || null
      ]);

      return {
        id: result.insertId,
        name,
        grade: grade || null,
        section: section || 'A',
        student_count: 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a class
   */
  static async updateClass(schoolId, classId, updates) {
    try {
      const { name, grade, class_teacher_id } = updates;

      let query = 'UPDATE classes SET ';
      const updateFields = [];
      const params = [];

      if (name !== undefined) {
        updateFields.push('name = ?');
        params.push(name);
      }

      if (grade !== undefined) {
        updateFields.push('level = ?');
        params.push(grade);
      }

      if (class_teacher_id !== undefined) {
        updateFields.push('class_teacher_id = ?');
        params.push(class_teacher_id);
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      query += updateFields.join(', ');
      query += ' WHERE school_id = ? AND class_id = ?';
      params.push(schoolId, classId);

      const [result] = await db.query(query, params);

      return {
        affectedRows: result.affectedRows,
        message: 'Class updated successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a class
   */
  static async deleteClass(schoolId, classId) {
    try {
      // Check if class has students
      const [students] = await db.query(
        'SELECT COUNT(*) as count FROM students WHERE current_class_id = ?',
        [classId]
      );

      if (students[0].count > 0) {
        throw new Error('Cannot delete class with enrolled students');
      }

      const query = 'DELETE FROM classes WHERE school_id = ? AND class_id = ?';
      const [result] = await db.query(query, [schoolId, classId]);

      return {
        affectedRows: result.affectedRows,
        message: 'Class deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get class statistics
   */
  static async getClassStats(schoolId) {
    try {
      const [stats] = await db.query(
        `SELECT
          COUNT(DISTINCT c.class_id) as total_classes,
          COUNT(s.student_id) as total_students,
          ROUND(COUNT(s.student_id) / COUNT(DISTINCT c.class_id), 0) as avg_students
        FROM classes c
        LEFT JOIN students s ON c.class_id = s.current_class_id
        WHERE c.school_id = ?`,
        [schoolId]
      );

      return {
        total: stats[0].total_classes || 0,
        totalStudents: stats[0].total_students || 0,
        avgStudents: stats[0].avg_students || 0
      };
    } catch (error) {
      throw error;
    }
  }
}

export default ClassService;
