import { publicAxios } from "./axios.service";
import { API_ENDPOINTS } from "./helper.service";

export const getImageByUserId = (userId) => {
  return publicAxios
    .get(API_ENDPOINTS.USER_IMAGES + "/" + userId, {
      responseType: "arraybuffer", // Set the responseType to 'arraybuffer'
    })
    .then((res) => {
      return res.data;
    });
};
