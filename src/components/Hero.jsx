import React, { useContext } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Hero({ title, description, children }) {
  // get user context
  const userContext = useContext(UserContext);

  return (
    <>
      <Container className="pt-4 pb-4">
        <Row>
          <Col
            xs={12}
            md={6}
            className="d-flex flex-column justify-content-center"
          >
            <h1>{title}</h1>
            <p>{description}</p>
            {/* If user is logged in dont show login/register button otherwise show buttons  */}
            {userContext.isLogin ? (
              ""
            ) : (
              <div>
                <Button
                  as={NavLink}
                  to="/login"
                  variant="primary"
                  className="me-2"
                >
                  Login
                </Button>
                <Button
                  as={NavLink}
                  to="/register"
                  variant="outline-primary"
                  className="me-3"
                >
                  Register
                </Button>
              </div>
            )}
          </Col>
          <Col xs={12} md={6}>
            <img
              src="/assets/hero-image.png"
              style={{ width: "100%" }}
              fluid="true"
              className="d-inline-block align-top"
              alt="QuickPik Logo"
            />
          </Col>
        </Row>
      </Container>
      {children}
    </>
  );
}
