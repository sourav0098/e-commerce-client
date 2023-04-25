import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { SideBar } from "../../components/SideBar";
import { AddressAutofill } from "@mapbox/search-js-react";

const Profile = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Sidebar */}
      <SideBar show={show} handleClose={handleClose}></SideBar>

      <Container>
        <Row>
          <Col>
            <h2 className="mt-3">
              <i
                className="fa-solid fa-bars me-2"
                style={{ cursor: "pointer" }}
                onClick={handleShow}
              ></i>
              Profile
            </h2>
            <hr />
          </Col>
        </Row>
        <Container>
          {/* Profile Form */}
          <Form>
            <Row>
              <Form.Group as={Col} controlId="fname" md={6} className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="First Name" />
              </Form.Group>
              <Form.Group as={Col} controlId="lname" md={6} className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Last Name" />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="email" md={6} className="mb-3">
                <Form.Label>Email</Form.Label>
                <p className="form-control mb-0 text-muted" disabled>
                  souravchoudhary@gmail.com
                </p>
              </Form.Group>
              <Form.Group as={Col} controlId="phone" md={6} className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" placeholder="Phone" />
              </Form.Group>
            </Row>
            {/* Adding mapbox address autofill */}
            <AddressAutofill
              accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              options={{
                country: "CA",
                language: "en",
              }}
            >
              <Row>
                <Form.Group
                  as={Col}
                  controlId="address"
                  md={12}
                  className="mb-3"
                >
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    autoComplete="address-line-1"
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} controlId="city" md={4} className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    autoComplete="address-level2"
                  />
                </Form.Group>
                <Form.Group
                  as={Col}
                  controlId="province"
                  md={4}
                  className="mb-3"
                >
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Province"
                    autoComplete="address-level1"
                  />
                </Form.Group>
                <Form.Group
                  as={Col}
                  controlId="postalCode"
                  md={4}
                  className="mb-3"
                >
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Postal Code"
                    autoComplete="postal-code"
                  />
                </Form.Group>
              </Row>
            </AddressAutofill>
            <Button variant="primary" className="mb-3">
              Save
            </Button>
          </Form>
        </Container>
      </Container>
    </>
  );
};

export default Profile;
