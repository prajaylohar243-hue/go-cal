import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PersonalDetails() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const stored =
      JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};

    setAge(stored.age || "");
    setGender(stored.gender || "");
    setWeight(stored.weight || "");
    setHeight(stored.height || "");
  }, []);

  const handleNext = () => {
    if (!age || !gender || !weight || !height) {
      alert("Please fill all fields");
      return;
    }

    const currentUser = localStorage.getItem("currentUser");

    const updatedData = {
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height)
    };

    localStorage.setItem(
      `userData_${currentUser}`,
      JSON.stringify(updatedData)
    );

    navigate("/activity");
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">

      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Personal Details
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800"
          />

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white dark:bg-gray-800"
          />

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

export default PersonalDetails;