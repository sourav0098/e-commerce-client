import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Badge } from "react-bootstrap";
import { CartContext } from "../context/CartContext";

const NavbarMenu = ({ handleShowCategorySidebar }) => {
  const userContext = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();

  // logout function
  const doLogout = () => {
    // remove user data and token from local storage and user context
    userContext.doLogout();
    navigate("/login"); // redirect to login page
  };

  function toggleCollapse() {
    if (window.innerWidth < 992) {
      setExpanded(!expanded);
    }
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="bg-navbar"
        variant="dark"
        sticky="top"
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand className="p-0" as={NavLink} to="/">
            <div className="d-flex">
              <img
                src="/assets/logo.png"
                width={50}
                fluid="true"
                className="d-inline-block align-top"
                alt="QuickPik Logo"
              />
              <div className="d-flex flex-column justify-content-center">
                <h4 className="m-0" style={{ fontSize: "1rem" }}>
                  QuickPik
                </h4>
                <small style={{ fontSize: "0.8rem" }}>
                  Rapid Reflection, Swift Selection
                </small>
              </div>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={toggleCollapse}
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/products" onClick={toggleCollapse}>
                Products
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  toggleCollapse();
                  handleShowCategorySidebar();
                }}
              >
                Categories
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about" onClick={toggleCollapse}>
                About Us
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact" onClick={toggleCollapse}>
                Contact Us
              </Nav.Link>
            </Nav>
            <Nav>
              {userContext.isLogin ? (
                <>
                  <Nav.Link as={NavLink} to="/cart" onClick={toggleCollapse}>
                    <i className="fa-solid fa-cart-shopping"></i>
                    {cart && cart?.items.length === 0 ? (
                      ""
                    ) : (
                      <Badge className="cart-badge" bg="danger">
                        {cart && cart?.items?.length}
                      </Badge>
                    )}
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/orders" onClick={toggleCollapse}>
                    Orders
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => {
                      toggleCollapse();
                      doLogout();
                    }}
                  >
                    Logout
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/profile" onClick={toggleCollapse}>
                    Hello, {userContext.userData.fname}
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login" onClick={toggleCollapse}>
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/register"
                    onClick={toggleCollapse}
                  >
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarMenu;
