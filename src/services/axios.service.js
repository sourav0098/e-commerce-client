import axios from "axios";
import { API_ENDPOINTS } from "./helper.service";
import { getTokenFromLocalStorage } from "../auth/helper.auth";

// Create a new axios instance with a baseURL that will be used for all requests
export const publicAxios = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
});

export const privateAxios = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
});

// Add a request interceptor to the privateAxios instance
privateAxios.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const tokens = getTokenFromLocalStorage();
    if (tokens !== null) {
      // Set the Authorization header for the request
      config.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
