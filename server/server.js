const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 분리된 라우트 모듈 가져오기
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// 미들웨어 설정
app.use(cors()); // 프론트엔드와 통신을 위해 CORS 허용
app.use(express.json()); // JSON 바디 파싱

// API 라우트 연결 (URL 모듈화)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
