-- Announcements table for school-wide announcements
CREATE TABLE IF NOT EXISTS announcements (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    audience ENUM('all', 'students', 'teachers', 'parents') DEFAULT 'all',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    INDEX idx_announcements_school (school_id, created_at)
);
