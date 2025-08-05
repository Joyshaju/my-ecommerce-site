import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

const handleLogin = async (e) => {
  e.preventDefault();

  if (email && password) {
    try {
      const response = await fetch("https://aded34ci4999.ngrok-free.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userRes = await fetch("https://aded34ci4999.ngrok-free.app", {
          credentials: "include",
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          alert("Login successful");
          navigate("/");
        } else {
          alert("Failed to fetch user data");
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Server error");
    }
  } else {
    alert("Please enter email and password");
  }
};

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        method="POST"
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
          value={email}
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
          value={password}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleRegisterClick}
          className="mt-4 w-full text-blue-500 hover:underline"
        >
          Don't have an account? Register
        </button>
        <button
          type="button"
          onClick={()=> navigate("/")}
          className="mt-4 w-full text-blue-500 hover:underline"
        >
          Back
        </button>
      </form>
    </div>
  );
}

export default Login;