import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const Error404 = () => {
  return (
    <Container className="text-center mt-3">
      <Row>
        <Col>
          <div>
            <img
              style={{ maxHeight: "400px", objectFit: "cover" }}
              src="/assets/error404.jpg"
              alt=""
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>Looks like you are lost in the space</h5>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
            <Button as={NavLink} to="/">Back to Home</Button>
        </Col>
      </Row>
    </Container>
  );
};
