import React, { useState } from "react";
import { SideBar } from "../../components/SideBar";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { OrderView } from "../../components/admin/OrderView";
import { getAllOrders, updateOrder } from "../../services/order.service";
import { API_ENDPOINTS } from "../../services/helper.service";
import { useEffect } from "react";
import { orderSchema } from "../../utils/schema/OrderSchema";
import { useFormik } from "formik";
import { IKContext, IKImage } from "imagekitio-react";
import { toast } from "react-toastify";

const ViewOrders = () => {
  document.title = "QuickPik | View Orders";

  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loading, setLoading] = useState(false); // loading state for save button

  const [orders, setOrders] = useState(undefined);

  const [selectedOrder, setSelectedOrder] = useState(undefined);
  const [showOrderViewModal, setShowOrderViewModal] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  // get all orders
  const getOrders = async (
    pageNumber = 0,
    pageSize = API_ENDPOINTS.ORDER_PAGE_SIZE,
    sortBy = "createdAt",
    sortDir = "asc"
  ) => {
    try {
      const data = await getAllOrders(pageNumber, pageSize, sortBy, sortDir);
      setOrders(data);
    } catch (error) {
      toast.error("Error while fetching orders");
    }
  };

  const handleOrderViewModalClose = () => setShowOrderViewModal(false);
  const handleOrderViewModalShow = (order) => {
    setSelectedOrder(order);

    // get image of products for order items
    setShowOrderViewModal(true);
  };

  // order view modal
  const OrderViewModal = () => {

    // Server side validation error
    const [serverError, setServerError] = useState(null);

    // update order function
    const updateOrderDetails = async (values, orderId) => {
      try {
        const data = await updateOrder(values, orderId);
        toast.success("Order updated successfully");
        const newArray = orders.content.map((order) => {
          if (order.orderId === orderId) {
            return data;
          } else {
            return order;
          }
        });
        setOrders({ ...orders, content: newArray });
        setSelectedOrder(data);
      } catch (err) {
        toast.error("Something went wrong! Unable to update order");
        // server validation errors
        if (err?.response?.data?.message) {
          setServerError(err.response.data.message);
        } else if (err?.response?.data?.errors) {
          setServerError(err.response.data.errors);
        }
      }
    };

    const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
      useFormik({
        initialValues: {
          orderName: selectedOrder?.orderName,
          shippingAddress: selectedOrder?.shippingAddress,
          postalCode: selectedOrder?.postalCode,
          city: selectedOrder?.city,
          province: selectedOrder?.province,
          shippingPhone: selectedOrder?.shippingPhone,
          orderStatus: selectedOrder?.orderStatus,
          paymentStatus: selectedOrder?.paymentStatus,
          deliveredDate:
            selectedOrder?.deliveredDate == null
              ? ""
              : selectedOrder.deliveredDate,
        },
        validationSchema: orderSchema,
        onSubmit: (values) => {
          setLoading(true);
          updateOrderDetails(
            {
              ...values,
              deliveredDate:
                values.deliveredDate === "" ? null : values.deliveredDate,
            },
            selectedOrder?.orderId
          );
          setLoading(false);
        },
      });

    return (
      <>
        {selectedOrder && (
          <Modal
            show={showOrderViewModal}
            onHide={handleOrderViewModalClose}
            size="lg"
          >
            <Modal.Header>
              <Modal.Title>{selectedOrder?.orderNumber}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* server side validation alert */}
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
              <Row>
                <Col>
                  <p>
                    <strong>Ordered By: </strong>
                    {selectedOrder.user.fname} {selectedOrder.user.lname}
                  </p>
                </Col>
              </Row>
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Form.Group
                    as={Col}
                    md={6}
                    controlId="orderName"
                    className="mb-3"
                  >
                    <Form.Label>Order Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Shopper Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.orderName}
                      isInvalid={touched.orderName && !!errors.orderName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.orderName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md={6}
                    controlId="shippingPhone"
                    className="mb-3"
                  >
                    <Form.Label>Shipping Phone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Shipping Phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.shippingPhone}
                      isInvalid={
                        touched.shippingPhone && !!errors.shippingPhone
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shippingPhone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group
                    as={Col}
                    controlId="shippingAddress"
                    className="mb-3"
                  >
                    <Form.Label>Shipping Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Shipping Address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.shippingAddress}
                      isInvalid={
                        touched.shippingAddress && !!errors.shippingAddress
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shippingAddress}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} controlId="city" className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.city}
                      isInvalid={touched.city && !!errors.city}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="province" className="mb-3">
                    <Form.Label>Province</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Province"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.province}
                      isInvalid={touched.province && !!errors.province}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.province}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="postalCode" className="mb-3">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Postal Code"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.postalCode}
                      isInvalid={touched.postalCode && !!errors.postalCode}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.postalCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="orderStatus"
                    md={6}
                    className="mb-3"
                  >
                    <Form.Label>Order Status</Form.Label>
                    <Form.Select
                      value={values.orderStatus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.orderStatus && !!errors.orderStatus}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.orderStatus}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="paymentStatus"
                    md={6}
                    className="mb-3"
                  >
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Select
                      value={values.paymentStatus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.paymentStatus && !!errors.paymentStatus
                      }
                    >
                      <option value="PAID">PAID</option>
                      <option value="NOT PAID">NOT PAID</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.paymentStatus}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="deliveredDate"
                    md={6}
                    className="mb-3"
                  >
                    <Form.Label>Delivered Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={values.deliveredDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.deliveredDate && !!errors.deliveredDate
                      }
                      max={new Date().toLocaleDateString("en-CA", {
                        timeZone: "America/Toronto",
                      })}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.deliveredDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="me-2"
                >
                  <Spinner
                    animation="border"
                    as="span"
                    size="sm"
                    className="me-2"
                    // loading state for save button
                    hidden={!loading}
                  ></Spinner>
                  <span>Update</span>
                </Button>
                <Button variant="secondary" onClick={handleOrderViewModalClose}>
                  Close
                </Button>
              </Form>
              <hr />
              {/* Order Items */}
              <Row>
                <Col>
                  <h4>Order Items</h4>
                </Col>
              </Row>
              <Row xs={1} md={1} lg={2}>
                {selectedOrder.orderItems.map((item, index) => {
                  return (
                    <Col key={index} className="mb-3">
                      <Card>
                        <Card.Body>
                          <Row>
                            <Col md={3} lg={4}>
                              {/* Product Image */}
                              <IKContext
                                urlEndpoint={
                                  process.env.REACT_APP_IMAGE_KIT_URL
                                }
                                publicKey={
                                  process.env.REACT_APP_IMAGE_KIT_PUBLIC_KEY
                                }
                              >
                                <IKImage
                                  path={`/products/${item.product.productImage}`}
                                  transformation={[
                                    {
                                      height: 200,
                                      width: 200,
                                    },
                                  ]}
                                  loading="lazy"
                                  width="100px"
                                  height="100px"
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "4%",
                                  }}
                                />
                              </IKContext>
                            </Col>
                            <Col
                              md={8}
                              lg={7}
                              className="d-flex flex-column justify-content-between"
                            >
                              <div>
                                <h6 className="order-item-title">
                                  {item.product.title.length > 40
                                    ? `${item.product.title.substring(
                                        0,
                                        40
                                      )}...`
                                    : item.product.title}
                                </h6>
                              </div>
                              <div>
                                <p className="mb-0">
                                  <span className="fw-semibold">
                                    Quantity:{" "}
                                  </span>
                                  {item.quantity}
                                </p>
                                <p className="mb-0">
                                  <span className="fw-semibold">
                                    Total Price:{" "}
                                  </span>
                                  ${item.totalPrice}
                                </p>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Modal.Body>
          </Modal>
        )}
      </>
    );
  };

  return (
    <>
      <OrderViewModal />
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
              Orders
            </h2>
            <hr />
          </Col>
        </Row>
        {orders && (
          <Container>
            <Row>
              <Col>
                <Table responsive hover size="sm">
                  <thead>
                    <tr>
                      <th className="small">S. No.</th>
                      <th className="small">Order Number</th>
                      <th className="small">Order Name</th>
                      <th className="small">Order Amount</th>
                      <th className="small">Order Status</th>
                      <th className="small">Payment Status</th>
                      <th className="small">Order Date</th>
                      <th className="small">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.content.map((order, index) => {
                      return (
                        <OrderView
                          order={order}
                          index={index}
                          key={order.orderId}
                          handleOrderViewModalShow={handleOrderViewModalShow}
                        />
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            {/* Pagination */}
            <Row>
              <Col style={{ textAlign: "right" }}>
                <div className="d-inline-block">
                  <Pagination>
                    <Pagination.First onClick={() => getAllOrders(0)} />
                    <Pagination.Prev
                      disabled={orders.pageNumber === 0}
                      onClick={() => {
                        if (orders.pageNumber === 0) {
                          return;
                        } else {
                          getAllOrders(orders.pageNumber - 1);
                        }
                      }}
                    />
                    {(() => {
                      const totalPages = orders.totalPages;
                      const currentPage = orders.pageNumber;

                      if (totalPages <= 3) {
                        // Show all pages if there are 3 or fewer
                        return [...Array(totalPages)].map((ob, i) => (
                          <Pagination.Item
                            key={i}
                            active={i === currentPage}
                            onClick={() => getAllOrders(i)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ));
                      }

                      // Show 3 pages based on current page
                      let startPage = 0;
                      let endPage = 0;

                      if (currentPage <= 1) {
                        startPage = 0;
                        endPage = 2;
                      } else if (currentPage >= totalPages - 2) {
                        startPage = totalPages - 3;
                        endPage = totalPages - 1;
                      } else {
                        startPage = currentPage - 1;
                        endPage = currentPage + 1;
                      }

                      return (
                        <>
                          {/* Render first page if it's not the first one */}
                          {startPage > 0 && (
                            <Pagination.Ellipsis
                              onClick={() => getAllOrders(startPage - 1)}
                            />
                          )}

                          {/* Render 3 pages */}
                          {[...Array(3)].map((ob, i) => (
                            <Pagination.Item
                              key={startPage + i}
                              active={startPage + i === currentPage}
                              onClick={() => getAllOrders(startPage + i)}
                            >
                              {startPage + i + 1}
                            </Pagination.Item>
                          ))}

                          {/* Render last page if it's not the last one */}
                          {endPage < totalPages - 1 && (
                            <Pagination.Ellipsis
                              onClick={() => getAllOrders(endPage + 1)}
                            />
                          )}
                        </>
                      );
                    })()}

                    <Pagination.Next
                      disabled={orders.lastPage}
                      onClick={() => {
                        if (orders.lastPage) return;
                        else {
                          getAllOrders(orders.pageNumber + 1);
                        }
                      }}
                    />
                    <Pagination.Last
                      onClick={() => getAllOrders(orders.totalPages - 1)}
                    />
                  </Pagination>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </Container>
    </>
  );
};
export default ViewOrders;
