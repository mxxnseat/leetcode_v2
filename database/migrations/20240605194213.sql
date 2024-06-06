-- Modify "problems" table
ALTER TABLE "public"."problems" DROP CONSTRAINT "created_by", ADD CONSTRAINT "created_by" FOREIGN KEY ("created_by") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
