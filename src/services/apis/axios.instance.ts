import axios from "axios";

(axios as any).defaults.headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "locales": localStorage.getItem("locales") ?? "en",
  "token": String(localStorage.getItem("token")),
  "tokenMember": String(localStorage.getItem("tokenMember"))
};

axios.interceptors.request.use(
  (config) => {
    //config.headers.token = String(localStorage.getItem("token"));
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;