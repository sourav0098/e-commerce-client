import { API_ENDPOINTS } from "./helper.service";
import { privateAxios, publicAxios } from "./axios.service";

// get products
export const getProducts = (
  pageNumber,
  pageSize = API_ENDPOINTS.PRODUCT_PAGE_SIZE,
  sortBy = "createdAt",
  sortDir = "asc"
) => {
  return publicAxios
    .get(
      `${API_ENDPOINTS.PRODUCTS}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    .then((res) => {
      return res.data;
    });
};

// get products live
export const getProductsLive = async (
  pageNumber,
  pageSize = API_ENDPOINTS.ALL_PRODUCT_PAGE_SIZE,
  sortBy = "createdAt",
  sortDir = "asc"
) => {
  const result = await publicAxios.get(
    `${API_ENDPOINTS.PRODUCTS}/live?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
  );
  return result.data;
};

// get products by id
export const getProductById = async (productId) => {
  const result = await publicAxios.get(
    API_ENDPOINTS.PRODUCTS + "/" + productId
  );
  return result.data;
};

// get products by category id
export const getProductsByCategoryId = async (
  categoryId,
  pageNumber,
  pageSize = API_ENDPOINTS.PRODUCT_PAGE_SIZE,
  sortBy = "createdAt",
  sortDir = "asc"
) => {
  const result = await publicAxios.get(
    `${API_ENDPOINTS.CATEGORIES}/${categoryId}${API_ENDPOINTS.PRODUCTS}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
  );
  return result.data;
};

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

// update product
export const updateProduct = (product, productId) => {
  return privateAxios
    .put(API_ENDPOINTS.PRODUCTS + "/" + productId, product)
    .then((res) => {
      return res.data;
    });
};

// get product image
export const getImageByProductId = (productId) => {
  return publicAxios
    .get(API_ENDPOINTS.PRODUCT_IMAGES + "/" + productId, {
      responseType: "arraybuffer", // Set the responseType to 'arraybuffer'
    })
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
  data.append("image", productImage);

  return privateAxios
    .post(API_ENDPOINTS.PRODUCT_IMAGES + "/" + productId, data)
    .then((res) => {
      return res.data;
    });
};

// update product details
export const updateProductDetails = (product, productId) => {
  return privateAxios
    .put(API_ENDPOINTS.PRODUCTS + "/" + productId, product)
    .then((res) => {
      return res.data;
    });
};

// update category of product
export const updateProductCategory = (categoryId, productId) => {
  return privateAxios
    .put(
      API_ENDPOINTS.CATEGORIES +
        "/" +
        categoryId +
        API_ENDPOINTS.PRODUCTS +
        "/" +
        productId
    )
    .then((res) => {
      return res.data;
    });
};

// search products by product name
export const searchProducts = (productName) => {
  return publicAxios
    .get(API_ENDPOINTS.PRODUCTS + "/search/" + productName)
    .then((res) => {
      return res.data;
    });
};
