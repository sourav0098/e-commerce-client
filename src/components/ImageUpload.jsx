import { useFormik } from "formik";
import React from "react";
import { useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { PreviewImage } from "./PreviewImage";
import { imageSchema } from "../utils/schema/image.schema";
import { useEffect } from "react";

export const ImageUpload = (props) => {
  // reference to the hidden image input element
  const imageRef = useRef(null);

  // formik hook for handling form state and validation
  const formik1 = useFormik({
    initialValues: {
      image: null,
    },
    validationSchema: imageSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    if (props.image) {
      formik1.setFieldValue("image", props.image);
    }
  }, [props.image]);

  return (
    <>
      {formik1.values.image && (
        <Form onSubmit={formik1.handleSubmit}>
          <Row>
            <Col className="text-center mb-3">
              <Form.Group controlId="formFile" className="mb-3">
                {/* Preview image component */}
                <PreviewImage file={formik1.values.image}></PreviewImage>

                {/* Hidden Image input */}
                <Form.Control
                  hidden
                  ref={imageRef}
                  type="file"
                  multiple={false}
                  accept="image/*"
                  onChange={(e) => {
                    formik1.setFieldValue("image", e.target.files[0]);
                  }}
                  onBlur={formik1.handleBlur}
                  isInvalid={formik1.touched.image && !!formik1.errors.image}
                />
                {/* Error message */}
                <Form.Control.Feedback type="invalid">
                  {formik1.errors.image}
                </Form.Control.Feedback>
              </Form.Group>
              {/*Button to trigger the hidden image input */}
              <Button
                variant="primary"
                onClick={() => {
                  imageRef.current.click();
                }}
              >
                Choose image
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              {/* Submit button */}
              <Button variant="primary" className="mb-3" type="submit">
                <i className="fa-solid fa-arrow-up-from-bracket me-2"></i>
                <span>Upload</span>
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};
