require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_key_for_dev",
  PORT: process.env.PORT || 5001,
  // 향후 다른 환경 변수(DB_URL 등)도 여기서 관리할 수 있습니다.
};
