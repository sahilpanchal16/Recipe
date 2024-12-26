import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = { email, password };

    try {
      // Attempt login
      const response = await axios.post(
        "http://localhost:1604/user/login",
        userInfo
      );

      if (response.data.token) {
        // Save token and user info in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);

        // Redirect to the user dashboard or homepage
        navigate("/"); // Replace with the correct user route
      } else {
        setError("Invalid login credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <div className="border rounded p-4 shadow">
            <h2 className="text-center mb-4">Login</h2>
            <Form onSubmit={handleSubmit}>
              {/* Email Field */}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Error Message */}
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {/* Submit Button */}
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary">
                Sign up
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
