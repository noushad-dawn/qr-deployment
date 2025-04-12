const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Client = require("../models/client");

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { companyName, email, password, phoneNumber, address } = body;
  if (!companyName || !email || !password || !phoneNumber || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const client = new Client({
      companyName,
      email,
      password,
      phoneNumber,
      address,
    });
    await client.save();
    res.json({ message: "Client registered successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const client = await Client.findOne({ email });
  if (!client) return res.status(401).json({ message: "Client not found" });

  const valid = await bcrypt.compare(password, client.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    {
      clientId: client._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;
