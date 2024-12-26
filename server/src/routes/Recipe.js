const express = require("express");
const path = require("path");
const { authToken } = require("../Middlewares/tokenAuth"); 
const {
  createRecipe,
  updateRecipe,
  getRecipe,
  deleteRecipe,
  upload,
} = require("../Controllers/Recipe");

const router = express.Router(); 

router.use("/img", express.static(path.join(__dirname, "../imgs")));

// Routes
router.post("/create", authToken, upload.single("poster"), createRecipe);
router.put("/update/:id", authToken, upload.single("poster"), updateRecipe);
router.get("/get", authToken, getRecipe);
router.delete("/delete/:id", authToken, deleteRecipe);

module.exports = { router };
