import axiosClient from '../axios';
import { CreateUser, LoginResponse, Teacher, User } from '@services/dataTypes';

export const refreshAccessTokenFn = async () => {
  // TODO add refresh token
  // const response = await axiosClient.get<LoginResponse>('auth/refresh');
  // return response.data;
};

// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const errMessage = error.response.data.message as string;
//     if (errMessage.includes('not logged in') && !originalRequest._retry) {
//       originalRequest._retry = true;
//       await refreshAccessTokenFn();
//       return axiosClient(originalRequest);
//     }
//     return Promise.reject(error);
//   },
// );

export const fetchUsers = (): Promise<any[]> =>
  axiosClient.get('/user').then((response) => response.data);

export const fetchUserById = (userId: string): Promise<any> =>
  axiosClient.get(`/user/${userId}`).then((response) => response.data);

export const updateAdmin = (updatedAdmin: FormData): Promise<User> =>
  axiosClient
    .patch('/auth/me', updatedAdmin, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((response) => response.data);

export const createUser = (userData: FormData) =>
  axiosClient.post('/user/', userData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateUser = ({
  userId,
  userData,
}: {
  userId: string;
  userData: FormData;
}) =>
  axiosClient.patch(`/user/${userId}`, userData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteUser = (userId: string) => {
  return axiosClient.delete(`/user/${userId}`);
};

export const recoverPassword = (email: string) =>
  axiosClient.post('/auth/forgotPassword', { email });
