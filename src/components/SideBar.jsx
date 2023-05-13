import React, { useContext, useEffect, useState } from "react";
import { Nav, Offcanvas } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { isAdminUser } from "../auth/HelperAuth";

export const SideBar = ({ show, handleClose }) => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  // check user is admin or not
  useEffect(() => {
    setIsAdmin(isAdminUser());
  },[isAdmin]);

  // logout function
  const doLogout = () => {
    // remove user data and token from local storage and user context
    userContext.doLogout();
    navigate("/login"); // redirect to login page
  };

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
          <Nav.Link
            as={NavLink}
            to="/profile"
            className="list-group-item sidebar-item"
          >
            <i className="fa-solid fa-user me-2"></i>
            <span>Profile</span>
          </Nav.Link>

          {isAdmin ? (
            <>
              <Nav.Link
                as={NavLink}
                to="/admin/users"
                className="list-group-item sidebar-item"
              >
                <i className="fa-solid fa-users me-2"></i>
                <span>Users</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/add-category"
                className="list-group-item sidebar-item"
              >
                <i className="fa-solid fa-plus me-2"></i>
                <span>Add Category</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/categories"
                className="list-group-item sidebar-item"
              >
                <i className="fa-solid fa-list me-2"></i>
                <span>View Categories</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/add-product"
                className="list-group-item sidebar-item"
              >
                <i className="fa-solid fa-box-open me-2"></i>
                <span>Add Product</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/products"
                className="list-group-item sidebar-item"
              >
                <i className="fa-solid fa-boxes-stacked me-2"></i>
                <span>View Products</span>
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/orders"
                className="list-group-item sidebar-item"
              >
                <i className="fa-solid fa-truck-fast me-2"></i>
                <span>Orders</span>
              </Nav.Link>
            </>
          ) : (
            ""
          )}
          <Nav.Link className="list-group-item sidebar-item" onClick={doLogout}>
            <i className="fa-solid fa-right-from-bracket me-2"></i>
            <span>Logout</span>
          </Nav.Link>
        </ul>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
