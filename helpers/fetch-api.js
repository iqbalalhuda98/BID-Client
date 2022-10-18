import axios from "axios";
import { logout } from "../utils/auth";

const apiUrl = "http://localhost:8888/api";

const FetchApiWithLogout = {
  get: async (url = "", options = {}) => {
    try {
      const response = await axios.get(`${apiUrl}${url}`, options);

      if (response.status === 401 && response.data.status === "error") {
        return logout();
      }

      return response.data;
    } catch (error) {
      return error ?? null;
    }
  },

  post: async (url = "", data = {}, options = {}) => {
    try {
      const response = await axios.post(`${apiUrl}${url}`, data, options);

      if (response.status === 401 && response.data.status === "error") {
        return logout();
      }

      return response.data;
    } catch (error) {
      window.alert(
        error?.response?.data.message ?? error?.message ?? "Login Failed"
      );
      return null;
    }
  },

  put: async (url = "", data = {}, options = {}) => {
    try {
      const response = await axios.put(`${apiUrl}${url}`, data, options);

      if (response.status === 401 && response.data.status === "error") {
        return logout();
      }

      return response.data;
    } catch (error) {
      return error ?? null;
    }
  },

  delete: async (url = "", options = {}) => {
    try {
      const response = await axios.delete(`${apiUrl}${url}`, options);

      if (response.status === 401 && response.data.status === "error") {
        return logout();
      }

      return response.data;
    } catch (error) {
      return error ?? null;
    }
  },
};

export default FetchApiWithLogout;
