import { useEffect, useState } from "react";
import { privateAxios, publicAxios } from "../services/axios.service";
import { toast } from "react-toastify";

export const useLoader = () => {
  // state for loader
  const [loading, setLoading] = useState(false);

  // axios interceptor for loader
  useEffect(() => {
    // Request interceptor
    privateAxios.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    publicAxios.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    privateAxios.interceptors.response.use(
      (config) => {
        setLoading(false);
        return config;
      },
      (error) => {
        setLoading(false);
        if (error.code === "ERR_NETWORK") {
          toast.error(
            "Oops! It seems our server is temporarily unavailable. We're working on resolving the issue. Please check back later",
            {
              autoClose: false,
            }
          );
        }

        return Promise.reject(error);
      }
    );

    publicAxios.interceptors.response.use(
      (config) => {
        setLoading(false);
        return config;
      },
      (error) => {
        setLoading(false);
        if (error.code === "ERR_NETWORK") {
          toast.error(
            "Oops! It seems our server is temporarily unavailable. We're working on resolving the issue. Please check back later",
            {
              autoClose: false,
            }
          );
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return loading;
};
