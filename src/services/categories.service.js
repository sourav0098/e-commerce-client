import { privateAxios } from "./axios.service";
import { API_ENDPOINTS } from "./helper.service";

export const getCategories = (currentPage=0, pageSize=8) => {
  return privateAxios.get(`${API_ENDPOINTS.CATEGORIES}?pageNumber=${currentPage}&pageSize=${pageSize}`).then((res) => {
    return res.data;
  });
};

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
