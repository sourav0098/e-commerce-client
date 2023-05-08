import React, { useState } from "react";
import { SideBar } from "../../components/SideBar";
import { Col, Container, Row } from "react-bootstrap";

const ViewUsers = () => {
  document.title = "QuickPik | Users";

  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
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
              Users
            </h2>
            <hr />
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default ViewUsers;
