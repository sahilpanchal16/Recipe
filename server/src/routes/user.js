const express = require("express");
const {
  createUser,
  getUSer,
  loginUser,
  deleteUser,
} = require("../Controllers/user");
const { authToken } = require("../Middlewares/tokenAuth");

const user_router = express.Router();

user_router.get("/get", authToken, getUSer);
user_router.post("/register", createUser);
user_router.post("/login", loginUser);
user_router.delete("/delete/:id", authToken, deleteUser);
module.exports = { user_router };
