const { z } = require("zod");

const password = z.string()
  .min(8).max(16)
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

const userInput = z.object({
  name: z.string().trim().min(20).max(60),
  email: z.string().trim().email(),
  password,
  address: z.string().trim().max(400)
});

const loginInput = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

const storeInput = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  address: z.string().trim().max(400),
  ownerId: z.string().cuid().optional().nullable()
});

const ratingInput = z.object({ score: z.number().int().min(1).max(5) });

function queryString(value) {
  return typeof value === "string" ? value.trim() : undefined;
}

module.exports = { password, userInput, loginInput, storeInput, ratingInput, queryString };
