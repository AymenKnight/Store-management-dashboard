/* eslint-disable @typescript-eslint/naming-convention */
import { User} from '@services/dataTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    avatar_url: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUserAuthenticated: (
    accessToken: string,
    refreshToken: string,
    user: any,
  ) => void;
  logout: () => void;
  updateUserInfo: (updatedInfo: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      setUserAuthenticated: (accessToken, refreshToken, user) =>
        set(() => ({ isAuthenticated: true, user, accessToken, refreshToken })),
      logout: () =>
        set(() => {
          // localStorage.removeItem('access_token');
          // localStorage.removeItem('refresh_token');
          return {
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          };
        }),
        updateUserInfo: (updatedInfo) => set((state) => ({ user: {...state.user, ...updatedInfo}})),
    }),
    {
      name: 'AuthStore',
    },
  ),
);

