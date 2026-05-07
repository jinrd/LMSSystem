const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// 1. 토큰 검증 미들웨어
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "인증 토큰이 필요합니다." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "유효하지 않거나 만료된 토큰입니다." });
    }
    req.user = user;
    next();
  });
};

// 2. 관리자 권한 확인 미들웨어
const isAdmin = (req, res, next) => {
  // verifyToken이 먼저 실행되어 req.user가 설정되어 있어야 함
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ error: "관리자 권한이 필요합니다." });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
