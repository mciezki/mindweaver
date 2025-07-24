import axiosInstance from '@/utils/api/axiosInstance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Function to perform GET requests.
 * @template T - The type of data expected in the response.
 * @param url - The endpoint URL (relative to the baseURL of axiosInstance).
 * @param config - Optional Axios request configuration (e.g., params, headers).
 * @returns A Promise with the response data.
 */
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
};

/**
 * Function to perform POST requests.
 * @template T - The type of data expected in the response.
 * @template D - The type of data sent in the request body.
 * @param url - The endpoint URL.
 * @param data - The data to be sent in the request body.
 * @param config - Optional Axios request configuration.
 * @returns A Promise with the response data.
 */
export const post = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data, config);
    return response.data;
};

/**
 * Function to perform PUT requests.
 * @template T - The type of data expected in the response.
 * @template D - The type of data sent in the request body.
 * @param url - The endpoint URL.
 * @param data - The data to be sent in the request body.
 * @param config - Optional Axios request configuration.
 * @returns A Promise with the response data.
 */
export const put = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
    return response.data;
};

/**
 * Function to perform PATCH requests.
 * @template T - The type of data expected in the response.
 * @template D - The type of data sent in the request body.
 * @param url - The endpoint URL.
 * @param data - The data to be sent in the request body.
 * @param config - Optional Axios request configuration.
 * @returns A Promise with the response data.
 */
export const patch = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
    return response.data;
};

/**
 * Function to perform DELETE requests.
 * @template T - The type of data expected in the response.
 * @param url - The endpoint URL.
 * @param config - Optional Axios request configuration.
 * @returns A Promise with the response data.
 */
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
};
