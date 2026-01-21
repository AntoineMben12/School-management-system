CREATE DATABASE SchoolManagementSystem;

USE SchoolManagementSystem;

SHOW TABLES;
-- CREATING SUPER_ADMIN
CREATE TABLE super_admin(
    super_admin_id INT PRIMARY KEY AUTO_INCREMENT,
    super_admin_name VARCHAR(100) NOT NULL,
    super_admin_email VARCHAR(100) NOT NULL,
    super_admin_password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);    

-- CREATING SCHOOL
CREATE TABLE school(
    school_id INT PRIMARY KEY AUTO_INCREMENT,
    school_name VARCHAR(100) NOT NULL,
    school_email VARCHAR(100) NOT NULL,
    school_password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);    

-- CREATING SCHOOL_LICENCES
CREATE TABLE school_licences(
    school_licences_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    school_licences_start_date DATE NOT NULL,
    school_licences_end_date DATE NOT NULL,
    school_licences_status ENUM('active', 'expired','suspended') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES school(school_id)
);    

-- CREATING ADMIN
CREATE TABLE admin(
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) NOT NULL,
    admin_password_hash VARCHAR(255) NOT NULL,
    role ENUM('principal', 'vice_principal', 'staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES school(school_id)
);    

-- CREATING TEACHER
CREATE TABLE teacher(
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    matricule VARCHAR(100) NOT NULL,
    teacher_name VARCHAR(100) NOT NULL,
    teacher_email VARCHAR(100) NOT NULL,
    teacher_passKey VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES school(school_id)
);    

-- CREATING TEACHER_OTP
CREATE TABLE teacher_otp(
    teacher_otp_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    opt_code VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id)
);

-- CREATING CLASSES
CREATE TABLE classes(
    classes_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(100) NOT NULL,
    FOREIGN KEY (school_id) REFERENCES school(school_id)
);

-- CREATING SUBJECT
CREATE TABLE subject(
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_lenght INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL
);

-- CREATING TEACHER_SUBJECT_CLASS
CREATE TABLE teacher_subject_class(
    teacher_subject_class_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    classes_id INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    FOREIGN KEY (classes_id) REFERENCES classes(classes_id)
);

-- CREATING STUDENT
CREATE TABLE student(
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    student_matricule VARCHAR(100) NOT NULL,
    student_full_name VARCHAR(255) NOT NULL,
    student_gender ENUM('F', 'M') NOT NULL,
    classes_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES school(school_id),
    FOREIGN KEY (classes_id) REFERENCES classes(classes_id)
);

-- CREATING COURSE_ATTENDANCE
CREATE TABLE course_attendance (
    course_attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    classes_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_status ENUM('present', 'absent', 'late') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    FOREIGN KEY (classes_id) REFERENCES classes(classes_id)
);

-- CREATING TEACHER_ATTENDANCE
CREATE TABLE teacher_attendance (
    teacher_attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_status ENUM('present', 'absent', 'late') NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id)
);

-- CREATING MARKS
CREATE TABLE marks (
    mark_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    classes_id INT NOT NULL,
    ca DECIMAL(5, 2) NOT NULL,
    mark_subtracted_class DECIMAL(5, 2) DEFAULT 0,
    mark_added_class DECIMAL(5, 2) DEFAULT 0,
    sn DECIMAL(5, 2),
    final_mark DECIMAL(5, 2),
    term VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    FOREIGN KEY (classes_id) REFERENCES classes(classes_id)
);

-- CREATE TABLE REPORT_CARD
CREATE TABLE report_card(
    report_card_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    classes_id INT NOT NULL,
    term VARCHAR(50) NOT NULL,
    total_average DECIMAL(5, 2),
    rank_in_class INT,
    remarks TEXT,
    generate_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (classes_id) REFERENCES classes(classes_id)
);

-- CREATE TABLE PARENT

CREATE TABLE parent(
    parent_id INT PRIMARY KEY AUTO_INCREMENT,
    parent_name VARCHAR(100),
    parent_email VARCHAR(100)
);

-- CREATE TABLE PARENT_STUDENT
CREATE TABLE parent_student(
    parent_student_id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,
    student_id INT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES parent(parent_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);

-- CREATE TABLE PARENT_QUESTIONS
CREATE TABLE parent_questions(
    parent_questions_id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,
    question TEXT NOT NULL,
    student_id INT,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'answered') DEFAULT 'pending',
    FOREIGN KEY (parent_id) REFERENCES parent(parent_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);

CREATE TABLE exam_format (
    exam_format_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT,
    format_name ENUM('UNIVERSITY','SECONDARY'),
    description TEXT,
    Foreign Key (school_id) REFERENCES school(school_id)
);

