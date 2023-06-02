import React, { useState } from "react";
import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { getAllOrdersByUserId } from "../../services/order.service";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { SingleOrderView } from "../../components/users/SingleOrderView";
import { Loader } from "../../components/Loader";

export const Orders = () => {
  document.title = "QuickPik | Orders";

  const { userData } = useContext(UserContext);

  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  // load user orders
  const loadUserOrders = async (userId) => {
    try {
      const data = await getAllOrdersByUserId(userId);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  // load user orders on component mount
  useEffect(() => {
    if (userData && userData.userId) {
      loadUserOrders(userData.userId);
    }
  }, [userData?.userId]);

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <h3>Your Orders</h3>
          <hr />
        </Col>
      </Row>

      {loading ? (
        <Loader show={loading} />
      ) : (
        <>
          {orders && orders.length === 0 ? (
            <h4 className="text-center">No orders found</h4>
          ) : (
            orders.map((order, index) => (
              <SingleOrderView order={order} key={index}></SingleOrderView>
            ))
          )}
        </>
      )}
    </Container>
  );
};
