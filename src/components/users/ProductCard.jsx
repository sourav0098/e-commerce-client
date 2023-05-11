import React from "react";
import { Badge, Button, Card, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Col className="mb-3" md={6} lg={4} xl={3}>
      <Card>
        <img
          src={`${process.env.REACT_APP_IMAGE_KIT_URL}/tr:h-300,w-400/products/${product.productImage}`}
          alt={product.title}
          width="100%"
          height="180px"
          onClick={() => navigate(`/product/${product.productId}`)}
          style={{
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
        <Card.Body>
          <div className="d-flex justify-content-between">
            <small className="text-muted fw-semibold">{product.brand}</small>
            {!product.stock ? <Badge bg="danger">Out of Stock</Badge> : ""}
          </div>
          <h6
            className="mb-0 product-title"
            style={{ minHeight: "46px" }}
            onClick={() => navigate(`/product/${product.productId}`)}
          >
            {product.title.length > 60
              ? product.title.slice(0, 60) + "..."
              : product.title}
          </h6>

          <small style={{ minHeight: "68px", display: "inline-block" }}>
            {product.shortDescription.length > 85
              ? product.shortDescription.slice(0, 85) + "..."
              : product.shortDescription}
          </small>
          <div className="d-flex align-items-center mb-1">
            {product.discountedPrice ? (
              <div className="text-muted">
                <del>
                  <small>$ {product.unitPrice}</small>
                </del>
                <small className="text-danger ms-2">
                  $ {product.discountedPrice}
                </small>
              </div>
            ) : (
              <div className="me-3">
                <small>$ {product.unitPrice}</small>
              </div>
            )}
          </div>
          <Button variant="primary" size="sm" disabled={!product.stock}>
            Add to Cart
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};
