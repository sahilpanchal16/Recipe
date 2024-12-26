const Users = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Import bcrypt

const SALT_ROUNDS = 10; // Set the number of salt rounds for hashing

// Create User
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Save the user to the database
    await Users.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Can't Create User:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ message: "Username/Email and password are required" });
    }

    // Find user by email or username
    const user = await Users.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare entered password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const tokenData = { id: user._id, username: user.username };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Can't Login User:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Users
const getUSer = async (req, res) => {
  try {
    const users = await Users.find(); // Fetch all users
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Can't Delete User:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, getUSer, loginUser, deleteUser };
