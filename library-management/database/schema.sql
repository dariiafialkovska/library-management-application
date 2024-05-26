--
-- PostgreSQL database dump
--

-- Dumped from database version 15.7
-- Dumped by pg_dump version 15.7

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Books; Type: TABLE; Schema: public; Owner: postgres
--

-- Drop tables if they exist
DROP TABLE IF EXISTS public."Borrowings" CASCADE;
DROP TABLE IF EXISTS public."Books" CASCADE;
DROP TABLE IF EXISTS public."Users" CASCADE;
DROP TABLE IF EXISTS public."SequelizeMeta" CASCADE;



CREATE TABLE public."Books" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    score integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Books" OWNER TO postgres;


CREATE SEQUENCE public."Books_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Books_id_seq" OWNER TO postgres;
ALTER SEQUENCE public."Books_id_seq" OWNED BY public."Books".id;


CREATE TABLE public."Borrowings" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "bookId" integer NOT NULL,
    score integer,
    returned boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Borrowings" OWNER TO postgres;

CREATE SEQUENCE public."Borrowings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Borrowings_id_seq" OWNER TO postgres;

ALTER SEQUENCE public."Borrowings_id_seq" OWNED BY public."Borrowings".id;


CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;


CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO postgres;



ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
ALTER TABLE ONLY public."Books" ALTER COLUMN id SET DEFAULT nextval('public."Books_id_seq"'::regclass);
ALTER TABLE ONLY public."Borrowings" ALTER COLUMN id SET DEFAULT nextval('public."Borrowings_id_seq"'::regclass);
ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
ALTER TABLE ONLY public."Books"
    ADD CONSTRAINT "Books_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public."Borrowings"
    ADD CONSTRAINT "Borrowings_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);
ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Borrowings"
    ADD CONSTRAINT "Borrowings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."Books"(id);
ALTER TABLE ONLY public."Borrowings"
    ADD CONSTRAINT "Borrowings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


