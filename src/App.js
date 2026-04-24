import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import PersonalDetails from "./pages/Onboarding/PersonalDetails";
import ActivityLevel from "./pages/Onboarding/ActivityLevel";
import Goals from "./pages/Onboarding/Goals";
import Plan from "./pages/Onboarding/Plan";

import Track from "./pages/Track";
import Exercise from "./pages/Exercise";
import Report from "./pages/Report";
import Coach from "./pages/Coach";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Onboarding */}
        <Route path="/personal" element={<PersonalDetails />} />
        <Route path="/activity" element={<ActivityLevel />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/plan" element={<Plan />} />

        {/* Main App */}
        <Route path="/dashboard" element={<Home />} />
        <Route path="/track" element={<Track />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/report" element={<Report />} />
        <Route path="/coach" element={<Coach />} />
      </Routes>
    </Router>
  );
}

export default App;