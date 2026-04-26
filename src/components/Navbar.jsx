import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const navItem = (label, path) => {
    const isActive = location.pathname === path;

    return (
      <div
        className="group relative cursor-pointer"
        onClick={() => navigate(path)}
      >
        <span
          className={`px-3 py-1 transition ${
            isActive
              ? "text-white font-semibold"
              : "text-gray-300 dark:text-gray-400"
          }`}
        >
          {label}
        </span>

        {/* Underline */}
        <span
          className={`
            absolute left-0 bottom-0 h-[2px] w-full bg-white
            transform transition-transform duration-300 ease-out origin-center
            ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
          `}
        />
      </div>
    );
  };

  return (
    <div className="bg-black dark:bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">

      {/* LOGO */}
      <h2
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer text-xl font-bold tracking-wide hover:scale-105 transition"
      >
        GoCal
      </h2>

      {/* NAV ITEMS */}
      <div className="flex gap-6 items-center">

        {navItem("Home", "/dashboard")}
        {navItem("Track", "/track")}
        {navItem("Exercise", "/exercise")}
        {navItem("Report", "/report")}
        {navItem("Coach", "/coach")}
        {navItem("Settings", "/settings")}

        {/* 🌙 TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

      </div>
    </div>
  );
}

export default Navbar;