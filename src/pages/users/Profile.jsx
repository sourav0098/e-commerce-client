import React, { useContext } from "react";
import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { SideBar } from "../../components/SideBar";
import { AddressAutofill } from "@mapbox/search-js-react";
import { useFormik } from "formik";
import { UserContext } from "../../context/user.context";
import { profileSchema } from "../../utils/schema/profile.schema";
import { useEffect } from "react";
import { getUserById, updateUser } from "../../services/user.service";
import { toast } from "react-toastify";
import { ImageUpload } from "../../components/users/ImageUpload";
import axios from "axios";

const Profile = () => {
  document.title = "QuickPik | Profile";
  const userContext = useContext(UserContext);

  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // Loading state for save button
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  // Server side validation error
  const [serverError, setServerError] = useState(null);

  // state for image file (can be a string or file object)
  const [image, setImage] = useState(null);

  // state for address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // methods for handling address changes
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };
  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
  };
  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value);
  };

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getUserFromServer();
  }, [userContext.userData]);

  const getUserFromServer = () => {
    if (userContext.userData) {
      // get user id from context
      const userId = userContext.userData.userId;

      // get user data from database
      getUserById(userId)
        .then((res) => {
          setUser(res);

          // setting the values of the form
          setValues({
            fname: res.fname,
            lname: res.lname,
            phone: res.phone == null ? "" : res.phone,
          });

          // setting the values of the address
          res.address == null ? setAddress("") : setAddress(res.address);
          res.city == null ? setCity("") : setCity(res.city);
          res.province == null ? setProvince("") : setProvince(res.province);
          res.postalCode == null
            ? setPostalCode("")
            : setPostalCode(res.postalCode);

          // get the user's image if it exists for user otherwise set default image
          if (res.image != null) {
            setImage(res.image);
          } else {
            // get default image in case user does not have an image
            axios
              .get("../assets/user-default.png", { responseType: "blob" })
              .then((response) => {
                const blob = response.data;
                const file = new File([blob], "default.png", {
                  type: "image/png",
                });
                setImage(file);
              })
              .catch(() => {
                toast.error("Something went wrong! unable to load image");
              });
          }
        })
        .catch((err) => {
          toast.error("Something went wrong! Please try again later");
        });
    }
  };

  // Formik form
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setValues,
    values,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      phone: "",
      image: "",
    },
    validationSchema: profileSchema,
    onSubmit: (values, actions) => {
      // set loading state to true
      // setLoading(true);
      const data = {
        ...values,
        email: userContext.userData.email,
        address,
        city,
        province,
        postalCode: postalCode.replace(/\s+/g, ""), // removes all whitespace from postal code input
      };

      // update user data in database
      setLoading(true);
      updateUser(userContext.userData.userId, data)
        .then((res) => {
          // show success toast
          toast.success("Profile updated successfully");
          setServerError(null);

          // get updated user data from server
          getUserFromServer();
        })
        .catch((err) => {
          if (err?.response?.data?.errors) {
            setServerError(err.response.data.errors);
            window.scrollTo(0, 0); // scroll to top of page
          } else {
            toast.error("Something went wrong! Please try again later");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

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
          {/* show spinner if user is null and data is still being fetched otherwise show form with values */}
          {user == null ? (
            <div className="text-center mb-3">
              <Spinner animation="border" as="span" size="lg"></Spinner>
            </div>
          ) : (
            <>
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
              {/* Image upload component */}
              {image == null ? "" : <ImageUpload image={image} userId={user.userId}/>}

              {/* Profile Form */}
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="fname"
                    md={6}
                    className="mb-3"
                  >
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
                  <Form.Group
                    as={Col}
                    controlId="lname"
                    md={6}
                    className="mb-3"
                  >
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
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="email"
                    md={6}
                    className="mb-3"
                  >
                    <Form.Label>Email</Form.Label>
                    <p
                      className="form-control mb-0 text-muted bg-light"
                      disabled
                    >
                      {user.email}
                    </p>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="phone"
                    md={6}
                    className="mb-3"
                  >
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      isInvalid={touched.phone && !!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
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
                        value={address}
                        onChange={handleAddressChange}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group
                      as={Col}
                      controlId="city"
                      md={4}
                      className="mb-3"
                    >
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="City"
                        autoComplete="address-level2"
                        value={city}
                        onChange={handleCityChange}
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
                        value={province}
                        onChange={handleProvinceChange}
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
                        value={postalCode}
                        onChange={handlePostalCodeChange}
                      />
                    </Form.Group>
                  </Row>
                </AddressAutofill>
                <Button
                  variant="primary"
                  className="mb-3"
                  type="submit"
                  disabled={loading}
                >
                  <Spinner
                    animation="border"
                    as="span"
                    size="sm"
                    className="me-2"
                    // loading state for save button
                    hidden={!loading}
                  ></Spinner>
                  <span>Save</span>
                </Button>
              </Form>
            </>
          )}
        </Container>
      </Container>
    </>
  );
};

export default Profile;
