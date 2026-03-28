import { ObjectId } from "mongodb";
import { connection } from "../config/dbconfig.js";

const collectionName = "tasks";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title & description required" });
    }

    const db = await connection();
    const task = {
      title,
      description,
      status: "pending",
      userId: new ObjectId(req.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(collectionName).insertOne(task);

    if (result.acknowledged) {
      res.status(201).json({ success: true, message: "Task created", task });
    }
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const db = await connection();
    // Admins see all tasks, users only see their own
    const filter = req.user.role === "admin" ? {} : { userId: new ObjectId(req.user.id) };

    const tasks = await db.collection(collectionName).find(filter).toArray();
    res.status(200).json({ success: true, message: "Tasks fetched", tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const db = await connection();
    const { id } = req.params;

    const filter = { _id: new ObjectId(id) };
    if (req.user.role !== "admin") {
      filter.userId = new ObjectId(req.user.id);
    }

    const task = await db.collection(collectionName).findOne(filter);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task fetched", task });
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const db = await connection();
    const { id } = req.params;
    const { title, description, status } = req.body;

    const update = { $set: { updatedAt: new Date() } };
    if (title) update.$set.title = title;
    if (description) update.$set.description = description;
    if (status) update.$set.status = status;

    const filter = { _id: new ObjectId(id) };
    if (req.user.role !== "admin") {
      filter.userId = new ObjectId(req.user.id);
    }

    const result = await db.collection(collectionName).updateOne(filter, update);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Task not found or no changes made" });
    }

    res.status(200).json({ success: true, message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const db = await connection();
    const { id } = req.params;

    const filter = { _id: new ObjectId(id) };
    if (req.user.role !== "admin") {
      filter.userId = new ObjectId(req.user.id);
    }

    const result = await db.collection(collectionName).deleteOne(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
