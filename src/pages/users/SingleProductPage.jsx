import React from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/product.service";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { IKContext, IKImage } from "imagekitio-react";
import { ShowHtml } from "../../components/ShowHtml";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { UserContext } from "../../context/UserContext";

export const SingleProductPage = () => {
  const [product, setProduct] = useState(null);
  document.title = `Product | ${product?.title}`;

  const { isLogin } = useContext(UserContext);

  const { productId } = useParams();

  // cart context
  const { addItem } = useContext(CartContext);

  // quantity state for product
  const [quantity, setQuantity] = useState(1);

  // handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleAddToCart = (productId, quantity) => {
    if (!isLogin) {
      // if user is not logged in then show toast
      toast.error("Please login to add item to cart", {
        position: "bottom-right",
      });
    } else {
      // if user is logged in then add item to cart
      const data = {
        productId,
        quantity,
      };

      // function call to add item to cart
      addItem(data, () => {
        toast.success("Item added to cart", {
          position: "bottom-right",
        });
      });
    }
  };

  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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

            <div className="mb-5 d-flex gap-2 align-items-center">
              {/* Quantity */}
              <p className="m-0">Quantity</p>
              <Form.Select
                size="sm"
                style={{ width: "75px" }}
                value={quantity}
                onChange={handleQuantityChange}
              >
                {options.map((option, index) => {
                  return (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  );
                })}
              </Form.Select>
            </div>

            <small className="text-danger fw-semibold">{product.quantity<10?(`Only ${product.quantity} left in stock`):("")}</small>
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
              <Button
                variant="primary"
                className="me-2"
                disabled={!product.stock}
              >
                Buy now
              </Button>
              <Button
                variant="outline-primary"
                disabled={!product.stock}
                onClick={() => {
                  handleAddToCart(product.productId, quantity);
                }}
              >
                Add to Cart
              </Button>
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
