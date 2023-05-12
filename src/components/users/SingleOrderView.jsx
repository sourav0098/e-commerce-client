import { IKContext, IKImage } from "imagekitio-react";
import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

export const SingleOrderView = ({ order }) => {
  const navigate = useNavigate();

  return (
    <Row className="mb-3">
      <Col>
        <Card>
          <Card.Body>
            <Row>
              {/* Order Number */}
              <Col md={6}>
                <h6>Order Number: {order.orderNumber}</h6>
              </Col>
              <Col md={6}>
                <h6>Order Date: {order.createdAt}</h6>
              </Col>
            </Row>
            {order.orderItems.map((item, index) => {
              return (
                <Row key={index} className="mt-3">
                  {/* Order item image */}
                  <Col
                    xs={4}
                    md={2}
                    lg={1}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <IKContext
                      urlEndpoint={process.env.REACT_APP_IMAGE_KIT_URL}
                      publicKey={process.env.REACT_APP_IMAGE_KIT_PUBLIC_KEY}
                    >
                      <IKImage
                        path={`/products/${item.product.productImage}`}
                        transformation={[
                          {
                            height: 200,
                            width: 200,
                          },
                        ]}
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                      />
                    </IKContext>
                  </Col>
                  {/* Product Details */}
                  <Col xs={12} md={8}>
                    <Row>
                      <Col>
                        <h6
                          className="product-title"
                          onClick={() =>
                            navigate("/product/" + item.product.productId)
                          }
                        >
                          {item.product.title}
                        </h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={3}>
                        <small>Quantity: {item.quantity} </small>
                      </Col>
                      <Col md={3}>
                        <small>
                          Total Price: $ {item.totalPrice.toFixed(2)}
                        </small>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              );
            })}
            <Row className="mt-3">
              <Col>
                <h6>Total Order Amount: $ {order.orderAmount.toFixed(2)}</h6>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button size="sm" as={NavLink} to={`/order/${order.orderId}`}>
                  View Order Details
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
