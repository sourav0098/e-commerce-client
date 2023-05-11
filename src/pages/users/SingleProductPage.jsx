import React from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/product.service";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { IKContext, IKImage } from "imagekitio-react";
import { ShowHtml } from "../../components/ShowHtml";

export const SingleProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  // get product by id
  const fetchProductById = async (productId) => {
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      toast.error("Something went wrong! Please try again later");
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId]);

  return (
    product && (
      <Container className="mt-3">
        <Row>
          <Col md={5} lg={3}>
            <IKContext
              urlEndpoint={process.env.REACT_APP_IMAGE_KIT_URL}
              publicKey={process.env.REACT_APP_IMAGE_KIT_PUBLIC_KEY}
            >
              <IKImage
                path={`/products/${product.productImage}`}
                transformation={[
                  {
                    height: 250,
                    width: 420,
                  },
                ]}
                loading="lazy"
                width="100%"
                height="100%"
                style={{ objectFit: "cover", borderRadius: "6px" }}
              />
            </IKContext>
          </Col>
          <Col md={7} lg={9}>
            <h5 className="text-muted fw-semibold mb-0">{product.brand}</h5>
            {!product.stock ? <Badge bg="danger">Out of Stock</Badge> : ""}
            <h3 className="fw-semibold mb-0">{product.title}</h3>
            <p>{product.shortDescription}</p>
            {product.discountedPrice ? (
              <div className="text-muted">
                <h4 className="d-inline mb-0 text-decoration-line-through">
                  $ {product.unitPrice}
                </h4>
                <h4 className="text-danger ms-2 d-inline mb-0">
                  $ {product.discountedPrice}
                </h4>
              </div>
            ) : (
              <div className="me-3">
                <h4>$ {product.unitPrice}</h4>
              </div>
            )}
            <div className="mt-3">
              <Button variant="primary" className="me-2" disabled={!product.stock}>
                Buy now
              </Button>
              <Button variant="outline-primary" disabled={!product.stock}>Add to Cart</Button>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <ShowHtml htmlText={product.description}></ShowHtml>
          </Col>
        </Row>
      </Container>
    )
  );
};
