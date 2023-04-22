import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function register() {
  return (
    <>
      <Container fluid="sm" style={{ maxWidth: "900px" }}>
        <Row>
          <Col className="text-center mt-3">
            <div>
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
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Register</h3>
          </Col>
        </Row>
        <Form className="mt-2">
          <Row className="mb-3 justify-content-center" md={10}>
            <Form.Group as={Col} controlId="fname">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="First Name" />
            </Form.Group>
            <Form.Group as={Col} controlId="lname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Last Name" />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                autoComplete="on"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                autoComplete="on"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="cpassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                autoComplete="on"
              />
            </Form.Group>
          </Row>
          <Button variant="primary">Register</Button>
          <small className="text-left mt-2 mb-2 d-block">
            Already have an account? <NavLink to="/login">login</NavLink>{" "}
          </small>
        </Form>
      </Container>
    </>
  );
}
