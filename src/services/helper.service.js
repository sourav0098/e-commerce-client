export const API_ENDPOINTS = {
  USER_PAGE_SIZE: 10,
  CATEGORY_PAGE_SIZE: 8,
  PRODUCT_PAGE_SIZE: 10,
  ALL_PRODUCT_PAGE_SIZE: 8,
  ORDER_PAGE_SIZE: 10,

  BASE_URL: "http://localhost:8080",
  LOGIN_USER: "/auth/login",
  USERS: "/users",
  USER_IMAGES:"/users/image",
  CATEGORIES: "/categories",
  CATEGORIES_IMAGES: "/categories/image",
  PRODUCTS: "/products",
  PRODUCT_IMAGES:"/products/image",
  ORDERS: "/orders",
};

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${day}/${month}/${year}`;
};