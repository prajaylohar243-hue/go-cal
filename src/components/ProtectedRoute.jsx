import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";

function ProtectedRoute({ children, type }) {
  const isLoggedIn = auth.currentUser !== null;

  const currentUser = localStorage.getItem("currentUser");

  const storedRaw = currentUser
    ? localStorage.getItem(`userData_${currentUser}`)
    : null;

  const stored = storedRaw ? JSON.parse(storedRaw) : {};

  // 🔥 STRICT PROFILE CHECK
  const isProfileComplete =
    stored &&
    stored.age &&
    stored.gender &&
    stored.weight &&
    stored.height &&
    stored.activity &&
    stored.goal;

  // ❌ Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // ❌ Onboarding blocked if already complete
  if (type === "onboarding" && isProfileComplete) {
    return <Navigate to="/dashboard" />;
  }

  // ❌ Private route blocked if NOT complete
  if (type === "private" && !isProfileComplete) {
    return <Navigate to="/personal" />;
  }

  return children;
}

export default ProtectedRoute;