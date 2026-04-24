import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>GoCal</h1>
      <p>Your smart fitness tracking app</p>

      <button onClick={() => navigate("/login")}>Login</button>
      <br /><br />
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  );
}

export default Landing;