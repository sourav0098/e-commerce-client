import { privateAxios } from "./axios.service";
import { API_ENDPOINTS } from "./helper.service";

// get order by id
export const getOrderById = async (orderId) => {
  const result = await privateAxios.get(`${API_ENDPOINTS.ORDERS}/${orderId}`);
  return result.data;
};

// get all orders
export const getAllOrders = async (
  pageNumber,
  pageSize = API_ENDPOINTS.ORDER_PAGE_SIZE,
  sortBy = "createdAt",
  sortDir = "asc"
) => {
  const result = await privateAxios.get(
    `${API_ENDPOINTS.ORDERS}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
  );
  return result.data;
};

// get all orders by user id
export const getAllOrdersByUserId = async (userId) => {
  const result = await privateAxios.get(
    `${API_ENDPOINTS.ORDERS}/user/${userId}`
  );
  return result.data;
};

// create order
export const createOrder = async (order) => {
  const result = await privateAxios.post(API_ENDPOINTS.ORDERS, order);
  return result.data;
};

// update order
export const updateOrder = async (order, orderId) => {
  const result = await privateAxios.put(
    `${API_ENDPOINTS.ORDERS}/${orderId}`,
    order
  );
  return result.data;
};
