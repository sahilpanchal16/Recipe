import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user starts typing
    setSuccessMessage(""); // Clear success message when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure the API URL is correct
      const response = await axios.post("http://localhost:1604/user/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data) {
        setSuccessMessage("User registered successfully!");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after 2 seconds
        }, 2000);
      }
    } catch (err) {
      console.error("Error registering user:", err);

      // Handle the error response from the backend
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Failed to register. Please try again."
        );
      } else {
        // Handle network or other unexpected errors
        setError(
          "Failed to register. Please check your internet connection or try again later."
        );
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <div className="border rounded p-4 shadow">
            <h2 className="text-center mb-4">Sign Up</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a password"
                  required
                />
              </Form.Group>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert variant="success" className="mb-3">
                  {successMessage}
                </Alert>
              )}

              <Button variant="primary" type="submit" className="w-100">
                Sign Up
              </Button>
            </Form>
            <p className="text-center mt-3">
              Already have an account?{" "}
              <a href="/login" className="text-primary">
                Log in
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
