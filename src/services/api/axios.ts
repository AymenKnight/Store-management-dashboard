import { CustomError } from '@libs/CustomError';
import { useAuthStore } from '@services/zustand/authStore';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  // withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const { accessToken, refreshToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.bearer = accessToken;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    // console.log('response', response.data);
    if (response.data.status === 'Success') {
      return response.data;
    }
  },
  async (error) => {
    const authStore = useAuthStore.getState();
    // console.log('error', error);
    if (error.response.data.status === 'unauthorized_error') {
      authStore.logout();
    } else if (error.response.data.status === 'no_courses_found') {
      throw new CustomError(
        error.response.data.status,
        error.response.data.message,
        [],
      );
    } else
      throw new CustomError(
        error.response.data.status,
        error.response.data.message,
        error.response.data.data,
      );
    error.response.data;
  },
);

export default axiosClient;
function refreshToken() {
  throw new Error('Function not implemented.');
}
