import axios from "axios";
import apiConfig from "../config/apiConfig";


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default class AuthService {

  getToken() {
    return getCookie("accessToken");
  }

  constructor() {
    axios.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) config.headers["x-access-token"] = token;
      return config;
    });
  }

  login(data) {
    console.log("LOGIN CALLED", data);
    return axios.post(apiConfig.login, data, { withCredentials: true });
  }

  getProfile() {
    return axios.get(apiConfig.getProfile, { withCredentials: true });
  }

getCompany(params = {}) {
  console.log("API Called with:", params);
  return axios.get(apiConfig.curdCompanyEndpoint, {
    params,
    withCredentials: true,
  });
}

      PostCompany(data) {
    return axios.post(apiConfig.curdCompanyEndpoint,data, { withCredentials: true });
  }
}

