-- DATABASE INITIALIZATION
CREATE DATABASE IF NOT EXISTS SchoolManagementSystem;
USE SchoolManagementSystem;

-- ==========================================
-- 1. TENANCY & LICENSE MODULE
-- ==========================================

CREATE TABLE schools (
    school_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) UNIQUE, -- for tenant.school.com
    contact_email VARCHAR(100) NOT NULL,
    address TEXT,
    logo_url VARCHAR(255),
    type ENUM('primary', 'secondary', 'university', 'mixed') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE school_licenses (
    license_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    plan_name VARCHAR(50) NOT NULL, -- e.g., 'Basic', 'Premium', 'Enterprise'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'suspended') DEFAULT 'active',
    max_students INT DEFAULT 500,
    features JSON, -- Toggle features like 'AI_INSIGHTS', 'FINANCE'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    INDEX idx_license_status (school_id, status)
);

-- ==========================================
-- 2. AUTHENTICATION & USERS (RBAC)
-- ==========================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    UNIQUE KEY idx_school_email (school_id, email) -- Email unique per school
);

-- Profiles linked to Users
CREATE TABLE teachers (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    school_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    qualification VARCHAR(100),
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

CREATE TABLE parents (
    parent_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    school_id INT NOT NULL,
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

-- ==========================================
-- 3. ACADEMIC STRUCTURE
-- ==========================================

CREATE TABLE academic_years (
    year_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    name VARCHAR(20) NOT NULL, -- '2023-2024'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

CREATE TABLE terms (
    term_id INT PRIMARY KEY AUTO_INCREMENT,
    year_id INT NOT NULL,
    name VARCHAR(50) NOT NULL, -- 'Term 1' or 'Fall Semester'
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (year_id) REFERENCES academic_years(year_id) ON DELETE CASCADE
);

-- Generic container for "Grade 1", "Computer Science Dept", etc.
CREATE TABLE departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- 'Science Dept' or 'Primary Section'
    head_teacher_id INT,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (head_teacher_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE classes (
    class_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    dept_id INT, -- Optional link to department
    name VARCHAR(50) NOT NULL, -- 'Grade 10-A' or 'BSCS-Year1'
    level INT, -- Numeric level for sorting (1, 2, ... 12)
    class_teacher_id INT,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (class_teacher_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    school_id INT NOT NULL,
    parent_id INT,
    current_class_id INT, -- Main homeroom/cohort
    admission_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE,
    gender ENUM('M', 'F', 'O'),
    enrollment_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(parent_id),
    FOREIGN KEY (current_class_id) REFERENCES classes(class_id),
    UNIQUE KEY idx_school_admission (school_id, admission_number)
);

-- ==========================================
-- 4. CURRICULUM & ENROLLMENT
-- ==========================================

CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- 'Mathematics' or 'Data Structures'
    code VARCHAR(20), -- 'MATH101'
    credits DECIMAL(3,1) DEFAULT 1.0, -- For University GPA
    is_elective BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

-- The actual instance of a subject being taught in a class/term
CREATE TABLE course_offerings (
    offering_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    term_id INT NOT NULL,
    subject_id INT NOT NULL,
    class_id INT, -- Can be null if it's an open elective
    teacher_id INT NOT NULL,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(term_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- Student specific subject enrollment (Crucial for University)
CREATE TABLE student_enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    offering_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id) ON DELETE CASCADE,
    UNIQUE KEY idx_student_offering (student_id, offering_id)
);

-- ==========================================
-- 5. EXAMS & MARKS
-- ==========================================

CREATE TABLE exam_formats (
    format_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    name VARCHAR(50) NOT NULL, -- 'Standard Secondary', 'University GPA'
    grading_system JSON, -- Store grade boundaries: {"A": 90, "B": 80}
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

CREATE TABLE assessments (
    assessment_id INT PRIMARY KEY AUTO_INCREMENT,
    offering_id INT NOT NULL,
    name VARCHAR(50) NOT NULL, -- 'Midterm', 'Final', 'Quiz 1'
    max_marks DECIMAL(5,2) NOT NULL,
    weightage DECIMAL(5,2) NOT NULL, -- e.g., 30%
    due_date DATE,
    FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id) ON DELETE CASCADE
);

CREATE TABLE marks (
    mark_id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    student_id INT NOT NULL,
    score_obtained DECIMAL(5,2),
    is_absent BOOLEAN DEFAULT FALSE,
    remarks VARCHAR(255),
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ==========================================
-- 6. ATTENDANCE
-- ==========================================

CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    offering_id INT NOT NULL, -- Link to specific course offering
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_attendance_date (offering_id, date)
);

desc invoices;
-- ==========================================
-- 7. FINANCE MODULE (NEW)
-- ==========================================

CREATE TABLE fee_heads (
    head_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- 'Tuition Fee', 'Library Fine'
    description TEXT,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

CREATE TABLE fee_structures (
    structure_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    class_id INT, -- Applies to all students in this class
    head_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    academic_year_id INT NOT NULL,
    due_date DATE,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (head_id) REFERENCES fee_heads(head_id)
);

CREATE TABLE invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    student_id INT NOT NULL,
    title VARCHAR(100) NOT NULL, -- 'Term 1 Fees'
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('unpaid', 'partial', 'paid', 'overdue') DEFAULT 'unpaid',
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method ENUM('cash', 'card', 'bank_transfer', 'mobile_money') NOT NULL,
    transaction_reference VARCHAR(100),
    recorded_by INT, -- User ID of accountant/admin
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);

-- ==========================================
-- 8. AI & LOGGING
-- ==========================================

CREATE TABLE ai_audit_logs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    user_id INT,
    action_type VARCHAR(50) NOT NULL, -- 'GENERATE_REPORT', 'PREDICT_PERFORMANCE'
    prompt_summary TEXT,
    ai_response_summary TEXT,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    INDEX idx_ai_usage (school_id, created_at)
);


create table super_admin(
	name varchar(30) primary key not null,
    password_hash varchar(40),
    email varchar(30),
    phone_number varchar(30)
);
SHOW TABLES;