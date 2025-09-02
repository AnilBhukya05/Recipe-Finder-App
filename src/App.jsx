import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [ingredient, setIngredient] = useState("");
  const [diet, setDiet] = useState("all");
  const [time, setTime] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dark mode by default
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchRecipes = async () => {
    if (!ingredient.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
          ingredient.trim()
        )}`
      );
      const data = await res.json();
      if (data.meals) {
        let filteredMeals = data.meals;

        if (diet === "vegetarian") {
          filteredMeals = filteredMeals.filter((meal) =>
            meal.strMeal.toLowerCase().includes("vegetarian")
          );
        }

        if (time === "quick") {
          filteredMeals = filteredMeals.slice(0, 6);
        }

        setRecipes(filteredMeals);
      } else {
        setRecipes([]);
        setError("No recipes found. Try another ingredient.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") fetchRecipes();
  };

  return (
    <div className="app">
      <h1 className="title">Taylor’s Smart Recipe Ideas</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter an ingredient (e.g. chicken, tomato)"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={onKeyDown}
          className="input"
          aria-label="ingredient"
        />

        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="select"
          aria-label="diet"
        >
          <option value="all">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
        </select>

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="select"
          aria-label="time"
        >
          <option value="all">Any Time</option>
          <option value="quick">Quick Meals</option>
        </select>

        <button onClick={fetchRecipes} className="button" aria-label="search">
          Search
        </button>

        {/* Dark mode default, toggle to white */}
        
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="button"
          aria-pressed={darkMode}
          style={{ backgroundColor: darkMode ? "#64748b" : "#0f172a" }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {loading && <p className="message">Loading recipes...</p>}
      {error && <p className="error">{error}</p>}

      <div className="recipes">
        {recipes.map((meal) => (
          <div key={meal.idMeal} className="card">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="card-img"
            />
            <h2 className="card-title">{meal.strMeal}</h2>
            <a
              href={`https://www.themealdb.com/meal/${meal.idMeal}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
            >
              View Recipe
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
