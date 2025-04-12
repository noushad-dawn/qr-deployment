const express = require("express");
const router = express.Router();
const ProcessFlow = require("../models/process");
const { authenticate } = require("../middleware/auth");

// middleware: authClient should attach req.client.id
router.post("/process-flow", authenticate, async (req, res) => {
  try {
    const { steps } = req.body;

    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ message: "Steps are required" });
    }

    // Check if flow already exists for the client
    const existingFlow = await ProcessFlow.findOne({ clientId: req.client.id });

    if (existingFlow) {
      // Update existing flow
      existingFlow.steps = steps;
      await existingFlow.save();
      return res.status(200).json({ message: "Process flow updated", flow: existingFlow });
    }

    // Create new flow
    const newFlow = new ProcessFlow({
      clientId: req.client.id,
      steps,
    });

    await newFlow.save();
    res.status(201).json({ message: "Process flow created", flow: newFlow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/process-flow", authenticate, async (req, res) => {
    try {
      const flow = await ProcessFlow.findOne({ clientId: req.client.id });
  
      if (!flow) {
        return res.status(404).json({ message: "No process flow found" });
      }
  
      res.status(200).json({ flow });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  module.exports = router;