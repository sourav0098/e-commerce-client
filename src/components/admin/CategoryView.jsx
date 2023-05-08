import { IKContext, IKImage } from "imagekitio-react";
import React from "react";
import { Button, Card, Col } from "react-bootstrap";

export const CategoryView = ({
  category,
  showDeleteModal,
  showCategoryModal,
}) => {
  return (
    <>
      <Col className="mb-3">
        <Card>
          {category.categoryImage ? (
            <IKContext
              urlEndpoint={process.env.REACT_APP_IMAGE_KIT_URL}
              publicKey={process.env.REACT_APP_IMAGE_KIT_PUBLIC_KEY}
            >
              <IKImage
                path={`/categories/${category.categoryImage}`}
                transformation={[
                  {
                    height: 400,
                    width: 400,
                  },
                ]}
                loading="lazy"
                style={{ height: "160px", objectFit: "cover" }}
              />
            </IKContext>
          ) : (
            <Card.Img
              variant="top"
              style={{ height: "160px", objectFit: "cover" }}
              src="/assets/no_image.png"
            />
          )}
          <Card.Body>
            <Card.Title>{category.categoryTitle}</Card.Title>
            <small className="d-block" style={{ height: "170px" }}>
              {category.description && category.description.length > 220
                ? category.description.substr(0, 220) + "..."
                : category.description}
            </small>

            <Button
              variant="primary"
              size="sm"
              className="me-2"
              onClick={() => showCategoryModal(category)}
            >
              View More
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => showDeleteModal(category.categoryId)}
            >
              Delete
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};
