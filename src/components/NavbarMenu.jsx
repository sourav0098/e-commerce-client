import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/user.context";

const NavbarMenu = () => {
  const userContext = useContext(UserContext);

  // logout function
  const doLogout = () => {
    // remove user data and token from local storage and user context
    userContext.doLogout(); 
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-navbar" variant="dark">
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
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/products">
                Products
              </Nav.Link>
              <NavDropdown title="Categories" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.2">
                  Mobile Phones
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Laptops</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.4">Cameras</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={NavLink} to="/about">
                About Us
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact">
                Contact Us
              </Nav.Link>
            </Nav>
            <Nav>
              {userContext.isLogin ? (
                <>
                  <Nav.Link as={NavLink} to="/cart">
                    <i className="fa-solid fa-cart-shopping"></i> Cart
                  </Nav.Link>
                  <Nav.Link onClick={doLogout}>
                    Logout
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/profile">
                    Hello, {userContext.userData.fname}
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register">
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
