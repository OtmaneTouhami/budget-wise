import axios from "axios";

const baseURL = process.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const options = {
  baseURL,
};

export const apiClient = axios.create(options);
