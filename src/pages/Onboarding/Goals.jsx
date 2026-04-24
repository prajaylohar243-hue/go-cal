import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function Goals() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const [goal, setGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  // 🔥 Prefill if exists
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

  console.log("FINAL USER DATA:", updatedData);

  navigate("/plan");
};

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>GoCal</h1>
      <h2>Select Your Goal</h2>

      <select value={goal} onChange={(e) => setGoal(e.target.value)}>
        <option value="">Select Goal</option>
        <option value="loss">Weight Loss</option>
        <option value="gain">Weight Gain</option>
        <option value="muscle">Muscle Gain</option>
        <option value="strength">Strength Gain</option>
        <option value="recomp">Recomposition</option>
      </select>

      <br /><br />

      {(goal === "loss" || goal === "gain") && (
        <>
          <input
            type="number"
            placeholder="Target Weight (kg)"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
          />
          <br /><br />
        </>
      )}

      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default Goals;