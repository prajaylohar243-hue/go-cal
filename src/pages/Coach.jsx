import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

function Coach() {
  const [userData, setUserData] = useState({});
  const [meals, setMeals] = useState({});
  const [workouts, setWorkouts] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  const date = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const storedUser =
      JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
    const storedMeals =
      JSON.parse(localStorage.getItem("meals")) || {};
    const storedWorkouts =
      JSON.parse(localStorage.getItem("workouts")) || {};

    setUserData(storedUser);
    setMeals(storedMeals);
    setWorkouts(storedWorkouts);

    generateInitialMessage(storedUser);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const todaysMeals = meals[date] || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

  const todaysWorkouts = workouts[date] || [];

  const totalCalories = Object.values(todaysMeals)
    .flat()
    .reduce((acc, item) => acc + (item.calories || 0), 0);

  const burned = todaysWorkouts.reduce(
    (acc, item) => acc + (item.calories || 0),
    0
  );

  const macros = Object.values(todaysMeals)
    .flat()
    .reduce(
      (acc, item) => {
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fats += item.fats || 0;
        return acc;
      },
      { protein: 0, carbs: 0, fats: 0 }
    );

  const generateInitialMessage = (user) => {
    let msg = "Hey! I'm your fitness coach 🤖\n\n";

    if (!user || !user.goal) {
      msg += "Complete your profile first ⚙️";
    } else {
      msg += "Ask me about calories, protein, workouts, or advice!";
    }

    setMessages([{ sender: "coach", text: msg }]);
  };

  const generateResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("calorie")) {
      return `You've consumed ${totalCalories} kcal and burned ${burned} kcal today.`;
    }

    if (q.includes("protein")) {
      return `Your protein intake is ${macros.protein}g. Try to increase it 💪`;
    }

    if (q.includes("carb")) {
      return `Your carbs are ${macros.carbs}g. Balance them ⚖️`;
    }

    if (q.includes("fat")) {
      return `Fats: ${macros.fats}g. Keep it moderate 🥑`;
    }

    if (q.includes("goal")) {
      return `Your goal is "${userData.goal}". Stay consistent!`;
    }

    if (q.includes("advice")) {
      if (macros.protein < 60) return "Increase protein intake 💪";
      if (burned < 200) return "Be more active today 🏃";
      return "You're doing great 🔥";
    }

    return "Ask me about calories, protein, workouts, or advice 💬";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const coachReply = {
      sender: "coach",
      text: generateResponse(input)
    };

    setMessages((prev) => [...prev, userMsg, coachReply]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 flex flex-col h-[85vh]">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">
          Fitness Coach 🤖
        </h1>

        {/* CHAT */}
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-4 flex-1 overflow-y-auto flex flex-col gap-3">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-black text-white dark:bg-white dark:text-black self-end"
                  : "bg-gray-100 dark:bg-gray-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 border px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={handleSend}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default Coach;