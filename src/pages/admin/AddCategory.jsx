import React, { useState } from "react";
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
import { categorySchema } from "../../utils/schema/category.schema";
import { addCategory } from "../../services/categories.service";
import { toast } from "react-toastify";

export const AddCategory = () => {
  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState(null);

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        categoryTitle: "",
        description: "",
      },
      validationSchema: categorySchema,
      onSubmit: (values, actions) => {
        setLoading(true);
        addCategory(values)
          .then((res) => {
            toast.success("Category added successfully");
            setServerError(null);
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
