import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { LOGIN_PATH } from '../paths';
import { PUBLIC_API } from './apiPaths';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(axiosInstance(prom.config));
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      originalRequest &&
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== PUBLIC_API.login &&
      originalRequest.url !== PUBLIC_API.register &&
      originalRequest.url !== PUBLIC_API.refresh
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post(PUBLIC_API.refresh);
        isRefreshing = false;
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        isRefreshing = false;
        processQueue(refreshError);

        console.error('Refresh token failed. Logging out...', refreshError);
        window.location.href = LOGIN_PATH;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
