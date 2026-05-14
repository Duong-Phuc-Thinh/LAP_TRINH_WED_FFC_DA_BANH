CREATE DATABASE IF NOT EXISTS aff_cup_organizer
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'aff_user'@'localhost' IDENTIFIED BY 'aff123456';
ALTER USER 'aff_user'@'localhost' IDENTIFIED BY 'aff123456';
GRANT ALL PRIVILEGES ON aff_cup_organizer.* TO 'aff_user'@'localhost';
FLUSH PRIVILEGES;

