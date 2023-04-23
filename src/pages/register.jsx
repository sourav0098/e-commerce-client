import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import { registerSchema } from "./schema/register.schema";
import { registerUser } from "../services/user.service";
import { toast } from "react-toastify";

export default function Register() {
  const [serverError, setServerError] = useState(null);

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        fname: "",
        lname: "",
        email: "",
        password: "",
        cpassword: "",
      },
      validationSchema: registerSchema,
      onSubmit: (values, actions) => {
        registerUser(values)
          .then((res) => {
            console.log(res);
            toast.success("User registered successfully!");
            actions.resetForm();
          })
          .catch((err) => {
            if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              setServerError(err.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          });
      },
    });

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
        {/* server side validation alert */}
        {serverError && (
          <Row>
            <Col>
              {typeof serverError === "string" ? (
                <Alert variant="danger" className="p-2 mt-2">
                  {serverError}
                </Alert>
              ) : (
                <Alert variant="danger" className="p-2 mt-2">
                  <ul>
                    {serverError.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              )}
            </Col>
          </Row>
        )}

        {/* Register Form */}
        <Row>
          <Col>
            <h3>Register</h3>
          </Col>
        </Row>
        <Form noValidate className="mt-2" onSubmit={handleSubmit}>
          <Row className="mb-3 justify-content-center" md={10}>
            <Form.Group as={Col} controlId="fname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fname}
                isInvalid={touched.fname && !!errors.fname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fname}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="lname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lname}
                isInvalid={touched.lname && !!errors.lname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lname}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                autoComplete="on"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                isInvalid={touched.email && errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                autoComplete="on"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                isInvalid={touched.password && errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="cpassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                autoComplete="on"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.cpassword}
                isInvalid={touched.cpassword && !!errors.cpassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cpassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button variant="primary" type="submit">
            Register
          </Button>
          <small className="text-left mt-2 mb-2 d-block">
            Already have an account? <NavLink to="/login" className="text-decoration-none">login</NavLink>
          </small>
        </Form>
      </Container>
    </>
  );
}
