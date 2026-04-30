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
  const [editQty, setEditQty] = useState({});

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

  const handleAddFood = () => {
    if (!food) return;

    const key = food.toLowerCase().trim();
    const macros = foodData[key];

    if (!macros) {
      return alert("Food not found");
    }

    const qty = manualQty || 100;
    const scale = qty / 100;

    const newItem = {
      name: `${food} (${qty}g)`,
      quantity: qty,
      calories: Math.round(macros.calories * scale),
      protein: Math.round(macros.protein * scale),
      carbs: Math.round(macros.carbs * scale),
      fats: Math.round(macros.fats * scale)
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

      const lastItem = updated[date][meal].slice(-1)[0];
      if (lastItem && lastItem.name === newItem.name) {
        return prev;
      }

      updated[date][meal] = [...updated[date][meal], newItem];

      return updated;
    });

    setFood("");
    setManualQty(100);
    setSuggestions([]);
  };

  const handleDelete = (mealType, index) => {
    setMeals((prev) => {
      const updated = { ...prev };
      updated[date][mealType].splice(index, 1);
      return { ...updated };
    });
  };

  const handleUpdateQuantity = (mealType, index, newQty) => {
    if (!newQty || newQty <= 0) return;

    setMeals((prev) => {
      const updated = { ...prev };

      const item = updated[date][mealType][index];
      const baseName = item.name.split(" (")[0];

      const baseMacros =
        foodData[baseName.toLowerCase()] || item;

      const scale = newQty / 100;

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

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 text-center">

        <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">
          Track Your Food 🍽️
        </h1>

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded-lg mb-4 bg-white dark:bg-gray-800 text-black dark:text-white"
        />

        {/* INPUT */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">

            <select
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="border px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>

            <div className="relative w-full sm:w-64">
              <input
                value={food}
                placeholder="Enter food"
                onChange={(e) => handleFoodChange(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white"
              />

              {suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-md max-h-40 overflow-y-auto">
                  {suggestions.map((item, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setFood(item);
                        setSuggestions([]);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="number"
              value={manualQty}
              onChange={(e) => setManualQty(Number(e.target.value))}
              className="border px-3 py-2 rounded-lg w-24 bg-white dark:bg-gray-800 text-black dark:text-white"
              min="1"
            />

            <button
              onClick={handleAddFood}
              className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Add Food
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="flex justify-around mt-3">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Calories</p>
            <p className="text-lg font-semibold text-black dark:text-white">{total.calories}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Remaining</p>
            <p className="text-lg font-semibold text-black dark:text-white">{remaining}</p>
          </div>
        </div>

        {/* MEALS */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {["breakfast", "lunch", "dinner", "snack"].map((type) => (
            <div key={type} className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 transition hover:shadow-lg hover:-translate-y-1">
              <h4 className="font-semibold mb-6 uppercase">{type}</h4>

              {currentMeals[type].length === 0 ? (
                <p className="text-gray-400 italic text-sm">
                  No food logged yet
                </p>
              ) : (
                currentMeals[type].map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-3 border-b pb-2">

                    <div className="text-left">
                      <div>{item.name}</div>
                      <small className="text-gray-500 dark:text-gray-400">
                        {item.calories} kcal • P: {item.protein}g | C: {item.carbs}g | F: {item.fats}g
                      </small>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={
                          editQty[`${type}-${index}`] ?? item.quantity ?? 100
                        }
                        onChange={(e) => {
                          setEditQty((prev) => ({
                            ...prev,
                            [`${type}-${index}`]: e.target.value
                          }));
                        }}
                        onBlur={() => {
                          const key = `${type}-${index}`;
                          handleUpdateQuantity(type, index, Number(editQty[key]));
                          setEditQty((prev) => {
                            const copy = { ...prev };
                            delete copy[key];
                            return copy;
                          });
                        }}
                        className="w-16 border rounded px-1 py-1 text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
                      />

                      <button
                        onClick={() => handleDelete(type, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ❌
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {/* PIE */}
        <div className="flex justify-center mt-8">
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