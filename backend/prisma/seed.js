require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient, Role } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5433/roxiler?schema=public"
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@roxiler.local" },
    update: {},
    create: {
      name: "Roxiler System Administrator",
      email: "admin@roxiler.local",
      passwordHash,
      address: "Platform",
      role: Role.ADMIN
    }
  });
}

main().finally(() => prisma.$disconnect());
