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

// Badges
app.get("/api/badges/:userId", (req, res) => {
  const sql = "SELECT * FROM badges WHERE user_id = ?";
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Stats
app.get("/api/stats/:userId", (req, res) => {
  const queries = {
    streak: "SELECT COUNT(*) as streak FROM checkins WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)",
    todayStudyTime: "SELECT SUM(duration) as total FROM study_sessions WHERE user_id = ? AND date = CURDATE()",
    tasksCompleted: "SELECT COUNT(*) as completed FROM tasks t JOIN goals g ON t.goal_id = g.id WHERE g.user_id = ? AND t.completed = 1"
  };
  
  const stats = {};
  let completed = 0;
  
  db.query(queries.streak, [req.params.userId], (err, result) => {
    stats.streak = result[0].streak || 0;
    completed++;
    if (completed === 3) res.json(stats);
  });
  
  db.query(queries.todayStudyTime, [req.params.userId], (err, result) => {
    stats.todayStudyTime = result[0].total || 0;
    completed++;
    if (completed === 3) res.json(stats);
  });
  
  db.query(queries.tasksCompleted, [req.params.userId], (err, result) => {
    stats.tasksCompleted = result[0].completed || 0;
    completed++;
    if (completed === 3) res.json(stats);
  });
});

app.get("/", (req, res) => {
  res.send("EduHabit API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));