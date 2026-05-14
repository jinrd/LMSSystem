import fs from "fs";
import path from "path";

const API_BASE = "http://localhost:5001/api";

// Helper: 딜레이
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function runTest() {
  console.log("🚀 [테스트 시작] 과제 출제 -> 제출 -> 채점 시나리오");

  // 1. 필요한 더미 데이터 세팅 (실제 DB에 있는 ID로 변경 필요)
  // 테스트를 위해 본인의 DB에 있는 실제 classId, teacher 토큰, student 토큰을 입력하세요.
  // 이 예제에서는 로그인 API를 직접 호출해서 토큰을 받아옵니다.
  
  const TEACHER_EMAIL = "teacher@test.com"; // DB에 있는 선생님 이메일
  const TEACHER_PW = "12341234"; // 비밀번호
  
  const STUDENT_EMAIL = "student@test.com"; // DB에 있는 학생 이메일
  const STUDENT_PW = "12341234"; // 비밀번호

  // 테스트할 반 ID (미리 하나 만들어두거나 있는 것을 사용)
  const TARGET_CLASS_ID = 1; 

  let teacherToken = "";
  let studentToken = "";
  let assignmentId = 0;
  let submissionId = 0;

  try {
    // ---------------------------------------------------------
    // STEP 1: 로그인하여 토큰 획득
    // ---------------------------------------------------------
    console.log("1. 선생님 & 학생 로그인 진행 중...");
    
    // 강사 로그인
    const tRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: TEACHER_EMAIL, password: TEACHER_PW })
    });
    if (!tRes.ok) throw new Error("선생님 로그인 실패 (이메일/비번을 확인하세요)");
    const tData = await tRes.json();
    teacherToken = tData.token;

    // 학생 로그인
    const sRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: STUDENT_EMAIL, password: STUDENT_PW })
    });
    if (!sRes.ok) throw new Error("학생 로그인 실패");
    const sData = await sRes.json();
    studentToken = sData.token;
    
    console.log("✅ 로그인 성공 및 토큰 발급 완료");

    // ---------------------------------------------------------
    // STEP 2: 선생님 - 과제 출제
    // ---------------------------------------------------------
    console.log(`2. 선생님이 ${TARGET_CLASS_ID}번 반에 과제 출제 중...`);
    const createRes = await fetch(`${API_BASE}/assignments/class/${TARGET_CLASS_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${teacherToken}` },
      body: JSON.stringify({
        title: "통합 테스트 자동 출제 과제",
        description: "이 과제는 스크립트에 의해 자동 생성되었습니다.",
        dueDate: "2026-12-31"
      })
    });
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(`과제 출제 실패: ${createData.message}`);
    assignmentId = createData.assignment.id;
    console.log(`✅ 과제 출제 완료! (Assignment ID: ${assignmentId})`);

    // ---------------------------------------------------------
    // STEP 3: 학생 - 과제 제출 (파일 업로드 시뮬레이션)
    // ---------------------------------------------------------
    console.log(`3. 학생이 과제(${assignmentId})를 파일과 함께 제출 중...`);
    
    // 더미 파일 생성
    const dummyFilePath = path.join(__dirname, "dummy.txt");
    fs.writeFileSync(dummyFilePath, "이것은 자동 제출된 더미 파일 내용입니다.");

    // FormData 생성 (Node.js 환경의 fetch를 위한 꼼수)
    // 최신 Node.js의 내장 fetch에서는 FormData를 직접 지원합니다.
    const formData = new FormData();
    formData.append("content", "학생: 자동화 스크립트로 과제를 제출합니다!");
    
    // Node.js 환경에서 Blob 객체로 변환하여 첨부
    const fileBuffer = fs.readFileSync(dummyFilePath);
    const fileBlob = new Blob([fileBuffer], { type: 'text/plain' });
    formData.append("file", fileBlob, "dummy.txt");

    const submitRes = await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${studentToken}` },
      body: formData // Content-Type은 fetch가 알아서 multipart/form-data로 세팅함
    });
    
    const submitData = await submitRes.json();
    if (!submitRes.ok) throw new Error(`과제 제출 실패: ${submitData.message}`);
    submissionId = submitData.submission.id;
    console.log(`✅ 과제 제출 완료! (Submission ID: ${submissionId}, File: ${submitData.submission.fileUrl})`);
    
    // 더미 파일 삭제
    fs.unlinkSync(dummyFilePath);

    // ---------------------------------------------------------
    // STEP 4: 선생님 - 제출물 채점
    // ---------------------------------------------------------
    console.log(`4. 선생님이 제출물(${submissionId}) 채점 중...`);
    const gradeRes = await fetch(`${API_BASE}/assignments/submissions/${submissionId}/grade`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${teacherToken}` },
      body: JSON.stringify({
        score: 95,
        feedback: "자동화 테스트를 무사히 통과했습니다! 훌륭합니다."
      })
    });
    const gradeData = await gradeRes.json();
    if (!gradeRes.ok) throw new Error(`채점 실패: ${gradeData.message}`);
    
    console.log(`✅ 채점 완료! (점수: ${gradeData.gradedSubmission.score}, 상태: ${gradeData.gradedSubmission.status})`);

    console.log("🎉 [테스트 성공] 모든 시나리오가 완벽하게 통과되었습니다!");

  } catch (error: any) {
    console.error("❌ [테스트 실패]", error.message);
  }
}

runTest();
