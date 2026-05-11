import AppError from "../utils/AppError";

const termsData = {
  service: `
    <h3>제 1 조 (목적)</h3>
    <p>본 약관은 LMS 시스템이 제공하는 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
    <br/>
    <h3>제 2 조 (회원의 의무)</h3>
    <p>회원은 서비스 이용 시 관련 법령, 본 약관의 규정, 이용안내 및 서비스상에 공지한 주의사항을 준수하여야 합니다.</p>
  `,
  privacy: `
    <h3>1. 수집하는 개인정보 항목</h3>
    <p>회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
    <ul>
      <li>- 필수항목 : 이름, 이메일, 비밀번호</li>
    </ul>
    <br/>
    <h3>2. 개인정보의 보유 및 이용기간</h3>
    <p>원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
  `,
};

const getTermsByType = (type: any) => {
  if (type !== "service" && type !== "privacy") {
    throw new AppError("유효하지 않은 약관 타입입니다.", 400);
  }
  return termsData[type as keyof typeof termsData];
};

export default {
  getTermsByType,
};
