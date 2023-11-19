"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const client = require("@prisma/client");
const prisma = new client.PrismaClient();
const api = {
  test: "test"
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
    electron.contextBridge.exposeInMainWorld("test", 123);
    electron.contextBridge.exposeInMainWorld("prisma", {
      getUsers: async () => {
        return prisma.user.findMany();
      },
      getUserById: async (id) => {
        return prisma.user.findUnique({ where: { id } });
      },
      createUser: async (data) => {
        return prisma.user.create({ data });
      }
      // Add more exposed functions as needed
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
