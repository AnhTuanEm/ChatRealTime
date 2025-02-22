import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://3.94.184.98:5001/api" : "http://3.94.184.98:5001/api",
  withCredentials: true,
});
