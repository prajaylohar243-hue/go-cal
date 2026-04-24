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

    // 🔥 Validation
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

    // 🔥 Check if user already exists
    const existingUser = localStorage.getItem(`user_${cleanEmail}`);

    if (existingUser) {
      alert("User already exists. Please login.");
      return;
    }

    // 🔥 Store user locally
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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>GoCal</h1>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;