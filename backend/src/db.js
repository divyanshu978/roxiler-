require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5433/roxiler?schema=public"
});

module.exports = { prisma: new PrismaClient({ adapter }) };
