import React, { useRef, useState } from "react";
import { SideBar } from "../../components/SideBar";
import axios from "axios";

import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { productSchema } from "../../utils/schema/product.schema";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AddProduct = () => {
  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);

  // reference to the hidden image input element
  const imageRef = useRef(null);

  // state to store the preview image
  const [previewImage, setPreviewImage] = useState(null);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Create a new FileReader instance to read the file
  const reader = new FileReader();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      brand: "",
      title: "",
      unitPrice: "",
      discountedPrice: "",
      quantity: "",
      description: "",
      productImage: null,
      isLive: false,
      isStock: false,
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    axios
      .get("../assets/product-default.png", { responseType: "blob" })
      .then((response) => {
        const blob = response.data;
        const file = new File([blob], "default.png", {
          type: "image/png",
        });
        setFieldValue("productImage", file);
      })
      .catch(() => {
        toast.error("Something went wrong! unable to get default product image");
      });
  },[]);

  // Check if the image is not null and read the file
  if (values.productImage !== null) {
    // Read the file and set the preview image
    reader.readAsDataURL(values.productImage);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  }
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
              Add Product
            </h2>
            <hr />
          </Col>
        </Row>
        <Container>
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col className="mb-3">
                <Form.Group controlId="formFile" className="mb-3">
                  {/* Image */}
                  <div>
                    <img
                      src={previewImage}
                      alt="Profile"
                      width="200px"
                      height="200px"
                      style={{ objectFit: "cover", borderRadius: "4%" }}
                    />
                  </div>

                  {/* Hidden Image input */}
                  <Form.Control
                    hidden
                    ref={imageRef}
                    type="file"
                    multiple={false}
                    accept="image/*"
                    onChange={(e) => {
                      setFieldValue("productImage", e.target.files[0]);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.productImage && !!errors.productImage}
                  />
                  {/* Error message */}
                  <Form.Control.Feedback type="invalid">
                    {errors.productImage}
                  </Form.Control.Feedback>
                </Form.Group>
                {/*Button to trigger the hidden image input */}
                <Button
                  variant="primary"
                  onClick={() => {
                    imageRef.current.click();
                  }}
                >
                  Choose Product Image
                </Button>
              </Col>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="brand" md={6} className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Brand"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.brand}
                  isInvalid={touched.brand && !!errors.brand}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.brand}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="title" md={6} className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  isInvalid={touched.title && !!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                controlId="unitPrice"
                md={4}
                className="mb-3"
              >
                <Form.Label>Unit Price</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Unit Price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unitPrice}
                    isInvalid={touched.unitPrice && !!errors.unitPrice}
                  />
                  <InputGroup.Text>CAD</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.unitPrice}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="discountedPrice"
                md={4}
                className="mb-3"
              >
                <Form.Label>Discounted Price</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Discounted Price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.discountedPrice}
                    isInvalid={
                      touched.discountedPrice && !!errors.discountedPrice
                    }
                  />
                  <InputGroup.Text>CAD</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.discountedPrice}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} controlId="quantity" md={4} className="mb-3">
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Stock Quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  isInvalid={touched.quantity && !!errors.quantity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.quantity}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row>
              <Form.Group
                as={Col}
                controlId="description"
                md={12}
                className="mb-3"
              >
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  placeholder="Provide a clear and concise description of your product"
                  rows={5}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                  isInvalid={touched.description && !!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md={2} className="mb-3">
                <Form.Check
                  type="switch"
                  id="isLive"
                  label="Live"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.isLive}
                />
              </Form.Group>
              <Form.Group as={Col} md={2} className="mb-3">
                <Form.Check
                  type="switch"
                  id="isStock"
                  label="In Stock"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.isStock}
                />
              </Form.Group>
            </Row>
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
              <span>Add Product</span>
            </Button>
          </Form>
        </Container>
      </Container>
    </>
  );
};
