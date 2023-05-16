import React from "react";
import { useContext } from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { CategoryContext } from "../context/CategoryContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const { categories } = useContext(CategoryContext);

  return (
    <>
      <footer className="footer">
        <Container fluid className="bg-navbar">
          <Row className="text-white p-3 align-items-center">
            <Col xs={12} md={3} className="pb-3">
              <div
                className="d-flex"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                <img
                  src="/assets/logo.png"
                  width={80}
                  fluid="true"
                  className="d-inline-block align-top"
                  alt="QuickPik Logo"
                />
                <div className="d-flex flex-column justify-content-center">
                  <h4 className="m-0" style={{ fontSize: "1.2rem" }}>
                    QuickPik
                  </h4>
                  <small style={{ fontSize: "0.9rem" }}>
                    Rapid Reflection, Swift Selection
                  </small>
                </div>
              </div>
            </Col>
            <Col xs={12} md={3} className="pb-3">
              <h6>
                <Nav.Link as={NavLink} to="/products">
                  Products
                </Nav.Link>
              </h6>
              <ul className="list-group list-unstyled">
                {categories &&
                  categories.content.slice(0,5).map((category, index) => {
                    return (
                      <Nav.Link
                        as={NavLink}
                        to={`/category/${category.categoryId}/products`}
                        key={index}
                      >
                        {category.categoryTitle}
                      </Nav.Link>
                    );
                  })}
              </ul>
            </Col>
            <Col xs={12} md={3} className="pb-3">
              <h6>Help & Support</h6>
              <ul className="list-group list-unstyled">
                <Nav.Link as={NavLink} to="/about">
                  About Us
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contact">
                  Contact Us
                </Nav.Link>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </Col>
            <Col xs={12} md={3}>
              <h6 className="text-center">
                Don't miss out on exclusive deals and updates! Sign up for our
                newsletter today.
              </h6>
              <button className="btn btn-outline-light w-100 mb-3 mt-3">
                Signup
              </button>
              <div className="d-flex gap-2 justify-content-center">
                {/* Social Icons */}
                <a
                  href="https://www.facebook.com/"
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-square-facebook fs-4"></i>
                </a>
                <a
                  href="https://www.instagram.com/"
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-instagram fs-4"></i>
                </a>
                <a
                  href="https://twitter.com/?lang=en"
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-twitter fs-4"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/sourav009/"
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-linkedin fs-4"></i>
                </a>
                <a
                  href="https://www.youtube.com/"
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-youtube fs-4"></i>
                </a>
              </div>
            </Col>
          </Row>
          <Row className="text-white text-center">
            <Col className="pb-2">
              <small>
                Copyright &copy; QuickPik, {currentYear} | All Rights Reserved
              </small>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}
