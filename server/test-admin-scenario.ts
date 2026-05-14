import fs from "fs";
import path from "path";

const API_BASE = "http://localhost:5001/api";

async function runAdminTest() {
  console.log("🚀 [테스트 시작] 원장님(ADMIN)의 공지사항 및 강의 등록/할당 시나리오");

  // 1. 필요한 더미 데이터 세팅 (실제 DB에 있는 ID로 변경 필요)
  const ADMIN_EMAIL = "admin@test.com"; // 원장님 이메일
  const ADMIN_PW = "12341234";

  const TEACHER_EMAIL = "teacher@test.com"; // 기존/신규 강사 이메일
  const STUDENT_ID = 2; // 기존에 있는 학생의 ID

  let adminToken = "";
  let teacherId = 2; // 테스트 진행하면서 받아오거나 세팅

  try {
    // ---------------------------------------------------------
    // STEP 1: 관리자 로그인
    // ---------------------------------------------------------
    console.log("1. 원장님 로그인 진행 중...");
    const aRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PW })
    });
    if (!aRes.ok) {
       console.log("관리자 계정이 없거나 로그인 실패. (이메일, 비밀번호 확인 필요)");
       // 만약 계정이 없다면 먼저 등록 로직이 필요할 수 있습니다.
       throw new Error("관리자 로그인 실패");
    }
    const aData = await aRes.json();
    adminToken = aData.token;
    console.log("✅ 원장님 로그인 완료");

    // ---------------------------------------------------------
    // STEP 2: 공지사항 등록 (ADMIN 전용)
    // ---------------------------------------------------------
    console.log(`2. 공지사항 등록 테스트 중...`);
    const noticeRes = await fetch(`${API_BASE}/notices`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: "[필독] 2026년 여름방학 특강 안내",
        content: "여름방학 특강이 개설되었습니다. 많은 수강 바랍니다."
      })
    });
    const noticeData = await noticeRes.json();
    if (!noticeRes.ok) throw new Error(`공지사항 등록 실패: ${noticeData.message}`);
    console.log(`✅ 공지사항 등록 완료! (Notice ID: ${noticeData.notice?.id || '생성됨'})`);

    // ---------------------------------------------------------
    // STEP 3: 과목(Course) 등록 (ADMIN 전용)
    // ---------------------------------------------------------
    console.log(`3. 새로운 과목 등록 중...`);
    const courseRes = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: "고급 웹 개발 실무",
        description: "React와 Node.js를 이용한 풀스택 프로젝트"
      })
    });
    const courseData = await courseRes.json();
    if (!courseRes.ok) throw new Error(`과목 등록 실패: ${courseData.message}`);
    const courseId = courseData.course.id;
    console.log(`✅ 과목 등록 완료! (Course ID: ${courseId})`);

    // ---------------------------------------------------------
    // STEP 4: 강좌(Class) 개설 및 강사 배정 (ADMIN 전용)
    // ---------------------------------------------------------
    console.log(`4. 강좌 개설 및 스케줄 등록 중...`);
    // 선생님의 ID를 알아야 강좌를 개설할 수 있습니다. (여기선 임의로 teacherId 사용)
    const classRes = await fetch(`${API_BASE}/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: "2026년 여름 웹개발 특강 A반",
        capacity: 30,
        startDate: "2026-07-01",
        endDate: "2026-08-31",
        courseId: courseId,
        instructorId: teacherId, // 담당 강사 ID
        schedules: [
          { dayOfWeek: 1, startTime: "14:00", endTime: "16:00" }, // 월요일
          { dayOfWeek: 3, startTime: "14:00", endTime: "16:00" }  // 수요일
        ]
      })
    });
    const classData = await classRes.json();
    if (!classRes.ok) throw new Error(`강좌 개설 실패: ${classData.message}`);
    const classId = classData.class.id;
    console.log(`✅ 강좌 개설 완료! (Class ID: ${classId})`);

    // ---------------------------------------------------------
    // STEP 5: 수강생 등록 (ADMIN 전용)
    // ---------------------------------------------------------
    console.log(`5. 방금 만든 강좌에 수강생 등록 중...`);
    const enrollRes = await fetch(`${API_BASE}/classes/${classId}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({
        studentId: STUDENT_ID
      })
    });
    const enrollData = await enrollRes.json();
    if (!enrollRes.ok) throw new Error(`수강생 등록 실패: ${enrollData.message}`);
    console.log(`✅ 수강생 등록 완료! (Student ID ${STUDENT_ID} -> Class ID ${classId})`);

    console.log("🎉 [테스트 성공] 관리자의 모든 시나리오가 완벽하게 통과되었습니다!");

  } catch (error: any) {
    console.error("❌ [테스트 실패]", error.message);
  }
}

runAdminTest();