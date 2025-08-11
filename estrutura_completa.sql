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
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


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

