import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // sends cookies (accessToken/refreshToken) with every request
});

export default api;