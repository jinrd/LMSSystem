/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // 클릭 이벤트용

export default function AdminSchedule() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllSchedules();
  }, []);

  const fetchAllSchedules = async () => {
    try {
      const token = localStorage.getItem("lms_token");

      // 모든 Course 를 가져오면 그 안에 딸린 classes 와 schedules 도 포함되어 있습니다.( 백엔드 구조 활용 )
      const res = await fetch("http://localhost:5001/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const courses = await res.json();

        // FullCalendar Event Object 형태로 데이터 변환(가장 중요한 부분!)
        const calendarEvents = [];

        // 색상 팔레트 (과목별로 다른 색상을 부여하기 위함)
        const colors = [
          "#4f46e5",
          "#059669",
          "#0891b2",
          "#ea580c",
          "#e11d48",
          "#be185d",
        ];

        courses.forEach((course, courseIndex) => {
          const eventColor = colors[courseIndex % colors.length];

          course.classes.forEach((cls) => {
            cls.schedules.forEach((sch) => {
              // FullCalendar 의 반복 일정 (Recurring Event) 포맷에 맞춤
              calendarEvents.push({
                id: `${cls.id}-${sch.id}`,
                title: `${course.title} - ${cls.name} (${cls.instructor?.name || "미배정"})`,
                startTime: sch.startTime, // 예: "14:00"
                endTime: sch.endTime, // 예: "16:00"
                startRecur: cls.startDate, // 개강일 (이 날짜부터 반복 시작)
                endRecur: cls.endDate, // 종강일 (이 날짜에 반복 종료)
                daysOfWeek: [sch.dayOfWeek], // 반복할 요일 배열 (예: [1] 은 월요일)
                backgroundColor: eventColor,
                borderColor: eventColor,
                // 클릭 시 모달 등을 띄우기 위해 원본 데이터를 확장 속성에 담아둔다
                extendedProps: {
                  courseId: course.id,
                  classId: cls.id,
                  instructorName: cls.instructor?.name,
                  capacity: cls.capacity,
                },
              });
            });
          });
        });
        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error("스케줄 불러오기 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (info) => {
    // 달력에 표시된 일정을 클릭했을 때의 동작
    const props = info.event.extendedProps;

    alert(`
           강좌명: ${info.event.title}
           시간: ${info.event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ~
           ${info.event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
           담당 강사: ${props.instructorName || "미배정"}
           정원: ${props.capacity} 명
         `);
  };
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          학원 전체 스케줄 달력
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            ※ 과목별로 색상이 다르게 표시됩니다.
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            스케줄을 불러오는 중입니다...
          </div>
        ) : (
          // FullCalendar 컴포넌트 렌더링
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek" // 기본 화면을 주간 시간표 뷰로 설정
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay", // 월간/주간/일간 버튼 제공
            }}
            events={events}
            eventClick={handleEventClick}
            slotMinTime="08:00:00" // 달력 시작 시간
            slotMaxTime="22:00:00" // 달력 종료 시간
            allDaySlot={false} // 종일 일정 칸 숨기기
            height="800px"
            locale="ko" // 한국어 설정
            slotEventOverlap={false} // 동일 시간대 일정 겹침 방지 (나란히 표시)
            dayMaxEvents={true} // 월간 뷰에서 일정 개수가 많을 경우 +more 로 표시
          />
        )}
      </div>
    </div>
  );
}
