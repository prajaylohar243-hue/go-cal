import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PersonalDetails() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  // 🔥 Load ONLY current user data
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) return;

    const stored =
      JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};

    setAge(stored.age || "");
    setGender(stored.gender || "");
    setWeight(stored.weight || "");
    setHeight(stored.height || "");

    console.log("PERSONAL LOAD:", stored);
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

    console.log("PERSONAL SAVE:", updatedData);

    navigate("/activity");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>GoCal</h1>
      <h2>Personal Details</h2>

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <br /><br />

      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <br /><br />

      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <br /><br />

      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default PersonalDetails;