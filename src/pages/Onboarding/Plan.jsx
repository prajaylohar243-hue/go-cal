import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

import {
  calculateBMR,
  getActivityMultiplier,
  calculateCalories,
  calculateMacros
} from "../../utils/calculations";

function Plan() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const weight = Number(userData.weight);
  const height = Number(userData.height);
  const age = Number(userData.age);

  const bmr = calculateBMR({
    gender: userData.gender,
    weight,
    height,
    age
  });

  const tdee = bmr * getActivityMultiplier(userData.activity);
  const calories = calculateCalories(tdee, userData.goal);
  const macros = calculateMacros(calories);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>GoCal</h1>
      <h2>Your Plan</h2>

      <p><strong>The Plan</strong></p>

      <p><strong>Daily Calories:</strong> {Math.round(calories)} kcal</p>
      <p><strong>Protein:</strong> {macros.protein} g</p>
      <p><strong>Carbs:</strong> {macros.carbs} g</p>
      <p><strong>Fats:</strong> {macros.fats} g</p>

      <br />

<p>
  {userData.goal === "loss" && "You are in a calorie deficit for fat loss 🔥"}
  {userData.goal === "gain" && "You are in a calorie surplus for muscle gain 💪"}
  {userData.goal === "recomp" && "You are maintaining for body recomposition ⚖️"}
  {userData.goal === "muscle" && "Focus on building lean muscle 💪"}
  {userData.goal === "strength" && "Focus on improving strength ⚡"}
</p>

      <br /><br />

      <p><strong>Estimated Time: 8–12 weeks</strong></p>

      <br /><br />

      <button onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
}

export default Plan;