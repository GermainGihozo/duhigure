-- DUHIGURE System Database Schema
-- Designed for scalability across sectors and districts

CREATE DATABASE IF NOT EXISTS duhigure_system;
USE duhigure_system;

-- Sectors/Districts table for scalability
CREATE TABLE sectors (
    sector_id INT PRIMARY KEY AUTO_INCREMENT,
    sector_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    province_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Families table
CREATE TABLE families (
    family_id INT PRIMARY KEY AUTO_INCREMENT,
    family_name VARCHAR(200) NOT NULL,
    head_of_family VARCHAR(150) NOT NULL,
    national_id VARCHAR(16) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    sector_id INT NOT NULL,
    village VARCHAR(100),
    cell VARCHAR(100),
    registration_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    FOREIGN KEY (sector_id) REFERENCES sectors(sector_id),
    INDEX idx_sector (sector_id),
    INDEX idx_status (status)
);

-- Family members table
CREATE TABLE family_members (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    relationship ENUM('father', 'mother', 'child', 'other') NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    role_in_family VARCHAR(100),
    occupation VARCHAR(100),
    education_level VARCHAR(50),
    is_head_of_household BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (family_id) REFERENCES families(family_id) ON DELETE CASCADE,
    INDEX idx_family (family_id),
    INDEX idx_relationship (relationship)
);

-- Imihigo (Performance Contracts) categories
CREATE TABLE imihigo_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    target_group ENUM('individual', 'family', 'both') NOT NULL,
    sector_specific BOOLEAN DEFAULT FALSE
);

-- Performance duties table
CREATE TABLE performance_duties (
    duty_id INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT NOT NULL,
    member_id INT, -- NULL if it's a family duty
    category_id INT NOT NULL,
    duty_description TEXT NOT NULL,
    target_date DATE NOT NULL,
    assigned_date DATE DEFAULT (CURDATE()),
    completion_date DATE,
    status ENUM('pending', 'in_progress', 'completed', 'delayed') DEFAULT 'pending',
    progress_percentage INT DEFAULT 0,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by INT,
    verification_date DATE,
    FOREIGN KEY (family_id) REFERENCES families(family_id),
    FOREIGN KEY (member_id) REFERENCES family_members(member_id),
    FOREIGN KEY (category_id) REFERENCES imihigo_categories(category_id),
    INDEX idx_status (status),
    INDEX idx_family (family_id),
    INDEX idx_target_date (target_date)
);

-- Progress tracking table
CREATE TABLE progress_updates (
    update_id INT PRIMARY KEY AUTO_INCREMENT,
    duty_id INT NOT NULL,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_description TEXT NOT NULL,
    progress_percentage INT,
    evidence_url VARCHAR(500),
    updated_by VARCHAR(100), -- Could be family member or official
    FOREIGN KEY (duty_id) REFERENCES performance_duties(duty_id) ON DELETE CASCADE,
    INDEX idx_duty (duty_id),
    INDEX idx_date (update_date)
);

-- User roles and permissions (for scalability)
CREATE TABLE user_roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL,
    permissions JSON NOT NULL,
    description TEXT
);

-- System users (administrators, sector officials, etc.)
CREATE TABLE system_users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    role_id INT NOT NULL,
    sector_id INT, -- NULL for national-level administrators
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id),
    FOREIGN KEY (sector_id) REFERENCES sectors(sector_id),
    INDEX idx_role (role_id),
    INDEX idx_sector (sector_id)
);

-- Audit log for tracking changes
CREATE TABLE audit_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSON,
    new_values JSON,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_changed_at (changed_at)
);

-- Reports and analytics table
CREATE TABLE analytics (
    analytics_id INT PRIMARY KEY AUTO_INCREMENT,
    sector_id INT,
    report_date DATE NOT NULL,
    total_families INT DEFAULT 0,
    total_members INT DEFAULT 0,
    total_imihigo_assigned INT DEFAULT 0,
    completed_imihigo INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_progress DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (sector_id) REFERENCES sectors(sector_id),
    UNIQUE KEY unique_sector_date (sector_id, report_date)
);

-- Insert initial data for Kibungo Sector
INSERT INTO sectors (sector_name, district_name, province_name) VALUES
('Kibungo', 'Bumbogo', 'Kigali City'),
('Bumbogo', 'Bumbogo', 'Kigali City');

-- Insert sample user roles
INSERT INTO user_roles (role_name, permissions, description) VALUES
('super_admin', '["manage_all", "view_all", "edit_all", "delete_all"]', 'System Super Administrator'),
('sector_admin', '["manage_sector", "view_sector", "edit_sector", "report_sector"]', 'Sector Level Administrator'),
('field_agent', '["register_families", "view_families", "update_progress", "verify_imihigo"]', 'Field Agent/Intore mu Ikoranabuhanga'),
('family_user', '["view_family", "update_progress", "view_reports"]', 'Family Representative');