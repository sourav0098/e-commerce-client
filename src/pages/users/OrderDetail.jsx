import React from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/order.service";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const OrderDetail = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  // fetch order by id
  const fetchOrder = async (orderId) => {
    try {
      const data = await getOrderById(orderId);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! unable to fetch order details");
    }
  };

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);

  return <></>;
};
