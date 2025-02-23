import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://13.239.240.242:5001/api" : "http://13.239.240.242:5001/api",
  withCredentials: true,
});
