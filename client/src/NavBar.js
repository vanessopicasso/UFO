import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserProvider";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Icon from "@mdi/react";
import { mdiLogout } from "@mdi/js";
import "./index.css";

function NavBar() {
  const { loggedInUser, login, logout, signUp } = useContext(UserContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setShow(false);
    setError(""); // Clear any previous error messages
  };

  const handleShow = () => {
    setShow(true);
    setIsSigningUp(false);
    setError(""); // Clear any previous error messages
  };

  const handleToggle = () => {
    setIsSigningUp(!isSigningUp);
    setName("");
    setEmail("");
    setError(""); // Clear any previous error messages
  };

  const handleFormSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      if (isSigningUp) {
        await signUp({ name, email }); // Use signUp function from UserContext
      } else {
        await login({ username: name, email });
      }
      handleClose(); // Close modal on successful sign-up or login
    } catch (error) {
      setError(error.message); // Display error message
    }
  };

  return (
    <>
      <Navbar expand="lg" style={componentStyle()}>
        <Container>
          <Navbar.Brand style={brandStyle()} onClick={() => navigate("/")}>
            My Pets
          </Navbar.Brand>
          <Nav>
            {loggedInUser ? (
              <Nav.Link onClick={logout} style={{ color: "black" }}>
                <Icon path={mdiLogout} size={0.8} color={"black"} /> Log Out
              </Nav.Link>
            ) : (
              <Nav.Link onClick={handleShow} style={{ color: "black" }}>
                Sign In
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <div className="d-flex justify-content-between align-items-center w-100">
            <Modal.Title>{isSigningUp ? "Sign Up" : "Sign In"}</Modal.Title>
            <Button variant="secondary" onClick={handleToggle} className="custom-button">
              {isSigningUp ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>} {/* Display error message if present */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormSubmit} className="custom-primary-button">
            {isSigningUp ? "Sign Up" : "Sign In"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function componentStyle() {
  return { backgroundColor: "#b45f06" };
}

function brandStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "black",
    fontFamily: "Georgia, serif",
    fontWeight: "bold",
    fontSize: "30px",
    cursor: "pointer", // Add cursor pointer to indicate it's clickable
  };
}

export default NavBar;