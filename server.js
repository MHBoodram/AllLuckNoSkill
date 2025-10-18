const express = require("express");
const cors = require("cors");
const db = require("./db"); // imports our MySQL pool
const app = express();

app.use(cors());
app.use(express.json());

//  TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running!");
});

//  GET all users
app.get("/api/player", (req, res) => {
  db.query("SELECT * FROM player", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.json(results);
  });
});

// POST new user
app.post("/api/player", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "Missing name or email" });

  db.query("INSERT INTO player (name, email) VALUES (?, ?)", [name, email], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(201).json({ id: result.insertId, name, email });
  });
});

// UPDATE user
app.put("/api/player/:id", (req, res) => {
  const { name, email } = req.body;
  db.query("UPDATE player SET name = ?, email = ? WHERE id = ?", [name, email, req.params.id], (err) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Database update error" });
    }
    res.json({ id: req.params.id, name, email });
  });
});

//  DELETE user
app.delete("/api/player/:id", (req, res) => {
  db.query("DELETE FROM player WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Database delete error" });
    }
    res.json({ message: "User deleted" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
