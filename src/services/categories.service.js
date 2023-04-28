import { privateAxios } from "./axios.service";
import { API_ENDPOINTS } from "./helper.service";

export const getCategories = () => {
  return privateAxios.get(API_ENDPOINTS.CATEGORIES).then((res) => {
    return res.data;
  });
};

export const addCategory = (data) => {
  return privateAxios.post(API_ENDPOINTS.CATEGORIES, data).then((res) => {
    return res.data;
  });
};
