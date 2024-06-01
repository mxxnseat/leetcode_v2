-- Create enum type "user_role"
CREATE TYPE "public"."user_role" AS ENUM ('user', 'admin');
-- Create enum type "problem_status"
CREATE TYPE "public"."problem_status" AS ENUM ('pending', 'canceled', 'approved');
-- Create "get_timestamp" function
CREATE FUNCTION "public"."get_timestamp" () RETURNS integer LANGUAGE sql AS $$ select extract(epoch from now()) $$;
-- Create "users" table
CREATE TABLE "public"."users" ("id" character varying(64) NOT NULL, "nickname" character varying(64) NOT NULL, "role" "public"."user_role" NOT NULL, "email" character varying(255) NULL, "created_at" integer NOT NULL DEFAULT public.get_timestamp(), "updated_at" integer NOT NULL DEFAULT public.get_timestamp(), PRIMARY KEY ("id"), CONSTRAINT "email" UNIQUE ("email"), CONSTRAINT "nickname" UNIQUE ("nickname"));
-- Create "problems" table
CREATE TABLE "public"."problems" ("id" character varying(64) NOT NULL, "title" character varying(1024) NOT NULL, "status" "public"."problem_status" NOT NULL DEFAULT 'pending', "description" text NOT NULL, "created_by" character varying(64) NOT NULL, "algorithm" text NOT NULL, "inputs" text NOT NULL, "created_at" integer NOT NULL DEFAULT public.get_timestamp(), "updated_at" integer NOT NULL DEFAULT public.get_timestamp(), PRIMARY KEY ("id"), CONSTRAINT "created_by" FOREIGN KEY ("created_by") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION);
