import { useFormik } from "formik";
import React from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { loginSchema } from "../utils/schema/LoginSchema";
import { useState } from "react";
import { loginUser } from "../services/user.service";
import { googleLogin } from "../services/user.service";
import { toast } from "react-toastify";
import { ROLES } from "../utils/roles";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  document.title = "QuickPik | Login";

  // Loading state for spinner
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // user context
  const userContext = useContext(UserContext);

  // Formik hook
  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: (values, actions) => {
        //  Set loading state to true for spinner
        setLoading(true);
        loginUser(values)
          .then((res) => {
            //  reset form
            actions.resetForm();

            const tokens = {
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
            };

            const { ...responseUser } = res.user;
            //  set user data and login status in user context
            userContext.doLogin(responseUser, tokens);

            // based on user role, redirect to dashboard or home page
            // NORMAL USER -> home page
            // ADMIN -> profile page
            res.user.roles.forEach((role) => {
              if (role.roleName === ROLES.NORMAL) {
                navigate("/");
              }
              if (role.roleName === ROLES.ADMIN) {
                navigate("/");
              }
            });
          })
          .catch((err) => {
            // unauthorised login error
            if (err.response.status === 401) {
              toast.error(err.response.data.message);
            } else {
              toast.error("Something went wrong! Please try again later");
            }
          })
          .finally(() => {
            //  Set loading state to false for spinner
            setLoading(false);
          });
      },
    });

  return (
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
          <h3>Login</h3>
        </Col>
      </Row>
      {/* Login Form */}
      <Form noValidate className="mt-2" onSubmit={handleSubmit}>
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
              isInvalid={touched.email && !!errors.email}
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
              isInvalid={touched.password && !!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit" disabled={loading}>
          <Spinner
            animation="border"
            as="span"
            size="sm"
            className="me-2"
            // loading state for register button
            hidden={!loading}
          ></Spinner>
          <span>Login</span>
        </Button>
        <small className="text-left mt-2 mb-2 d-block">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-decoration-none">
            register
          </NavLink>
        </small>
      </Form>

      {/* OR */}
      <Row className="align-items-center justify-content-center">
        <Col xs={5} className="text-right">
          <hr />
        </Col>
        <Col xs={2} className="text-center">
          <small>OR</small>
        </Col>
        <Col xs={5} className="text-left">
          <hr />
        </Col>
      </Row>
      {/* Google Login */}
      <Row>
        <Col className="d-flex align-items-center justify-content-center mt-3 mb-3">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              googleLogin(credentialResponse)
                .then((res) => {

                  const tokens = {
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                  };

                  const { ...responseUser } = res.user;
                  //  set user data and login status in user context
                  userContext.doLogin(responseUser, tokens);

                  // based on user role, redirect to dashboard or home page
                  // NORMAL USER -> home page
                  // ADMIN -> home page
                  res.user.roles.forEach((role) => {
                    if (role.roleName === ROLES.NORMAL) {
                      navigate("/");
                    }
                    if (role.roleName === ROLES.ADMIN) {
                      navigate("/");
                    }
                  });
                })
                .catch((err) => {
                  toast.error("Something went wrong! Please try again later");
                });
            }}
            onError={() => {
              toast.error("Something went wrong! Unable to login with Google");
            }}
            theme="filled_blue"
            size="large"
            width="300"
            text="signin_with"
            useOneTap
            auto_select
          />
        </Col>
      </Row>
    </Container>
  );
};
