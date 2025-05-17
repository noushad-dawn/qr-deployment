const express = require('express');
const router = express.Router();
const QRTemplate = require('../models/qrTemplate');
const { authenticate } = require("../middleware/auth");

// POST - Create or Update QR Template for a user
router.post('/', authenticate, async (req, res) => {
  try {
    const { fields, qrSize, backgroundColor, foregroundColor, padding, name, isDefault } = req.body;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Check if template already exists for the user
    const existingTemplate = await QRTemplate.findOne({ clientId: req.clientId });

    if (existingTemplate) {
      // Update existing template
      existingTemplate.fields = fields;
      existingTemplate.qrSize = qrSize;
      existingTemplate.backgroundColor = backgroundColor;
      existingTemplate.foregroundColor = foregroundColor;
      existingTemplate.padding = padding;
      existingTemplate.name = name;
      existingTemplate.isDefault = isDefault;
      
      await existingTemplate.save();
      return res.status(200).json({ message: "QR Template updated", template: existingTemplate });
    }

    // Create new template
    const newTemplate = new QRTemplate({
      userId: req.user._id,
      fields,
      qrSize,
      backgroundColor,
      foregroundColor,
      padding,
      name,
      isDefault,
    });

    await newTemplate.save();
    res.status(201).json({ message: "QR Template created", template: newTemplate });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET - Get QR Template for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const template = await QRTemplate.findOne({ clientId: req.clientId });

    if (!template) {
      return res.status(200).json({ message: "No QR template found" });
    }

    res.status(200).json({ template });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
