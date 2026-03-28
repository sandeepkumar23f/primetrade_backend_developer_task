"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description?: string;
}

interface TaskForm {
  title: string;
  description: string;
}

export default function Dashboard() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskData, setTaskData] = useState<TaskForm>({ title: "", description: "" });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);

    if (!storedToken) {
      router.push("/login");
    } else {
      fetchTasks(storedToken);
    }
  }, [router]);

  // Fetch tasks from backend
  const fetchTasks = async (authToken: string) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${API}/api/v1/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(data.tasks || []);
      else setErrorMessage(data.message || "Failed to fetch tasks");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setErrorMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!taskData.title) {
      setErrorMessage("Title is required");
      return;
    }

    try {
      const url = editingTask ? `${API}/api/v1/tasks/${editingTask._id}` : `${API}/api/v1/tasks`;
      const method = editingTask ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(taskData),
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessMessage(editingTask ? "Task updated!" : "Task added!");
        setTaskData({ title: "", description: "" });
        setEditingTask(null);
        if (token) fetchTasks(token);
      } else setErrorMessage(result.message || "Operation failed");
    } catch (err) {
      console.error("Error submitting task:", err);
      setErrorMessage("Server error. Try again later.");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskData({ title: task.title, description: task.description || "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await fetch(`${API}/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        setSuccessMessage("Task deleted!");
        if (token) fetchTasks(token);
      } else setErrorMessage(result.message || "Delete failed");
    } catch (err) {
      console.error("Error deleting task:", err);
      setErrorMessage("Server error. Try again later.");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">{editingTask ? "Edit Task" : "Add Task"}</h2>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 mb-2 w-full rounded"
            required
          />
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 mb-2 w-full rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </form>

        <h2 className="text-lg font-bold mb-2">Your Tasks</h2>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
