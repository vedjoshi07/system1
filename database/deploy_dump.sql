-- ============================================================
-- FINDLY — Campus Lost & Found Management System
-- Universal Deployment SQL Dump (Schema + Sample Seed Data)
-- Compatible with: phpMyAdmin, InfinityFree, Alwaysdata, TiDB, cPanel
-- Note: No "CREATE DATABASE" or "USE" statement needed.
-- Select your database in phpMyAdmin, then click "Import" -> choose this file.
-- ============================================================

CREATE TABLE IF NOT EXISTS user (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('STUDENT','STAFF','ADMIN') NOT NULL DEFAULT 'STUDENT',
  contactNo VARCHAR(15),
  enrollmentNo VARCHAR(30) NULL,
  accountStatus ENUM('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS category (
  categoryId INT AUTO_INCREMENT PRIMARY KEY,
  categoryName VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS item (
  itemId INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  itemType ENUM('LOST','FOUND') NOT NULL,
  categoryId INT NOT NULL,
  location VARCHAR(200) NOT NULL,
  itemDate DATE NOT NULL,
  imageUrl VARCHAR(255) NULL,
  custodyLocation VARCHAR(200) NULL,
  custodyStatus ENUM('IN_CUSTODY','MOVED','HANDED_OVER') NULL,
  status ENUM('PENDING','ACTIVE','CLAIMED','RESOLVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  postedBy INT NOT NULL,
  loggedByStaff INT NULL,
  recipientName VARCHAR(100) NULL,
  recipientContactNo VARCHAR(15) NULL,
  recipientEnrollmentNo VARCHAR(30) NULL,
  claimedAt DATETIME NULL,
  resolvedAt DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES category(categoryId),
  FOREIGN KEY (postedBy) REFERENCES user(userId),
  FOREIGN KEY (loggedByStaff) REFERENCES user(userId),
  INDEX idx_item_status (status),
  INDEX idx_item_type (itemType),
  INDEX idx_item_category (categoryId),
  INDEX idx_item_date (itemDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification (
  notificationId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  itemId INT NULL,
  message VARCHAR(255) NOT NULL,
  isRead BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(userId),
  FOREIGN KEY (itemId) REFERENCES item(itemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_log (
  auditId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  itemId INT NULL,
  action VARCHAR(100) NOT NULL,
  oldStatus VARCHAR(30) NULL,
  newStatus VARCHAR(30) NULL,
  details TEXT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(userId),
  FOREIGN KEY (itemId) REFERENCES item(itemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories
INSERT IGNORE INTO category (categoryId, categoryName) VALUES
(1, 'Electronics'),
(2, 'Documents/ID Cards'),
(3, 'Bags'),
(4, 'Accessories'),
(5, 'Books/Stationery'),
(6, 'Others');

-- Users
-- Passwords:
--   Admin   -> Admin@123
--   Staff   -> Staff@123
--   Student -> Student@123
INSERT IGNORE INTO user (userId, name, email, password, role, contactNo, enrollmentNo, accountStatus) VALUES
(1, 'Rohit Desai', 'admin@gnu.ac.in', '$2y$10$0X/aZUnOnMPecTNhtGONkev9VgLeyeSppIS2mlvh44Zi3Mo8ujZNm', 'ADMIN', '9876543210', 'ADM0001', 'ACTIVE'),
(2, 'Priya Shah', 'staff@gnu.ac.in', '$2y$10$scaQMga0v6aqSAb8b9PzfORrMj.s6t.cdEAMTlz3DAfGnK9mDcFze', 'STAFF', '9825012345', 'EMP1023', 'ACTIVE'),
(3, 'Meet Patel', 'meet.patel@gnu.ac.in', '$2y$10$AtxL1A31qeA0TV7BJSUUau7c5.vyGc6jFckzKUO1LUlmDMRLZ9zqG', 'STUDENT', '9099045678', '20BECE1001', 'ACTIVE'),
(4, 'Sneha Joshi', 'sneha.joshi@gnu.ac.in', '$2y$10$K7aJm5VahzVTuGMRiMRhxOIZNUG.mejMIMxZAzU.qY1HScZic77km', 'STUDENT', '9725567890', '21BECE2034', 'ACTIVE');

-- Sample items
INSERT IGNORE INTO item
  (itemId, title, description, itemType, categoryId, location, itemDate, imageUrl,
   custodyLocation, custodyStatus, status, postedBy, loggedByStaff,
   recipientName, recipientContactNo, recipientEnrollmentNo, claimedAt, resolvedAt)
VALUES
  (1, 'Black Lenovo Laptop Charger', 'Black Lenovo laptop charger (65W) left plugged in Computer Lab 302. Has a small sticker on the block with "M9" written on it.',
   'LOST', 1, 'Computer Lab 302, U & P Umar Institute', '2026-08-18', NULL,
   NULL, NULL, 'PENDING', 3, NULL, NULL, NULL, NULL, NULL, NULL),

  (2, 'Blue College ID Card', 'Lost my blue student ID card with name Sneha Joshi (21BECE2034). Last seen at the main library reading hall.',
   'LOST', 2, 'Main Library, Reading Hall', '2026-08-15', NULL,
   NULL, NULL, 'ACTIVE', 4, NULL, NULL, NULL, NULL, NULL, NULL),

  (3, 'Samsung Galaxy Watch', 'Samsung Galaxy Watch (black, 44mm) found on a bench near the central canteen. Screen has a small crack at the top edge.',
   'FOUND', 1, 'Central Canteen, open area near Juice Corner', '2026-08-17', NULL,
   'Campus Security Office, Block A', 'IN_CUSTODY', 'PENDING', 2, 2,
   NULL, NULL, NULL, NULL, NULL),

  (4, 'Grey Laptop Bag with Notebooks', 'Grey backpack containing a green notebook, a pen pouch and an engineering drawing booklet, found in MCA Block corridor.',
   'FOUND', 3, 'MCA Block, first floor corridor', '2026-08-12', NULL,
   'Campus Security Office, Block A', 'IN_CUSTODY', 'ACTIVE', 2, 2,
   NULL, NULL, NULL, NULL, NULL),

  (5, 'Karbonn Power Bank', 'White Karbonn 10000 mAh power bank handed in by a student. Found near Seminar Hall 1 during the placement drive.',
   'FOUND', 1, 'Seminar Hall 1, IT Block', '2026-08-05', NULL,
   'Campus Security Office, Block A', 'HANDED_OVER', 'RESOLVED', 2, 2,
   'Karan Mehta', '9099911223', '20BECE3045', '2026-08-06 11:30:00', '2026-08-06 11:45:00');

-- Notifications & Audit Logs
INSERT IGNORE INTO notification (notificationId, userId, itemId, message, isRead) VALUES
(1, 3, 1, 'Your lost item report "Black Lenovo Laptop Charger" is awaiting admin approval.', FALSE),
(2, 4, 2, 'Your lost item report "Blue College ID Card" has been approved and is now live.', TRUE),
(3, 2, 4, 'Found item "Grey Laptop Bag with Notebooks" has been approved and is now visible to students.', TRUE),
(4, 2, 5, 'Item "Karbonn Power Bank" was marked as resolved. Handover completed.', TRUE);

INSERT IGNORE INTO audit_log (auditId, userId, itemId, action, oldStatus, newStatus, details, timestamp) VALUES
(1, 2, 3, 'POST', NULL, 'PENDING', 'Found item logged: Samsung Galaxy Watch', '2026-08-17 09:05:00'),
(2, 2, 4, 'POST', NULL, 'PENDING', 'Found item logged: Grey Laptop Bag with Notebooks', '2026-08-12 10:20:00'),
(3, 1, 4, 'MODERATE', 'PENDING', 'ACTIVE', 'Approved found item: Grey Laptop Bag with Notebooks', '2026-08-12 14:10:00'),
(4, 1, 2, 'MODERATE', 'PENDING', 'ACTIVE', 'Approved lost item: Blue College ID Card', '2026-08-15 16:00:00'),
(5, 2, 5, 'POST', NULL, 'PENDING', 'Found item logged: Karbonn Power Bank', '2026-08-05 13:45:00'),
(6, 2, 5, 'CLAIM', 'ACTIVE', 'CLAIMED', 'Item claimed after in-person verification', '2026-08-06 11:30:00'),
(7, 2, 5, 'RECORD_RECIPIENT', 'CLAIMED', 'CLAIMED', 'Recipient details recorded for Karbonn Power Bank', '2026-08-06 11:40:00'),
(8, 2, 5, 'RESOLVE', 'CLAIMED', 'RESOLVED', 'Item marked resolved; handed over to recipient', '2026-08-06 11:45:00');
