import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const exerciseData = {
  running: 10,
  walking: 4,
  cycling: 8,
  skipping: 12,
  pushups: 7
};

function Exercise() {
  const [exercise, setExercise] = useState("running");
  const [duration, setDuration] = useState("");

  // 🔥 DATE
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // 🔥 LOAD
  const [workouts, setWorkouts] = useState(() => {
    const stored = localStorage.getItem("workouts");
    return stored ? JSON.parse(stored) : {};
  });

  // 🔥 SAVE
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const currentWorkouts = workouts[date] || [];

  // 🔥 ADD
  const handleAdd = () => {
    if (!duration) return;

    const calories =
      exerciseData[exercise] * Number(duration);

    const workout = {
      name: exercise,
      duration,
      calories
    };

    setWorkouts((prev) => {
      const updated = { ...prev };

      if (!updated[date]) {
        updated[date] = [];
      }

      updated[date].push(workout);

      return updated;
    });

    setDuration("");
  };

  // 🔥 DELETE
  const handleDelete = (index) => {
    setWorkouts((prev) => {
      const updated = { ...prev };
      updated[date].splice(index, 1);
      return { ...updated };
    });
  };

  // 🔥 TOTAL
  const totalBurn = currentWorkouts.reduce(
    (acc, item) => acc + item.calories,
    0
  );

  return (
    <div>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Exercise 🔥</h1>

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br /><br />

        {/* SELECT */}
        <select
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        >
          {Object.keys(exerciseData).map((ex) => (
            <option key={ex}>{ex}</option>
          ))}
        </select>

        <br /><br />

        {/* INPUT */}
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <br /><br />

        <button onClick={handleAdd}>Add Workout</button>

        {/* LIST */}
        <div style={{ marginTop: "30px" }}>
          <h3>Workouts ({date})</h3>

          {currentWorkouts.length === 0 ? (
            <p>No workouts</p>
          ) : (
            currentWorkouts.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  alignItems: "center"
                }}
              >
                <p>
                  {item.name} — {item.duration} min — {item.calories} kcal
                </p>

                <button
                  onClick={() => handleDelete(index)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* TOTAL */}
        <div style={{ marginTop: "30px" }}>
          <h3>Total Burn 🔥</h3>
          <p>{totalBurn} kcal</p>
        </div>
      </div>
    </div>
  );
}

export default Exercise;