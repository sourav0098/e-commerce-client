import React, { useRef, useState } from "react";
import { SideBar } from "../../components/SideBar";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useFormik } from "formik";
import {
  addCategory,
  uploadCategoryImage,
} from "../../services/categories.service";
import { toast } from "react-toastify";
import { categoryWithFileSchema } from "../../utils/schema/CategoryWithFileSchema";

export const AddCategory = () => {
  document.title = "QuickPik | Add Category";

  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // reference to the hidden image input element
  const imageRef = useRef(null);

  // Create a new FileReader instance to read the file
  const reader = new FileReader();

  // state to store the preview image
  const [previewImage, setPreviewImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState(null);

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
      categoryTitle: "",
      description: "",
      image: null,
    },
    validationSchema: categoryWithFileSchema,
    onSubmit: (values, actions) => {
      const { image, ...category } = values;
      setLoading(true);
      addCategory(category)
        .then((res) => {
          toast.success("Category added successfully");
          setServerError(null);
          if (image != null) {
            uploadCategoryImage(image, res?.categoryId)
              .then(() => {
                toast.success("Category Image uploaded successfully")
              })
              .catch((err) => {
                toast.error("Something went wrong! Unable to upload category image")
              });
          }
          actions.resetForm();
        })
        .catch((err) => {
          if (err?.response?.data?.errors) {
            setServerError(err.response.data.errors);
          } else {
            toast.error("Something went wrong! Please try again later");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  // Check if the image is not null and read the file
  if (values.image !== null) {
    // Read the file and set the preview image
    reader.readAsDataURL(values.image);
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
              Add Category
            </h2>
            <hr />
          </Col>
        </Row>
        <Container>
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
            {/* Category Image */}
            <Row>
              <Col className="mb-3">
                <Form.Group controlId="image" className="mb-3">
                  {/* Image */}
                  <div>
                    {previewImage === null ? (
                      <i className="fa-regular fa-image fs-1 ms-1"></i>
                    ) : (
                      <img
                        src={previewImage}
                        alt="Category"
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
                      setFieldValue("image", e.target.files[0]);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.image && !!errors.image}
                  />
                  {/* Error message */}
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>
                {/*Button to trigger the hidden image input */}
                <Button
                  variant="primary"
                  onClick={() => {
                    imageRef.current.click();
                  }}
                >
                  Choose Category Image
                </Button>
              </Col>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                controlId="categoryTitle"
                md={8}
                className="mb-3"
              >
                <Form.Label>Category Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Category Title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.categoryTitle}
                  isInvalid={touched.categoryTitle && !!errors.categoryTitle}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.categoryTitle}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                controlId="description"
                md={8}
                className="mb-3"
              >
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  placeholder="Provide a clear and concise description of your product category"
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
              <span>Add Category</span>
            </Button>
          </Form>
        </Container>
      </Container>
    </>
  );
};
