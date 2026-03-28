import jwt from "jsonwebtoken";
const verifyJWTToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader); 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  console.log("TOKEN:", token); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-code");

    console.log("DECODED:", decoded); 

    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default verifyJWTToken