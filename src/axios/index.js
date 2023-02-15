import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `/api-uploader`,
  timeout: 300000,
});

const errorHandler = (error) => {
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use((config) => {
  return config;
}, errorHandler);

axiosInstance.interceptors.response.use((response) => {
  console.log("全局拦截axios请求", response);
  const result = response.data;
  if (result.code !== 0) {
    return Promise.reject(new Error(result.message));
  }
  return result;
}, errorHandler);

export default axiosInstance;
