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

  // 🔥 ADD WEIGHT
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

  // 🔥 CHART DATA
  const chartData = history.map((item) => ({
    date: item.date.slice(5),
    weight: item.weight
  }));

  // 🔥 INSIGHT LOGIC
  const getWeightInsight = () => {
    if (history.length < 2) return "Add more data to see insights";

    const latest = history[history.length - 1].weight;
    const previous = history[history.length - 2].weight;

    const diff = +(latest - previous).toFixed(1);

    if (diff < 0) {
      return `You lost ${Math.abs(diff)} kg 🔥`;
    } else if (diff > 0) {
      return `Weight increased by ${diff} kg ⚠️`;
    } else {
      return "Weight is stable 👏";
    }
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
    <div>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>GoCal</h1>

        <h2>
          Hello {userData.gender === "male" ? "King 👑" : "Champion 👑"}
        </h2>

        <p>Welcome to your dashboard</p>

        {/* 🔥 SUMMARY */}
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            margin: "20px auto",
            width: "300px",
            borderRadius: "10px"
          }}
        >
          <h3>Today's Summary</h3>

          <p>Calories Target: {Math.round(calories)} kcal</p>
          <p>Protein: {macros.protein} g</p>
          <p>Carbs: {macros.carbs} g</p>
          <p>Fats: {macros.fats} g</p>
        </div>

        {/* 🔥 WEIGHT TRACKING */}
        <div style={{ marginTop: "30px" }}>
          <h3>Track Weight 📉</h3>

          <input
            type="number"
            placeholder="Enter weight"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
          />

          <button onClick={handleAddWeight} style={{ marginLeft: "10px" }}>
            Add
          </button>

          {/* 🔥 HISTORY (latest first) */}
          <div style={{ marginTop: "15px" }}>
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

        {/* 🔥 GRAPH */}
        <div style={{ marginTop: "40px" }}>
          <h3>Weight Progress 📈</h3>

          {chartData.length < 2 ? (
            <p>Add more entries to see graph</p>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LineChart width={350} height={250} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" />
              </LineChart>
            </div>
          )}
        </div>

        {/* 🔥 INSIGHTS */}
        <div style={{ marginTop: "20px" }}>
          <h3>Insights 🧠</h3>
          <p>{getWeightInsight()}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;