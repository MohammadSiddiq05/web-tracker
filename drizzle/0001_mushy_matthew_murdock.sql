ALTER TABLE "websites" DROP CONSTRAINT "websites_websiteId_unique";--> statement-breakpoint
ALTER TABLE "websites" ALTER COLUMN "websiteId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "websites" ALTER COLUMN "websiteId" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "websites" ALTER COLUMN "enableLocalhostTracking" SET NOT NULL;