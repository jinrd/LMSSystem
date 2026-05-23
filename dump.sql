--
-- PostgreSQL database dump
--

\restrict ZMn8ktomBtqshx9VMbUz5U2ALv298GLPkMVeFBkdrpdkwE7S7uVr0rkUjR0Xp3a

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: dev_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO dev_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: dev_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Role; Type: TYPE; Schema: public; Owner: dev_user
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'TEACHER',
    'STUDENT'
);


ALTER TYPE public."Role" OWNER TO dev_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Assignment; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."Assignment" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "classId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Assignment" OWNER TO dev_user;

--
-- Name: Assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public."Assignment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Assignment_id_seq" OWNER TO dev_user;

--
-- Name: Assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public."Assignment_id_seq" OWNED BY public."Assignment".id;


--
-- Name: Class; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."Class" (
    id integer NOT NULL,
    name text NOT NULL,
    capacity integer NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "courseId" text NOT NULL,
    "instructorId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Class" OWNER TO dev_user;

--
-- Name: ClassSchedule; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."ClassSchedule" (
    id integer NOT NULL,
    "dayOfWeek" integer NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "classId" integer NOT NULL
);


ALTER TABLE public."ClassSchedule" OWNER TO dev_user;

--
-- Name: ClassSchedule_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public."ClassSchedule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ClassSchedule_id_seq" OWNER TO dev_user;

--
-- Name: ClassSchedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public."ClassSchedule_id_seq" OWNED BY public."ClassSchedule".id;


--
-- Name: Class_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public."Class_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Class_id_seq" OWNER TO dev_user;

--
-- Name: Class_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public."Class_id_seq" OWNED BY public."Class".id;


--
-- Name: Course; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    title text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text
);


ALTER TABLE public."Course" OWNER TO dev_user;

--
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."Enrollment" (
    id integer NOT NULL,
    status text DEFAULT 'ENROLLED'::text NOT NULL,
    "studentId" integer NOT NULL,
    "classId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Enrollment" OWNER TO dev_user;

--
-- Name: Enrollment_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public."Enrollment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Enrollment_id_seq" OWNER TO dev_user;

--
-- Name: Enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public."Enrollment_id_seq" OWNED BY public."Enrollment".id;


--
-- Name: Notice; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."Notice" (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "authorId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notice" OWNER TO dev_user;

--
-- Name: Notice_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public."Notice_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Notice_id_seq" OWNER TO dev_user;

--
-- Name: Notice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public."Notice_id_seq" OWNED BY public."Notice".id;


--
-- Name: Submission; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."Submission" (
    id integer NOT NULL,
    content text,
    "fileUrl" text,
    "assignmentId" integer NOT NULL,
    "studentId" integer NOT NULL,
    status text DEFAULT 'SUBMITTED'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    feedback text,
    score integer
);


ALTER TABLE public."Submission" OWNER TO dev_user;

--
-- Name: Submission_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public."Submission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Submission_id_seq" OWNER TO dev_user;

--
-- Name: Submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public."Submission_id_seq" OWNED BY public."Submission".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    "termsAgreed" boolean NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."Role" DEFAULT 'STUDENT'::public."Role" NOT NULL,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    status text DEFAULT 'ACTIVE'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO dev_user;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO dev_user;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Assignment id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Assignment" ALTER COLUMN id SET DEFAULT nextval('public."Assignment_id_seq"'::regclass);


--
-- Name: Class id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Class" ALTER COLUMN id SET DEFAULT nextval('public."Class_id_seq"'::regclass);


--
-- Name: ClassSchedule id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."ClassSchedule" ALTER COLUMN id SET DEFAULT nextval('public."ClassSchedule_id_seq"'::regclass);


--
-- Name: Enrollment id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Enrollment" ALTER COLUMN id SET DEFAULT nextval('public."Enrollment_id_seq"'::regclass);


--
-- Name: Notice id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Notice" ALTER COLUMN id SET DEFAULT nextval('public."Notice_id_seq"'::regclass);


--
-- Name: Submission id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Submission" ALTER COLUMN id SET DEFAULT nextval('public."Submission_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."Assignment" (id, title, description, "dueDate", "classId", "createdAt", "updatedAt") FROM stdin;
1	미용 실습 정리	이번주차에 배운 애요에 대해 정리해서 올리시오	2026-05-30 00:00:00	11	2026-05-14 04:43:44.956	2026-05-14 04:43:44.956
\.


--
-- Data for Name: Class; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."Class" (id, name, capacity, "startDate", "endDate", "courseId", "instructorId", "createdAt", "updatedAt") FROM stdin;
8	피부 강트	1	2026-05-10 00:00:00	2026-10-10 00:00:00	76dc7a54-6aec-44d4-82f6-892d54703d19	25	2026-05-10 13:28:53.509	2026-05-10 13:28:53.509
11	선생님 1 테스트	5	2026-01-01 00:00:00	2026-01-01 00:00:00	3f2889cd-bb38-4743-bb50-f43acf97ac9c	24	2026-05-12 05:00:30.607	2026-05-12 05:00:30.607
12	선생님 1 테스트 강좌 2	20	2026-01-01 00:00:00	2026-01-01 00:00:00	76dc7a54-6aec-44d4-82f6-892d54703d19	24	2026-05-12 05:01:03.207	2026-05-12 05:01:03.207
\.


--
-- Data for Name: ClassSchedule; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."ClassSchedule" (id, "dayOfWeek", "startTime", "endTime", "classId") FROM stdin;
15	1	00:39	13:30	8
18	1	01:00	01:00	11
19	1	01:00	01:00	12
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."Course" (id, title, "createdAt", "updatedAt", description) FROM stdin;
9bc2595f-11ae-41e8-b1c9-235fd1fed56a	네일아트 국가자격증 대비반	2026-05-07 07:03:24.488	2026-05-07 07:03:24.488	\N
76dc7a54-6aec-44d4-82f6-892d54703d19	피부 미용 심화 과정	2026-05-07 07:03:24.488	2026-05-07 07:03:24.488	\N
49d21d08-5127-449b-964b-614ac5199f0b	미용 실무 기초 완성	2026-05-07 07:03:24.488	2026-05-10 03:43:18.929	설명을 수정합니다
3f2889cd-bb38-4743-bb50-f43acf97ac9c	경진 실장님 강트	2026-05-10 13:19:22.153	2026-05-10 13:19:22.153	피부 쌤 제주도 가서 새로운 사람 뽑음(기존 수강생임)
7a2f1d4b-6eee-4752-96d2-83bc444da86e	ㄷㄷㄷㄷㄷㄷㄷ	2026-05-11 08:20:01.242	2026-05-11 08:20:01.242	ㄷㄷㄷㄷㄷㄷ
\.


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."Enrollment" (id, status, "studentId", "classId", "createdAt", "updatedAt") FROM stdin;
8	ENROLLED	5	8	2026-05-10 13:31:30.408	2026-05-10 13:31:30.408
12	ENROLLED	5	11	2026-05-12 05:00:37.874	2026-05-12 05:00:37.874
\.


--
-- Data for Name: Notice; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."Notice" (id, title, content, "authorId", "createdAt", "updatedAt") FROM stdin;
206	asdf33333	asdf	1	2026-05-09 03:56:56.829	2026-05-11 07:26:52.64
211	수정된 공지	수정된 내용	51	2026-05-14 05:22:39.347	2026-05-14 05:22:39.366
207	ㅁㄴㅇㄹㅁㅇㄹㅁㄹㅇㅁㅇㅁㄴㅇㄹㅁ	ㅁㅇㄹㅁㅇㄹㅁㅇㄹㅁㅇㄹㅁ	1	2026-05-11 07:27:00.633	2026-05-11 07:27:00.633
208	ㅁㅇㄹㅁㅇㄹㅁㄴㅇ	ㅁㄴㅇㄹㅁㅇㄴㄹㅁㄹㅁㅇㄴ	1	2026-05-11 08:23:08.544	2026-05-11 08:23:08.544
106	공지사항 테스트 제목 1	이것은 0.1초 간격으로 생성된 더미 공지사항 1 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
107	공지사항 테스트 제목 2	이것은 0.1초 간격으로 생성된 더미 공지사항 2 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
108	공지사항 테스트 제목 3	이것은 0.1초 간격으로 생성된 더미 공지사항 3 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
109	공지사항 테스트 제목 4	이것은 0.1초 간격으로 생성된 더미 공지사항 4 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
110	공지사항 테스트 제목 5	이것은 0.1초 간격으로 생성된 더미 공지사항 5 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
111	공지사항 테스트 제목 6	이것은 0.1초 간격으로 생성된 더미 공지사항 6 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
112	공지사항 테스트 제목 7	이것은 0.1초 간격으로 생성된 더미 공지사항 7 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
113	공지사항 테스트 제목 8	이것은 0.1초 간격으로 생성된 더미 공지사항 8 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
114	공지사항 테스트 제목 9	이것은 0.1초 간격으로 생성된 더미 공지사항 9 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
115	공지사항 테스트 제목 10	이것은 0.1초 간격으로 생성된 더미 공지사항 10 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
116	공지사항 테스트 제목 11	이것은 0.1초 간격으로 생성된 더미 공지사항 11 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
117	공지사항 테스트 제목 12	이것은 0.1초 간격으로 생성된 더미 공지사항 12 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
118	공지사항 테스트 제목 13	이것은 0.1초 간격으로 생성된 더미 공지사항 13 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
119	공지사항 테스트 제목 14	이것은 0.1초 간격으로 생성된 더미 공지사항 14 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
120	공지사항 테스트 제목 15	이것은 0.1초 간격으로 생성된 더미 공지사항 15 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
121	공지사항 테스트 제목 16	이것은 0.1초 간격으로 생성된 더미 공지사항 16 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
122	공지사항 테스트 제목 17	이것은 0.1초 간격으로 생성된 더미 공지사항 17 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
123	공지사항 테스트 제목 18	이것은 0.1초 간격으로 생성된 더미 공지사항 18 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
124	공지사항 테스트 제목 19	이것은 0.1초 간격으로 생성된 더미 공지사항 19 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
125	공지사항 테스트 제목 20	이것은 0.1초 간격으로 생성된 더미 공지사항 20 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
126	공지사항 테스트 제목 21	이것은 0.1초 간격으로 생성된 더미 공지사항 21 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
127	공지사항 테스트 제목 22	이것은 0.1초 간격으로 생성된 더미 공지사항 22 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
128	공지사항 테스트 제목 23	이것은 0.1초 간격으로 생성된 더미 공지사항 23 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
129	공지사항 테스트 제목 24	이것은 0.1초 간격으로 생성된 더미 공지사항 24 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
130	공지사항 테스트 제목 25	이것은 0.1초 간격으로 생성된 더미 공지사항 25 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
131	공지사항 테스트 제목 26	이것은 0.1초 간격으로 생성된 더미 공지사항 26 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
132	공지사항 테스트 제목 27	이것은 0.1초 간격으로 생성된 더미 공지사항 27 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
133	공지사항 테스트 제목 28	이것은 0.1초 간격으로 생성된 더미 공지사항 28 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
134	공지사항 테스트 제목 29	이것은 0.1초 간격으로 생성된 더미 공지사항 29 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
135	공지사항 테스트 제목 30	이것은 0.1초 간격으로 생성된 더미 공지사항 30 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
136	공지사항 테스트 제목 31	이것은 0.1초 간격으로 생성된 더미 공지사항 31 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
137	공지사항 테스트 제목 32	이것은 0.1초 간격으로 생성된 더미 공지사항 32 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
138	공지사항 테스트 제목 33	이것은 0.1초 간격으로 생성된 더미 공지사항 33 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
139	공지사항 테스트 제목 34	이것은 0.1초 간격으로 생성된 더미 공지사항 34 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
140	공지사항 테스트 제목 35	이것은 0.1초 간격으로 생성된 더미 공지사항 35 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
141	공지사항 테스트 제목 36	이것은 0.1초 간격으로 생성된 더미 공지사항 36 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
142	공지사항 테스트 제목 37	이것은 0.1초 간격으로 생성된 더미 공지사항 37 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
143	공지사항 테스트 제목 38	이것은 0.1초 간격으로 생성된 더미 공지사항 38 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
144	공지사항 테스트 제목 39	이것은 0.1초 간격으로 생성된 더미 공지사항 39 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
145	공지사항 테스트 제목 40	이것은 0.1초 간격으로 생성된 더미 공지사항 40 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
146	공지사항 테스트 제목 41	이것은 0.1초 간격으로 생성된 더미 공지사항 41 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
147	공지사항 테스트 제목 42	이것은 0.1초 간격으로 생성된 더미 공지사항 42 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
148	공지사항 테스트 제목 43	이것은 0.1초 간격으로 생성된 더미 공지사항 43 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
149	공지사항 테스트 제목 44	이것은 0.1초 간격으로 생성된 더미 공지사항 44 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
150	공지사항 테스트 제목 45	이것은 0.1초 간격으로 생성된 더미 공지사항 45 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
151	공지사항 테스트 제목 46	이것은 0.1초 간격으로 생성된 더미 공지사항 46 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
152	공지사항 테스트 제목 47	이것은 0.1초 간격으로 생성된 더미 공지사항 47 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
153	공지사항 테스트 제목 48	이것은 0.1초 간격으로 생성된 더미 공지사항 48 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
154	공지사항 테스트 제목 49	이것은 0.1초 간격으로 생성된 더미 공지사항 49 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
155	공지사항 테스트 제목 50	이것은 0.1초 간격으로 생성된 더미 공지사항 50 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
156	공지사항 테스트 제목 51	이것은 0.1초 간격으로 생성된 더미 공지사항 51 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
157	공지사항 테스트 제목 52	이것은 0.1초 간격으로 생성된 더미 공지사항 52 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
158	공지사항 테스트 제목 53	이것은 0.1초 간격으로 생성된 더미 공지사항 53 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
159	공지사항 테스트 제목 54	이것은 0.1초 간격으로 생성된 더미 공지사항 54 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
160	공지사항 테스트 제목 55	이것은 0.1초 간격으로 생성된 더미 공지사항 55 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
161	공지사항 테스트 제목 56	이것은 0.1초 간격으로 생성된 더미 공지사항 56 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
162	공지사항 테스트 제목 57	이것은 0.1초 간격으로 생성된 더미 공지사항 57 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
163	공지사항 테스트 제목 58	이것은 0.1초 간격으로 생성된 더미 공지사항 58 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
164	공지사항 테스트 제목 59	이것은 0.1초 간격으로 생성된 더미 공지사항 59 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
165	공지사항 테스트 제목 60	이것은 0.1초 간격으로 생성된 더미 공지사항 60 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
166	공지사항 테스트 제목 61	이것은 0.1초 간격으로 생성된 더미 공지사항 61 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
167	공지사항 테스트 제목 62	이것은 0.1초 간격으로 생성된 더미 공지사항 62 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
168	공지사항 테스트 제목 63	이것은 0.1초 간격으로 생성된 더미 공지사항 63 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
169	공지사항 테스트 제목 64	이것은 0.1초 간격으로 생성된 더미 공지사항 64 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
170	공지사항 테스트 제목 65	이것은 0.1초 간격으로 생성된 더미 공지사항 65 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
171	공지사항 테스트 제목 66	이것은 0.1초 간격으로 생성된 더미 공지사항 66 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
172	공지사항 테스트 제목 67	이것은 0.1초 간격으로 생성된 더미 공지사항 67 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
173	공지사항 테스트 제목 68	이것은 0.1초 간격으로 생성된 더미 공지사항 68 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
174	공지사항 테스트 제목 69	이것은 0.1초 간격으로 생성된 더미 공지사항 69 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
175	공지사항 테스트 제목 70	이것은 0.1초 간격으로 생성된 더미 공지사항 70 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
176	공지사항 테스트 제목 71	이것은 0.1초 간격으로 생성된 더미 공지사항 71 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
177	공지사항 테스트 제목 72	이것은 0.1초 간격으로 생성된 더미 공지사항 72 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
209	테스트 공지	내용	45	2026-05-14 05:20:38.988	2026-05-14 05:20:38.988
178	공지사항 테스트 제목 73	이것은 0.1초 간격으로 생성된 더미 공지사항 73 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
179	공지사항 테스트 제목 74	이것은 0.1초 간격으로 생성된 더미 공지사항 74 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
180	공지사항 테스트 제목 75	이것은 0.1초 간격으로 생성된 더미 공지사항 75 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
181	공지사항 테스트 제목 76	이것은 0.1초 간격으로 생성된 더미 공지사항 76 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
182	공지사항 테스트 제목 77	이것은 0.1초 간격으로 생성된 더미 공지사항 77 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
183	공지사항 테스트 제목 78	이것은 0.1초 간격으로 생성된 더미 공지사항 78 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
184	공지사항 테스트 제목 79	이것은 0.1초 간격으로 생성된 더미 공지사항 79 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
185	공지사항 테스트 제목 80	이것은 0.1초 간격으로 생성된 더미 공지사항 80 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
186	공지사항 테스트 제목 81	이것은 0.1초 간격으로 생성된 더미 공지사항 81 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
187	공지사항 테스트 제목 82	이것은 0.1초 간격으로 생성된 더미 공지사항 82 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
188	공지사항 테스트 제목 83	이것은 0.1초 간격으로 생성된 더미 공지사항 83 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
189	공지사항 테스트 제목 84	이것은 0.1초 간격으로 생성된 더미 공지사항 84 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
190	공지사항 테스트 제목 85	이것은 0.1초 간격으로 생성된 더미 공지사항 85 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
191	공지사항 테스트 제목 86	이것은 0.1초 간격으로 생성된 더미 공지사항 86 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
192	공지사항 테스트 제목 87	이것은 0.1초 간격으로 생성된 더미 공지사항 87 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
193	공지사항 테스트 제목 88	이것은 0.1초 간격으로 생성된 더미 공지사항 88 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
194	공지사항 테스트 제목 89	이것은 0.1초 간격으로 생성된 더미 공지사항 89 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
195	공지사항 테스트 제목 90	이것은 0.1초 간격으로 생성된 더미 공지사항 90 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
196	공지사항 테스트 제목 91	이것은 0.1초 간격으로 생성된 더미 공지사항 91 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
197	공지사항 테스트 제목 92	이것은 0.1초 간격으로 생성된 더미 공지사항 92 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
198	공지사항 테스트 제목 93	이것은 0.1초 간격으로 생성된 더미 공지사항 93 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
199	공지사항 테스트 제목 94	이것은 0.1초 간격으로 생성된 더미 공지사항 94 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
200	공지사항 테스트 제목 95	이것은 0.1초 간격으로 생성된 더미 공지사항 95 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
201	공지사항 테스트 제목 96	이것은 0.1초 간격으로 생성된 더미 공지사항 96 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
202	공지사항 테스트 제목 97	이것은 0.1초 간격으로 생성된 더미 공지사항 97 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
203	공지사항 테스트 제목 98	이것은 0.1초 간격으로 생성된 더미 공지사항 98 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
204	공지사항 테스트 제목 99	이것은 0.1초 간격으로 생성된 더미 공지사항 99 입니다.	1	2026-05-08 04:43:16.539	2026-05-08 04:43:16.539
210	수정된 공지	수정된 내용	48	2026-05-14 05:21:52.623	2026-05-14 05:21:52.643
\.


--
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."Submission" (id, content, "fileUrl", "assignmentId", "studentId", status, "createdAt", "updatedAt", feedback, score) FROM stdin;
1	sadf	/Users/jinwon/Workspace/Project/private_project/important/LmsSystem/uploads/1778733958848_451297468_basic_enrollment_template.pdf	1	4	GRADED	2026-05-14 04:45:58.902	2026-05-14 04:48:31.842	아주 테스트가 잘됐어요	100
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."User" (id, email, password, name, "termsAgreed", "createdAt", role, "failedLoginAttempts", "lockedUntil", status) FROM stdin;
32	teacher9@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님9	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
1	admin@test.com	$2b$10$mqtsSFLMMc6hBqkZvTizVOyBtx2aEGieKXFXOhcryRsBFb04bkcLC	admin	t	2026-05-04 04:02:35.209	ADMIN	0	\N	ACTIVE
40	teacher17@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님17	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
44	test@example.com	$2b$10$NtM8BRAKhuAYi9.79FxpY.bC7VjY.WWW3.hEc.ffWziNRNcQRJBeW	Test User	t	2026-05-11 08:38:38.071	STUDENT	0	\N	ACTIVE
3	test2@test.com	$2b$10$IhkNbIwC8x0r9GmCcNug4eIgNLkd.rupKebepUlnmnoxl4nPPsplu	test2	t	2026-05-05 04:35:23.168	TEACHER	0	\N	ACTIVE
2	test1@test.com	$2b$10$wfDQ.rXQVRBTxe3a.hyCJeqp9JIGvQPy7HktW0CWs/PProTYh8agy	테스트1	t	2026-05-04 04:05:22.02	STUDENT	0	\N	ACTIVE
6	student3@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생3	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
7	student4@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생4	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
8	student5@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생5	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
9	student6@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생6	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
10	student7@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생7	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
11	student8@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생8	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
12	student9@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생9	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
13	student10@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생10	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
14	student11@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생11	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
15	student12@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생12	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
16	student13@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생13	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
17	student14@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생14	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
18	student15@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생15	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
19	student16@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생16	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
20	student17@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생17	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
21	student18@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생18	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
22	student19@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생19	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
23	student20@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생20	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ACTIVE
24	teacher1@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님1	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
25	teacher2@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님2	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
26	teacher3@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님3	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
27	teacher4@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님4	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
28	teacher5@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님5	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
29	teacher6@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님6	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
30	teacher7@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님7	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
31	teacher8@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님8	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
33	teacher10@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님10	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
34	teacher11@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님11	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
35	teacher12@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님12	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
36	teacher13@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님13	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
37	teacher14@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님14	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
38	teacher15@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님15	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
39	teacher16@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님16	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
41	teacher18@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님18	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
43	teacher20@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님20	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
5	student2@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	학생2	t	2026-05-07 07:05:26.2	STUDENT	5	2026-05-19 01:46:50.895	ACTIVE
42	teacher19@lms.com	$2b$10$di0UmF1dMLMmgZVyvIaZqOBkZ/JHYWCxEg0mPb8gx1yYwlr0rHzVq	선생님19	t	2026-05-07 07:05:34.468	TEACHER	0	\N	ACTIVE
4	student1@lms.com	$2b$10$qahlq8jrAfp/iWBMFFXKaO2BHuUL4oy.wrxGjuW16JYgzH8ijf9JO	학생1	t	2026-05-07 07:05:26.2	STUDENT	0	\N	ON_LEAVE
\.


--
-- Name: Assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public."Assignment_id_seq"', 6, true);


--
-- Name: ClassSchedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public."ClassSchedule_id_seq"', 24, true);


--
-- Name: Class_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public."Class_id_seq"', 17, true);


--
-- Name: Enrollment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public."Enrollment_id_seq"', 18, true);


--
-- Name: Notice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public."Notice_id_seq"', 214, true);


--
-- Name: Submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public."Submission_id_seq"', 4, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public."User_id_seq"', 62, true);


--
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- Name: ClassSchedule ClassSchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."ClassSchedule"
    ADD CONSTRAINT "ClassSchedule_pkey" PRIMARY KEY (id);


--
-- Name: Class Class_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id);


--
-- Name: Notice Notice_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Notice"
    ADD CONSTRAINT "Notice_pkey" PRIMARY KEY (id);


--
-- Name: Submission Submission_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Enrollment_studentId_classId_key; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE UNIQUE INDEX "Enrollment_studentId_classId_key" ON public."Enrollment" USING btree ("studentId", "classId");


--
-- Name: Submission_assignmentId_studentId_key; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE UNIQUE INDEX "Submission_assignmentId_studentId_key" ON public."Submission" USING btree ("assignmentId", "studentId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Assignment Assignment_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClassSchedule ClassSchedule_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."ClassSchedule"
    ADD CONSTRAINT "ClassSchedule_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Class Class_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Class Class_instructorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Enrollment Enrollment_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Enrollment Enrollment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Submission Submission_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public."Assignment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Submission Submission_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: dev_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict ZMn8ktomBtqshx9VMbUz5U2ALv298GLPkMVeFBkdrpdkwE7S7uVr0rkUjR0Xp3a

