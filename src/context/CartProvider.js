import React, { useState } from "react";
import { CartContext } from "./CartContext";
import { useEffect } from "react";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import {
  addItemToCart,
  getCartByUserId,
  removeAllItemsFromCart,
  removeItemFromCart,
} from "../services/cart.service";
import { toast } from "react-toastify";

export const CartProvider = ({ children }) => {
  const { isLogin, userData } = useContext(UserContext);
  const [cart, setCart] = useState(null);

  const fetchUserCart = async (userId) => {
    try {
      const data = await getCartByUserId(userId);
      setCart(data);
    } catch (error) {
      setCart({ items: [] });
    }
  };

  // add item to cart
  const addItem = async (data, next = () => {}) => {
    try {
      const res = await addItemToCart(data, userData.userId);
      setCart(res);
      next();
    } catch (error) {
      toast.error("Error in adding item to cart", {
        position: "bottom-right",
      });
    }
  };

  // remove item from cart
  const removeItem = async (itemId) => {
    try {
      await removeItemFromCart(userData.userId, itemId);
      const newCart = cart.items.filter((item) => item.cartItemId !== itemId);
      setCart({
        ...cart,
        items: newCart,
      });
    } catch (error) {
      toast.error("Error in removing item from cart", {
        position: "bottom-right",
      });
    }
  };

  // remove all items from cart
  const removeAllItems = async () => {
    try {
      const data = await removeAllItemsFromCart(userData.userId);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLogin) {
      // get user cart from database
      fetchUserCart(userData.userId);
    }
  }, [isLogin]);

  return (
    <CartContext.Provider
      value={{
        cart: cart,
        setCart: setCart,
        addItem: addItem,
        removeItem: removeItem,
        removeAllItems: removeAllItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
