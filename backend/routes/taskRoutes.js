// routes/taskRoutes.js
import express from "express";
import { createTask, getTasks, getTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { verifyJWTToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// API versioning
router.post("/v1/tasks", verifyJWTToken, createTask);
router.get("/v1/tasks", verifyJWTToken, getTasks);
router.get("/v1/tasks/:id", verifyJWTToken, getTask);
router.put("/v1/tasks/:id", verifyJWTToken, updateTask);
router.delete("/v1/tasks/:id", verifyJWTToken, authorizeRoles("admin"), deleteTask); 

export default router;