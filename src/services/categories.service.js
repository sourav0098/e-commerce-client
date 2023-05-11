import { privateAxios, publicAxios } from "./axios.service";
import { API_ENDPOINTS } from "./helper.service";

export const getCategories = (
  currentPage = 0,
  pageSize = API_ENDPOINTS.CATEGORY_PAGE_SIZE
) => {
  return publicAxios
    .get(
      `${API_ENDPOINTS.CATEGORIES}?pageNumber=${currentPage}&pageSize=${pageSize}`
    )
    .then((res) => {
      return res.data;
    });
};

export const getCategoryById = async (categoryId) => {
  const result = await publicAxios.get(API_ENDPOINTS.CATEGORIES + "/" + categoryId);
  return result.data;
}

export const addCategory = (data) => {
  return privateAxios.post(API_ENDPOINTS.CATEGORIES, data).then((res) => {
    return res.data;
  });
};

export const updateCategory = (categoryId, data) => {
  return privateAxios
    .put(API_ENDPOINTS.CATEGORIES + "/" + categoryId, data)
    .then((res) => {
      return res.data;
    });
};

export const deleteCategory = (categoryId) => {
  return privateAxios
    .delete(API_ENDPOINTS.CATEGORIES + "/" + categoryId)
    .then((res) => {
      return res.data;
    });
};

// upload image for category
export const uploadCategoryImage = (categoryImage, categoryId) => {
  if (categoryImage == null) {
    return;
  }

  const data = new FormData();
  data.append("image", categoryImage);

  return privateAxios
    .post(API_ENDPOINTS.CATEGORIES_IMAGES + "/" + categoryId, data)
    .then((res) => {
      return res.data;
    });
};
