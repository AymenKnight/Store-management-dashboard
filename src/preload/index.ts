import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Custom APIs for renderer
const api = {
  test: 'test',
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('prisma', {
      getUsers: async () => {
        return prisma.user.findMany(); // Example function, adjust according to your needs
      },
      getUserById: async (id: number) => {
        return prisma.user.findUnique({ where: { id } });
      },
      createUser: async (data: {
        username: string;
        password: string;
        role: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string;
        address?: string;
      }) => {
        return prisma.user.create({ data });
      },
      // Add more exposed functions as needed
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI;
  // @ts-expect-error (define in dts)
  window.api = api;
}
