import React from "react";
import { Col, Container, Row } from "react-bootstrap";

export default function Hero({ title, description, children }) {
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
            <div>
              <button className="btn btn-primary me-3 d-inline-block">
                Login
              </button>
              <button className="btn btn-outline-primary">Register</button>
            </div>
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
