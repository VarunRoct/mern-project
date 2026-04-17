const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, phone, hashedPassword], (err, result) => {
      if (err) {
        return res.send("Error: " + err.message);
      }
      res.send("User registered successfully ✅");
    });

  } catch (error) {
    res.send("Server error");
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.send("Error: " + err.message);
    }

    if (result.length === 0) {
      return res.send("User not found");
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret123");

    res.send({
      message: "Login successful ✅",
      token: token
    });
  });
});

router.get('/dashboard', authMiddleware, (req, res) => {
  res.send({
    message: "Welcome to dashboard 🎉",
    user: req.user
  });
});
module.exports = router;