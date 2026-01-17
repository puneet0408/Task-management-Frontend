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

  logout() {
    return axios.post(apiConfig.logout, { withCredentials: true });
  }

  getProfile(uuid) {
    return axios.get(`${apiConfig.curdUsersEndpoint}/${uuid}`, { withCredentials: true });
  }

  getCompany(params = {}) {
    return axios.get(apiConfig.curdCompanyEndpoint, {
      params,
      withCredentials: true,
    });
  }

  PostCompany(data) {
    return axios.post(apiConfig.curdCompanyEndpoint, data, {
      withCredentials: true,
    });
  }
  editCompanyData(data, uuid) {
    return axios.patch(`${apiConfig.curdCompanyEndpoint}/${uuid}`, data, {
      withCredentials: true,
    });
  }
  DeleteCompanyData(uuid) {
    return axios.delete(`${apiConfig.curdCompanyEndpoint}/${uuid}`, {
      withCredentials: true,
    });
  }

  getUsers(params = {}) {
    return axios.get(apiConfig.curdUsersEndpoint, {
      params,
      withCredentials: true,
    });
  }

  PostUSers(data) {
    return axios.post(apiConfig.curdUsersEndpoint, data, {
      withCredentials: true,
    });
  }
  editUsers(data, uuid) {
    return axios.patch(`${apiConfig.curdUsersEndpoint}/${uuid}`, data, {
      withCredentials: true,
    });
  }
  DeleteUsers(uuid) {
    return axios.delete(`${apiConfig.curdUsersEndpoint}/${uuid}`, {
      withCredentials: true,
    });
  }
  setuserPassword(data, token) {
    return axios.patch(
      `${apiConfig.setPasswordEndpoint}/${token}`,
      { password: data },
      { withCredentials: true }
    );
  }
  getProject(params = {}) {
    return axios.get(apiConfig.curdProjectEndpoint, {
      params,
      withCredentials: true,
    });
  }
  PostProject(data) {
    return axios.post(apiConfig.curdProjectEndpoint, data, {
      withCredentials: true,
    });
  }
  editProject(data, uuid) {
    return axios.patch(`${apiConfig.curdProjectEndpoint}/${uuid}`, data, {
      withCredentials: true,
    });
  }
  DeleteProject(uuid) {
    return axios.delete(`${apiConfig.curdProjectEndpoint}/${uuid}`, {
      withCredentials: true,
    });
  }
  getSprint(params = {}) {
    return axios.get(apiConfig.curdSprintEndpoint, {
      params,
      withCredentials: true,
    });
  }
  PostSprint(data) {
    return axios.post(apiConfig.curdSprintEndpoint, data, {
      withCredentials: true,
    });
  }
  editSprint(data, uuid) {
    return axios.patch(`${apiConfig.curdSprintEndpoint}/${uuid}`, data, {
      withCredentials: true,
    });
  }
  DeleteSprint(uuid) {
    return axios.delete(`${apiConfig.curdSprintEndpoint}/${uuid}`, {
      withCredentials: true,
    });
  }
    MarkDefultProject(uuid) {
    return axios.patch(`${apiConfig.markdefaultProject}/${uuid}`, {
      withCredentials: true,
    });
  }
      MarkLastPreferenceProject(uuid) {
    return axios.patch(`${apiConfig.markLastPreferenceProject}/${uuid}`, {
      withCredentials: true,
    });
  }
}
