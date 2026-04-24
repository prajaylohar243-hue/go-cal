import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function ActivityLevel() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const [activity, setActivity] = useState("");

  // 🔥 Prefill if exists
  useEffect(() => {
    if (userData?.activity) {
      setActivity(userData.activity);
    }
  }, [userData]);

  const handleNext = () => {
  if (!activity) {
    alert("Select activity level");
    return;
  }

  const currentUser = localStorage.getItem("currentUser");

  const stored =
    JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};

  const updatedData = {
    ...stored,
    activity
  };

  localStorage.setItem(
    `userData_${currentUser}`,
    JSON.stringify(updatedData)
  );

  setUserData(updatedData);

  navigate("/goals");
};

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>GoCal</h1>
      <h2>Activity Level</h2>

      <p>How active are you?</p>

      <select value={activity} onChange={(e) => setActivity(e.target.value)}>
        <option value="">Select Activity</option>
        <option value="sedentary">Sedentary</option>
        <option value="light">Lightly Active</option>
        <option value="moderate">Moderately Active</option>
        <option value="active">Very Active</option>
        <option value="athlete">Athlete</option>
      </select>

      <br /><br />

      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default ActivityLevel;