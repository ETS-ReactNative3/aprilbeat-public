import { PrismaClient } from "@prisma/client";
import type pristype from "@prisma/client";

let prisma: pristype.PrismaClient;
let globalredefined: any = global;
let globpris: any = globalredefined.prisma;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globpris) {
    globpris = new PrismaClient();
  }
  prisma = globpris;
}

export const prismaClient = prisma;
