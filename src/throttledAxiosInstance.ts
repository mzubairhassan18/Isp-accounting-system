import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import throttle from "lodash/throttle";

// Define the throttle delay (in milliseconds)
const throttleDelay = 500;

// Define a custom type that includes both AxiosInstance and the throttled function
interface ThrottledAxiosInstance extends AxiosInstance {
  requestThrottled: (config: AxiosRequestConfig) => Promise<AxiosResponse>;
}
const axiosInstance: AxiosInstance = axios.create();

// Create a throttled version of the request method
export const throttledRequest: ThrottledAxiosInstance = throttle(
  async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
    try {
      return await axiosInstance.request(config);
    } catch (error) {
      throw error;
    }
  },
  throttleDelay
) as unknown as ThrottledAxiosInstance;

// Add the throttled request method to the custom Axios instance
