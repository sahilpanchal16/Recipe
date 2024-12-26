import React, { useEffect, useState } from "react";
import axios from "axios";
import MyNavbar from "../Navbar/Navabar";

const Hero = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch recipes from the backend
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:1604/recipes/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(response.data.data || []); // Adjust based on the API response structure
      setError(null);
    } catch (err) {
      console.error(
        "Error fetching recipes:",
        err.response?.data || err.message
      );
      setError("Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRecipes();
    } else {
      alert("Unauthorized! Redirecting to login.");
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <MyNavbar />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F6F9FC",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Recipe Grid */}
          {loading ? (
            <p>Loading recipes...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`http://localhost:1604/img/${recipe.poster}`}
                    alt={recipe.recipe_name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "20px" }}>
                    <h3>{recipe.recipe_name}</h3>
                    <p>{recipe.calories} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Hero;
