export const calculateBMR = ({ gender, weight, height, age }) => {
  if (gender === "Male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const getActivityMultiplier = (activity) => {
  switch (activity) {
    case "sedentary":
      return 1.2;
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "active":
      return 1.725;
    case "athlete":
      return 1.9;
    default:
      return 1.2;
  }
};

export const calculateCalories = (tdee, goal) => {
  if (goal === "loss") return tdee - 500;
  if (goal === "gain") return tdee + 500;
  return tdee; 
};

export const calculateMacros = (calories) => {
  const protein = (calories * 0.3) / 4;
  const carbs = (calories * 0.4) / 4;
  const fats = (calories * 0.3) / 9;

  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats)
  };
};