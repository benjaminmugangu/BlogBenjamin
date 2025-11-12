// // lib/prismaDynamic.ts
import { PrismaClient } from "@prisma/client";

// type TenantConfig = {
//   databaseUrl: string;
// };

// export function createPrismaClient(config: TenantConfig): PrismaClient {
//   return new PrismaClient({
//     datasources: {
//       db: {
//         url: config.databaseUrl,
//       },
//     },
//   });
// }

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;