import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/auth";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.3:4000/api",
  timeout: 10000,
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || status === 206 || status === 207;
  },
});

// 🟦 Inject access token di setiap request
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.access_token) {
      config.headers.Authorization = `Bearer ${authStore.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===========================
// 🟩 AUTO REFRESH LOGIC
// ===========================
let isRefreshing = false;
let queue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
};

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Jika bukan 401 → langsung lempar error
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Jika request sudah pernah di-retry → token refresh gagal
    if (originalRequest._retry) {
      authStore.logout();
      window.location.href = "/";
      return Promise.reject(error);
    }

    // Tandai request ini sebagai retry
    originalRequest._retry = true;

    // Jika sudah ada proses refresh → antre
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Ambil refresh token
    const refreshToken = authStore.refresh_token;
    if (!refreshToken) {
      authStore.logout();
      window.location.href = "/";
      return Promise.reject(error);
    }

    // ================================
    // 🟦 Mulai proses refresh token
    // ================================
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newAccessToken = res.data.data.access_token;

      // Simpan ke store
      authStore.setAccessToken(newAccessToken);

      // Update default auth header
      apiClient.defaults.headers.common["Authorization"] =
        "Bearer " + newAccessToken;

      // Selesaikan antrean
      processQueue(null, newAccessToken);

      // Ulang request awal
      originalRequest.headers.Authorization = "Bearer " + newAccessToken;
      return apiClient(originalRequest);
    } catch (err) {
      // Refresh token invalid → auto logout
      processQueue(err, null);
      authStore.logout();
      window.location.href = "/";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
