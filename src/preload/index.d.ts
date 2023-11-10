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
      createUser: (data: { name: string; email: string }) => Promise<{
        id: number;
        email: string;
        name: string | null;
      }>;
    };
  }
}
