const express = require("express");
const cors = require("cors");
const db = require("./db"); // imports our MySQL pool
const bcrypt = require("bcryptjs");
const app = express();

app.use(cors());
app.use(express.json());

//  TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running!");
});

app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO player (Username, Email, Password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(400).json({ error: "User already exists" });
          console.error("Register error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered", idPlayer: result.insertId });
      }
    );
  } catch (err) {
    console.error("Hashing error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ LOGIN user
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" });

  db.query("SELECT * FROM player WHERE Email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(400).json({ error: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    res.json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
  });
});

// ✅ GET user info (for profile)
app.get("/api/player/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT idPlayer, Username, Email, created_at FROM player WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  });
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
