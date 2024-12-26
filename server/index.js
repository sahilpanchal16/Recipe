const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { user_router } = require("./src/routes/user");
const { router } = require("./src/routes/Recipe"); 
const path = require("path"); 

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images from the /imgs directory
app.use("/img", express.static(path.join(__dirname, "../imgs"))); 

// Use routes
app.use("/user", user_router);
app.use("/recipes", router); 

const PORT = process.env.PORT || 1604;
app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  console.log(`Server started at http://localhost:${PORT}/`);
});
