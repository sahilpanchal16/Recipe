const Recipe = require("../Models/Recipe"); 
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Multer Configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imgPath = path.join(__dirname, "../imgs");
    if (!fs.existsSync(imgPath)) fs.mkdirSync(imgPath);
    cb(null, imgPath);
  },
  filename: (req, file, cb) => {
    const prefix = Date.now() + "-" + Math.round(Math.random() * 100000);
    cb(null, prefix + "-" + file.originalname); 
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only images are allowed."));
    }
    cb(null, true);
  },
});

// Create a new recipe
const createRecipe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    const { recipe_name, calories, ingredients } = req.body;
    const user = req.user.id;
    const poster = req.file ? req.file.filename : null; // Save the image filename if uploaded

    const newRecipe = new Recipe({
      recipe_name,
      calories,
      ingredients,
      poster,
      user,
    });

    const saveRecipe = await newRecipe.save();
    res
      .status(201)
      .json({ msg: "Recipe created successfully", data: newRecipe });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Error creating recipe", error });
  }
};

// Update an existing recipe
const updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { recipe_name, calories, ingredients } = req.body;
    const poster = req.file ? req.file.filename : null;

    const recipe = await Recipe.findOne({ _id: recipeId, user: req.user.id });
    if (!recipe) {
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized access." });
    }

    const updateData = { recipe_name, calories, ingredients };
    if (poster) updateData.poster = poster;

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updateData, {
      new: true,
    });
    res.json({ msg: "Recipe updated successfully", data: updatedRecipe });
  } catch (error) {
    console.error("Error updating Recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all recipes
const getRecipe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    const recipes = await Recipe.find({ user: req.user.id });
    res.status(200).json({ data: recipes });
  } catch (error) {
    console.error("Error fetching Recipe:", error);
    res.status(500).json({ error: "Failed to fetch Recipe" });
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findOne({ _id: recipeId, user: req.user.id });

    if (!recipe) {
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized access." });
    }

    if (recipe.poster) {
      const posterPath = path.join(__dirname, "../imgs", recipe.poster);
      if (fs.existsSync(posterPath)) fs.unlinkSync(posterPath);
    }

    await Recipe.deleteOne({ _id: recipeId });
    res.json({ msg: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting Recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createRecipe,
  updateRecipe,
  getRecipe,
  deleteRecipe,
  upload,
};
