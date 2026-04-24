import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // 🔥 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItem = (label, path) => {
    const isActive = location.pathname === path;

    return (
      <span
        onClick={() => navigate(path)}
        style={{
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "8px",
          backgroundColor: isActive ? "#333" : "transparent",
          fontWeight: isActive ? "bold" : "normal",
          transition: "0.2s"
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.target.style.backgroundColor = "#222";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.target.style.backgroundColor = "transparent";
        }}
      >
        {label}
      </span>
    );
  };

  // 🔥 LOGOUT
  const handleLogout = async () => {
  await signOut(auth);

  localStorage.removeItem("currentUser"); // 🔥 IMPORTANT

  navigate("/login");
};

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        borderBottom: "1px solid #ccc",
        backgroundColor: "#111",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Logo */}
      <h2
        style={{ margin: 0, cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        GoCal
      </h2>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          position: "relative"
        }}
      >
        {navItem("Home", "/dashboard")}
        {navItem("Track", "/track")}
        {navItem("Exercise", "/exercise")}
        {navItem("Report", "/report")}
        {navItem("Coach", "/coach")} {/* 🔥 NEW */}

        {/* 🔥 SETTINGS DROPDOWN */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <span
            onClick={() => setOpen(!open)}
            style={{
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "8px"
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#222")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Settings
          </span>

          {open && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                background: "#222",
                borderRadius: "8px",
                padding: "10px",
                minWidth: "120px"
              }}
            >
              <p
                onClick={handleLogout}
                style={{
                  margin: 0,
                  cursor: "pointer",
                  padding: "6px",
                  color: "white"
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;