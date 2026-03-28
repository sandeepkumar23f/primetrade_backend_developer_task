// routes/taskRoutes.js
import express from "express";
import { createTask, getTasks, getTask, updateTask, deleteTask } from "../controllers/taskController.js";
import verifyJWTToken from "../middleware/verifyJWTToken.js";

const router = express.Router();

router.post("/", verifyJWTToken, createTask);
router.get("/", verifyJWTToken, getTasks);
router.get("/:id", verifyJWTToken, getTask);
router.put("/:id", verifyJWTToken, updateTask);
router.delete("/:id", verifyJWTToken,  deleteTask); 

export default router;