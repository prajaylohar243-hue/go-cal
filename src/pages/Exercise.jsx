import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// 🔥 calorie per minute rates
const calorieRates = {
  running: 10,
  walking: 4,
  cycling: 8,
  gym: 6,
  skipping: 12
};

function Exercise() {
  const [exercise, setExercise] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [workouts, setWorkouts] = useState(() => {
    return JSON.parse(localStorage.getItem("workouts")) || {};
  });

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const todaysWorkouts = workouts[date] || [];

  const handleAdd = () => {
    if (!exercise || !time) return;

    const key = exercise.toLowerCase().trim();
    const rate = calorieRates[key] || 5;
    const calories = rate * Number(time);

    const newItem = {
      name: `${exercise} (${time} min)`,
      time: Number(time),
      calories
    };

    setWorkouts((prev) => {
      const updated = { ...prev };

      if (!updated[date]) updated[date] = [];

      updated[date] = [...updated[date], newItem];

      return updated;
    });

    setExercise("");
    setTime("");
  };

  const handleDelete = (index) => {
    setWorkouts((prev) => {
      const updated = { ...prev };
      updated[date].splice(index, 1);
      return { ...updated };
    });
  };

  const totalBurned = todaysWorkouts.reduce(
    (acc, item) => acc + item.calories,
    0
  );

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Exercise Tracker 🏋️
          </h1>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-3 border px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>

        {/* INPUT CARD */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">

            <input
              type="text"
              placeholder="Exercise (running, gym...)"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full sm:w-64 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="number"
              placeholder="Time (minutes)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border px-3 py-2 rounded-lg w-32 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
              min="1"
            />

            <button
              onClick={handleAdd}
              className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 transition active:scale-95"
            >
              Add
            </button>

          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Burned</p>
          <p className="text-xl font-semibold">{totalBurned} kcal</p>
        </div>

        {/* WORKOUT LIST */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Workouts</h2>

          {todaysWorkouts.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              No workouts logged yet
            </p>
          ) : (
            todaysWorkouts.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2"
              >
                <span>{item.name}</span>

                <div className="flex items-center gap-3">
                  <span>{item.calories} kcal</span>

                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default Exercise;