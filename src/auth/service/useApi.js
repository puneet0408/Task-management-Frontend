import AuthService from "./authService";

// const useApi = () => {
//   const jwt = new AuthService();

//   return {
//     login: jwt.login.bind(jwt),
//     getProfile: jwt.getProfile?.bind(jwt),
//   };
// };

// export default useApi;


export default function useApi() {
  return new AuthService(); 
}

