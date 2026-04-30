import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

function Coach() {
  const [userData, setUserData] = useState({});
  const [meals, setMeals] = useState({});
  const [workouts, setWorkouts] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

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
  }, [messages, typing]);

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

  // 🔥 AI CALL (Mistral)
  const generateResponse = async (query) => {
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `
You are a professional fitness coach.

Rules:
- Keep answers short
- Be practical
- Use numbers when possible

User Data:
Calories: ${totalCalories}
Protein: ${macros.protein}
Carbs: ${macros.carbs}
Fats: ${macros.fats}
Goal: ${userData.goal}

User Question:
${query}
`
        })
      });

      const data = await res.json();
      return data.reply;

    } catch {
      return "Unable to connect to AI";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setTyping(true);

    const replyText = await generateResponse(input);

    setTyping(false);

    const coachReply = {
      sender: "coach",
      text: replyText
    };

    setMessages((prev) => [...prev, coachReply]);
  };

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 flex flex-col h-[85vh]">

        <h1 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">
          Fitness Coach 🤖
        </h1>

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

          {/* 🔥 Typing Indicator */}
          {typing && (
            <div className="text-gray-400 text-sm">Coach is typing...</div>
          )}

          <div ref={bottomRef} />
        </div>

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