import { API_ENDPOINTS } from "./helper.service";
import { privateAxios } from "./axios.service";

// create a new product without category
export const addProductWithoutCategory = (product) => {
  return privateAxios.post(API_ENDPOINTS.PRODUCTS, product).then((res) => {
    return res.data;
  });
};

// create a new product with category
export const addProductWithCategory = (product, categoryId) => {
  return privateAxios
    .post(
      `${API_ENDPOINTS.CATEGORIES}/${categoryId}${API_ENDPOINTS.PRODUCTS}`,
      product
    )
    .then((res) => {
      return res.data;
    });
};

// upload product image
export const uploadProductImage = (productImage, productId) => {
  if (productImage == null) {
    return;
  }

  const data = new FormData();
  data.append("productImage", productImage);

  return privateAxios
    .post(API_ENDPOINTS.PRODUCT_IMAGES + "/" + productId, data)
    .then((res) => {
      return res.data;
    });
};
