--
-- PostgreSQL database dump
--

-- Dumped from database version 10.2
-- Dumped by pg_dump version 10.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

--
-- PostgreSQL database dump complete
--

-- Knex migrations

INSERT INTO public.knex_migrations(name, batch, migration_time) VALUES ('20180207153033_migration_1.js', 1, NOW());
INSERT INTO public.knex_migrations(name, batch, migration_time) VALUES ('20180207153040_migration_2.js', 1, NOW());
INSERT INTO public.knex_migrations(name, batch, migration_time) VALUES ('20180207153050_migration_3.js', 1, NOW());
