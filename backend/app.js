import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import verifyJWTToken from "./middleware/verifyJWTToken.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://primetrade-backend-developer-task-1.onrender.com"
    ],
    credentials: true,
  })
);



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", verifyJWTToken, taskRoutes);

export default app;