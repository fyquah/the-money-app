--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: account_books; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE account_books (
    id integer NOT NULL,
    name character varying(255),
    user_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: account_books_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE account_books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE account_books_id_seq OWNED BY account_books.id;


--
-- Name: accounting_records; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE accounting_records (
    id integer NOT NULL,
    accounting_transaction_id integer,
    amount double precision,
    account_name character varying(255),
    account_type character varying(255),
    record_type character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    account_book_id integer
);


--
-- Name: accounting_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE accounting_records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounting_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE accounting_records_id_seq OWNED BY accounting_records.id;


--
-- Name: accounting_transactions; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE accounting_transactions (
    id integer NOT NULL,
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    account_book_id integer,
    author_id integer,
    date date
);


--
-- Name: accounting_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE accounting_transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounting_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE accounting_transactions_id_seq OWNED BY accounting_transactions.id;


--
-- Name: debts; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE debts (
    id integer NOT NULL,
    amount double precision,
    borrower_id integer,
    lender_id integer,
    status character varying(255) DEFAULT 'pending'::character varying,
    description character varying(255),
    seen_by_lender boolean DEFAULT false,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: debts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE debts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: debts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE debts_id_seq OWNED BY debts.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE sessions (
    id integer NOT NULL,
    user_id integer,
    remember_token character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE sessions_id_seq OWNED BY sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    password_digest character varying(255)
);


--
-- Name: users_editable_account_books; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE users_editable_account_books (
    user_id integer,
    account_book_id integer
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: users_viewable_account_books; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE users_viewable_account_books (
    user_id integer,
    account_book_id integer
);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY account_books ALTER COLUMN id SET DEFAULT nextval('account_books_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY accounting_records ALTER COLUMN id SET DEFAULT nextval('accounting_records_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY accounting_transactions ALTER COLUMN id SET DEFAULT nextval('accounting_transactions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY debts ALTER COLUMN id SET DEFAULT nextval('debts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY sessions ALTER COLUMN id SET DEFAULT nextval('sessions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: account_books_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY account_books
    ADD CONSTRAINT account_books_pkey PRIMARY KEY (id);


--
-- Name: accounting_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY accounting_records
    ADD CONSTRAINT accounting_records_pkey PRIMARY KEY (id);


--
-- Name: accounting_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY accounting_transactions
    ADD CONSTRAINT accounting_transactions_pkey PRIMARY KEY (id);


--
-- Name: debts_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY debts
    ADD CONSTRAINT debts_pkey PRIMARY KEY (id);


--
-- Name: sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_accounting_records_on_account_book_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_records_on_account_book_id ON accounting_records USING btree (account_book_id);


--
-- Name: index_accounting_records_on_account_book_id_and_account_name; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_records_on_account_book_id_and_account_name ON accounting_records USING btree (account_book_id, account_name);


--
-- Name: index_accounting_records_on_account_book_id_and_account_type; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_records_on_account_book_id_and_account_type ON accounting_records USING btree (account_book_id, account_type);


--
-- Name: index_accounting_records_on_accounting_transaction_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_records_on_accounting_transaction_id ON accounting_records USING btree (accounting_transaction_id);


--
-- Name: index_accounting_records_on_transactions_and_record_type; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_records_on_transactions_and_record_type ON accounting_records USING btree (accounting_transaction_id, record_type);


--
-- Name: index_accounting_transactions_on_account_book_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_transactions_on_account_book_id ON accounting_transactions USING btree (account_book_id);


--
-- Name: index_accounting_transactions_on_author_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_transactions_on_author_id ON accounting_transactions USING btree (author_id);


--
-- Name: index_accounting_transactions_on_created_at; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_transactions_on_created_at ON accounting_transactions USING btree (created_at);


--
-- Name: index_accounting_transactions_on_date; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_transactions_on_date ON accounting_transactions USING btree (date);


--
-- Name: index_accounting_transactions_on_description; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_accounting_transactions_on_description ON accounting_transactions USING btree (description);


--
-- Name: index_editable_account_book_on_user_account_book; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_editable_account_book_on_user_account_book ON users_editable_account_books USING btree (user_id, account_book_id);


--
-- Name: index_sessions_on_remember_token; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_sessions_on_remember_token ON sessions USING btree (remember_token);


--
-- Name: index_sessions_on_user_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_sessions_on_user_id ON sessions USING btree (user_id);


--
-- Name: index_transactions_on_account_book_and_created; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_transactions_on_account_book_and_created ON accounting_transactions USING btree (account_book_id, created_at);


--
-- Name: index_users_editable_account_books_on_account_book_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_users_editable_account_books_on_account_book_id ON users_editable_account_books USING btree (account_book_id);


--
-- Name: index_users_editable_account_books_on_user_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_users_editable_account_books_on_user_id ON users_editable_account_books USING btree (user_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: index_users_viewable_account_books_on_account_book_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_users_viewable_account_books_on_account_book_id ON users_viewable_account_books USING btree (account_book_id);


--
-- Name: index_users_viewable_account_books_on_user_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_users_viewable_account_books_on_user_id ON users_viewable_account_books USING btree (user_id);


--
-- Name: index_viewable_account_books_user_account_book; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_viewable_account_books_user_account_book ON users_viewable_account_books USING btree (user_id, account_book_id);


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX unique_schema_migrations ON schema_migrations USING btree (version);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user",public;

INSERT INTO schema_migrations (version) VALUES ('20140802062830');

INSERT INTO schema_migrations (version) VALUES ('20140802065336');

INSERT INTO schema_migrations (version) VALUES ('20140813072911');

INSERT INTO schema_migrations (version) VALUES ('20140813095638');

INSERT INTO schema_migrations (version) VALUES ('20140814142128');

INSERT INTO schema_migrations (version) VALUES ('20140814155848');

INSERT INTO schema_migrations (version) VALUES ('20140815021138');

INSERT INTO schema_migrations (version) VALUES ('20140815093307');

INSERT INTO schema_migrations (version) VALUES ('20140815101215');

INSERT INTO schema_migrations (version) VALUES ('20140815112104');

INSERT INTO schema_migrations (version) VALUES ('20140817142832');

INSERT INTO schema_migrations (version) VALUES ('20140817143057');

INSERT INTO schema_migrations (version) VALUES ('20140817150153');

INSERT INTO schema_migrations (version) VALUES ('20140818132857');

INSERT INTO schema_migrations (version) VALUES ('20140819032137');

INSERT INTO schema_migrations (version) VALUES ('20140819060729');

INSERT INTO schema_migrations (version) VALUES ('20140819061134');

INSERT INTO schema_migrations (version) VALUES ('20140819063803');

INSERT INTO schema_migrations (version) VALUES ('20140819064035');

INSERT INTO schema_migrations (version) VALUES ('20140819065451');

INSERT INTO schema_migrations (version) VALUES ('20140821080749');

INSERT INTO schema_migrations (version) VALUES ('20141011162527');

INSERT INTO schema_migrations (version) VALUES ('20141011201244');

INSERT INTO schema_migrations (version) VALUES ('20141108101034');

