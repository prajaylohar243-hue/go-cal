import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!name || !cleanEmail || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const existingUser = localStorage.getItem(`user_${cleanEmail}`);

    if (existingUser) {
      alert("User already exists. Please login.");
      return;
    }

    const user = {
      name,
      email: cleanEmail,
      password
    };

    localStorage.setItem(`user_${cleanEmail}`, JSON.stringify(user));

    alert("Registered successfully! Please login.");

    navigate("/login");
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">

      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account 🚀
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
          />

          <button
            onClick={handleRegister}
            className="bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg hover:bg-gray-800 transition active:scale-95"
          >
            Register
          </button>

        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;