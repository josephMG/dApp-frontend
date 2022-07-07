/* eslint-disable @typescript-eslint/no-namespace */

type Image = {
  src: string;
  width: number;
  height: number;
};

export type { Image };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT?: string;
      NEXTAUTH_SECRET?: string;
      NEXT_PUBLIC_RPC_URL?: string;
      NEXT_PUBLIC_BACKEND_URL?: string;
    }
  }
}
