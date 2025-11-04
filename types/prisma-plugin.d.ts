// types/prisma-plugin.d.ts
declare module '@prisma/nextjs-monorepo-workaround-plugin' {
  // keep it simple; no extra deps needed
  export class PrismaPlugin {
    constructor();
    apply(...args: any[]): void;
  }
}
