import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const stored =
      JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};

    setUserData(stored);
    setFormData(stored);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    localStorage.setItem(
      `userData_${currentUser}`,
      JSON.stringify(formData)
    );

    setUserData(formData);
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      localStorage.removeItem("meals");
      localStorage.removeItem("workouts");
      alert("Data reset successfully");
    }
  };

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
          Settings ⚙️
        </h1>

        {/* PROFILE */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 mb-6 hover:shadow-lg transition">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile</h2>

            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              className="text-sm text-blue-500 hover:underline"
            >
              {editing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">

            {/* AGE */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Age</p>
              {editing ? (
                <input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => handleChange("age", e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="font-semibold">{userData.age || "-"}</p>
              )}
            </div>

            {/* GENDER */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Gender</p>
              {editing ? (
                <select
                  value={formData.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <p className="font-semibold capitalize">
                  {userData.gender || "-"}
                </p>
              )}
            </div>

            {/* WEIGHT */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Weight</p>
              {editing ? (
                <input
                  type="number"
                  value={formData.weight || ""}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="font-semibold">
                  {userData.weight || "-"} kg
                </p>
              )}
            </div>

            {/* HEIGHT */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Height</p>
              {editing ? (
                <input
                  type="number"
                  value={formData.height || ""}
                  onChange={(e) => handleChange("height", e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="font-semibold">
                  {userData.height || "-"} cm
                </p>
              )}
            </div>

            {/* GOAL */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Goal</p>
              {editing ? (
                <select
                  value={formData.goal || ""}
                  onChange={(e) => handleChange("goal", e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black"
                >
                  <option value="">Select Goal</option>
                  <option value="loss">Weight Loss</option>
                  <option value="maintain">Maintain</option>
                  <option value="gain">Muscle Gain</option>
                </select>
              ) : (
                <p className="font-semibold capitalize">
                  {userData.goal || "-"}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ACTIONS */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">

          <h2 className="text-xl font-semibold mb-4">Actions</h2>

          <div className="flex flex-col gap-3">

            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition active:scale-95"
            >
              Reset Data
            </button>

            <button
              onClick={handleLogout}
              className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 transition active:scale-95"
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Settings;