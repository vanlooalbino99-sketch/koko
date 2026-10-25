CREATE TABLE "quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"user_id" uuid,
	"company" text NOT NULL,
	"email" text NOT NULL,
	"seats" integer NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_accounts" DROP CONSTRAINT "billing_accounts_plan_check";--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_plan_check";--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- Anciennes offres : Pro devient Standard, Équipe devient Premium (qui garde l'espace équipe).
UPDATE "billing_accounts" SET "plan" = CASE "plan" WHEN 'pro' THEN 'standard' WHEN 'team' THEN 'premium' ELSE "plan" END;--> statement-breakpoint
UPDATE "organizations" SET "plan" = CASE "plan" WHEN 'pro' THEN 'standard' WHEN 'team' THEN 'premium' ELSE "plan" END;--> statement-breakpoint
CREATE INDEX "quote_requests_created_idx" ON "quote_requests" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "billing_accounts" ADD CONSTRAINT "billing_accounts_plan_check" CHECK ("billing_accounts"."plan" is null or "billing_accounts"."plan" in ('standard', 'advanced', 'premium'));--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_plan_check" CHECK ("organizations"."plan" in ('free', 'standard', 'advanced', 'premium'));--> statement-breakpoint
ALTER TABLE "quote_requests" ENABLE ROW LEVEL SECURITY;
