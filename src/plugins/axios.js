import axios from "axios";
import { SessionUtils } from "../utils/session";

const api = axios.create();

api.interceptors.request.use((config) => {
  const session = SessionUtils.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = SessionUtils.getSession();
        const refresh_token = session?.refresh_token;

        const res = await axios({
          method: "post",
          url: "/product-review-api/refresh-token",
          params: {
            refresh_token,
          },
        });

        if (res.status === 200) {
          const { access_token, refresh_token } = res.data;

          SessionUtils.setSession({
            ...session,
            access_token,
            refresh_token,
          });

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        SessionUtils.removeSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
