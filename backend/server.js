import express from "express";
import dotenv from "dotenv";
import path from "path";

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");
const eventRoutes = require("./routes/events");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);

const __dirname = path.resolve();

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"/frontend/build")));

  app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"frontend","build","index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Error fetching tasks from the database' });
  }
});


app.post('/api/tasks', async (req, res) => {
  const { title, due_date, priority, status } = req.body;
  console.log('Received task:', { title, due_date, priority, status }); 

  if (!title || !priority || !status || !due_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newTask = new Task({
      title,
      due_date,
      priority,
      status,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error saving task:', err);
    res.status(500).json({ error: 'Error saving task to the database' });
  }
});


app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, priority, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, priority, status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { title, due_date, priority, status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, due_date, priority, status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Error updating task' });
  }
});

app.delete('/api/tasks/:id',async(req,res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
