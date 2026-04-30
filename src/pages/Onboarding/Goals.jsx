import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function Goals() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const [goal, setGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  useEffect(() => {
    if (userData?.goal) {
      setGoal(userData.goal);
      setTargetWeight(userData.targetWeight || "");
    }
  }, [userData]);

  const handleNext = () => {
    if (!goal) {
      alert("Please select a goal");
      return;
    }

    if ((goal === "loss" || goal === "gain") && !targetWeight) {
      alert("Please enter target weight");
      return;
    }

    const currentUser = localStorage.getItem("currentUser");

    const stored =
      JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};

    const updatedData = {
      ...stored,
      goal,
      targetWeight
    };

    localStorage.setItem(
      `userData_${currentUser}`,
      JSON.stringify(updatedData)
    );

    setUserData(updatedData);

    navigate("/plan");
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">

      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Select Goal
        </h1>

        <div className="flex flex-col gap-4">

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="">Select Goal</option>
            <option value="loss">Weight Loss</option>
            <option value="gain">Weight Gain</option>
            <option value="muscle">Muscle Gain</option>
            <option value="strength">Strength Gain</option>
            <option value="recomp">Recomposition</option>
          </select>

          {(goal === "loss" || goal === "gain") && (
            <input
              type="number"
              placeholder="Target Weight"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800"
            />
          )}

          <button
            onClick={handleNext}
            className="bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}

export default Goals;