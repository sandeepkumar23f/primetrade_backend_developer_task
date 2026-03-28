import jwt from "jsonwebtoken";

const verifyJWTToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-code");
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ success: false, message: "Token expired" });
    }
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default verifyJWTToken;
