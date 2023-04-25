import React from "react";
import { NavLink, Offcanvas } from "react-bootstrap";

export const SideBar = ({ show, handleClose }) => {
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      scroll={true}
      style={{
        backgroundColor: "var(--primary-color)",
        color: "white",
        maxWidth: "220px",
      }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>QuickPik</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0">
        <ul className="list-group">
          <NavLink as={NavLink} to="/profile" className="list-group-item sidebar-item"><i className="fa-solid fa-user me-2"></i>Profile</NavLink>
          <NavLink className="list-group-item sidebar-item">Profile</NavLink>
        </ul>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
