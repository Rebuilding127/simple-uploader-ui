import axiosInstance from "../axios/index";

export const FILE_UPLOAD_URL = `/api-uploader/file/upload`;

export function merge(data) {
  return axiosInstance.post("/file/merge", data);
}

export function test() {
  return axiosInstance.get("/file/test");
}
