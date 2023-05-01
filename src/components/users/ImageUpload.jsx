import { useFormik } from "formik";
import React, { useState } from "react";
import { useRef } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { imageSchema } from "../../utils/schema/image.schema";
import { useEffect } from "react";
import { uploadImage } from "../../services/user.service";
import { toast } from "react-toastify";

export const ImageUpload = (props) => {
  const [loading, setLoading] = useState(false);

  // reference to the hidden image input element
  const imageRef = useRef(null);

  // state to store the preview image
  const [previewImage, setPreviewImage] = useState(null);

  // formik hook for handling form state and validation
  const formik1 = useFormik({
    initialValues: {
      image: null,
    },
    validationSchema: imageSchema,
    onSubmit: (values) => {
      // update image by calling the API
      setLoading(true);
      uploadImage(values.image, props.userId)
        .then((res) => {
          toast.success("Image updated successfully");
        })
        .catch((err) => {
          toast.error("Error updating image");
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    if (props.image) {
      // set the image value in formik state
      formik1.setFieldValue("image", props.image);
    }
  }, []);

  // Create a new FileReader instance to read the file
  const reader = new FileReader();

  // Check if the image is not null and read the file
  if (formik1.values.image !== null) {
    // Read the file and set the preview image
    reader.readAsDataURL(formik1.values.image);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  }

  return (
    <>
      {formik1.values.image && (
        <Form onSubmit={formik1.handleSubmit}>
          <Row>
            <Col className="text-center mb-3">
              <Form.Group controlId="formFile" className="mb-3">
                {/* Image */}
                <div>
                  <img
                    src={previewImage}
                    alt="Profile"
                    width="200px"
                    height="200px"
                    style={{ objectFit: "cover", borderRadius: "50%" }}
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
                <i
                  className="fa-solid fa-arrow-up-from-bracket me-2"
                  hidden={loading}
                ></i>
                <span>Upload</span>
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};
