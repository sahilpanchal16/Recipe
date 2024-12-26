const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipe_name: { type: String, required: true },
  calories: { type: Number, required: true },
  ingredients: { type: String, required: true },
  poster: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
