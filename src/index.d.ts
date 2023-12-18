import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      test: string;
    };
    prisma: {
      getUsers: () => Promise<
        {
          id: number;
          email: string;
          name: string | null;
        }[]
      >;
      getUserById: (id: number) => Promise<{
        id: number;
        email: string;
        name: string | null;
      }>;
      createUser: (data: {
        username: string;
        password: string;
        role: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string;
        address?: string;
      }) => Promise<{
        id: number;
        email: string;
        name: string | null;
      }>;
    };
    test: number;
  }
}
