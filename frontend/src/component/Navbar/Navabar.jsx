import React, { useEffect, useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by verifying the token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Clear user data and token
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <BootstrapNavbar bg="light" expand="lg" className="px-3">
      {/* Website Logo */}
      <BootstrapNavbar.Brand href="/">
        <h3>SP</h3>
      </BootstrapNavbar.Brand>

      {/* Toggle Button for Mobile View */}
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

      {/* Navbar Items */}
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto"></Nav>

        {/* Search Form */}
        <Form className="d-flex me-3">
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-primary">Search</Button>
        </Form>

        {/* User Options */}
        <Nav.Link href="/recipe">
          <i
            className="bi bi-journal-plus me-3"
            style={{ fontSize: "1.5rem" }}
          ></i>
        </Nav.Link>
        <Nav>
          {isLoggedIn ? (
            <Button
              variant="outline-danger"
              onClick={handleLogout}
              style={{ fontSize: "1.0rem" }}
            >
              Logout
            </Button>
          ) : (
            <Nav.Link href="/login">
              <Button style={{ fontSize: "1.0rem" }}>Login</Button>
            </Nav.Link>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default MyNavbar;
