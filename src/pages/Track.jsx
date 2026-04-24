import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import foodData from "../utils/foodData";
import {
  calculateBMR,
  getActivityMultiplier,
  calculateCalories
} from "../utils/calculations";
import { UserContext } from "../context/UserContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Track() {
  const { userData } = useContext(UserContext);

  const [meal, setMeal] = useState("breakfast");
  const [food, setFood] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [manualQty, setManualQty] = useState(100);
  const [isAdding, setIsAdding] = useState(false);

  // 🔥 AI STATES
  const [aiFood, setAiFood] = useState("");
  const [aiMacros, setAiMacros] = useState({
    protein: 0,
    carbs: 0,
    fats: 0
  });
  const [quantity, setQuantity] = useState(100);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [meals, setMeals] = useState(() => {
    return JSON.parse(localStorage.getItem("meals")) || {};
  });

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const currentMeals = meals[date] || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

  // 🔥 ADD FOOD (FIXED)
  const handleAddFood = () => {
  if (!food || isAdding) return;

  setIsAdding(true);

  const macros = foodData[food.toLowerCase()];
  if (!macros) {
    setIsAdding(false);
    return alert("Food not found");
  }

  const baseName = food;
  const qty = manualQty;
  const scale = qty / 100;

  setMeals((prev) => {
    const updated = { ...prev };

    if (!updated[date]) {
      updated[date] = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      };
    }

    const existingIndex = updated[date][meal].findIndex((item) =>
      item.name.startsWith(baseName)
    );

    if (existingIndex !== -1) {
      const existing = updated[date][meal][existingIndex];

      const newQty = (existing.quantity || 100) + qty;
      const newScale = newQty / 100;

      updated[date][meal][existingIndex] = {
        name: `${baseName} (${newQty}g)`,
        quantity: newQty,
        calories: Math.round(macros.calories * newScale),
        protein: Math.round(macros.protein * newScale),
        carbs: Math.round(macros.carbs * newScale),
        fats: Math.round(macros.fats * newScale)
      };
    } else {
      updated[date][meal].push({
        name: `${baseName} (${qty}g)`,
        quantity: qty,
        calories: Math.round(macros.calories * scale),
        protein: Math.round(macros.protein * scale),
        carbs: Math.round(macros.carbs * scale),
        fats: Math.round(macros.fats * scale)
      });
    }

    return updated;
  });

  setFood("");
  setManualQty(100);
  setSuggestions([]);

  // 🔥 release lock
  setTimeout(() => setIsAdding(false), 100);
};

  // 🔥 DELETE FOOD
  const handleDelete = (mealType, index) => {
    setMeals((prev) => {
      const updated = { ...prev };
      updated[date][mealType].splice(index, 1);
      return { ...updated };
    });
  };

// 🔥 UPDATE QUANTITY (ADD HERE 👇)
const handleUpdateQuantity = (mealType, index, newQty) => {
  if (!newQty || newQty <= 0) return;

  setMeals((prev) => {
    const updated = { ...prev };

    const item = updated[date][mealType][index];

    const baseName = item.name.split(" (")[0];

    const scale = newQty / 100;

    const baseMacros =
      foodData[baseName.toLowerCase()] || {
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
        calories: item.calories
      };

    updated[date][mealType][index] = {
      name: `${baseName} (${newQty}g)`,
      quantity: newQty,
      calories: Math.round(baseMacros.calories * scale),
      protein: Math.round(baseMacros.protein * scale),
      carbs: Math.round(baseMacros.carbs * scale),
      fats: Math.round(baseMacros.fats * scale)
    };

    return updated;
  });
};

  // 🔥 SUGGESTIONS
  const handleFoodChange = (value) => {
    setFood(value);

    if (value.length > 0) {
      setSuggestions(
        Object.keys(foodData).filter((item) =>
          item.includes(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  // 🔥 AI GUESS
  const handleAIGuess = () => {
    if (!food) return;

    const data = foodData[food.toLowerCase()];
    if (!data) return alert("Food not recognized");

    setAiFood(food);
    setAiMacros({
      protein: data.protein,
      carbs: data.carbs,
      fats: data.fats
    });
    setQuantity(100);
  };

  // 🔥 CALCULATE CALORIES
  const calculatedCalories =
    aiMacros.protein * 4 +
    aiMacros.carbs * 4 +
    aiMacros.fats * 9;

  const scaledCalories = Math.round(
    (calculatedCalories * quantity) / 100
  );

  // 🔥 ADD AI FOOD (FIXED)
  const handleAddAIFood = () => {
  if (!aiFood) return;

  const baseName = aiFood;
  const scale = quantity / 100;

  const newItem = {
    name: `${baseName} (${quantity}g)`,
    quantity,
    calories: scaledCalories,
    protein: Math.round(aiMacros.protein * scale),
    carbs: Math.round(aiMacros.carbs * scale),
    fats: Math.round(aiMacros.fats * scale)
  };

  setMeals((prev) => {
    const updated = { ...prev };

    if (!updated[date]) {
      updated[date] = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      };
    }

    const existingIndex = updated[date][meal].findIndex((item) =>
      item.name.startsWith(baseName)
    );

    if (existingIndex !== -1) {
      const existing = updated[date][meal][existingIndex];

      const newQty = (existing.quantity || 100) + quantity;
      const scale = newQty / 100;

      updated[date][meal][existingIndex] = {
        name: `${baseName} (${newQty}g)`,
        quantity: newQty,
        calories: Math.round(
          (aiMacros.protein * 4 +
            aiMacros.carbs * 4 +
            aiMacros.fats * 9) * scale
        ),
        protein: Math.round(aiMacros.protein * scale),
        carbs: Math.round(aiMacros.carbs * scale),
        fats: Math.round(aiMacros.fats * scale)
      };
    } else {
      updated[date][meal].push(newItem);
    }

    return updated;
  });

  setAiFood("");
};

  // 🔥 TOTALS
  const total = Object.values(currentMeals).flat().reduce(
    (acc, item) => {
      acc.calories += item.calories || 0;
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fats += item.fats || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const workouts = JSON.parse(localStorage.getItem("workouts")) || {};
  const burned = (workouts[date] || []).reduce(
    (acc, item) => acc + item.calories,
    0
  );

  const net = total.calories - burned;

  const bmr = calculateBMR({
    gender: userData.gender,
    weight: userData.weight,
    height: userData.height,
    age: userData.age
  });

  const target = calculateCalories(
    bmr * getActivityMultiplier(userData.activity || "sedentary"),
    userData.goal || "maintain"
  );

  const remaining = Math.round(target - net);

  const chartData = [
    { name: "Protein", value: total.protein },
    { name: "Carbs", value: total.carbs },
    { name: "Fats", value: total.fats }
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const card = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    margin: "20px auto",
    width: "350px",
    background: "#fff"
  };

  return (
    <div>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h1>Track Your Food 🍽️</h1>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br /><br />

        <select value={meal} onChange={(e) => setMeal(e.target.value)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>

        <br /><br />

        <input
          value={food}
          placeholder="Enter food"
          onChange={(e) => handleFoodChange(e.target.value)}
        />

        {suggestions.map((item, i) => (
          <p key={i} onClick={() => { setFood(item); setSuggestions([]); }}>
            {item}
          </p>
        ))}

        <button onClick={handleAddFood}>Add Food</button>

        {/* 🔥 AI BUTTON */}
        <br /><br />
        <button onClick={handleAIGuess}>🤖 AI Guess Food</button>

        {/* 🔥 AI PANEL */}
        {aiFood && (
          <div style={card}>
            <h3>AI Suggestion</h3>

            <p><b>{aiFood}</b></p>

            <input
              type="number"
              value={aiMacros.protein}
              onChange={(e) =>
                setAiMacros({ ...aiMacros, protein: Number(e.target.value) })
              }
              placeholder="Protein"
            />

            <input
              type="number"
              value={aiMacros.carbs}
              onChange={(e) =>
                setAiMacros({ ...aiMacros, carbs: Number(e.target.value) })
              }
              placeholder="Carbs"
            />

            <input
              type="number"
              value={aiMacros.fats}
              onChange={(e) =>
                setAiMacros({ ...aiMacros, fats: Number(e.target.value) })
              }
              placeholder="Fats"
            />

            <br /><br />

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Quantity (g)"
            />

            <p><b>Calories:</b> {scaledCalories}</p>

            <button onClick={handleAddAIFood}>
              Add to Meal
            </button>
          </div>
        )}

        {/* SUMMARY */}
        <div style={card}>
          <h3>Today's Summary</h3>
          <p>Calories: {total.calories}</p>
          <p>Remaining: {remaining}</p>
        </div>

{/* 🔥 MEAL TIMELINE (NEW) */}
<div style={{ marginTop: "30px" }}>
  {["breakfast", "lunch", "dinner", "snack"].map((type) => (
    <div
      key={type}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "15px",
        margin: "10px auto",
        width: "350px",
        background: "#fff"
      }}
    >
      <h4 style={{ textTransform: "uppercase" }}>{type}</h4>

      {currentMeals[type].length === 0 ? (
        <p style={{ color: "#888" }}>No items added</p>
      ) : (
        currentMeals[type].map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px"
            }}
          >
            <div
  key={index}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  }}
>
  <div>
    <div>{item.name}</div>
    <small>
      P: {item.protein}g | C: {item.carbs}g | F: {item.fats}g
    </small>
  </div>

  <div>
    <input
      type="number"
      value={item.quantity || 100}
      onChange={(e) =>
        handleUpdateQuantity(type, index, Number(e.target.value))
      }
      style={{ width: "60px" }}
    />

    <span> g</span>

    <button
      onClick={() => handleDelete(type, index)}
      style={{
        marginLeft: "10px",
        border: "none",
        background: "none",
        cursor: "pointer"
      }}
    >
      ❌
    </button>
  </div>
</div>

            <span>
              {item.calories} kcal
              <button
                onClick={() => handleDelete(type, index)}
                style={{
                  marginLeft: "10px",
                  border: "none",
                  background: "none",
                  cursor: "pointer"
                }}
              >
                ❌
              </button>
            </span>
          </div>
        ))
      )}
    </div>
  ))}
</div>

        {/* PIE */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PieChart width={300} height={300}>
            <Pie data={chartData} dataKey="value">
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default Track;