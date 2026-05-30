CREATE TABLE "liveUsers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "liveUsers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"pageViewId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"websiteId" uuid NOT NULL,
	"visitorId" varchar NOT NULL,
	"last_seen" varchar,
	"city" varchar,
	"region" varchar,
	"country" varchar,
	"countryCode" varchar,
	"lat" varchar,
	"lng" varchar,
	"device" varchar,
	"os" varchar,
	"browser" varchar,
	CONSTRAINT "liveUsers_pageViewId_unique" UNIQUE("pageViewId")
);
--> statement-breakpoint
CREATE TABLE "pageViews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pageViews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"visitorId" varchar(255),
	"websiteId" uuid NOT NULL,
	"domain" varchar(255) NOT NULL,
	"url" varchar(2048),
	"type" varchar(50) NOT NULL,
	"referrer" varchar(2048),
	"entryTime" integer,
	"exitTime" integer,
	"totalActiveTime" integer,
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"device" varchar,
	"os" varchar,
	"browser" varchar,
	"city" varchar,
	"region" varchar,
	"country" varchar,
	"countryCode" varchar,
	"ipAddress" varchar,
	"refParams" varchar,
	"exitUrl" varchar
);
--> statement-breakpoint
ALTER TABLE "websites" ADD CONSTRAINT "websites_websiteId_unique" UNIQUE("websiteId");