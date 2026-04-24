import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // kept for UI consistency
  const navigate = useNavigate();

  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter email");
      return;
    }

    // 🔥 store current user
    localStorage.setItem("currentUser", cleanEmail);

    // 🔥 check user-specific data
    const stored = JSON.parse(
      localStorage.getItem(`userData_${cleanEmail}`)
    );

    // 🔥 check if profile is complete
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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>GoCal</h1>

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

      <button onClick={handleLogin}>Login</button>

      <p>
        New user?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default Login;