import axios from 'axios';
import { logout } from '../app/slices/authSlice';
import { API_BASE_URL } from '../utils/config';
import { navigateTo } from '../utils/NavigationService';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe to be notified when token refresh completes
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

// Notify all subscribers and clear
function onRefreshed(error) {
  refreshSubscribers.forEach((cb) => cb(error));
  refreshSubscribers = [];
}

// Perform the actual refresh request using apiClient (to set cookies)
function doRefresh(deviceId) {
  return apiClient.post(
    '/auth/refresh-access-token',
    { deviceId },
    { withCredentials: true }
  );
}

// Handle token refresh and retry original request
function handleTokenRefresh(originalRequest, deviceId) {
  originalRequest._retry = true;

  if (!isRefreshing) {
    isRefreshing = true;
    doRefresh(deviceId)
      .then(() => {
        isRefreshing = false;
        onRefreshed();
      })
      .catch((err) => {
        isRefreshing = false;
        onRefreshed(err);
      });
  }

  return new Promise((resolve, reject) => {
    subscribeTokenRefresh((refreshError) => {
      if (refreshError) {
        return reject(refreshError);
      }
      // Replay the original request with full config
      resolve(apiClient({
        ...originalRequest,
        withCredentials: true,
      }));
    });
  });
}

// Get deviceId from localStorage
const deviceId = localStorage.getItem('deviceId');

export const setupInterceptors = (store) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';

      if (status === 401) {
        // Hard logout scenarios
        const hardLogoutMsgs = [
          'Session expired. Please login again.',
          'Invalid or expired refresh token. Please login again.',
          'User not found. Please login again.',
          'Invalid session. Please login again.',
          'Unauthorized. No access token provided.',
          'Unauthorized. Invalid token.',
          'Unauthorized. Authentication failed.',
        ];
        if (hardLogoutMsgs.includes(errorMessage)) {
          await store.dispatch(logout(deviceId));
          localStorage.removeItem('user');
          navigateTo('/');
          return Promise.reject(error);
        }

        if (errorMessage === 'Unauthorized. No refresh token provided.') {
          localStorage.removeItem('user');
          navigateTo('/');
          return Promise.reject(error);
        }

        // Treat any other 401 as token expired
        if (!originalRequest._retry) {
          return handleTokenRefresh(originalRequest, deviceId);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;
