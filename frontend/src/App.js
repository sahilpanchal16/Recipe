import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./component/Login/Login";
import Signup from "./component/Login/Signup";
import Hero from "./component/Hero/Hero";
import RecipeForm from "./component/Recipe/Recipe";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Hero />} />
      <Route path="/recipe" element={<RecipeForm />} />
    </Routes>
  );
}

export default App;
