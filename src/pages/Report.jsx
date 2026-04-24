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

  // 🔥 TOTAL CALORIES
  const totalCalories = Object.values(todaysMeals)
    .flat()
    .reduce((acc, item) => acc + (item.calories || 0), 0);

  const burned = todaysWorkouts.reduce(
    (acc, item) => acc + item.calories,
    0
  );

  const net = totalCalories - burned;

  // 🔥 MACROS
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

  // 🔥 WEEKLY DATA (FIXED)
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

  // 🔥 INSIGHT
  const getInsight = () => {
    if (totalCalories === 0) return "Start logging your meals!";

    if (macros.protein < 50)
      return "Increase protein intake 💪";

    if (macros.carbs > macros.protein * 3)
      return "Too many carbs, balance your diet ⚖️";

    if (burned > totalCalories)
      return "Great job staying active 🔥";

    return "You're doing well, keep it up!";
  };

  return (
    <div>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Report 📊</h1>

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br /><br />

        {/* FOOD */}
        <div>
          <h3>Food Summary</h3>
          <p>Total Calories: {totalCalories} kcal</p>
        </div>

        {/* EXERCISE */}
        <div style={{ marginTop: "20px" }}>
          <h3>Exercise Summary</h3>
          <p>Calories Burned: {burned} kcal</p>
        </div>

        {/* NET */}
        <div style={{ marginTop: "20px" }}>
          <h3>Net Calories</h3>
          <p>{net} kcal</p>
        </div>

        {/* PIE CHART */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h3>Macros Breakdown</h3>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <PieChart width={300} height={300}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
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
        <div style={{ marginTop: "20px" }}>
          <h3>Insight 🧠</h3>
          <p>{getInsight()}</p>
        </div>

        {/* 🔥 WEEKLY GRAPH */}
        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <h3>Weekly Progress 📈</h3>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <LineChart width={400} height={300} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Line type="monotone" dataKey="net" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;