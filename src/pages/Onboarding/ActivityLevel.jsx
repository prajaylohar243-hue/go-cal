import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function ActivityLevel() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const [activity, setActivity] = useState("");

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
    <div className="relative z-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">

      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">

        <h1 className="text-3xl font-bold mb-4">Activity Level</h1>

        <p className="text-gray-500 dark:text-gray-400 mb-4">
          How active are you?
        </p>

        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full bg-white dark:bg-gray-800 mb-4"
        >
          <option value="">Select Activity</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Lightly Active</option>
          <option value="moderate">Moderately Active</option>
          <option value="active">Very Active</option>
          <option value="athlete">Athlete</option>
        </select>

        <button
          onClick={handleNext}
          className="bg-black text-white dark:bg-white dark:text-black py-2 w-full rounded-lg"
        >
          Next
        </button>

      </div>
    </div>
  );
}

export default ActivityLevel;