import axios from "axios";
import { API_ENDPOINTS } from "./helper.service";

// Create a new axios instance with a baseURL that will be used for all requests
export const publicAxios = axios.create({
    baseURL: API_ENDPOINTS.BASE_URL,
})
