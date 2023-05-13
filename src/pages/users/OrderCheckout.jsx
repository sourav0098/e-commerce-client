import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { placeOrderSchema } from "../../utils/schema/placeOrder.schema";
import { useFormik } from "formik";
import { AddressAutofill } from "@mapbox/search-js-react";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import { CartContext } from "../../context/cart.context";
import { createOrder } from "../../services/order.service";
import Swal from "sweetalert2";

export const OrderCheckout = () => {
  document.title = "QuickPik | Finalize Your Purchase";

  const { userData } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);

  // loading state for save button
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState("");

  // handle address input change
  const handleAddressInputChange = (event) => {
    const inputValue = event.target.value;
    setShippingAddress(inputValue);
    setFieldValue("shippingAddress", inputValue);
  };

  // handle address input blur
  const handleAddressInputBlur = (event) => {
    const inputValue = event.target.value;
    setShippingAddress(inputValue);
    setFieldTouched("shippingAddress", true);
    setFieldValue("shippingAddress", inputValue);
  };

  const placeOrder = async (data) => {
    try {
      await createOrder(data);
      setCart({ items: [] });
      Swal.fire({
        icon: "success",
        title: "Order placed successfully",
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to place order",
        timer: 2000
      });
    }
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    values,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      orderName: "",
      shippingPhone: "",
      shippingAddress: shippingAddress,
      city: "",
      province: "",
      postalCode: "",
    },
    validationSchema: placeOrderSchema,
    onSubmit: (values, actions) => {
      setLoading(true);
      const data = {
        userId: userData.userId,
        cartId: cart.cartId,
        orderStatus: "PENDING",
        paymentStatus: "NOT PAID",
        ...values,
        postalCode: values.postalCode.replace(/\s+/g, ""),
      };
      placeOrder(data);
      actions.resetForm();
      setLoading(false);
    },
  });

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <h3>Review & Place Order</h3>
          <hr />
        </Col>
      </Row>
      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md={6} controlId="orderName" className="mb-3">
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
              isInvalid={touched.shippingPhone && !!errors.shippingPhone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.shippingPhone}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {/* Adding mapbox address autofill */}
        <AddressAutofill
          accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          options={{
            country: "CA",
            language: "en",
          }}
        >
          <Row>
            <Form.Group as={Col} controlId="shippingAddress" className="mb-3">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Shipping Address"
                autoComplete="address-line-1"
                value={shippingAddress}
                onChange={handleAddressInputChange}
                onBlur={handleAddressInputBlur}
                isInvalid={touched.shippingAddress && !!errors.shippingAddress}
              />
              <Form.Control.Feedback type="invalid">
                {errors.shippingAddress}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} controlId="city" className="mb-3" md={4}>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                autoComplete="address-level2"
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
                autoComplete="address-level1"
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
                autoComplete="postal-code"
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
        </AddressAutofill>
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="me-2 mb-3"
        >
          <Spinner
            animation="border"
            as="span"
            size="sm"
            className="me-2"
            // loading state for save button
            hidden={!loading}
          ></Spinner>
          <span>Proceed to Pay</span>
        </Button>
      </Form>
    </Container>
  );
};
