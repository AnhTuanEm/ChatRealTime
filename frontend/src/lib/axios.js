import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://13.211.117.49:5001/api" : "http://13.211.117.49:5001/api",
  withCredentials: true,
});
