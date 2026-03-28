import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"
import verifyJWTToken from "./middleware/verifyJWTToken.js"
const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks",verifyJWTToken,taskRoutes)

export default app;