import { PrismaClient } from '@prisma/client';

// vite-env-override.d.ts
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

declare global {
  interface Window {
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
