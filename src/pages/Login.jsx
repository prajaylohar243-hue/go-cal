import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter email");
      return;
    }

    localStorage.setItem("currentUser", cleanEmail);

    const stored = JSON.parse(
      localStorage.getItem(`userData_${cleanEmail}`)
    );

    const isProfileComplete =
      stored &&
      stored.age &&
      stored.gender &&
      stored.weight &&
      stored.height &&
      stored.activity &&
      stored.goal;

    if (isProfileComplete) {
      navigate("/dashboard");
    } else {
      navigate("/personal");
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">

      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={handleLogin}
            className="bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg hover:bg-gray-800 transition active:scale-95"
          >
            Login
          </button>

        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          New user?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;