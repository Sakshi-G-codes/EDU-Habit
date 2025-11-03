const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "eduhabit"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

app.get("/", (req, res) => {
  res.send("EduHabit API is running!");
});

app.listen(5000, () => console.log("Server running on port 5000"));
