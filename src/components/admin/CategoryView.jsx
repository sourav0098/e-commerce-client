import React from "react";
import { Button, Card, Col } from "react-bootstrap";

export const CategoryView = ({ category, showDeleteModal, showCategoryModal }) => {

  return (
    <>
      <Col className="mb-3">
        <Card>
          <Card.Img
            variant="top"
            style={{ height: "160px", objectFit: "cover" }}
            src="https://randompicturegenerator.com/img/national-park-generator/g44ab0f039fe3369476691d11cb20c038b946a4ebf20e4474b43fc5421c2192a1609b6b72709cdb583cfc2c2bfbbbc5f9_640.jpg"
          />
          <Card.Body>
            <Card.Title>{category.categoryTitle}</Card.Title>
            <small className="d-block" style={{ height: "170px" }}>
              {category.description && category.description.length > 220
                ? category.description.substr(0, 220) + "..."
                : category.description}
            </small>

            <Button variant="primary" size="sm" className="me-2" onClick={()=>showCategoryModal(category)}>
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
