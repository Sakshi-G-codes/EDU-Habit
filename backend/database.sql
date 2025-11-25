-- EduHabit Database Schema

CREATE DATABASE IF NOT EXISTS eduhabit;
USE eduhabit;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  target_date DATE,
  description TEXT,
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  goal_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- Daily Check-ins Table
CREATE TABLE IF NOT EXISTS checkins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_checkin (user_id, date)
);

-- Study Sessions Table
CREATE TABLE IF NOT EXISTS study_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50), 
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default badges
DELIMITER $$

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  -- Use INSERT IGNORE so trigger won't fail if duplicates exist
  INSERT IGNORE INTO badges (user_id, name, description, icon, unlocked) VALUES
    (NEW.id, 'First Step', 'Complete your first check-in', '🎯', FALSE),
    (NEW.id, 'Week Warrior', 'Maintain a 7-day streak', '🔥', FALSE),
    (NEW.id, 'Study Master', 'Complete 10 study sessions', '📚', FALSE),
    (NEW.id, 'Goal Getter', 'Complete your first goal', '🏆', FALSE),
    (NEW.id, 'Consistency King', 'Maintain a 30-day streak', '👑', FALSE);
END$$

DELIMITER ;

