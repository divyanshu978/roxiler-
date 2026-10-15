const jwt = require("jsonwebtoken");
const { Role } = require("@prisma/client");
const { jwtSecret } = require("./config");

function authenticate(req, res, next) {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = bearerToken || req.headers.cookie?.split(";")
    .map(value => value.trim())
    .find(value => value.startsWith("roxiler_token="))
    ?.slice("roxiler_token=".length);
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try {
    req.authUser = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.authUser || !roles.includes(req.authUser.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

module.exports = { authenticate, authorize, Role };
