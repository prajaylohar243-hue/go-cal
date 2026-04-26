import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function Report() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [meals, setMeals] = useState({});
  const [workouts, setWorkouts] = useState({});

  useEffect(() => {
    const storedMeals = JSON.parse(localStorage.getItem("meals")) || {};
    const storedWorkouts = JSON.parse(localStorage.getItem("workouts")) || {};

    setMeals(storedMeals);
    setWorkouts(storedWorkouts);
  }, []);

  const todaysMeals = meals[date] || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

  const todaysWorkouts = workouts[date] || [];

  const totalCalories = Object.values(todaysMeals)
    .flat()
    .reduce((acc, item) => acc + (item.calories || 0), 0);

  const burned = todaysWorkouts.reduce(
    (acc, item) => acc + item.calories,
    0
  );

  const net = totalCalories - burned;

  const macros = Object.values(todaysMeals)
    .flat()
    .reduce(
      (acc, item) => {
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fats += item.fats || 0;
        return acc;
      },
      { protein: 0, carbs: 0, fats: 0 }
    );

  const chartData = [
    { name: "Protein", value: macros.protein },
    { name: "Carbs", value: macros.carbs },
    { name: "Fats", value: macros.fats }
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const getLast7Days = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const key = d.toISOString().split("T")[0];

      const dayMeals = meals[key] || {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      };

      const dayWorkouts = workouts[key] || [];

      const calories = Object.values(dayMeals)
        .flat()
        .reduce((acc, item) => acc + (item.calories || 0), 0);

      const burned = dayWorkouts.reduce(
        (acc, item) => acc + item.calories,
        0
      );

      const netValue = calories - burned;

      days.push({
        date: key.slice(5),
        net: netValue
      });
    }

    return days;
  };

  const weeklyData = getLast7Days();

  const getInsight = () => {
    if (totalCalories === 0) return "Start logging your meals!";
    if (macros.protein < 50) return "Increase protein intake 💪";
    if (macros.carbs > macros.protein * 3)
      return "Too many carbs, balance your diet ⚖️";
    if (burned > totalCalories)
      return "Great job staying active 🔥";
    return "You're doing well, keep it up!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Report 📊
          </h1>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-3 border px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">

          <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Calories</p>
            <p className="text-xl font-semibold">{totalCalories} kcal</p>
          </div>

          <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Burned</p>
            <p className="text-xl font-semibold">{burned} kcal</p>
          </div>

          <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Net</p>
            <p className="text-xl font-semibold">{net} kcal</p>
          </div>

        </div>

        {/* MACRO CHART */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Macros Breakdown
          </h2>

          <div className="flex justify-center">
            <PieChart width={300} height={300}>
              <Pie data={chartData} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* INSIGHT */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Insight 🧠</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {getInsight()}
          </p>
        </div>

        {/* WEEKLY GRAPH */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">
            Weekly Progress 📈
          </h2>

          <div className="flex justify-center">
            <LineChart width={400} height={300} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="net" stroke="#22c55e" />
            </LineChart>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Report;