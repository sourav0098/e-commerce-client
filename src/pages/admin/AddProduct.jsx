import React, { useRef, useState } from "react";
import { SideBar } from "../../components/SideBar";
import { Editor } from "@tinymce/tinymce-react";

import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  addProductWithCategory,
  addProductWithoutCategory,
  uploadProductImage,
} from "../../services/product.service";
import { getCategories } from "../../services/categories.service";
import { productWithFileSchema } from "../../utils/schema/ProductWithFileSchema";

export const AddProduct = () => {
  document.title = "QuickPik | Add Product";

  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // state to store categories
  const [categories, setCategories] = useState([]);

  // state to store selected category in which product will be added
  const [selectedCategoryId, setSelectedCategoryId] = useState(undefined);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // reference to the hidden image input element
  const imageRef = useRef(null);

  // reference to the rich text editor
  const editorRef = useRef(null);

  // state to store the preview image
  const [previewImage, setPreviewImage] = useState(null);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // fetch categories
  useEffect(() => {
    getCategories(0, 100)
      .then((data) => {
        setCategories(data.content);
      })
      .catch((err) => {
        toast.error("Something went wrong! Unable to fetch categories");
      });
  }, []);

  // Create a new FileReader instance to read the file
  const reader = new FileReader();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
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
      shortDescription: "",
      description: "",
      productImage: null,
      live: true,
      stock: true,
    },
    validationSchema: productWithFileSchema,
    onSubmit: (values, actions) => {
      const { productImage, ...product } = values;
      setLoading(true);
      if (selectedCategoryId === "none") {
        // add product without category
        addProductWithoutCategory(product)
          .then((data) => {
            toast.success("Product added successfully");
            if (productImage != null && productImage.name !== "default.png") {
              // upload image for product
              uploadProductImage(productImage, data.productId)
                .then((data) => {
                  toast.success("Product image uploaded successfully");
                })
                .catch((err) => {
                  toast.error("Something went wrong! Unable to upload image");
                });
            }
            actions.resetForm();
            editorRef.current.setContent("");
            setPreviewImage(null);
          })
          .catch((err) => {
            // server validation errors
            if (err?.response?.data?.message) {
              setServerError(err.response.data.message);
            } else if (err?.response?.data?.errors) {
              setServerError(err.response.data.errors);
            } else {
              toast.error("Something went wrong!");
            }
            window.scrollTo(0, 0); // scroll to top of page
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // add product with category
        addProductWithCategory(product, selectedCategoryId)
          .then((data) => {
            toast.success("Product added successfully");
            if (productImage != null) {
              // upload image for product
              uploadProductImage(productImage, data.productId)
                .then((data) => {
                  toast.success("Product image uploaded successfully");
                })
                .catch((err) => {
                  toast.error("Something went wrong! Unable to upload image");
                });
            }
            // reset form and editor
            actions.resetForm();
            setServerError(null);
            editorRef.current.setContent("");
          })
          .catch((err) => {
            // server validation errors
            if (err?.response?.data?.message) {
              setServerError(err.response.data.message);
            } else if (err?.response?.data?.errors) {
              setServerError(err.response.data.errors);
            } else {
              toast.error("Something went wrong!");
            }
            window.scrollTo(0, 0); // scroll to top of page
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
  });

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
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col className="mb-3">
                <Form.Group controlId="formFile" className="mb-3">
                  {/* Image */}
                  <div>
                    {previewImage === null ? (
                      <i className="fa-regular fa-image fs-1 ms-1"></i>
                    ) : (
                      <img
                        src={previewImage}
                        alt="Profile"
                        width="200px"
                        height="200px"
                        style={{ objectFit: "cover", borderRadius: "4%" }}
                      />
                    )}
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
              {/* Product Category */}
              <Form.Group as={Col} controlId="category" md={6} className="mb-3">
                <Form.Label>Product Category</Form.Label>
                <Form.Select
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  value={selectedCategoryId}
                >
                  <option disabled selected>Select a Category</option>
                  {categories ? (
                    <>
                      {/* Show category options */}
                      {categories.map((category) => {
                        return (
                          <option
                            key={category.categoryId}
                            value={category.categoryId}
                          >
                            {category.categoryTitle}
                          </option>
                        );
                      })}
                    </>
                  ) : (
                    ""
                  )}
                </Form.Select>
              </Form.Group>
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
                controlId="shortDescription"
                className="mb-3"
              >
                <Form.Label>Short Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Short Description"
                  onChange={handleChange}
                  rows={3}
                  onBlur={handleBlur}
                  value={values.shortDescription}
                  isInvalid={
                    touched.shortDescription && !!errors.shortDescription
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.shortDescription}
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
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  init={{
                    selector: "textarea#basic-example",
                    icons: "bootstrap",
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "fullscreen",
                      "insertdatetime",
                      "table",
                      "help",
                    ],
                    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | ltr rtl',
                    browser_spellcheck: true,
                    autosave_interval: "30s",
                    content_style: `
                        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                        body { font-family: 'Roboto', sans-serif; }`,
                  }}
                  // value={values.description}
                  onEditorChange={(e) => {
                    handleChange({ target: { name: "description", value: e } });
                  }}
                  onBlur={() => setFieldTouched("description", true)}
                ></Editor>
                {touched.description && errors.description && (
                  <div className="text-danger" style={{ fontSize: "0.875rem" }}>
                    {errors.description}
                  </div>
                )}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md={2} className="mb-3">
                <Form.Check
                  type="switch"
                  id="live"
                  label="Live"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.live}
                  checked={values.live}
                />
              </Form.Group>
              <Form.Group as={Col} md={2} className="mb-3">
                <Form.Check
                  type="switch"
                  id="stock"
                  label="In Stock"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.stock}
                  checked={values.stock}
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
