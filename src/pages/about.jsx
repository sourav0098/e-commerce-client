import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

export const About = () => {
  return (
    <Container className="mt-3">
      <Row className="mb-4">
        <Col className="text-center" md={12}>
          <h2>Your One-Stop-Shop for the Latest Electronics</h2>
        </Col>
        <Col className="text-center" md={12}>
          <p>
            At QuickPik, we're passionate about providing you with a seamless
            online shopping experience for all your electronic needs. Whether
            you're searching for the hottest smartphones, cutting-edge laptops,
            or innovative smart home devices, we've got you covered. With our
            extensive product range and user-friendly platform, finding and
            purchasing the perfect electronics has never been easier.
          </p>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Card className="ps-4 pe-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Card.Img variant="top" src="/assets/hero-image.png" />
                </Col>
                <Col
                  className="d-flex  flex-column justify-content-center"
                  md={9}
                >
                  <h4>Browse Our Exceptional Selection</h4>
                  <p>
                    Discover a world of possibilities as you explore our curated
                    collection of top-notch electronics. We pride ourselves on
                    offering a wide range of brands, models, and features,
                    ensuring that you'll find the ideal device to suit your
                    needs and preferences. From flagship smartphones that
                    redefine mobile technology to powerful laptops that fuel
                    your productivity, QuickPik is your gateway to the latest
                    advancements in the electronic realm.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Card className="ps-4 pe-4">
            <Card.Body>
              <Row>
                <Col
                  className="d-flex  flex-column justify-content-center"
                  md={9}
                >
                  <h4>Simplified Shopping Experience</h4>
                  <p>
                    At QuickPik, we understand the importance of simplicity and
                    convenience when it comes to online shopping. Our intuitive
                    platform has been designed with you in mind, making it
                    effortless to navigate through our product categories,
                    compare options, and make informed purchase decisions. We've
                    streamlined the buying process to save you time, so you can
                    quickly find what you're looking for and proceed to checkout
                    with confidence.
                  </p>
                </Col>
                <Col md={3}>
                  <Card.Img variant="top" src="/assets/about-3.png" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Card className="ps-4 pe-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Card.Img variant="top" src="/assets/about-2.png" />
                </Col>
                <Col className="d-flex flex-column justify-content-center">
                  <h4>Exceptional Customer Service</h4>
                  <p>
                    We believe that exceptional customer service is the
                    foundation of a successful e-commerce business. That's why
                    our dedicated team at QuickPik is committed to providing you
                    with unrivaled support throughout your shopping journey.
                    Whether you have a question about a product, need assistance
                    with an order, or simply want personalized recommendations,
                    our friendly and knowledgeable staff is here to help. Your
                    satisfaction is our top priority.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h4>Meet our team</h4>
          <p className="text-muted">
            Please feel free to contact for any questions for opportunities
          </p>
        </Col>
        <Col md={12} lg={8} xl={6} xxl={6}>
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col xs={{ span: 4, offset: 3 }} md={{span:4, offset:0}}>
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
                  <h5 className="m-0">
                    Sourav Choudhary
                    <a
                      href="https://www.linkedin.com/in/sourav009/"
                      target="_blank"
                      rel="noreferrer"
                      className="ms-2"
                    >
                      <i
                        className="fa-brands fa-linkedin"
                        style={{ color: "#0072b1" }}
                      ></i>
                    </a>
                  </h5>
                  <small className="text-muted">SOFTWARE DEVELOPER</small>
                  <p className="mb-4">
                    Full Stack Developer | Java | Spring Boot | React.js |
                    Apache Kafka | GraphQL |
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
