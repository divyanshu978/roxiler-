const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Role } = require("@prisma/client");
const { prisma } = require("./db");
const { jwtSecret, frontendUrl, isProduction } = require("./config");
const { authenticate, authorize } = require("./middleware");
const { password, userInput, loginInput, storeInput, ratingInput, queryString } = require("./validation");

const app = express();
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

const publicUser = { id: true, name: true, email: true, address: true, role: true, createdAt: true };
const average = ratings => ratings.length
  ? Number((ratings.reduce((sum, item) => sum + item.score, 0) / ratings.length).toFixed(2))
  : 0;
const tokenFor = (id, role) => jwt.sign({ id, role }, jwtSecret, { expiresIn: "1d" });
function setAuthCookie(res, token) {
  const flags = [
    `roxiler_token=${encodeURIComponent(token)}`,
    "Max-Age=86400",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    isProduction ? "Secure" : ""
  ].filter(Boolean).join("; ");
  res.setHeader("Set-Cookie", flags);
}

function clearAuthCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `roxiler_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${isProduction ? "; Secure" : ""}`
  );
}

function parse(schema, value, res) {
  const result = schema.safeParse(value);
  if (!result.success) {
    res.status(400).json({ error: "Validation failed", details: result.error.issues });
    return undefined;
  }
  return result.data;
}

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/auth/register", async (req, res, next) => {
  const input = parse(userInput, req.body, res); if (!input) return;
  try {
    const { password: plainPassword, ...profile } = input;
    const user = await prisma.user.create({
      data: { ...profile, passwordHash: await bcrypt.hash(plainPassword, 12) },
      select: publicUser
    });
    setAuthCookie(res, tokenFor(user.id, user.role));
    res.status(201).json({ user });
  } catch (error) { next(error); }
});

app.post("/api/auth/login", async (req, res, next) => {
  const input = parse(loginInput, req.body, res); if (!input) return;
  try {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) 
      return res.status(401).json({ error: "Invalid credentials" });
    setAuthCookie(res, tokenFor(user.id, user.role));
    res.json({ user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role } });
  } catch (error) { next(error); }
});

app.post("/api/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

app.patch("/api/auth/password", authenticate, async (req, res, next) => {
  const nextPassword = parse(password, req.body?.password, res); if (!nextPassword) return;
  try {
    await prisma.user.update({ where: { id: req.authUser.id }, data: { passwordHash: await bcrypt.hash(nextPassword, 12) } });
    res.json({ message: "Password updated" });
  } catch (error) { next(error); }
});

app.get("/api/stores", authenticate, async (req, res, next) => {
  try {
    const name = queryString(req.query.name), address = queryString(req.query.address);
    const sortBy = ["name", "address", "createdAt"].includes(String(req.query.sortBy)) ? String(req.query.sortBy) : "name";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const stores = await prisma.store.findMany({
      where: { name: name ? { contains: name, mode: "insensitive" } : undefined, address: address ? { contains: address, mode: "insensitive" } : undefined },
      include: { ratings: { select: { score: true, userId: true } } },
      orderBy: { [sortBy]: sortOrder }
    });
    res.json(stores.map(({ ratings, ...store }) => ({ ...store, overallRating: average(ratings), userRating: ratings.find(r => r.userId === req.authUser.id)?.score || null })));
  } catch (error) { next(error); }
});

app.put("/api/stores/:storeId/ratings", authenticate, authorize(Role.USER), async (req, res, next) => {
  const input = parse(ratingInput, req.body, res); if (!input) return;
  try {
    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId: req.authUser.id, storeId: req.params.storeId } },
      update: { score: input.score },
      create: { score: input.score, userId: req.authUser.id, storeId: req.params.storeId }
    });
    res.json(rating);
  } catch (error) { next(error); }
});

app.use("/api/admin", authenticate, authorize(Role.ADMIN));
app.get("/api/admin/dashboard", async (_req, res, next) => {
  try {
    const [users, stores, ratings] = await Promise.all([prisma.user.count(), prisma.store.count(), prisma.rating.count()]);
    res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
  } catch (error) { next(error); }
});
app.post("/api/admin/users", async (req, res, next) => {
  const input = parse(userInput.extend({ role: require("zod").z.enum(["ADMIN", "USER", "STORE_OWNER"]) }), req.body, res); if (!input) return;
  try {
    const { password: plainPassword, ...profile } = input;
    const user = await prisma.user.create({ data: { ...profile, passwordHash: await bcrypt.hash(plainPassword, 12) }, select: publicUser });
    res.status(201).json(user);
  } catch (error) { next(error); }
});
app.get("/api/admin/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { name: queryString(req.query.name) ? { contains: queryString(req.query.name), mode: "insensitive" } : undefined, email: queryString(req.query.email) ? { contains: queryString(req.query.email), mode: "insensitive" } : undefined, address: queryString(req.query.address) ? { contains: queryString(req.query.address), mode: "insensitive" } : undefined, role: Object.values(Role).includes(String(req.query.role)) ? String(req.query.role) : undefined },
      select: publicUser, orderBy: { [String(req.query.sortBy || "name")]: req.query.sortOrder === "desc" ? "desc" : "asc" }
    });
    res.json(users);
  } catch (error) { next(error); }
});
app.get("/api/admin/users/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { ...publicUser, ownedStores: { include: { ratings: { select: { score: true } } } } } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ ...user, ownedStores: user.ownedStores.map(store => ({ ...store, overallRating: average(store.ratings) })) });
  } catch (error) { next(error); }
});
app.post("/api/admin/stores", async (req, res, next) => {
  const input = parse(storeInput, req.body, res); if (!input) return;
  try { res.status(201).json(await prisma.store.create({ data: input })); } catch (error) { next(error); }
});
app.get("/api/admin/stores", async (req, res, next) => {
  try {
    const stores = await prisma.store.findMany({ where: { name: queryString(req.query.name) ? { contains: queryString(req.query.name), mode: "insensitive" } : undefined, email: queryString(req.query.email) ? { contains: queryString(req.query.email), mode: "insensitive" } : undefined, address: queryString(req.query.address) ? { contains: queryString(req.query.address), mode: "insensitive" } : undefined }, include: { ratings: { select: { score: true } } }, orderBy: { [String(req.query.sortBy || "name")]: req.query.sortOrder === "desc" ? "desc" : "asc" } });
    res.json(stores.map(({ ratings, ...store }) => ({ ...store, overallRating: average(ratings) })));
  } catch (error) { next(error); }
});

app.get("/api/owner/dashboard", authenticate, authorize(Role.STORE_OWNER), async (req, res, next) => {
  try {
    const stores = await prisma.store.findMany({ where: { ownerId: req.authUser.id }, include: { ratings: { include: { user: { select: publicUser } } } } });
    res.json(stores.map(({ ratings, ...store }) => ({ ...store, averageRating: average(ratings), ratings })));
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON body",
      message: "Send a valid JSON object with quoted property names."
    });
  }
  if (error.code === "P2002") return res.status(409).json({ error: "A record with that unique value already exists" });
  if (error.code === "P2025") return res.status(404).json({ error: "Related record not found" });
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
