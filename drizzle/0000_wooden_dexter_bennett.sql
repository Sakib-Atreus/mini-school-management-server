CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"section" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"class_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text NOT NULL,
	"refresh_token_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "classes_id_idx" ON "classes" USING btree ("id");--> statement-breakpoint
CREATE INDEX "students_id_idx" ON "students" USING btree ("id");--> statement-breakpoint
CREATE INDEX "students_class_idx" ON "students" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "users_id_idx" ON "users" USING btree ("id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");