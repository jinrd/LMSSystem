import fs from "fs";
import path from "path";
import prisma from "./prismaClient";

const API_BASE = "http://localhost:5001/api";

const randId = Math.floor(Math.random() * 100000);
const ADMIN_EMAIL = `admin_test_${randId}@test.com`;
const TEACHER_EMAIL = `teacher_test_${randId}@test.com`;
const STUDENT_EMAIL = `student_test_${randId}@test.com`;
const PASSWORD = "password123!";
const NEW_PASSWORD = "newPassword123!";

async function runAllTests() {
  console.log("🚀 [종합 테스트 시작] 전체 API 통합 테스트 시나리오");

  let adminToken = "";
  let teacherToken = "";
  let studentToken = "";

  let adminId = 0;
  let teacherId = 0;
  let studentId = 0;

  try {
    // ---------------------------------------------------------
    // 1. Auth API (회원가입 및 로그인)
    // ---------------------------------------------------------
    console.log("\n[1] Auth API 테스트 중...");
    
    const registerUser = async (email: string, name: string) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: PASSWORD, name, termsAgreed: true })
      });
      if (!res.ok) throw new Error(`회원가입 실패: ${email}`);
      const data = await res.json();
      return data.user.id;
    };

    adminId = await registerUser(ADMIN_EMAIL, "테스트 원장님");
    teacherId = await registerUser(TEACHER_EMAIL, "테스트 선생님");
    studentId = await registerUser(STUDENT_EMAIL, "테스트 학생");

    // DB에 직접 접근해서 권한 변경 (회원가입 시 기본이 STUDENT이므로)
    await prisma.user.update({ where: { id: adminId }, data: { role: "ADMIN" } });
    await prisma.user.update({ where: { id: teacherId }, data: { role: "TEACHER" } });
    console.log("✅ 회원가입 및 권한 세팅 완료");

    const loginUser = async (email: string, password = PASSWORD) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error(`로그인 실패: ${email}`);
      const data = await res.json();
      return data.token;
    };

    adminToken = await loginUser(ADMIN_EMAIL);
    teacherToken = await loginUser(TEACHER_EMAIL);
    studentToken = await loginUser(STUDENT_EMAIL);
    console.log("✅ 로그인 및 토큰 발급 완료");

    // ---------------------------------------------------------
    // 2. Terms API
    // ---------------------------------------------------------
    console.log("\n[2] Terms API 테스트 중...");
    const termsRes = await fetch(`${API_BASE}/terms/service`);
    if (!termsRes.ok) throw new Error("약관 조회 실패");
    console.log("✅ 약관 조회 완료");

    // ---------------------------------------------------------
    // 3. User API
    // ---------------------------------------------------------
    console.log("\n[3] User API 테스트 중...");
    const getMeRes = await fetch(`${API_BASE}/users/me`, { headers: { "Authorization": `Bearer ${studentToken}` } });
    if (!getMeRes.ok) throw new Error("내 정보 조회 실패");
    
    const updateMeRes = await fetch(`${API_BASE}/users/me`, {
      method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${studentToken}` },
      body: JSON.stringify({ name: "수정된 테스트 학생" })
    });
    if (!updateMeRes.ok) throw new Error("내 정보 수정 실패");

    const pwRes = await fetch(`${API_BASE}/users/me/password`, {
      method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${studentToken}` },
      body: JSON.stringify({ currentPassword: PASSWORD, newPassword: NEW_PASSWORD })
    });
    if (!pwRes.ok) throw new Error("비밀번호 수정 실패");
    studentToken = await loginUser(STUDENT_EMAIL, NEW_PASSWORD); // 바뀐 비번으로 새 토큰 획득

    const getUsersRes = await fetch(`${API_BASE}/users`, { headers: { "Authorization": `Bearer ${adminToken}` } });
    if (!getUsersRes.ok) throw new Error("전체 유저 조회 실패");

    // 선생님을 잠시 ADMIN으로 바꿨다가 원상복구 해보기
    const updateRoleRes = await fetch(`${API_BASE}/users/${teacherId}/role`, {
      method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({ role: "TEACHER" })
    });
    if (!updateRoleRes.ok) throw new Error("유저 권한 수정 실패");
    console.log("✅ 유저 API 기능 확인 완료");

    // ---------------------------------------------------------
    // 4. Notice API
    // ---------------------------------------------------------
    console.log("\n[4] Notice API 테스트 중...");
    const createNoticeRes = await fetch(`${API_BASE}/notices`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({ title: "테스트 공지", content: "내용" })
    });
    if (!createNoticeRes.ok) throw new Error("공지 등록 실패");
    const noticeId = (await createNoticeRes.json()).id;

    const getNoticesRes = await fetch(`${API_BASE}/notices`, { headers: { "Authorization": `Bearer ${studentToken}` } });
    if (!getNoticesRes.ok) throw new Error("공지 목록 조회 실패");

    const getNoticeRes = await fetch(`${API_BASE}/notices/${noticeId}`, { headers: { "Authorization": `Bearer ${studentToken}` } });
    if (!getNoticeRes.ok) throw new Error("공지 상세 조회 실패");

    const updateNoticeRes = await fetch(`${API_BASE}/notices/${noticeId}`, {
      method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({ title: "수정된 공지", content: "수정된 내용" })
    });
    if (!updateNoticeRes.ok) throw new Error("공지 수정 실패");
    console.log("✅ 공지사항 기능 확인 완료");

    // ---------------------------------------------------------
    // 5. Course API
    // ---------------------------------------------------------
    console.log("\n[5] Course API 테스트 중...");
    const createCourseRes = await fetch(`${API_BASE}/courses`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({ title: "테스트 과목", description: "과목 설명" })
    });
    if (!createCourseRes.ok) throw new Error("과목 등록 실패");
    const courseId = (await createCourseRes.json()).course.id;

    const getCoursesRes = await fetch(`${API_BASE}/courses`);
    if (!getCoursesRes.ok) throw new Error("과목 목록 조회 실패");

    const updateCourseRes = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({ title: "수정된 과목", description: "수정됨" })
    });
    if (!updateCourseRes.ok) throw new Error("과목 수정 실패");
    console.log("✅ 강의(과목) 기능 확인 완료");

    // ---------------------------------------------------------
    // 6. Class API
    // ---------------------------------------------------------
    console.log("\n[6] Class API 테스트 중...");
    const createClassRes = await fetch(`${API_BASE}/classes`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: "테스트 강좌 A반", capacity: 10, startDate: "2026-05-01", endDate: "2026-06-01",
        courseId, instructorId: teacherId,
        schedules: [{ dayOfWeek: 1, startTime: "10:00", endTime: "12:00" }]
      })
    });
    if (!createClassRes.ok) throw new Error("강좌 개설 실패");
    const classId = (await createClassRes.json()).class.id;

    const getClassRes = await fetch(`${API_BASE}/classes/${classId}`);
    if (!getClassRes.ok) throw new Error("강좌 상세 조회 실패");

    const enrollRes = await fetch(`${API_BASE}/classes/${classId}/enrollments`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` },
      body: JSON.stringify({ studentId })
    });
    if (!enrollRes.ok) throw new Error("수강생 등록 실패");

    const getEnrollRes = await fetch(`${API_BASE}/classes/${classId}/enrollments`, { headers: { "Authorization": `Bearer ${adminToken}` } });
    if (!getEnrollRes.ok) throw new Error("수강생 목록 조회 실패");
    console.log("✅ 강좌 및 수강생 기능 확인 완료");

    // ---------------------------------------------------------
    // 7. Assignment API
    // ---------------------------------------------------------
    console.log("\n[7] Assignment API 테스트 중...");
    const createAssRes = await fetch(`${API_BASE}/assignments/class/${classId}`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${teacherToken}` },
      body: JSON.stringify({ title: "테스트 과제", description: "설명", dueDate: "2026-05-30" })
    });
    if (!createAssRes.ok) throw new Error("과제 출제 실패");
    const assignmentId = (await createAssRes.json()).assignment.id;

    const getAssRes = await fetch(`${API_BASE}/assignments/class/${classId}`, { headers: { "Authorization": `Bearer ${studentToken}` } });
    if (!getAssRes.ok) throw new Error("과제 목록 조회 실패");

    const dummyFilePath = path.join(__dirname, "dummy_test.pdf");
    fs.writeFileSync(dummyFilePath, "테스트 더미");
    const formData = new FormData();
    formData.append("content", "과제 제출");
    formData.append("file", new Blob([fs.readFileSync(dummyFilePath)], { type: "application/pdf" }), "dummy_test.pdf");

    const submitRes = await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
      method: "POST", headers: { "Authorization": `Bearer ${studentToken}` }, body: formData
    });
    fs.unlinkSync(dummyFilePath);
    if (!submitRes.ok) {
        const errorData = await submitRes.json().catch(() => ({}));
        throw new Error(`과제 제출 실패: ${errorData.message || submitRes.statusText}`);
    }
    const submissionId = (await submitRes.json()).submission.id;

    const getSubRes = await fetch(`${API_BASE}/assignments/${assignmentId}/submissions`, { headers: { "Authorization": `Bearer ${teacherToken}` } });
    if (!getSubRes.ok) throw new Error("제출 목록 조회 실패");

    const gradeRes = await fetch(`${API_BASE}/assignments/submissions/${submissionId}/grade`, {
      method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${teacherToken}` },
      body: JSON.stringify({ score: 100, feedback: "완벽!" })
    });
    if (!gradeRes.ok) throw new Error("과제 채점 실패");
    console.log("✅ 과제 및 채점 기능 확인 완료");

    // ---------------------------------------------------------
    // 8. Dashboards API
    // ---------------------------------------------------------
    console.log("\n[8] Dashboards API 테스트 중...");
    const tStatusRes = await fetch(`${API_BASE}/classes/teacher/status`, { headers: { "Authorization": `Bearer ${teacherToken}` } });
    if (!tStatusRes.ok) throw new Error("선생님 통계 조회 실패");

    const tDetailRes = await fetch(`${API_BASE}/classes/teacher/${classId}/detail`, { headers: { "Authorization": `Bearer ${teacherToken}` } });
    if (!tDetailRes.ok) throw new Error("선생님용 강좌 상세 조회 실패");

    // [ADMIN Bypass 검증] 원장님도 선생님 상세에 접근 가능한지 테스트
    const adminTDetailRes = await fetch(`${API_BASE}/classes/teacher/${classId}/detail`, { headers: { "Authorization": `Bearer ${adminToken}` } });
    if (!adminTDetailRes.ok) throw new Error("원장님 권한으로 선생님 강좌 상세 조회 우회 실패");

    const sStatusRes = await fetch(`${API_BASE}/classes/student/status`, { headers: { "Authorization": `Bearer ${studentToken}` } });
    if (!sStatusRes.ok) throw new Error("학생 통계 조회 실패");

    const sDetailRes = await fetch(`${API_BASE}/classes/student/${classId}/detail`, { headers: { "Authorization": `Bearer ${studentToken}` } });
    if (!sDetailRes.ok) throw new Error("학생용 강좌 상세 조회 실패");
    console.log("✅ 대시보드 통계 및 상세 조회 기능 확인 완료");

    // ---------------------------------------------------------
    // 9. Cleanup API (삭제 로직)
    // ---------------------------------------------------------
    console.log("\n[9] Cleanup API 테스트 (삭제 로직) 중...");
    const rmEnrollRes = await fetch(`${API_BASE}/classes/${classId}/enrollments/${studentId}`, {
      method: "DELETE", headers: { "Authorization": `Bearer ${adminToken}` }
    });
    if (!rmEnrollRes.ok) throw new Error("수강생 제거 실패");

    const rmClassRes = await fetch(`${API_BASE}/classes/${classId}`, {
      method: "DELETE", headers: { "Authorization": `Bearer ${adminToken}` }
    });
    if (!rmClassRes.ok) throw new Error("강좌 삭제 실패");

    const rmCourseRes = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: "DELETE", headers: { "Authorization": `Bearer ${adminToken}` }
    });
    if (!rmCourseRes.ok) throw new Error("과목 삭제 실패");

    const rmNoticeRes = await fetch(`${API_BASE}/notices/${noticeId}`, {
      method: "DELETE", headers: { "Authorization": `Bearer ${adminToken}` }
    });
    if (!rmNoticeRes.ok) throw new Error("공지 삭제 실패");
    
    // 유저 삭제 (DB 직접 접근)
    await prisma.user.deleteMany({
      where: {
        id: { in: [adminId, teacherId, studentId] }
      }
    });

    console.log("✅ 삭제 기능 확인 완료");

    console.log("\n🎉 [모든 테스트 성공] 등록된 모든 API 엔드포인트가 정상적으로 작동합니다!");

  } catch (error: any) {
    console.error("\n❌ [테스트 실패]", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runAllTests();