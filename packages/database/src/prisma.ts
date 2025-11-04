import { PrismaClient as PrismaClientType } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClientType().$extends(withAccelerate());
