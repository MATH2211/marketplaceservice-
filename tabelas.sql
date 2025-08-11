--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5 (Ubuntu 15.5-0ubuntu0.23.04.1)
-- Dumped by pg_dump version 15.5 (Ubuntu 15.5-0ubuntu0.23.04.1)

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
-- Name: gerar_horarios(date, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.gerar_horarios(dia_input date, id_estab integer, id_prof integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    hora_atual TIME := TIME '08:00';
    hora_fim TIME := TIME '18:00';
    hora_texto VARCHAR(4);
BEGIN
    WHILE hora_atual <= hora_fim LOOP
        -- Converte para formato 'HHMM' (ex: 0830, 0900, etc)
        hora_texto := to_char(hora_atual, 'HH24MI');

        INSERT INTO horarios (dia, hora, disponivel, id_estabelecimento, id_profissional)
        VALUES (dia_input, hora_texto, true, id_estab, id_prof);

        hora_atual := hora_atual + INTERVAL '30 minutes';
    END LOOP;
END;
$$;


ALTER FUNCTION public.gerar_horarios(dia_input date, id_estab integer, id_prof integer) OWNER TO postgres;

--
-- Name: gerar_horarios(date, integer, integer, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.gerar_horarios(dia_input date, id_estab integer, id_prof integer, hora_inicio_texto character varying, hora_fim_texto character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    hora_inicio TIME := to_timestamp(hora_inicio_texto, 'HH24MI')::TIME;
    hora_fim TIME := to_timestamp(hora_fim_texto, 'HH24MI')::TIME;
    hora_atual TIME := hora_inicio;
    hora_texto VARCHAR(4);
BEGIN
    WHILE hora_atual <= hora_fim LOOP
        hora_texto := to_char(hora_atual, 'HH24MI');

        INSERT INTO horarios (dia, hora, disponivel, id_estabelecimento, id_profissional)
        VALUES (dia_input, hora_texto, true, id_estab, id_prof);

        hora_atual := hora_atual + INTERVAL '30 minutes';
    END LOOP;
    RETURN TRUE;
END;
$$;


ALTER FUNCTION public.gerar_horarios(dia_input date, id_estab integer, id_prof integer, hora_inicio_texto character varying, hora_fim_texto character varying) OWNER TO postgres;

--
-- Name: gerar_horarios_semana(date, integer, integer, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.gerar_horarios_semana(dia_inicio date, id_estab integer, id_prof integer, hora_inicio_texto character varying, hora_fim_texto character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    i INT;
    dia_atual DATE;
BEGIN
    FOR i IN 0..6 LOOP
        dia_atual := dia_inicio + i;

        BEGIN
            PERFORM gerar_horarios(dia_atual, id_estab, id_prof, hora_inicio_texto, hora_fim_texto);
        EXCEPTION WHEN OTHERS THEN
            -- Ignora erro de um dia e continua com os demais
            RAISE NOTICE 'Erro ao gerar horários para o dia %, pulando...', dia_atual;
        END;
    END LOOP;
END;
$$;


ALTER FUNCTION public.gerar_horarios_semana(dia_inicio date, id_estab integer, id_prof integer, hora_inicio_texto character varying, hora_fim_texto character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrador (
    id integer NOT NULL,
    nome character varying NOT NULL,
    email character varying NOT NULL,
    celular character varying,
    senha character varying NOT NULL,
    username character varying(30) NOT NULL
);


ALTER TABLE public.administrador OWNER TO postgres;

--
-- Name: administrador_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrador_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administrador_id_seq OWNER TO postgres;

--
-- Name: administrador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrador_id_seq OWNED BY public.administrador.id;


--
-- Name: agendamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agendamentos (
    id integer NOT NULL,
    id_estabelecimento integer NOT NULL,
    id_cliente integer NOT NULL,
    servicos character varying,
    id_profissional integer NOT NULL,
    id_horario integer NOT NULL
);


ALTER TABLE public.agendamentos OWNER TO postgres;

--
-- Name: agendamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agendamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.agendamentos_id_seq OWNER TO postgres;

--
-- Name: agendamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agendamentos_id_seq OWNED BY public.agendamentos.id;


--
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id integer NOT NULL,
    nome character varying,
    email character varying NOT NULL,
    celular character varying
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- Name: cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cliente_id_seq OWNER TO postgres;

--
-- Name: cliente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_id_seq OWNED BY public.cliente.id;


--
-- Name: estabelecimento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estabelecimento (
    id integer NOT NULL,
    nome character varying,
    endereco text,
    id_admin integer NOT NULL
);


ALTER TABLE public.estabelecimento OWNER TO postgres;

--
-- Name: estabelecimento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estabelecimento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.estabelecimento_id_seq OWNER TO postgres;

--
-- Name: estabelecimento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estabelecimento_id_seq OWNED BY public.estabelecimento.id;


--
-- Name: horarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios (
    id integer NOT NULL,
    dia date NOT NULL,
    hora character varying(4) NOT NULL,
    disponivel boolean DEFAULT true,
    id_estabelecimento integer,
    id_profissional integer NOT NULL,
    CONSTRAINT horarios_hora_check CHECK ((char_length((hora)::text) <= 4))
);


ALTER TABLE public.horarios OWNER TO postgres;

--
-- Name: horarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.horarios_id_seq OWNER TO postgres;

--
-- Name: horarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_id_seq OWNED BY public.horarios.id;


--
-- Name: imagens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imagens (
    id integer NOT NULL,
    imagem_url character varying NOT NULL,
    tipo character varying(100),
    id_estabelecimento integer NOT NULL
);


ALTER TABLE public.imagens OWNER TO postgres;

--
-- Name: imagens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.imagens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.imagens_id_seq OWNER TO postgres;

--
-- Name: imagens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.imagens_id_seq OWNED BY public.imagens.id;


--
-- Name: profissional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profissional (
    id integer NOT NULL,
    nome character varying NOT NULL,
    celular character varying,
    email character varying,
    disponivel boolean DEFAULT true,
    id_estabelecimento integer NOT NULL,
    image_url character varying
);


ALTER TABLE public.profissional OWNER TO postgres;

--
-- Name: profissional_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profissional_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.profissional_id_seq OWNER TO postgres;

--
-- Name: profissional_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profissional_id_seq OWNED BY public.profissional.id;


--
-- Name: servicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicos (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    valor numeric(5,2) NOT NULL,
    tempo integer NOT NULL,
    id_estabelecimento integer NOT NULL,
    imagem_url character varying
);


ALTER TABLE public.servicos OWNER TO postgres;

--
-- Name: servicos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.servicos_id_seq OWNER TO postgres;

--
-- Name: servicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicos_id_seq OWNED BY public.servicos.id;


--
-- Name: administrador id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN id SET DEFAULT nextval('public.administrador_id_seq'::regclass);


--
-- Name: agendamentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos ALTER COLUMN id SET DEFAULT nextval('public.agendamentos_id_seq'::regclass);


--
-- Name: cliente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id SET DEFAULT nextval('public.cliente_id_seq'::regclass);


--
-- Name: estabelecimento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estabelecimento ALTER COLUMN id SET DEFAULT nextval('public.estabelecimento_id_seq'::regclass);


--
-- Name: horarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios ALTER COLUMN id SET DEFAULT nextval('public.horarios_id_seq'::regclass);


--
-- Name: imagens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagens ALTER COLUMN id SET DEFAULT nextval('public.imagens_id_seq'::regclass);


--
-- Name: profissional id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional ALTER COLUMN id SET DEFAULT nextval('public.profissional_id_seq'::regclass);


--
-- Name: servicos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos ALTER COLUMN id SET DEFAULT nextval('public.servicos_id_seq'::regclass);


--
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrador (id, nome, email, celular, senha, username) FROM stdin;
12	Nildim	markim@2222	+5533	$2b$10$Ed97Ow0WU7iz5UlBmOhLv.1SPXhXWUd6xwgcqhEXpCCfw5DZ2VdCK	Catfallen2
14	Nildim	markim@	+5533	$2b$10$Q04uRercIFj/9yUfGQsw1u2NTsYmZcYliqCny9vs1rMK2A59yT3Nm	Catfallen22
15	Nildim	markim@gmail.com	55555	$2b$10$OJ8GH/A3X4hqF7K.jjlM4OO6S85pSIPkdYRzdY1yWj.Ww1XWHam8W	markim
16	Markim	marcosalex9061@gmail.com	99991952105	$2b$10$C3cWaxpYEwfJ0yCXBoRV1.s9TG9gkJDi5mvL.tm.ZrtMRwbI3EQTm	Catfallen
19	markim	marquimreidelas2020@gmail.com	99991952015	$2b$10$GtRt6ntWbS8Tl8qGa21AkOkzNzAvcVe8N5YZmlZrlOjFbAHkXgVa2	markim2
22	Nildim	markim222@gmail.com	55555	$2b$10$hBzXmVfOZUz18PxlxstQLOTAwKT0937fP9UeIcvVCW7N.6S0PV4Mi	markim22
23	Italo Cauê Marinho Araujo 	Italocauemarinhoaraujo@gmail.com	99985303310	$2b$10$HkNSdIQ3Bzuxe4YRKsvXBeONbzo7OEPi2Vrfm3UlXpdIlG0399joy	Italo 
24	Nildim	markim@gmail123.com	555555	$2b$10$BSjco/hEghAQjPCR9nHZ6O27bG0PU.n7kZxxQe6Oq7b9EJo3LCHi.	markim20
25	Italo Cauê 	Italo@.com	9985303310	$2b$10$EVNjOtOaBqKMYORx/0wJ4uK/zFJHaOW0Ur0P76xsfONWwOe89WMh2	Caue 
26	teste	teste@	53	$2b$10$9vP/Sv1cQJEjOpDcvYj6QOow2PTaWeA85m0g2YstS892pYcFkl4qe	teste
27	teste2	teste2@gmail	545	$2b$10$C3Y09d/Rv4fnfEZ5w8H75OC77iZsc3llbmCnyPgmb/GELt5mxxuDG	teste2
28	Pedro Azevedo Sena 	202302366911@alunos.facimp.edu.br	99992102211	$2b$10$OCOUSh3NrtNln4SehD7R2.aljzGkMpKN2UUBbC3c10h4db7r4k1Eu	Pedro
29	Yann	yanduarte@gmail.com	545484548	$2b$10$oSTu36wlYtXvlg8aWkgQl.jqwk8CVJF3kla30Dep9bOx8vb7YMnoG	@duarte.com
30	markim	markimz@gmail	9656	$2b$10$NCbF8kTW9OVwtm2QSz2DCu3AvkMk85AKuqR1vy4C1f/yjSBgNSrnW	markim222
\.


--
-- Data for Name: agendamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agendamentos (id, id_estabelecimento, id_cliente, servicos, id_profissional, id_horario) FROM stdin;
9	15	1	"corte"	10	6
\.


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id, nome, email, celular) FROM stdin;
1	Nildim	nildim@	99
2	markim	markim@	99
\.


--
-- Data for Name: estabelecimento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estabelecimento (id, nome, endereco, id_admin) FROM stdin;
3	Barbearia do Nildim	Rua 3	14
4	barbearia do markim	rua 3 progresso 2	15
5	barbearia do nildim	rua 3	19
6	markim dentista	rua 2	19
9	Teste	Rua3	15
10	Rua3	2	15
11	Nego doce 	Xique xique Bahia 	15
12	Teste	Rua	15
13	estabelecimento do nildim	Rua 5	14
14	estabelecimento	Rua 6	12
15	estabelecimento do nildim	Rua 6	12
16	Estabelecimento do markim	rua 2	12
17	nildim	rua 2	12
18	nildim	rua 2	12
19	Loja de roupas 	No centro 	23
20	Loja de roupas 	No centro 	23
21	Loja de roupas 	No centro 	23
22	Loja de roupas 	No centro 	23
23	Loja de roupas 	No centro 	23
24	Loja de roupas 	No centro 	23
25	Loja de roupas 	No centro 	23
26	Flamengo 	No centro 	25
27	teste	rua 3	12
28	teste	rua 3	27
29	teste	rua 5	26
30	teste2	rua teste	26
31	teste	rua teste2	26
32	Teste	rua teste 3	26
33	praça 	rua bom jardim	29
34	Teste	Teste	12
\.


--
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios (id, dia, hora, disponivel, id_estabelecimento, id_profissional) FROM stdin;
7	2025-06-11	0830	t	15	10
8	2025-06-11	0900	t	15	10
9	2025-06-11	0930	t	15	10
10	2025-06-11	1000	t	15	10
11	2025-06-11	1030	t	15	10
12	2025-06-11	1100	t	15	10
13	2025-06-11	1130	t	15	10
14	2025-06-11	1200	t	15	10
15	2025-06-11	1230	t	15	10
16	2025-06-11	1300	t	15	10
17	2025-06-11	1330	t	15	10
18	2025-06-11	1400	t	15	10
19	2025-06-11	1430	t	15	10
20	2025-06-11	1500	t	15	10
21	2025-06-11	1530	t	15	10
22	2025-06-11	1600	t	15	10
23	2025-06-11	1630	t	15	10
24	2025-06-11	1700	t	15	10
25	2025-06-11	1730	t	15	10
26	2025-06-11	1800	t	15	10
28	2025-06-12	0800	t	15	10
29	2025-06-12	0830	t	15	10
30	2025-06-12	0900	t	15	10
31	2025-06-12	0930	t	15	10
32	2025-06-12	1000	t	15	10
33	2025-06-12	1030	t	15	10
34	2025-06-12	1100	t	15	10
35	2025-06-12	1130	t	15	10
36	2025-06-12	1200	t	15	10
37	2025-06-12	1230	t	15	10
38	2025-06-12	1300	t	15	10
39	2025-06-12	1330	t	15	10
40	2025-06-12	1400	t	15	10
41	2025-06-12	1430	t	15	10
42	2025-06-12	1500	t	15	10
43	2025-06-12	1530	t	15	10
44	2025-06-12	1600	t	15	10
45	2025-06-12	1630	t	15	10
46	2025-06-12	1700	t	15	10
47	2025-06-12	1730	t	15	10
48	2025-06-12	1800	t	15	10
50	2025-06-13	0800	t	15	10
51	2025-06-13	0830	t	15	10
52	2025-06-13	0900	t	15	10
53	2025-06-13	0930	t	15	10
54	2025-06-13	1000	t	15	10
55	2025-06-13	1030	t	15	10
56	2025-06-13	1100	t	15	10
57	2025-06-13	1130	t	15	10
58	2025-06-13	1200	t	15	10
59	2025-06-13	1230	t	15	10
60	2025-06-13	1300	t	15	10
61	2025-06-13	1330	t	15	10
62	2025-06-13	1400	t	15	10
63	2025-06-13	1430	t	15	10
64	2025-06-13	1500	t	15	10
65	2025-06-13	1530	t	15	10
66	2025-06-13	1600	t	15	10
67	2025-06-13	1630	t	15	10
68	2025-06-13	1700	t	15	10
69	2025-06-13	1730	t	15	10
70	2025-06-13	1800	t	15	10
73	2025-06-14	0800	t	15	10
74	2025-06-14	0830	t	15	10
75	2025-06-14	0900	t	15	10
76	2025-06-14	0930	t	15	10
77	2025-06-14	1000	t	15	10
78	2025-06-14	1030	t	15	10
79	2025-06-14	1100	t	15	10
80	2025-06-14	1130	t	15	10
81	2025-06-14	1200	t	15	10
82	2025-06-14	1230	t	15	10
83	2025-06-14	1300	t	15	10
84	2025-06-14	1330	t	15	10
85	2025-06-14	1400	t	15	10
86	2025-06-14	1430	t	15	10
87	2025-06-14	1500	t	15	10
88	2025-06-14	1530	t	15	10
89	2025-06-14	1600	t	15	10
90	2025-06-14	1630	t	15	10
91	2025-06-14	1700	t	15	10
92	2025-06-14	1730	t	15	10
93	2025-06-14	1800	t	15	10
94	2025-06-15	0800	t	15	10
95	2025-06-15	0830	t	15	10
96	2025-06-15	0900	t	15	10
97	2025-06-15	0930	t	15	10
98	2025-06-15	1000	t	15	10
99	2025-06-15	1030	t	15	10
100	2025-06-15	1100	t	15	10
101	2025-06-15	1130	t	15	10
102	2025-06-15	1200	t	15	10
103	2025-06-15	1230	t	15	10
104	2025-06-15	1300	t	15	10
105	2025-06-15	1330	t	15	10
106	2025-06-15	1400	t	15	10
107	2025-06-15	1430	t	15	10
108	2025-06-15	1500	t	15	10
109	2025-06-15	1530	t	15	10
110	2025-06-15	1600	t	15	10
111	2025-06-15	1630	t	15	10
112	2025-06-15	1700	t	15	10
113	2025-06-15	1730	t	15	10
114	2025-06-15	1800	t	15	10
115	2025-06-16	0800	t	15	10
116	2025-06-16	0830	t	15	10
117	2025-06-16	0900	t	15	10
118	2025-06-16	0930	t	15	10
119	2025-06-16	1000	t	15	10
120	2025-06-16	1030	t	15	10
121	2025-06-16	1100	t	15	10
122	2025-06-16	1130	t	15	10
123	2025-06-16	1200	t	15	10
124	2025-06-16	1230	t	15	10
125	2025-06-16	1300	t	15	10
126	2025-06-16	1330	t	15	10
127	2025-06-16	1400	t	15	10
128	2025-06-16	1430	t	15	10
129	2025-06-16	1500	t	15	10
130	2025-06-16	1530	t	15	10
131	2025-06-16	1600	t	15	10
132	2025-06-16	1630	t	15	10
133	2025-06-16	1700	t	15	10
134	2025-06-16	1730	t	15	10
135	2025-06-16	1800	t	15	10
136	2025-06-17	0800	t	15	10
137	2025-06-17	0830	t	15	10
138	2025-06-17	0900	t	15	10
139	2025-06-17	0930	t	15	10
140	2025-06-17	1000	t	15	10
141	2025-06-17	1030	t	15	10
142	2025-06-17	1100	t	15	10
143	2025-06-17	1130	t	15	10
144	2025-06-17	1200	t	15	10
145	2025-06-17	1230	t	15	10
146	2025-06-17	1300	t	15	10
147	2025-06-17	1330	t	15	10
148	2025-06-17	1400	t	15	10
149	2025-06-17	1430	t	15	10
150	2025-06-17	1500	t	15	10
151	2025-06-17	1530	t	15	10
152	2025-06-17	1600	t	15	10
153	2025-06-17	1630	t	15	10
154	2025-06-17	1700	t	15	10
155	2025-06-17	1730	t	15	10
156	2025-06-17	1800	t	15	10
157	2025-06-18	0800	t	15	10
158	2025-06-18	0830	t	15	10
159	2025-06-18	0900	t	15	10
160	2025-06-18	0930	t	15	10
161	2025-06-18	1000	t	15	10
162	2025-06-18	1030	t	15	10
163	2025-06-18	1100	t	15	10
164	2025-06-18	1130	t	15	10
165	2025-06-18	1200	t	15	10
166	2025-06-18	1230	t	15	10
167	2025-06-18	1300	t	15	10
168	2025-06-18	1330	t	15	10
169	2025-06-18	1400	t	15	10
170	2025-06-18	1430	t	15	10
171	2025-06-18	1500	t	15	10
172	2025-06-18	1530	t	15	10
173	2025-06-18	1600	t	15	10
174	2025-06-18	1630	t	15	10
175	2025-06-18	1700	t	15	10
176	2025-06-18	1730	t	15	10
177	2025-06-18	1800	t	15	10
178	2025-06-19	0800	t	15	10
179	2025-06-19	0830	t	15	10
180	2025-06-19	0900	t	15	10
181	2025-06-19	0930	t	15	10
182	2025-06-19	1000	t	15	10
183	2025-06-19	1030	t	15	10
184	2025-06-19	1100	t	15	10
185	2025-06-19	1130	t	15	10
186	2025-06-19	1200	t	15	10
187	2025-06-19	1230	t	15	10
188	2025-06-19	1300	t	15	10
189	2025-06-19	1330	t	15	10
190	2025-06-19	1400	t	15	10
191	2025-06-19	1430	t	15	10
192	2025-06-19	1500	t	15	10
193	2025-06-19	1530	t	15	10
194	2025-06-19	1600	t	15	10
195	2025-06-19	1630	t	15	10
196	2025-06-19	1700	t	15	10
197	2025-06-19	1730	t	15	10
198	2025-06-19	1800	t	15	10
212	2025-06-20	0800	t	15	10
213	2025-06-20	0830	t	15	10
214	2025-06-20	0900	t	15	10
215	2025-06-20	0930	t	15	10
216	2025-06-20	1000	t	15	10
217	2025-06-20	1030	t	15	10
218	2025-06-20	1100	t	15	10
219	2025-06-20	1130	t	15	10
220	2025-06-20	1200	t	15	10
221	2025-06-20	1230	t	15	10
222	2025-06-20	1300	t	15	10
223	2025-06-20	1330	t	15	10
224	2025-06-20	1400	t	15	10
225	2025-06-20	1430	t	15	10
226	2025-06-20	1500	t	15	10
227	2025-06-20	1530	t	15	10
228	2025-06-20	1600	t	15	10
229	2025-06-20	1630	t	15	10
230	2025-06-20	1700	t	15	10
231	2025-06-20	1730	t	15	10
232	2025-06-20	1800	t	15	10
233	2025-06-25	0800	t	15	10
234	2025-06-25	0830	t	15	10
235	2025-06-25	0900	t	15	10
236	2025-06-25	0930	t	15	10
237	2025-06-25	1000	t	15	10
238	2025-06-25	1030	t	15	10
239	2025-06-25	1100	t	15	10
240	2025-06-25	1130	t	15	10
241	2025-06-25	1200	t	15	10
242	2025-06-25	1230	t	15	10
243	2025-06-25	1300	t	15	10
244	2025-06-25	1330	t	15	10
245	2025-06-25	1400	t	15	10
246	2025-06-25	1430	t	15	10
247	2025-06-25	1500	t	15	10
248	2025-06-25	1530	t	15	10
249	2025-06-25	1600	t	15	10
250	2025-06-25	1630	t	15	10
251	2025-06-25	1700	t	15	10
252	2025-06-25	1730	t	15	10
253	2025-06-25	1800	t	15	10
256	2025-06-27	0800	t	15	10
257	2025-06-27	0830	t	15	10
258	2025-06-27	0900	t	15	10
259	2025-06-27	0930	t	15	10
260	2025-06-27	1000	t	15	10
261	2025-06-27	1030	t	15	10
262	2025-06-27	1100	t	15	10
263	2025-06-27	1130	t	15	10
264	2025-06-27	1200	t	15	10
265	2025-06-27	1230	t	15	10
266	2025-06-27	1300	t	15	10
267	2025-06-27	1330	t	15	10
268	2025-06-27	1400	t	15	10
269	2025-06-27	1430	t	15	10
270	2025-06-27	1500	t	15	10
271	2025-06-27	1530	t	15	10
272	2025-06-27	1600	t	15	10
273	2025-06-27	1630	t	15	10
274	2025-06-27	1700	t	15	10
275	2025-06-27	1730	t	15	10
276	2025-06-27	1800	t	15	10
277	2025-06-28	0800	t	15	10
278	2025-06-28	0830	t	15	10
279	2025-06-28	0900	t	15	10
280	2025-06-28	0930	t	15	10
281	2025-06-28	1000	t	15	10
282	2025-06-28	1030	t	15	10
283	2025-06-28	1100	t	15	10
284	2025-06-28	1130	t	15	10
285	2025-06-28	1200	t	15	10
286	2025-06-28	1230	t	15	10
287	2025-06-28	1300	t	15	10
288	2025-06-28	1330	t	15	10
289	2025-06-28	1400	t	15	10
290	2025-06-28	1430	t	15	10
291	2025-06-28	1500	t	15	10
292	2025-06-28	1530	t	15	10
293	2025-06-28	1600	t	15	10
294	2025-06-28	1630	t	15	10
295	2025-06-28	1700	t	15	10
296	2025-06-28	1730	t	15	10
297	2025-06-28	1800	t	15	10
299	2025-06-29	0800	t	15	10
300	2025-06-29	0830	t	15	10
301	2025-06-29	0900	t	15	10
302	2025-06-29	0930	t	15	10
303	2025-06-29	1000	t	15	10
304	2025-06-29	1030	t	15	10
305	2025-06-29	1100	t	15	10
306	2025-06-29	1130	t	15	10
307	2025-06-29	1200	t	15	10
308	2025-06-29	1230	t	15	10
309	2025-06-29	1300	t	15	10
310	2025-06-29	1330	t	15	10
311	2025-06-29	1400	t	15	10
312	2025-06-29	1430	t	15	10
313	2025-06-29	1500	t	15	10
314	2025-06-29	1530	t	15	10
315	2025-06-29	1600	t	15	10
316	2025-06-29	1630	t	15	10
317	2025-06-29	1700	t	15	10
318	2025-06-29	1730	t	15	10
319	2025-06-29	1800	t	15	10
320	2025-06-12	0000	t	15	14
322	2025-06-18	0800	t	15	14
323	2025-06-18	0830	t	15	14
324	2025-06-18	0900	t	15	14
325	2025-06-18	0930	t	15	14
326	2025-06-18	1000	t	15	14
327	2025-06-18	1030	t	15	14
328	2025-06-18	1100	t	15	14
329	2025-06-18	1130	t	15	14
330	2025-06-18	1200	t	15	14
331	2025-06-18	1230	t	15	14
332	2025-06-18	1300	t	15	14
333	2025-06-18	1330	t	15	14
334	2025-06-18	1400	t	15	14
335	2025-06-18	1430	t	15	14
336	2025-06-18	1500	t	15	14
337	2025-06-18	1530	t	15	14
338	2025-06-18	1600	t	15	14
339	2025-06-18	1630	t	15	14
340	2025-06-18	1700	t	15	14
341	2025-06-18	1730	t	15	14
342	2025-06-18	1800	t	15	14
345	2025-06-16	0800	t	16	11
346	2025-06-16	0830	t	16	11
347	2025-06-16	0900	t	16	11
348	2025-06-16	0930	t	16	11
349	2025-06-16	1000	t	16	11
350	2025-06-16	1030	t	16	11
351	2025-06-16	1100	t	16	11
352	2025-06-16	1130	t	16	11
353	2025-06-16	1200	t	16	11
354	2025-06-16	1230	t	16	11
355	2025-06-16	1300	t	16	11
356	2025-06-16	1330	t	16	11
357	2025-06-16	1400	t	16	11
358	2025-06-16	1430	t	16	11
359	2025-06-16	1500	t	16	11
360	2025-06-16	1530	t	16	11
361	2025-06-16	1600	t	16	11
362	2025-06-16	1630	t	16	11
363	2025-06-16	1700	t	16	11
364	2025-06-16	1730	t	16	11
365	2025-06-16	1800	t	16	11
6	2025-06-11	0800	f	15	10
366	2025-06-15	0800	t	33	15
367	2025-06-15	0830	t	33	15
368	2025-06-15	0900	t	33	15
369	2025-06-15	0930	t	33	15
370	2025-06-15	1000	t	33	15
371	2025-06-15	1030	t	33	15
372	2025-06-15	1100	t	33	15
373	2025-06-15	1130	t	33	15
374	2025-06-15	1200	t	33	15
375	2025-06-15	1230	t	33	15
376	2025-06-15	1300	t	33	15
377	2025-06-15	1330	t	33	15
378	2025-06-15	1400	t	33	15
379	2025-06-15	1430	t	33	15
380	2025-06-15	1500	t	33	15
381	2025-06-15	1530	t	33	15
382	2025-06-15	1600	t	33	15
383	2025-06-15	1630	t	33	15
384	2025-06-15	1700	t	33	15
385	2025-06-15	1730	t	33	15
386	2025-06-15	1800	t	33	15
387	2025-06-22	0800	t	14	17
388	2025-06-22	0830	t	14	17
389	2025-06-22	0900	t	14	17
390	2025-06-22	0930	t	14	17
391	2025-06-22	1000	t	14	17
392	2025-06-22	1030	t	14	17
393	2025-06-22	1100	t	14	17
394	2025-06-22	1130	t	14	17
395	2025-06-22	1200	t	14	17
396	2025-06-22	1230	t	14	17
397	2025-06-22	1300	t	14	17
398	2025-06-22	1330	t	14	17
399	2025-06-22	1400	t	14	17
400	2025-06-22	1430	t	14	17
401	2025-06-22	1500	t	14	17
402	2025-06-22	1530	t	14	17
403	2025-06-22	1600	t	14	17
404	2025-06-22	1630	t	14	17
405	2025-06-22	1700	t	14	17
406	2025-06-22	1730	t	14	17
407	2025-06-22	1800	t	14	17
\.


--
-- Data for Name: imagens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imagens (id, imagem_url, tipo, id_estabelecimento) FROM stdin;
1	https://res.cloudinary.com/df83lvdun/image/upload/v1748474848/estabelecimentos/gnisqpcwdhwhsnw2qo3f.png	logo	13
2	https://res.cloudinary.com/df83lvdun/image/upload/v1748476054/estabelecimentos/bzppkvgjh7wxygav5vwj.png	logo	14
3	https://res.cloudinary.com/df83lvdun/image/upload/v1748479107/estabelecimentos/wvdhvefdzhujavuozndv.webp	logo	15
4	https://res.cloudinary.com/df83lvdun/image/upload/v1748739383/estabelecimentos/sx8cp9v1j4syzxhyfvhs.png	logo	16
6	https://res.cloudinary.com/df83lvdun/image/upload/v1748924619/estabelecimentos/tq5uckkac3yxyenzgzcb.jpg	logo	18
7	https://res.cloudinary.com/df83lvdun/image/upload/v1749684074/estabelecimentos/fgxosekfdcjlytfs6mxq.jpg	logo	20
8	https://res.cloudinary.com/df83lvdun/image/upload/v1749684075/estabelecimentos/ahodxx6hs8jtun0srr08.jpg	logo	21
9	https://res.cloudinary.com/df83lvdun/image/upload/v1749684075/estabelecimentos/cb5qaud5kaaafmehqozg.jpg	logo	23
10	https://res.cloudinary.com/df83lvdun/image/upload/v1749684075/estabelecimentos/zgffqvftfhklwhbnlmev.jpg	logo	19
11	https://res.cloudinary.com/df83lvdun/image/upload/v1749684076/estabelecimentos/qrcorvzl3hvrvgom5pts.jpg	logo	24
12	https://res.cloudinary.com/df83lvdun/image/upload/v1749684076/estabelecimentos/e16cqita3cv73hj67thf.jpg	logo	25
13	https://res.cloudinary.com/df83lvdun/image/upload/v1749684096/estabelecimentos/ltpi3tjlk6lot0zcfdka.jpg	logo	22
14	https://res.cloudinary.com/df83lvdun/image/upload/v1749684430/estabelecimentos/yeagjbzilmptq5ryttfr.jpg	logo	26
15	https://res.cloudinary.com/df83lvdun/image/upload/v1749685054/estabelecimentos/xboqec2jgpwfsaz39x0u.png	logo	27
16	https://res.cloudinary.com/df83lvdun/image/upload/v1749705313/estabelecimentos/ew9ll8qe5mboalm5hwdm.png	logo	32
17	https://res.cloudinary.com/df83lvdun/image/upload/v1749767914/estabelecimentos/zruhz8ik7hysdys6mq9k.png	logo	34
\.


--
-- Data for Name: profissional; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profissional (id, nome, celular, email, disponivel, id_estabelecimento, image_url) FROM stdin;
10	Markim cabelereiro	999999	emaildonildim@	t	15	https://res.cloudinary.com/df83lvdun/image/upload/v1749101821/profissionais/fasepl3d60gzaetj7fya.jpg
11	Nildim vasco	99999	email@email	t	16	https://res.cloudinary.com/df83lvdun/image/upload/v1749446170/profissionais/ejp9r33ia8too3g9c6bh.jpg
12	NewGen	95	email@donewgen	t	16	https://res.cloudinary.com/df83lvdun/image/upload/v1749446229/profissionais/za9g3n8rkewbk03vppzz.jpg
13	Médico 	99985306010	Markin@gmail.com	t	13	https://res.cloudinary.com/df83lvdun/image/upload/v1749683786/profissionais/nhkxvlcddlsopznsegvb.jpg
14	nildim	999	email@email	t	15	https://res.cloudinary.com/df83lvdun/image/upload/v1749708268/profissionais/iokske2ybmukoigrh79a.png
15	Yann	4565224	vitor@gamil.com	t	33	\N
16	Yan	99	yan@	t	34	https://res.cloudinary.com/df83lvdun/image/upload/v1749768219/profissionais/remxcjvpnd2xngadzfmn.png
17	markim	66	marcosalex9061@gmail.com	t	14	https://res.cloudinary.com/df83lvdun/image/upload/v1750118805/profissionais/ybdolb4cmmhlane2xfnq.jpg
\.


--
-- Data for Name: servicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicos (id, nome, valor, tempo, id_estabelecimento, imagem_url) FROM stdin;
1	corte	10.00	20	15	\N
3	teste	25.00	25	15	\N
6	nildim	20.00	20	16	\N
5	nildim	20.00	20	16	https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jair_Bolsonaro_2019_Portrait_%283x4_cropped%29.jpg/250px-Jair_Bolsonaro_2019_Portrait_%283x4_cropped%29.jpg
7	corte	10.00	20	15	\N
8	corte	10.00	20	15	\N
9	corte	10.00	20	15	\N
10	corte do nildim	25.00	35	15	\N
11	corte do nildim	25.00	35	15	https://res.cloudinary.com/df83lvdun/image/upload/v1748927966/servicos/l3r8pf731yccqesg9hvw.jpg
12	teste	25.00	25	18	https://res.cloudinary.com/df83lvdun/image/upload/v1749168055/servicos/upgkcezc7kvhp7epxoc6.jpg
13	Corte do NewGen	35.00	35	15	https://res.cloudinary.com/df83lvdun/image/upload/v1749445677/servicos/rogsidnpvbtbqzjvmati.jpg
14	Lava carro	30.00	60	13	\N
15	Lava carro 	30.00	60	13	https://res.cloudinary.com/df83lvdun/image/upload/v1749683679/servicos/n3sebxsqsin6uahuoikx.png
16	Teste	35.00	30	34	https://res.cloudinary.com/df83lvdun/image/upload/v1749768015/servicos/so9h6vx41o2tsz2o0cyg.jpg
17	pastel	10.00	5	33	\N
18	Teste	35.00	35	34	https://res.cloudinary.com/df83lvdun/image/upload/v1749768142/servicos/dvwlba6rvdoq69vax7zn.jpg
19	corte	35.00	35	14	https://res.cloudinary.com/df83lvdun/image/upload/v1750118712/servicos/hcnjnad3umuml4ybhmbf.jpg
\.


--
-- Name: administrador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_id_seq', 30, true);


--
-- Name: agendamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agendamentos_id_seq', 9, true);


--
-- Name: cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_id_seq', 2, true);


--
-- Name: estabelecimento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estabelecimento_id_seq', 34, true);


--
-- Name: horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_id_seq', 407, true);


--
-- Name: imagens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.imagens_id_seq', 17, true);


--
-- Name: profissional_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profissional_id_seq', 17, true);


--
-- Name: servicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicos_id_seq', 19, true);


--
-- Name: administrador administrador_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_email_key UNIQUE (email);


--
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (id);


--
-- Name: agendamentos agendamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_pkey PRIMARY KEY (id);


--
-- Name: cliente cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_email_key UNIQUE (email);


--
-- Name: cliente cliente_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_email_unique UNIQUE (email);


--
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- Name: estabelecimento estabelecimento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estabelecimento
    ADD CONSTRAINT estabelecimento_pkey PRIMARY KEY (id);


--
-- Name: horarios horarios_dia_hora_id_profissional_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_dia_hora_id_profissional_key UNIQUE (dia, hora, id_profissional);


--
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id);


--
-- Name: imagens imagens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagens
    ADD CONSTRAINT imagens_pkey PRIMARY KEY (id);


--
-- Name: profissional profissional_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional
    ADD CONSTRAINT profissional_pkey PRIMARY KEY (id);


--
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (id);


--
-- Name: administrador unique_usename; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT unique_usename UNIQUE (username);


--
-- Name: idx_estab_admin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estab_admin ON public.estabelecimento USING btree (id_admin);


--
-- Name: idx_horario_id_estabelecimento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_horario_id_estabelecimento ON public.horarios USING btree (id_estabelecimento);


--
-- Name: idx_horario_id_profissional; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_horario_id_profissional ON public.horarios USING btree (id_profissional);


--
-- Name: idx_imagens_id_estabelecimento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_imagens_id_estabelecimento ON public.imagens USING btree (id_estabelecimento);


--
-- Name: idx_profissional_estabelecimento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profissional_estabelecimento ON public.profissional USING btree (id_estabelecimento);


--
-- Name: idx_servicos_id_estabelecimento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_servicos_id_estabelecimento ON public.servicos USING btree (id_estabelecimento);


--
-- Name: agendamentos agendamentos_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- Name: agendamentos agendamentos_id_estabelecimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_id_estabelecimento_fkey FOREIGN KEY (id_estabelecimento) REFERENCES public.estabelecimento(id);


--
-- Name: agendamentos agendamentos_id_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES public.horarios(id);


--
-- Name: agendamentos agendamentos_id_profissional_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_id_profissional_fkey FOREIGN KEY (id_profissional) REFERENCES public.profissional(id);


--
-- Name: estabelecimento estabelecimento_id_admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estabelecimento
    ADD CONSTRAINT estabelecimento_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.administrador(id);


--
-- Name: horarios horarios_id_estabelecimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_id_estabelecimento_fkey FOREIGN KEY (id_estabelecimento) REFERENCES public.estabelecimento(id);


--
-- Name: horarios horarios_id_profissional_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_id_profissional_fkey FOREIGN KEY (id_profissional) REFERENCES public.profissional(id);


--
-- Name: imagens imagens_id_estabelecimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagens
    ADD CONSTRAINT imagens_id_estabelecimento_fkey FOREIGN KEY (id_estabelecimento) REFERENCES public.estabelecimento(id);


--
-- Name: profissional profissional_id_estabelecimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional
    ADD CONSTRAINT profissional_id_estabelecimento_fkey FOREIGN KEY (id_estabelecimento) REFERENCES public.estabelecimento(id);


--
-- Name: servicos servicos_id_estabelecimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_id_estabelecimento_fkey FOREIGN KEY (id_estabelecimento) REFERENCES public.estabelecimento(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

