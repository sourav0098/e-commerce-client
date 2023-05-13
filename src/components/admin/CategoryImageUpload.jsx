import { useFormik } from "formik";
import React, { useState } from "react";
import { useRef } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { imageSchema } from "../../utils/schema/ImageSchema";
import { useEffect } from "react";
import { IKContext, IKImage } from "imagekitio-react";

export const CategoryImageUpload = (props) => {
  const [loading, setLoading] = useState(false);

  // reference to the hidden image input element
  const imageRef = useRef(null);

  // state to store the preview image
  const [previewImage, setPreviewImage] = useState(undefined);

  // formik hook for handling form state and validation
  const formik = useFormik({
    initialValues: {
      image: null,
    },
    validationSchema: imageSchema,
    onSubmit: (values, actions) => {
      // update image by calling the API
      setLoading(true);
      props
        .handleUploadCategoryImage(values.image, props.categoryId)
        .then(() => {
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  // Create a new FileReader instance to read the file

  useEffect(() => {
    if (props.image !== null && typeof props.image == "object") {
      // if image is an object, it is a file show preview
      formik.setFieldValue("image", props.image);
      const reader = new FileReader();
      reader.readAsDataURL(props.image);
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
    } else if (props.image !== null && typeof props.image == "string") {
      // if image is a string, it is an imagekit url
      setPreviewImage(props.image);
    }
  }, []);

  useEffect(() => {
    if (formik.values.image !== null) {
      const reader = new FileReader();
      reader.readAsDataURL(formik.values.image);
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
    }
  }, [formik.values.image]);

  return (
    <>
      {
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col className="text-center mb-3">
              <Form.Group controlId="formFile" className="mb-3">
                {/* Image */}
                {formik.values.image !== null ? (
                  <div>
                    <img
                      src={previewImage}
                      alt="Profile"
                      width="250px"
                      height="150px"
                      style={{ objectFit: "cover", borderRadius: "2%" }}
                    />
                  </div>
                ) : (
                  // Image kit
                  previewImage !== undefined && (
                    <IKContext
                      urlEndpoint={process.env.REACT_APP_IMAGE_KIT_URL}
                      publicKey={process.env.REACT_APP_IMAGE_KIT_PUBLIC_KEY}
                    >
                      <IKImage
                        path={`/categories/${previewImage}`}
                        transformation={[
                          {
                            height: 400,
                            width: 400,
                          },
                        ]}
                        loading="lazy"
                        width="250px"
                        height="150px"
                        style={{ objectFit: "cover", borderRadius: "2%" }}
                      />
                    </IKContext>
                  )
                )}

                {/* Hidden Image input */}
                <Form.Control
                  hidden
                  ref={imageRef}
                  type="file"
                  multiple={false}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0] !== undefined) {
                      formik.setFieldValue("image", e.target.files[0]);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.image && !!formik.errors.image}
                />
                {/* Error message */}
                <Form.Control.Feedback type="invalid">
                  {formik.errors.image}
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
                disabled={loading || formik.values.image === null}
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
      }
    </>
  );
};
