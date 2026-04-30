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
    <div className="relative z-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">

      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">

        <h1 className="text-3xl font-bold mb-4">Your Plan</h1>

        <div className="space-y-2">
          <p><strong>Calories:</strong> {Math.round(calories)} kcal</p>
          <p><strong>Protein:</strong> {macros.protein} g</p>
          <p><strong>Carbs:</strong> {macros.carbs} g</p>
          <p><strong>Fats:</strong> {macros.fats} g</p>
        </div>

        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {userData.goal === "loss" && "Calorie deficit for fat loss 🔥"}
          {userData.goal === "gain" && "Calorie surplus for muscle gain 💪"}
          {userData.goal === "recomp" && "Maintenance for recomposition ⚖️"}
          {userData.goal === "muscle" && "Focus on lean muscle 💪"}
          {userData.goal === "strength" && "Strength improvement ⚡"}
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg"
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Plan;