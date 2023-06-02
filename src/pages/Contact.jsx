import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

export const Contact = () => {
  return (
    <Container className="mt-3">
      <Row>
        <Col md={12}>
          <h4>Meet our team</h4>
          <p className="text-muted">
            Please feel free to contact for any questions or opportunities
          </p>
        </Col>
        <Col md={12} lg={8} xl={6} xxl={6}>
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col xs={{ span: 4, offset: 3 }} md={{ span: 4, offset: 0 }}>
                  <img
                    src="/assets/sourav.png"
                    alt="Sourav Choudhary"
                    className="img-fluid"
                    style={{
                      width: "100%",
                    }}
                  />
                </Col>
                <Col md={8}>
                  <h5 className="m-0 product-title">
                    <a
                      href="https://www.linkedin.com/in/sourav009/"
                      target="_blank"
                      rel="noreferrer"
                      className="nav-link p-0"
                    >
                      Sourav Choudhary
                      <i
                        className="fa-brands fa-linkedin ms-2"
                        style={{ color: "#0072b1" }}
                      ></i>
                    </a>
                  </h5>
                  <small className="text-muted fw-semibold">
                    FULL STACK SOFTWARE DEVELOPER
                  </small>
                  <p className="mb-4">
                    Highly skilled software developer proficient in Java, Spring
                    Boot, React.js with good experience of developing innovative
                    solutions and collaborating effectively in team
                    environments
                  </p>
                  <a
                    href="mailto:souravchoudhary1998@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-solid fa-envelope text-muted fs-5 me-2"></i>
                  </a>
                  <small>souravchoudhary1998@gmail.com</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
