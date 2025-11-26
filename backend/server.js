const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Ilovepotatos5&5",
  database: process.env.DB_NAME || "eduhabit"
});

db.connect(err => {
  if (err) {
    console.error("MySQL Connection Error:", err);
    return;
  }
  console.log("MySQL Connected!");
});

// Users
app.post("/api/users/register", (req, res) => {
  const { email, password, name } = req.body;
  const sql = "INSERT INTO users (email, password, name) VALUES (?, ?, ?)";
  db.query(sql, [email, password, name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, email, name });
  });
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    res.json(results[0]);
  });
});

// Goals - CRUD
app.post("/api/goals", (req, res) => {
  const { user_id, title, category, target_date, description } = req.body;
  const sql = "INSERT INTO goals (user_id, title, category, target_date, description) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [user_id, title, category, target_date, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, user_id, title, category, target_date, description });
  });
});

app.get("/api/goals/:userId", (req, res) => {
  const sql = "SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC";
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put("/api/goals/:id", (req, res) => {
  const { title, category, target_date, description, progress } = req.body;
  const sql = "UPDATE goals SET title = ?, category = ?, target_date = ?, description = ?, progress = ? WHERE id = ?";
  db.query(sql, [title, category, target_date, description, progress, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Goal updated successfully" });
  });
});

app.delete("/api/goals/:id", (req, res) => {
  const sql = "DELETE FROM goals WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Goal deleted successfully" });
  });
});

// Tasks
app.post("/api/tasks", (req, res) => {
  const { goal_id, title } = req.body;
  const sql = "INSERT INTO tasks (goal_id, title) VALUES (?, ?)";
  db.query(sql, [goal_id, title], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, goal_id, title, completed: false });
  });
});

app.get("/api/tasks/:goalId", (req, res) => {
  const sql = "SELECT * FROM tasks WHERE goal_id = ?";
  db.query(sql, [req.params.goalId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put("/api/tasks/:id", (req, res) => {
  const { completed } = req.body;
  const sql = "UPDATE tasks SET completed = ? WHERE id = ?";
  db.query(sql, [completed, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task updated successfully" });
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task deleted successfully" });
  });
});

// Check-ins
app.post("/api/checkins", (req, res) => {
  const { user_id, note } = req.body;
  const sql = "INSERT INTO checkins (user_id, note, date) VALUES (?, ?, CURDATE())";
  db.query(sql, [user_id, note], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, user_id, note, date: new Date() });
  });
});

app.get("/api/checkins/:userId", (req, res) => {
  const sql = "SELECT * FROM checkins WHERE user_id = ? ORDER BY date DESC";
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Study Sessions
app.post("/api/sessions", (req, res) => {
  const { user_id, subject, duration, date } = req.body;
  const sql = "INSERT INTO study_sessions (user_id, subject, duration, date) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, subject, duration, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, user_id, subject, duration, date });
  });
});

app.get("/api/sessions/:userId", (req, res) => {
  const sql = "SELECT * FROM study_sessions WHERE user_id = ? ORDER BY date DESC";
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Badges with auto-unlock logic
app.get("/api/badges/:userId", async (req, res) => {
  try {
    // Get user stats
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM checkins WHERE user_id = ?) as checkins,
        (SELECT COUNT(*) FROM study_sessions WHERE user_id = ?) as sessions,
        (SELECT COUNT(*) FROM goals WHERE user_id = ? AND progress = 100) as completedGoals,
        (SELECT COUNT(*) FROM tasks t JOIN goals g ON t.goal_id = g.id WHERE g.user_id = ? AND t.completed = 1) as completedTasks
    `;
    
    db.query(statsQuery, [req.params.userId, req.params.userId, req.params.userId, req.params.userId], (err, stats) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const userStats = stats[0];
      
      // Calculate streak
      db.query("SELECT date FROM checkins WHERE user_id = ? ORDER BY date DESC", [req.params.userId], (err, checkins) => {
        let streak = 0;
        if (checkins.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          let currentDate = new Date(today);
          
          for (let checkin of checkins) {
            const checkinDate = new Date(checkin.date);
            checkinDate.setHours(0, 0, 0, 0);
            
            if (checkinDate.getTime() === currentDate.getTime() || 
                checkinDate.getTime() === currentDate.getTime() - 86400000) {
              streak++;
              currentDate = new Date(checkinDate);
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
        
        // Define badge criteria
        const badges = [
          { name: 'First Step', description: 'Complete your first check-in', icon: '🎯', criteria: userStats.checkins >= 1 },
          { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', criteria: streak >= 7 },
          { name: 'Study Master', description: 'Complete 10 study sessions', icon: '📚', criteria: userStats.sessions >= 10 },
          { name: 'Goal Getter', description: 'Complete your first goal', icon: '🏆', criteria: userStats.completedGoals >= 1 },
          { name: 'Consistency King', description: 'Maintain a 30-day streak', icon: '👑', criteria: streak >= 30 },
          { name: 'Task Champion', description: 'Complete 50 tasks', icon: '✅', criteria: userStats.completedTasks >= 50 }
        ];
        
        const badgeResults = badges.map(badge => ({
          ...badge,
          unlocked: badge.criteria,
          unlocked_at: badge.criteria ? new Date() : null
        }));
        
        res.json(badgeResults);
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user account
app.delete("/api/users/:userId", (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [req.params.userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Account deleted successfully" });
  });
});

// Stats with proper streak calculation
app.get("/api/stats/:userId", (req, res) => {
  const stats = {};
  let completed = 0;
  
  // Calculate consecutive streak
  const streakQuery = `
    SELECT date FROM checkins 
    WHERE user_id = ? 
    ORDER BY date DESC
  `;
  
  db.query(streakQuery, [req.params.userId], (err, checkins) => {
    if (err) {
      stats.streak = 0;
      stats.checkedInToday = false;
    } else {
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkins.length > 0) {
        const lastCheckin = new Date(checkins[0].date);
        lastCheckin.setHours(0, 0, 0, 0);
        
        // Check if checked in today
        stats.checkedInToday = lastCheckin.getTime() === today.getTime();
        
        // Calculate consecutive days
        let currentDate = new Date(today);
        if (!stats.checkedInToday) {
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        for (let checkin of checkins) {
          const checkinDate = new Date(checkin.date);
          checkinDate.setHours(0, 0, 0, 0);
          
          if (checkinDate.getTime() === currentDate.getTime()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
      } else {
        stats.checkedInToday = false;
      }
      
      stats.streak = streak;
    }
    completed++;
    if (completed === 4) res.json(stats);
  });
  
  // Today's study time
  db.query("SELECT SUM(duration) as total FROM study_sessions WHERE user_id = ? AND date = CURDATE()", 
    [req.params.userId], (err, result) => {
    stats.todayStudyTime = result[0].total || 0;
    completed++;
    if (completed === 4) res.json(stats);
  });
  
  // Tasks completed
  db.query("SELECT COUNT(*) as completed FROM tasks t JOIN goals g ON t.goal_id = g.id WHERE g.user_id = ? AND t.completed = 1",
    [req.params.userId], (err, result) => {
    stats.tasksCompleted = result[0].completed || 0;
    completed++;
    if (completed === 4) res.json(stats);
  });
  
  // Active goals count
  db.query("SELECT COUNT(*) as count FROM goals WHERE user_id = ? AND progress < 100",
    [req.params.userId], (err, result) => {
    stats.activeGoals = result[0].count || 0;
    completed++;
    if (completed === 5) res.json(stats);
  });
  
  // Total badges unlocked
  db.query(`
    SELECT 
      (SELECT COUNT(*) FROM checkins WHERE user_id = ?) as checkins,
      (SELECT COUNT(*) FROM study_sessions WHERE user_id = ?) as sessions,
      (SELECT COUNT(*) FROM goals WHERE user_id = ? AND progress = 100) as completedGoals,
      (SELECT COUNT(*) FROM tasks t JOIN goals g ON t.goal_id = g.id WHERE g.user_id = ? AND t.completed = 1) as completedTasks
  `, [req.params.userId, req.params.userId, req.params.userId, req.params.userId], (err, badgeStats) => {
    if (err) {
      stats.totalBadges = 0;
    } else {
      const userStats = badgeStats[0];
      let unlockedCount = 0;
      
      // Calculate streak for badges
      db.query("SELECT date FROM checkins WHERE user_id = ? ORDER BY date DESC", [req.params.userId], (err, checkins) => {
        let streak = 0;
        if (checkins && checkins.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          let currentDate = new Date(today);
          
          for (let checkin of checkins) {
            const checkinDate = new Date(checkin.date);
            checkinDate.setHours(0, 0, 0, 0);
            
            if (checkinDate.getTime() === currentDate.getTime() || 
                checkinDate.getTime() === currentDate.getTime() - 86400000) {
              streak++;
              currentDate = new Date(checkinDate);
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
        
        // Count unlocked badges
        if (userStats.checkins >= 1) unlockedCount++;
        if (streak >= 7) unlockedCount++;
        if (userStats.sessions >= 10) unlockedCount++;
        if (userStats.completedGoals >= 1) unlockedCount++;
        if (streak >= 30) unlockedCount++;
        if (userStats.completedTasks >= 50) unlockedCount++;
        
        stats.totalBadges = unlockedCount;
        completed++;
        if (completed === 5) res.json(stats);
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("EduHabit API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));