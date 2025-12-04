import AuthService from "./authService";

export default function useApi() {
  return new AuthService(); 
}

