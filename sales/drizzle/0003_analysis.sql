CREATE TABLE "simulation_analyses" (
	"simulation_id" uuid PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"model" text,
	"result" jsonb,
	"input_tokens" integer,
	"output_tokens" integer,
	"error" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "simulation_analyses_status_check" CHECK ("simulation_analyses"."status" in ('running', 'completed', 'failed', 'insufficient'))
);
--> statement-breakpoint
ALTER TABLE "simulation_analyses" ADD CONSTRAINT "simulation_analyses_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_analyses" ENABLE ROW LEVEL SECURITY;