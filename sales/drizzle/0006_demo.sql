CREATE TABLE "demo_audio" (
	"key" text PRIMARY KEY NOT NULL,
	"mime" text NOT NULL,
	"audio" "bytea" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_voices" (
	"role" text PRIMARY KEY NOT NULL,
	"voice_id" text,
	"name" text,
	"source" text,
	"sample" "bytea",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "demo_voices_role_check" CHECK ("demo_voices"."role" in ('seller', 'prospect:fr', 'prospect:en'))
);
--> statement-breakpoint
ALTER TABLE "demo_audio" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "demo_voices" ENABLE ROW LEVEL SECURITY;
