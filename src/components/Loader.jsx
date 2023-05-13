import React from "react";
import { Container, Spinner } from "react-bootstrap";

export const Loader = ({ show }) => {

  return (
    show && (
      <Container className="text-center mt-3">
        <Spinner animation="border"/>
      </Container>
    )
  );
};
