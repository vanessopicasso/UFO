import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Modal from "./NewPetModal";
import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";

const Layout = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const buttonStyle = {
    position: "fixed",
    bottom: "50px",
    right: "15px",
    backgroundColor: "#c6f3ffff",
    width: "69px",
    height: "69px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "35px",
    color: "#000",
    textDecoration: "none",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
  };

  const bodyStyle = {
    overflow: "auto",
    padding: "16px",
    flex: "1",
  };

  return (
    <>
      <div style={bodyStyle}>
        <Outlet />
      </div>
      <div className="card-footer text-dark" style={footerStyle}>
        ©vanesso_picasso
      </div>
      <Modal showModal={showModal} closeModal={toggleModal} />
      <div style={buttonStyle} onClick={toggleModal}>
        <Icon path={mdiPlus} size={0.8} color={"black"} />
      </div>
    </>
  );
};

const footerStyle = {
  padding: "8px",
  textAlign: "center",
  backgroundColor: "#b45f06",
  fontFamily: "Georgia, serif",
};

export default Layout;