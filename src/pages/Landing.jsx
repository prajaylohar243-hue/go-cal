import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-6">

      {/* NAVBAR (LOGO TOP LEFT) */}
      <div className="flex justify-between items-center py-4 max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-black dark:text-white">
          GoCal
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-black dark:text-white hover:underline"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm bg-black text-white dark:bg-white dark:text-black px-4 py-1 rounded-lg"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center mt-16">

        <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-4">
          Track. Improve. Transform.
        </h2>

        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
          A simple and powerful way to manage your calories, workouts, and fitness goals.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:scale-105 transition"
          >
            Start Now
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 border border-black dark:border-white text-black dark:text-white rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* WHO WE ARE */}
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
          Who We Are
        </h3>

        <p className="text-gray-600 dark:text-gray-400">
          GoCal is built to simplify fitness tracking. We focus on clarity,
          consistency, and actionable insights so you can focus on results instead of complexity.
        </p>
      </div>

      {/* BENEFITS */}
      <div className="max-w-5xl mx-auto mt-20 grid sm:grid-cols-3 gap-6 text-center">

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
          <h4 className="font-semibold mb-2">Stay Consistent</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track daily progress and build long-term habits.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
          <h4 className="font-semibold mb-2">Simple Tracking</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Log meals and workouts without unnecessary complexity.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
          <h4 className="font-semibold mb-2">Clear Insights</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Understand your calories, macros, and progress instantly.
          </p>
        </div>

      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto mt-20">

        <h3 className="text-2xl font-semibold text-center mb-8 text-black dark:text-white">
          Features
        </h3>

        <div className="grid sm:grid-cols-2 gap-6">

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
            <h4 className="font-semibold mb-2">Food Tracking</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Log meals and track calories and macros easily.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
            <h4 className="font-semibold mb-2">Workout Logging</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track exercises and monitor calories burned.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
            <h4 className="font-semibold mb-2">Progress Reports</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visualize your weekly progress with charts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
            <h4 className="font-semibold mb-2">Smart Coach</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get guidance based on your activity and goals.
            </p>
          </div>

        </div>
      </div>

      {/* MOTTO */}
      <div className="text-center mt-20 mb-10">
        <p className="text-gray-500 dark:text-gray-400 italic">
          “Consistency beats intensity.”
        </p>
      </div>

    </div>
  );
}

export default Landing;