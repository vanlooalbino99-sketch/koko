CREATE TABLE "voice_agents" (
	"scenario_version_id" uuid PRIMARY KEY NOT NULL,
	"agent_id" text NOT NULL,
	"config_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "voice_agents_agent_id_unique" UNIQUE("agent_id")
);
--> statement-breakpoint
ALTER TABLE "simulations" DROP CONSTRAINT "simulations_status_check";--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "provider_agent_id" text;--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "end_reason" text;--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "transcript" jsonb;--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "provider_cost" integer;--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "error_message" text;--> statement-breakpoint
ALTER TABLE "simulations" ADD COLUMN "last_synced_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "voice_agents" ADD CONSTRAINT "voice_agents_scenario_version_id_scenario_versions_id_fk" FOREIGN KEY ("scenario_version_id") REFERENCES "public"."scenario_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_end_reason_check" CHECK ("simulations"."end_reason" is null or "simulations"."end_reason" in ('user', 'agent', 'error', 'timeout'));--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_status_check" CHECK ("simulations"."status" in ('created', 'connecting', 'in_progress', 'processing', 'completed', 'failed', 'cancelled'));--> statement-breakpoint
ALTER TABLE "voice_agents" ENABLE ROW LEVEL SECURITY;