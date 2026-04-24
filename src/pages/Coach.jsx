import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Coach() {
  const [userData, setUserData] = useState({});
  const [meals, setMeals] = useState({});
  const [workouts, setWorkouts] = useState({});

  const date = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      console.log("No user logged in");
      return;
    }

    const storedUser =
      JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};

    const storedMeals =
      JSON.parse(localStorage.getItem("meals")) || {};

    const storedWorkouts =
      JSON.parse(localStorage.getItem("workouts")) || {};

    setUserData(storedUser);
    setMeals(storedMeals);
    setWorkouts(storedWorkouts);

    console.log("COACH USER DATA:", storedUser);
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
    (acc, item) => acc + (item.calories || 0),
    0
  );

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

  const getAdvice = () => {
    let advice = [];

    if (!userData || !userData.goal) {
      advice.push("Complete your profile first ⚙️");
      return advice;
    }

    if (totalCalories === 0) {
      advice.push("Start logging your meals 🍽️");
    }

    if (macros.protein < 60) {
      advice.push("Increase protein intake 💪");
    }

    if (macros.carbs > macros.protein * 3) {
      advice.push("Reduce excess carbs ⚖️");
    }

    if (burned < 200) {
      advice.push("Try to be more active today 🏃");
    }

    if (userData.goal === "loss" && totalCalories > 2000) {
      advice.push("You're eating above your goal 📉");
    }

    if (userData.goal === "gain" && totalCalories < 1800) {
      advice.push("Increase calorie intake 📈");
    }

    if (advice.length === 0) {
      advice.push("You're doing great! Keep going 🔥");
    }

    return advice;
  };

  const tips = getAdvice();

  return (
    <div>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>AI Fitness Coach 🤖</h1>

        <div
          style={{
            maxWidth: "500px",
            margin: "20px auto",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #ccc"
          }}
        >
          {tips.map((tip, index) => (
            <p key={index}>• {tip}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Coach;