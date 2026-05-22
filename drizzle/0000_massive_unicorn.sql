CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "websites" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "websites_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"websiteId" varchar(255) NOT NULL,
	"domain" varchar(255) NOT NULL,
	"timezone" varchar(255) NOT NULL,
	"enableLocalhostTracking" boolean DEFAULT false,
	"userEmail" varchar(255) NOT NULL,
	CONSTRAINT "websites_websiteId_unique" UNIQUE("websiteId"),
	CONSTRAINT "websites_domain_unique" UNIQUE("domain")
);
