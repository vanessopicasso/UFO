import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const NewPetModal = ({ showModal, closeModal }) => {
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [weight, setWeight] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    // You can add your logic to save the new pet data here
    closeModal();
  };

  return (
    <Modal show={!!showModal} onHide={closeModal} className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>New Pet!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="petName">
            <Form.Label>Pet's Name</Form.Label>
            <Form.Control
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
          </Form.Group>
          {/* Add more form fields for Breed, Sex, Birth Date, Weight, Additional Details */}
          {/* Example: */}
          {/* <Form.Group controlId="breed">
            <Form.Label>Breed</Form.Label>
            <Form.Control
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
          </Form.Group> */}
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Modal.Body>
      {/* Add a footer with the button for adding a profile picture */}
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary">Add Profile Picture</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewPetModal;