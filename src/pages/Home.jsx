import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
  calculateBMR,
  getActivityMultiplier,
  calculateCalories,
  calculateMacros
} from "../utils/calculations";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function Home() {
  const [userData, setUserData] = useState({});
  const [weightInput, setWeightInput] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const stored =
      JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
    setUserData(stored);

    const storedHistory =
      JSON.parse(localStorage.getItem(`weight_${currentUser}`)) || [];
    setHistory(storedHistory);
  }, []);

  const handleAddWeight = () => {
    if (!weightInput) return;

    const currentUser = localStorage.getItem("currentUser");

    const newEntry = {
      date: new Date().toISOString().split("T")[0],
      weight: Number(weightInput)
    };

    const updated = [...history, newEntry];

    localStorage.setItem(`weight_${currentUser}`, JSON.stringify(updated));

    setHistory(updated);
    setWeightInput("");
  };

  const chartData = history.map((item) => ({
    date: item.date.slice(5),
    weight: item.weight
  }));

  const getWeightInsight = () => {
    if (history.length < 2) return "Add more data to see insights";

    const latest = history[history.length - 1].weight;
    const previous = history[history.length - 2].weight;

    const diff = +(latest - previous).toFixed(1);

    if (diff < 0) return `You lost ${Math.abs(diff)} kg 🔥`;
    if (diff > 0) return `Weight increased by ${diff} kg ⚠️`;
    return "Weight is stable 👏";
  };

  const weight = Number(userData.weight || 0);
  const height = Number(userData.height || 0);
  const age = Number(userData.age || 0);

  const bmr = calculateBMR({
    gender: userData.gender,
    weight,
    height,
    age
  });

  const tdee = bmr * getActivityMultiplier(userData.activity || "sedentary");
  const calories = calculateCalories(tdee, userData.goal || "maintain");
  const macros = calculateMacros(calories);

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
    <Navbar />

    <div className="max-w-5xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          GoCal Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Hello {userData.gender === "male" ? "King 👑" : "Champion 👑"}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>

        <div className="grid grid-cols-2 gap-4">
          <p>🔥 Calories: <span className="font-medium">{Math.round(calories)} kcal</span></p>
          <p>💪 Protein: <span className="font-medium">{macros.protein} g</span></p>
          <p>🍞 Carbs: <span className="font-medium">{macros.carbs} g</span></p>
          <p>🥑 Fats: <span className="font-medium">{macros.fats} g</span></p>
        </div>
      </div>

      {/* WEIGHT */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Track Weight 📉</h2>

        <div className="flex gap-3 justify-center mb-4">
          <input
            type="number"
            placeholder="Enter weight"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black"
          />

          <button
            onClick={handleAddWeight}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 transition"
          >
            Add
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {history.length === 0 ? (
            <p>No weight data yet</p>
          ) : (
            [...history].reverse().map((item, index) => (
              <p key={index}>
                {item.date} — {item.weight} kg
              </p>
            ))
          )}
        </div>
      </div>

      {/* GRAPH */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Weight Progress 📈</h2>

        {chartData.length < 2 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Add more entries to see graph
          </p>
        ) : (
          <div className="flex justify-center">
            <LineChart width={400} height={250} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#22c55e" />
            </LineChart>
          </div>
        )}
      </div>

      {/* INSIGHTS */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Insights 🧠</h2>
        <p className="text-gray-700 dark:text-gray-300">
          {getWeightInsight()}
        </p>
      </div>

    </div>
  </div>
);
}

export default Home;