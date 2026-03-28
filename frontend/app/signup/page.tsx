"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";

// ✅ Types
interface UserData {
  name: string;
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

export default function SignUp() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const API =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // ✅ Typed change handler (NO ANY)
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async (): Promise<void> => {
    if (loading) return; // ✅ prevent spam clicks

    setErrorMessage("");
    setSuccessMessage("");

    // ✅ Validation
    if (!userData.name || !userData.email || !userData.password) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!validateEmail(userData.email)) {
      setErrorMessage("Enter valid email address");
      return;
    }

    if (userData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      if (data.success) {
        setSuccessMessage("Account created successfully 🚀");

        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 w-full h-16 flex items-center px-8 bg-white shadow-sm text-black font-bold text-2xl z-50">
        Register
      </div>

      <div className="min-h-[calc(100vh-64px)] pt-16 flex items-center justify-center bg-linear-to-r from-blue-500 to-gray-500">
        <div className="w-full max-w-md bg-white text-black rounded-lg p-8 shadow-md">

          <h1 className="text-2xl text-center font-bold mb-3">
            Register Here
          </h1>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mb-2">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-green-600 text-sm text-center mb-2">
              {successMessage}
            </p>
          )}

          <div className="mb-4">
            <label>Name</label>
            <input
              name="name"
              value={userData.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              className="w-full h-10 border rounded-md px-3"
            />
          </div>

          <div className="mb-4">
            <label>Email</label>
            <input
              name="email"
              value={userData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full h-10 border rounded-md px-3"
            />
          </div>

          <div className="mb-4">
            <label>Password</label>
            <input
              name="password"
              value={userData.password}
              onChange={handleChange}
              type="password"
              placeholder="Enter password"
              className="w-full h-10 border rounded-md px-3"
            />
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-400 my-4">OR</p>

          <div className="flex items-center justify-center mt-4">
            <Link href="/login" className="text-blue-500 hover:underline">
              Already have an account? Login
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}