import { privateAxios, publicAxios } from "./axios.service";
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

export const uploadImage = (image, userId) => {
  if (image == null) {
    return;
  }

  const data = new FormData();
  data.append("image", image);

  return privateAxios
    .post(API_ENDPOINTS.USER_IMAGES + "/" + userId, data)
    .then((res) => {
      return res.data;
    });
};
