import { publicAxios } from "./axios.service";
import { API_ENDPOINTS } from "./helper.service";

// Register new user
export const registerUser = (data) => {
   // Use the publicAxios instance to send a POST request to the REGISTER_USER endpoint with the user data
   return publicAxios.post(API_ENDPOINTS.REGISTER_USER, data).then((res) => {
    // If the request is successful, return the response data
    return res.data;
  });
};

// Login user
export const loginUser = (data) => {
  return publicAxios.post(API_ENDPOINTS.LOGIN_USER, data).then((res) => {
    return res.data;
  });
}
