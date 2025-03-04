const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

// Add a new event
router.post("/", async (req, res) => {
  const { title, date, description } = req.body;
  try {
    const event = new Event({ title, date, description });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
