import { privateAxios, publicAxios } from "./axios.service";
import { API_ENDPOINTS } from "./helper.service";

// Login user
export const loginUser = (data) => {
  return publicAxios.post(API_ENDPOINTS.LOGIN_USER, data).then((res) => {
    return res.data;
  });
};

// Register new user
export const registerUser = (data) => {
  // Use the publicAxios instance to send a POST request to the REGISTER_USER endpoint with the user data
  return publicAxios.post(API_ENDPOINTS.USERS, data).then((res) => {
    // If the request is successful, return the response data
    return res.data;
  });
};

// Get user by ID
export const getUserById = (userId) => {
  return privateAxios.get(API_ENDPOINTS.USERS + "/" + userId).then((res) => {
    return res.data;
  });
};

export const updateUser = (userId, data) => {
  return privateAxios
    .put(API_ENDPOINTS.USERS + "/" + userId, data)
    .then((res) => {
      return res.data;
    });
};

// Get user image by ID
export const getImageByUserId = (userId) => {
  return publicAxios
    .get(API_ENDPOINTS.USER_IMAGES + "/" + userId, {
      responseType: "arraybuffer", // Set the responseType to 'arraybuffer'
    })
    .then((res) => {
      return res.data;
    });
};

// upload user image
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
