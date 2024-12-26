import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecipeForm() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    recipe_name: "",
    calories: "",
    ingredients: "",
    image: null,
    imagePreview: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch recipes from the backend
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:1604/recipes/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(response.data.data || []);
      setError(null); // Clear errors
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
    fetchRecipes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("recipe_name", formData.recipe_name);
    formDataToSend.append("calories", formData.calories);
    formDataToSend.append("ingredients", formData.ingredients);
    if (formData.image) formDataToSend.append("poster", formData.image);

    try {
      let response;
      if (editingIndex !== null) {
        const recipeId = recipes[editingIndex]._id;
        response = await axios.put(
          `http://localhost:1604/recipes/update/${recipeId}`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedRecipes = [...recipes];
        updatedRecipes[editingIndex] = response.data.data;
        setRecipes(updatedRecipes);
        setEditingIndex(null);
        setFormData({
          recipe_name: "",
          calories: "",
          ingredients: "",
          image: null,
          imagePreview: null,
        });
      } else {
        response = await axios.post(
          "http://localhost:1604/recipes/create",
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecipes([...recipes, response.data.data]);
        setFormData({
          recipe_name: "",
          calories: "",
          ingredients: "",
          image: null,
          imagePreview: null,
        });
      }
    } catch (err) {
      console.error(
        "Error submitting recipe:",
        err.response?.data || err.message
      );
      alert("Failed to submit recipe. Please try again.");
    }
  };

  const handleEdit = (index) => {
    const recipe = recipes[index];
    setFormData({
      recipe_name: recipe.recipe_name,
      calories: recipe.calories,
      ingredients: recipe.ingredients,
      imagePreview: `http://localhost:1604/img/${recipe.poster}`,
    });
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    const recipeId = recipes[index]._id;
    try {
      await axios.delete(`http://localhost:1604/recipes/delete/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(recipes.filter((_, i) => i !== index));
    } catch (err) {
      console.error(
        "Error deleting recipe:",
        err.response?.data || err.message
      );
      alert("Failed to delete recipe. Please try again.");
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.recipe_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F6F9FC",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #D3DCE6",
            borderRadius: "8px",
            height: "40px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        />

        {/* Recipe Form */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {editingIndex !== null ? "Edit Recipe" : "Create a New Recipe"}
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              name="recipe_name"
              placeholder="Recipe Name"
              value={formData.recipe_name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #D3DCE6",
                borderRadius: "4px",
              }}
            />
            <input
              type="number"
              name="calories"
              placeholder="Calories"
              value={formData.calories}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #D3DCE6",
                borderRadius: "4px",
              }}
            />
            <textarea
              name="ingredients"
              placeholder="Ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={5}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #D3DCE6",
                borderRadius: "4px",
              }}
            />
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Preview"
                style={{
                  marginTop: "10px",
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <button
              type="submit"
              style={{
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {editingIndex !== null ? "Update Recipe" : "Submit Recipe"}
            </button>
          </form>
        </div>

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
            {filteredRecipes.map((recipe, index) => (
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
                  <p>{recipe.ingredients}</p>
                  <button
                    onClick={() => handleEdit(index)}
                    style={{
                      marginRight: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#007BFF",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#DC3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
