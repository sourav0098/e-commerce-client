import { privateAxios, publicAxios } from "./axios.service";
import { API_ENDPOINTS } from "./helper.service";

// get cart by user id
export const getCartByUserId = async (userId) => {
  const res = await publicAxios.get(`${API_ENDPOINTS.CARTS}/user/${userId}`);
  return res.data;
};

// add item to cart
export const addItemToCart = async (data, userId) => {
  const res = await privateAxios.post(`${API_ENDPOINTS.CARTS}/${userId}`, data);
  return res.data;
};

// remove item from cart
export const removeItemFromCart = async (userId, itemId) => {
  const res = await privateAxios.delete(
    `${API_ENDPOINTS.CARTS}/${userId}/item/${itemId}`
  );
  return res.data;
};

// remove all items from cart
export const removeAllItemsFromCart = async (userId) => {
  const res = await privateAxios.delete(`${API_ENDPOINTS.CARTS}/${userId}`);
  return res.data;
};
