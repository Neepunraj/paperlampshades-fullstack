import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = process.env.PASSWORDPRISMA || "12345";
  const name = "Super Admin";
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { email },
  });
  if (existingSuperAdmin) {
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const superAdminUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("super admin creates successfully", superAdminUser.email);
}
main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
