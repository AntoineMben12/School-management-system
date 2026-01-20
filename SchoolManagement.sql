CREATE DATABASE SchoolManagementSystem;

USE SchoolManagementSystem;

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
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) NOT NULL,
    admin_password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);    